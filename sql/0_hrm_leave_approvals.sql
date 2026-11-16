-- ksf_FA_HRM_LeaveApproval: leave approval tables

CREATE TABLE IF NOT EXISTS `0_hrm_leave_approvals` (
  `approval_id`   INT(11) NOT NULL AUTO_INCREMENT,
  `request_id`    INT(11) NOT NULL COMMENT 'FK to hrm_leave_requests.id',
  `approver_id`   INT(11) NOT NULL COMMENT 'FK to crm_persons.id (approver)',
  `state`         VARCHAR(24) NOT NULL DEFAULT 'pending' COMMENT 'pending|approved|rejected',
  `approved_at`   DATETIME DEFAULT NULL,
  `comments`      VARCHAR(255) DEFAULT NULL,
  `created_at`    DATETIME NOT NULL,
  `updated_at`    DATETIME NOT NULL,
  PRIMARY KEY (`approval_id`),
  UNIQUE KEY `uq_request_approver` (`request_id`, `approver_id`),
  KEY `idx_request` (`request_id`),
  KEY `idx_approver_state` (`approver_id`, `state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
