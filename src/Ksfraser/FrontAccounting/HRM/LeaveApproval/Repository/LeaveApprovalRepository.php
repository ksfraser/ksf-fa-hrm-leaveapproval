<?php
declare(strict_types=1);
namespace Ksfraser\FrontAccounting\HRM\LeaveApproval\Repository;
final class LeaveApprovalRepository {
    private string $table = 'hrm_leave_approvals';
    public function findAll(): array {
        if (!function_exists('db_query') || !defined('TB_PREF')) { return array(); }
        $sql = "SELECT a.*, p.name AS approver_name FROM " . TB_PREF . $this->table . " a"
            . " LEFT JOIN " . TB_PREF . "crm_persons p ON a.approver_id = p.id"
            . " ORDER BY a.created_at DESC, a.approval_id DESC";
        $result = db_query($sql, 'Could not load leave approvals');
        if ($result === false) { return array(); }
        $rows = array();
        while (($row = db_fetch_assoc($result)) !== false && $row !== null) { $rows[] = $row; }
        return $rows;
    }
    public function findById(int $id): ?array {
        if (!function_exists('db_query') || !defined('TB_PREF')) { return null; }
        $sql = "SELECT a.*, p.name AS approver_name FROM " . TB_PREF . $this->table . " a"
            . " LEFT JOIN " . TB_PREF . "crm_persons p ON a.approver_id = p.id"
            . " WHERE a.approval_id = " . (int) $id;
        $result = db_query($sql, 'Could not load leave approval');
        if ($result === false) { return null; }
        $row = db_fetch_assoc($result);
        return $row === false ? null : $row;
    }
    public function listForRequest(int $requestId): array {
        if (!function_exists('db_query') || !defined('TB_PREF')) { return array(); }
        $sql = "SELECT a.*, p.name AS approver_name FROM " . TB_PREF . $this->table . " a"
            . " LEFT JOIN " . TB_PREF . "crm_persons p ON a.approver_id = p.id"
            . " WHERE a.request_id = " . (int) $requestId
            . " ORDER BY a.created_at ASC";
        $result = db_query($sql, 'Could not load leave approvals by request');
        if ($result === false) { return array(); }
        $rows = array();
        while (($row = db_fetch_assoc($result)) !== false && $row !== null) { $rows[] = $row; }
        return $rows;
    }
    public function listPendingForApprover(int $approverId): array {
        if (!function_exists('db_query') || !defined('TB_PREF')) { return array(); }
        $sql = "SELECT a.*, p.name AS approver_name FROM " . TB_PREF . $this->table . " a"
            . " LEFT JOIN " . TB_PREF . "crm_persons p ON a.approver_id = p.id"
            . " WHERE a.state = 'pending' AND a.approver_id = " . (int) $approverId
            . " ORDER BY a.created_at ASC";
        $result = db_query($sql, 'Could not load pending leave approvals');
        if ($result === false) { return array(); }
        $rows = array();
        while (($row = db_fetch_assoc($result)) !== false && $row !== null) { $rows[] = $row; }
        return $rows;
    }
    public function insertApproval(array $data): int {
        if (!function_exists('db_query') || !defined('TB_PREF')) { return 0; }
        $sql = "INSERT INTO " . TB_PREF . $this->table . " (
                request_id, approver_id, state, approved_at, comments, created_at, updated_at)
            VALUES ("
            . $this->intVal($data['request_id'] ?? 0) . ", "
            . $this->intVal($data['approver_id'] ?? 0) . ", "
            . $this->escape($data['state'] ?? 'pending') . ", "
            . $this->escape($data['approved_at'] ?? null) . ", "
            . $this->escape($data['comments'] ?? '') . ", "
            . $this->escape(date('Y-m-d H:i:s')) . ", "
            . $this->escape(date('Y-m-d H:i:s')) . ")";
        $this->dbQuery($sql);
        return $this->dbInsertId();
    }
    public function updateState(int $approvalId, string $state, string $approvedAt = null, string $comments = null): void {
        if (!function_exists('db_query') || !defined('TB_PREF')) { return; }
        $sets = ["state = " . $this->escape($state)];
        $sets[] = "approved_at = " . $this->escape($approvedAt);
        $sets[] = "comments = " . $this->escape($comments ?? '');
        $sets[] = "updated_at = " . $this->escape(date('Y-m-d H:i:s'));
        $sql = "UPDATE " . TB_PREF . $this->table . " SET " . implode(', ', $sets)
            . " WHERE approval_id = " . $this->intVal($approvalId);
        $this->dbQuery($sql);
    }
    private function dbQuery($sql, $errorMsg = null) {
        return db_query($sql, $errorMsg);
    }
    private function dbInsertId() {
        return db_insert_id();
    }
    private function escape($value): string {
        if ($value === null) { return 'NULL'; }
        return function_exists('db_escape') ? db_escape($value) : addslashes((string) $value);
    }
    private function intVal($value): int {
        return (int) $value;
    }
}
