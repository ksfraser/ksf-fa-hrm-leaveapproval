<?php
declare(strict_types=1);

/**
 * ksf_FA_HRM_LeaveApproval module event hooks.
 *
 * Extension points for other modules to react to leave-approval lifecycle
 * events. Fired via hook_invoke_all() from the service layer.
 */
if (!function_exists('hook_invoke_all')) {
    return;
}

/**
 * Fired when a leave approval state changes.
 * @param string $approvalId
 * @param string $fromState
 * @param string $toState
 * @param array $meta
 */
function leave_approval_state_changed($approvalId, $fromState, $toState, $meta = array()) {
    hook_invoke_all('LEAVEAPPROVAL_STATE_CHANGED', array(
        'approval_id' => $approvalId,
        'from_state' => $fromState,
        'to_state' => $toState,
        'meta' => $meta,
    ));
}
