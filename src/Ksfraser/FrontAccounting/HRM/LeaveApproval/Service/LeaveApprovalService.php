<?php
declare(strict_types=1);
namespace Ksfraser\FrontAccounting\HRM\LeaveApproval\Service;
use Ksfraser\FrontAccounting\HRM\LeaveApproval\DTO\LeaveApprovalDTO;
use Ksfraser\FrontAccounting\HRM\LeaveApproval\Repository\LeaveApprovalRepository;
use ksfraser\RelatedTo\DTO\RelatedRecordDto;
final class LeaveApprovalService {
    private $repo;
    public function __construct(?LeaveApprovalRepository $repo = null) { $this->repo = $repo ?? new LeaveApprovalRepository(); }
    public function resolveById(int $id, ?RelatedRecordDto $dto = null): array {
        $row = $this->repo->findById($id);
        if ($row === null) {
            return array('dto' => new RelatedRecordDto('hrm_leave_approval', '0', 'hrm_leave_approval', '0', null), 'fields' => $this->fieldMap(), 'labels' => $this->labelMap(), 'url' => '#', 'label' => _('Leave Approval #') . (string) $id);
        }
        $r = LeaveApprovalDTO::fromArray($row);
        $dto = $dto ?? new RelatedRecordDto('hrm_leave_approval', (string) $r->approval_id, 'hrm_leave_approval', (string) $r->approval_id, null);
        return array(
            'dto' => $dto,
            'fields' => array(
                'approval_id' => (string) $r->approval_id,
                'request_id' => $r->request_label ?: (string) $r->request_id,
                'approver_id' => $r->approver_name,
                'state' => $r->state,
                'approved_at' => $r->approved_at,
                'comments' => $r->comments,
            ),
            'labels' => $this->labelMap(),
            'url' => '/modules/ksf_FA_HRM_LeaveApproval/pages/leave_approval_form.php?action=edit&approval_id=' . $r->approval_id,
            'label' => $r->getDisplayLabel(),
        );
    }
    public function listForRequest(int $requestId): array {
        $rows = $this->repo->listForRequest($requestId);
        $results = array();
        foreach ($rows as $row) {
            $r = LeaveApprovalDTO::fromArray($row);
            $results[] = array(
                'id' => $r->approval_id,
                'dto' => new RelatedRecordDto('hrm_leave_approval', (string) $r->approval_id, 'hrm_leave_approval', (string) $r->approval_id, null),
                'fields' => array(
                    'approval_id' => (string) $r->approval_id,
                    'request_id' => $r->request_label ?: (string) $r->request_id,
                    'approver_id' => $r->approver_name,
                    'state' => $r->state,
                    'approved_at' => $r->approved_at,
                    'comments' => $r->comments,
                ),
                'labels' => $this->labelMap(),
                'url' => '/modules/ksf_FA_HRM_LeaveApproval/pages/leave_approval_form.php?action=edit&approval_id=' . $r->approval_id,
                'label' => $r->getDisplayLabel(),
            );
        }
        return $results;
    }
    public function listAll(): array {
        $rows = $this->repo->findAll();
        $results = array();
        foreach ($rows as $row) {
            $r = LeaveApprovalDTO::fromArray($row);
            $results[] = array(
                'id' => $r->approval_id,
                'fields' => array(
                    'approval_id' => (string) $r->approval_id,
                    'request_id' => $r->request_label ?: (string) $r->request_id,
                    'approver_name' => $r->approver_name,
                    'state' => $r->state,
                    'approved_at' => $r->approved_at,
                    'url' => '/modules/ksf_FA_HRM_LeaveApproval/pages/leave_approval_form.php?action=edit&approval_id=' . $r->approval_id,
                ),
            );
        }
        return $results;
    }
    public function insertApproval(array $data): int {
        return $this->repo->insertApproval($data);
    }
    public function updateState(int $approvalId, string $state, string $approvedAt = null, string $comments = null): void {
        $this->repo->updateState($approvalId, $state, $approvedAt, $comments);
        leave_approval_state_changed((string) $approvalId, '', $state, array('comments' => $comments));
    }
    public function fieldMap(): array { return $this->labelMap(); }
    public function labelMap(): array {
        return array(
            'approval_id' => _('Approval ID'),
            'request_id' => _('Leave Request'),
            'approver_id' => _('Approver'),
            'state' => _('Status'),
            'approved_at' => _('Approved At'),
            'comments' => _('Comments'),
        );
    }
    public function getStateTransitions(string $currentState): array {
        $transitions = array(
            'pending' => array('approved' => _('Approve'), 'rejected' => _('Reject')),
        );
        return isset($transitions[$currentState]) ? $transitions[$currentState] : array();
    }
    public function isAllowedTransition(string $fromState, string $toState): bool {
        $transitions = $this->getStateTransitions($fromState);
        return isset($transitions[$toState]);
    }
}
