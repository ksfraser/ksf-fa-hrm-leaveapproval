# ksf_FA_HRM_LeaveApproval — Requirements Traceability Matrix

| Req ID | Requirement | Source | Implemented In | Verified By |
|--------|-------------|--------|----------------|-------------|
| BR-HRM-02 | Leave approval workflow | HR-CRM_gaps.md H1 | LeaveApprovalService | unit tests |
| FR-LA-01 | Create approval record | BR-HRM-02 | LeaveApprovalRepository::insertApproval | LeaveApprovalDtoTest |
| FR-LA-02 | List all approvals | BR-HRM-02 | LeaveApprovalService::listAll | (tab controller) |
| FR-LA-03 | Resolve approval by id | BR-HRM-02 | LeaveApprovalService::resolveById | (capability hook) |
| FR-LA-04 | Transition approved/rejected | BR-HRM-02 | LeaveApprovalService::updateState | (state transitions) |
| FR-LA-05 | List pending for approver | BR-HRM-02 | LeaveApprovalRepository::listPendingForApprover | (service) |
| FR-LA-06 | RELATED_TO_FIELDS | BR-HRM-02 | hooks.php RELATED_TO_FIELDS | (capability) |
| NF-LA-01 | Native db_* calls | AGENTS_ARCH | repository | code review |
| NF-LA-02 | PHP 7.3 compatible | AGENTS_ARCH | all src | code review |
| NF-LA-03 | Unit tests | AGENTS_ARCH | tests/Unit | phpunit |
