# ksf_FA_HRM_LeaveApproval — Requirements

## Purpose
Manage the approval workflow for leave requests created in ksf_FA_HRM_Leave. Each leave request can have one approval record per approver in the chain, tracking state (pending/approved/rejected), approver, timestamp, and comments.

## Business Rules (BR-HRM-02)
- A leave approval is created when a leave request is submitted for approval.
- An approval record belongs to exactly one leave request and one approver.
- State transitions: pending → approved | rejected.
- Only the designated current approver may action a pending approval.
- Approval/rejection is recorded with a timestamp and optional comments.
- State changes fire the LEAVEAPPROVAL_STATE_CHANGED hook for downstream modules (payroll, notifications).

## Functional Requirements
- FR-LA-01: Create an approval record for a leave request and approver.
- FR-LA-02: List all approvals (summary table).
- FR-LA-03: Resolve a single approval by id (for related-record linking).
- FR-LA-04: Transition an approval to approved or rejected with timestamp/comments.
- FR-LA-05: List pending approvals for a given approver.
- FR-LA-06: Expose leave approval fields via RELATED_TO_FIELDS for cross-module linking.

## Non-Functional Requirements
- NF-LA-01: All database access uses native FA db_* calls (no PDO, no raw mysqli).
- NF-LA-02: PHP 7.3 compatible runtime (no union types, no match(), no readonly).
- NF-LA-03: Unit tests cover DTO round-trip and label resolution.
