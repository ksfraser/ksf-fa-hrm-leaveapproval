<?php

declare(strict_types=1);

namespace Ksfraser\FrontAccounting\HRM\LeaveApproval\Controller;

use Ksfraser\FrontAccounting\Common\App\AbstractTabController;
use Ksfraser\FrontAccounting\HRM\LeaveApproval\Service\LeaveApprovalService;
use ksfraser\RelatedTo\DTO\RelatedQueryDto;
use ksfraser\RelatedTo\UI\DefaultRelatedRecordsRenderer;

class LeaveApprovalTabController extends AbstractTabController
{
    private $service;

    public function __construct($context = null, array $options = [])
    {
        parent::__construct($context, $options);
        $this->service = new LeaveApprovalService();
    }

    protected function getPkField(): string { return 'approval_id'; }

    protected function getFieldMetadata(): array
    {
        return [
            'entity'      => 'hrm_leave_approval',
            'table'       => '0_hrm_leave_approvals',
            'label'       => 'Leave Approval',
            'labelPlural' => 'Leave Approvals',
            'hookPrefix'  => 'leaveapproval',
            'pk'          => 'approval_id',
            'fields'      => [],
            'fk_ddls'   => [],
            'ddlHooks'  => [],
            'tableSettings' => [],
        ];
    }

    protected function listRows(int $page, int $perPage): array
    {
        $offset = ($page - 1) * $perPage;
        return array_slice($this->service->listAll(), $offset, $perPage);
    }

    protected function countRows(): int
    {
        return count($this->service->listAll());
    }

    protected function findRecord(string $pk): ?array { return null; }
    protected function createRecord(array $data): int { return 0; }
    protected function updateRecord(string $pk, array $data): void {}
    protected function deleteRecord(string $pk): void {}
    protected function fkOptions(): array { return []; }

    protected function renderSummaryTable(): void
    {
        if (!function_exists('start_table')) return;

        $page = max(1, $this->page());
        $perPage = $this->perPage;
        $rows = $this->listRows($page, $perPage);

        start_table(TABLESTYLE2, "width='95%'");
        $th = function (string $label): void {
            echo '<th>' . htmlspecialchars($this->localise($label), ENT_QUOTES) . '</th>';
        };
        echo '<tr>';
        $th(_('Approval ID'));
        $th(_('Leave Request'));
        $th(_('Approver'));
        $th(_('Status'));
        $th(_('Approved At'));
        $th(_('Actions'));
        echo '</tr>';

        if (empty($rows)) {
            echo '<tr><td colspan="6"><em>'
                . htmlspecialchars($this->localise('No leave approvals yet.'), ENT_QUOTES)
                . '</em></td></tr>';
        }

        foreach ($rows as $i => $row) {
            echo '<tr class="' . ($i % 2 ? 'evenrow' : 'oddrow') . '">';
            echo '<td>' . htmlspecialchars($row['fields']['approval_id'] ?? '', ENT_QUOTES, 'UTF-8') . '</td>';
            echo '<td>' . htmlspecialchars($row['fields']['request_id'] ?? '', ENT_QUOTES, 'UTF-8') . '</td>';
            echo '<td>' . htmlspecialchars($row['fields']['approver_name'] ?? '', ENT_QUOTES, 'UTF-8') . '</td>';
            echo '<td>' . htmlspecialchars($row['fields']['state'] ?? '', ENT_QUOTES, 'UTF-8') . '</td>';
            echo '<td>' . htmlspecialchars($row['fields']['approved_at'] ?? '', ENT_QUOTES, 'UTF-8') . '</td>';
            echo '<td><a href="' . htmlspecialchars($row['url'] ?? '#', ENT_QUOTES, 'UTF-8') . '" target="_blank">'
                . htmlspecialchars($this->localise('View'), ENT_QUOTES, 'UTF-8') . '</a></td>'
            . '</tr>';
        }

        end_table(0);
    }

    protected function renderNotes(): void
    {
        $lhsId = isset($_GET['id']) ? (string) $_GET['id'] : '';
        if ($lhsId === '' || !function_exists('hook_invoke')) return;

        $queryDto = new RelatedQueryDto('hrm_leave_approval', $lhsId);
        $queryResult = $queryDto;
        hook_invoke('ksf_FA_RelatedTo', 'RELATED_TO', $queryResult, null);

        if (!is_array($queryResult) || !isset($queryResult['related']) || !is_array($queryResult['related'])) {
            return;
        }

        $renderer = new DefaultRelatedRecordsRenderer(array(
            'css_class' => 'related-records',
            'header_class' => 'related-header',
            'table_class' => 'related-table',
            'table_border' => true,
            'type_labels' => array('hrm_leave_approval' => _('Leave Approval')),
        ));
        echo $renderer->renderRelatedRecords('hrm_leave_approval', $lhsId, $queryResult['related'], array(
            'css_class' => 'related-records',
            'header_class' => 'related-header',
            'table_class' => 'related-table',
            'table_border' => true,
        ));
    }
}
