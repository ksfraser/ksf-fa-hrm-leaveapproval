<?php
declare(strict_types=1);
require_once __DIR__ . '/ComposerDependencies.php';
\Ksfraser\FrontAccounting\HRM\LeaveApproval\Utils\ComposerDependencies::ensure(__DIR__);
$autoload_path = dirname(__FILE__) . '/vendor/autoload.php';
if (file_exists($autoload_path)) { require_once $autoload_path; }
require_once __DIR__ . '/includes/common.inc';
require_once __DIR__ . '/includes/events.inc';
use ksfraser\RelatedTo\DTO\RelatedRecordDto;
define('SS_ksf_FA_HRM_LeaveApproval', 188 << 8);
if (!defined('SA_HRM_LEAVEAPPROVAL_VIEW')) {
    define('SA_HRM_LEAVEAPPROVAL_VIEW', SS_ksf_FA_HRM_LeaveApproval | 1);
    define('SA_HRM_LEAVEAPPROVAL_MANAGE', SS_ksf_FA_HRM_LeaveApproval | 2);
    define('SA_HRM_LEAVEAPPROVAL_APPROVE', SS_ksf_FA_HRM_LeaveApproval | 3);
    define('SA_HRM_LEAVEAPPROVAL_ADMIN', SS_ksf_FA_HRM_LeaveApproval | 4);
}
class hooks_ksf_FA_HRM_LeaveApproval extends hooks {
    const RESPONDERS = array('RELATED_TO_FIELDS', 'LEAVEAPPROVAL_RESOLVE', 'LEAVEAPPROVAL_FIELDS', 'LEAVEAPPROVAL_LIST');
    var $module_name = 'ksf_FA_HRM_LeaveApproval';
    var $version = '1.0.0';
    function install_tabs($app) { }
    function install_options($app) { }
    function install_access() {
        $security_sections[SS_ksf_FA_HRM_LeaveApproval] = _("Leave Approval");
        $security_areas['SA_HRM_LEAVEAPPROVAL_VIEW'] = array(SA_HRM_LEAVEAPPROVAL_VIEW, _("View leave approvals"));
        $security_areas['SA_HRM_LEAVEAPPROVAL_MANAGE'] = array(SA_HRM_LEAVEAPPROVAL_MANAGE, _("Manage leave approvals"));
        $security_areas['SA_HRM_LEAVEAPPROVAL_APPROVE'] = array(SA_HRM_LEAVEAPPROVAL_APPROVE, _("Approve leave"));
        $security_areas['SA_HRM_LEAVEAPPROVAL_ADMIN'] = array(SA_HRM_LEAVEAPPROVAL_ADMIN, _("Administer leave approval"));
        return array($security_areas, $security_sections);
    }
    function activate_extension($company, $check_only = true) {
        if ($check_only) { return true; }
        \Ksfraser\FrontAccounting\HRM\LeaveApproval\Utils\ComposerDependencies::ensure(__DIR__);
        $this->update_databases($company, array(
            '0_hrm_leave_approvals.sql' => array('hrm_leave_approvals'),
        ), false);
        return true;
    }
    private function ensure_composer_dependencies() {
        \Ksfraser\FrontAccounting\HRM\LeaveApproval\Utils\ComposerDependencies::ensure(__DIR__);
    }
    public function getModuleConstants(&$data, $opts = null) {
        $data['constants'] = array(
            'SS_ksf_FA_HRM_LeaveApproval' => SS_ksf_FA_HRM_LeaveApproval,
            'SA_HRM_LEAVEAPPROVAL_VIEW' => SA_HRM_LEAVEAPPROVAL_VIEW,
            'SA_HRM_LEAVEAPPROVAL_MANAGE' => SA_HRM_LEAVEAPPROVAL_MANAGE,
            'SA_HRM_LEAVEAPPROVAL_APPROVE' => SA_HRM_LEAVEAPPROVAL_APPROVE,
            'SA_HRM_LEAVEAPPROVAL_ADMIN' => SA_HRM_LEAVEAPPROVAL_ADMIN,
        );
        return true;
    }
    public function getModuleCapabilities(&$data, $opts = null) {
        $data['capabilities'] = self::RESPONDERS;
        return true;
    }
    public function hasCapability(&$data, $opts) {
        $capability = is_array($opts) && isset($opts['capability']) ? $opts['capability'] : null;
        if ($capability === null && isset($data['capability'])) { $capability = $data['capability']; }
        $data['has_capability'] = in_array($capability, self::RESPONDERS, true);
        return $data['has_capability'];
    }
    public function respondToCapabilityRequest(&$data, $opts = null) {
        $request = is_array($opts) && isset($opts['request']) ? $opts['request'] : (isset($data['request']) ? $data['request'] : 'capabilities');
        $data['request'] = $request;
        $data['module'] = $this->module_name;
        if (strpos($request, 'has:') === 0) { return $this->hasCapability($data, array('capability' => substr($request, 4))); }
        switch ($request) {
            case 'capabilities': return $this->getModuleCapabilities($data, $opts);
            case 'constants': return $this->getModuleConstants($data, $opts);
            default: $data['error'] = 'Unknown request type: ' . $request; return null;
        }
    }
    public function RELATED_TO_FIELDS(&$data, $opts = null) {
        if (!isset($data['module']) || !is_string($data['module'])) { $data['error'] = 'RELATED_TO_FIELDS requires data[module]'; return null; }
        if (!isset($data['type']) || !is_string($data['type'])) { $data['error'] = 'RELATED_TO_FIELDS requires data[type]'; return null; }
        if ($data['type'] !== 'hrm_leave_approval') { return null; }
        if (!isset($data['fields']) || !is_array($data['fields'])) { $data['fields'] = array(); }
        $data['fields'] = array_merge($data['fields'], array(
            'approval_id' => _('Approval ID'),
            'request_id' => _('Leave Request'),
            'approver_id' => _('Approver'),
            'state' => _('Status'),
            'approved_at' => _('Approved At'),
            'comments' => _('Comments'),
        ));
        return null;
    }
    public function LEAVEAPPROVAL_RESOLVE(&$data, $opts = null) {
        if (!isset($data['approval_id']) || !is_numeric($data['approval_id'])) { $data['error'] = 'LEAVEAPPROVAL_RESOLVE requires data[approval_id]'; return null; }
        if (!isset($data['dto']) || !$data['dto'] instanceof RelatedRecordDto) { $data['error'] = 'LEAVEAPPROVAL_RESOLVE requires data[dto] as RelatedRecordDto'; return null; }
        $service = new \Ksfraser\FrontAccounting\HRM\LeaveApproval\Service\LeaveApprovalService();
        $data['result'] = $service->resolveById((int) $data['approval_id'], $data['dto']);
        return null;
    }
    public function LEAVEAPPROVAL_FIELDS(&$data, $opts = null) {
        $data['fields'] = array(
            'approval_id' => _('Approval ID'),
            'request_id' => _('Leave Request'),
            'approver_id' => _('Approver'),
            'state' => _('Status'),
            'approved_at' => _('Approved At'),
            'comments' => _('Comments'),
        );
        return null;
    }
    public function LEAVEAPPROVAL_LIST(&$data, $opts = null) {
        if (!isset($data['request_id']) || !is_numeric($data['request_id'])) { $data['error'] = 'LEAVEAPPROVAL_LIST requires data[request_id]'; return null; }
        $service = new \Ksfraser\FrontAccounting\HRM\LeaveApproval\Service\LeaveApprovalService();
        $data['result'] = $service->listForRequest((int) $data['request_id']);
        return null;
    }
}
