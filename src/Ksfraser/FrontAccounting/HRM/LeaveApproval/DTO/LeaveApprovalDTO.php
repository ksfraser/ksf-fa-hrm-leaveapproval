<?php
declare(strict_types=1);
namespace Ksfraser\FrontAccounting\HRM\LeaveApproval\DTO;
final class LeaveApprovalDTO {
    public $approval_id;
    public $request_id;
    public $request_label;
    public $approver_id;
    public $approver_name;
    public $state;
    public $approved_at;
    public $comments;
    public $created_at;
    public $updated_at;
    public function __construct(
        int $approval_id,
        int $request_id = 0,
        string $request_label = '',
        int $approver_id = 0,
        string $approver_name = '',
        string $state = 'pending',
        string $approved_at = '',
        string $comments = '',
        string $created_at = '',
        string $updated_at = ''
    ) {
        $this->approval_id = $approval_id;
        $this->request_id = $request_id;
        $this->request_label = $request_label;
        $this->approver_id = $approver_id;
        $this->approver_name = $approver_name;
        $this->state = $state;
        $this->approved_at = $approved_at;
        $this->comments = $comments;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }
    public function getDisplayLabel(): string {
        if ($this->approver_name !== '') {
            return sprintf(_('%s for %s'), $this->state, $this->approver_name);
        }
        return _('Leave Approval #') . (string) $this->approval_id;
    }
    public function toArray(): array {
        return array(
            'approval_id' => $this->approval_id,
            'request_id' => $this->request_id,
            'request_label' => $this->request_label,
            'approver_id' => $this->approver_id,
            'approver_name' => $this->approver_name,
            'state' => $this->state,
            'approved_at' => $this->approved_at,
            'comments' => $this->comments,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        );
    }
    public static function fromArray(array $data): self {
        return new self(
            (int) ($data['approval_id'] ?? 0),
            (int) ($data['request_id'] ?? 0),
            (string) ($data['request_label'] ?? ''),
            (int) ($data['approver_id'] ?? 0),
            (string) ($data['approver_name'] ?? ''),
            (string) ($data['state'] ?? 'pending'),
            (string) ($data['approved_at'] ?? ''),
            (string) ($data['comments'] ?? ''),
            (string) ($data['created_at'] ?? ''),
            (string) ($data['updated_at'] ?? '')
        );
    }
}
