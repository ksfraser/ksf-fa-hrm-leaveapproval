<?php
declare(strict_types=1);
namespace Ksfraser\FrontAccounting\HRM\LeaveApproval\Tests\Unit;
use PHPUnit\Framework\TestCase;
use Ksfraser\FrontAccounting\HRM\LeaveApproval\DTO\LeaveApprovalDTO;
class LeaveApprovalDtoTest extends TestCase
{
    public function testDtoRoundTripsThroughArray(): void {
        $dto = new LeaveApprovalDTO(5, 10, 'LR-10', 7, 'Sue Jones', 'pending', '', 'Approve late leave', '2026-10-01 09:00:00', '2026-10-01 09:00:00');
        $arr = $dto->toArray();
        $this->assertSame(5, $arr['approval_id']);
        $this->assertSame(10, $arr['request_id']);
        $this->assertSame('LR-10', $arr['request_label']);
        $this->assertSame(7, $arr['approver_id']);
        $this->assertSame('Sue Jones', $arr['approver_name']);
        $this->assertSame('pending', $arr['state']);
        $this->assertSame('Approve late leave', $arr['comments']);
        $dto2 = LeaveApprovalDTO::fromArray($arr);
        $this->assertSame($dto->approval_id, $dto2->approval_id);
        $this->assertSame($dto->approver_name, $dto2->approver_name);
        $this->assertSame($dto->state, $dto2->state);
    }
    public function testDisplayLabelUsesApproverWhenSet(): void {
        $dto = new LeaveApprovalDTO(1, 2, '', 3, 'Sue Jones', 'approved');
        $this->assertStringContainsString('Sue Jones', $dto->getDisplayLabel());
    }
    public function testDisplayLabelFallsBackToId(): void {
        $dto = new LeaveApprovalDTO(9, 2, '', 0, '', 'pending');
        $this->assertStringContainsString('Leave Approval #9', $dto->getDisplayLabel());
    }
}
