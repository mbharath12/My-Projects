package com.technomile.grc.constants;

public enum ApprovalProcess {
    APPROVE("approve"), REJECT("reject");

    String approvalType;

    ApprovalProcess(final String applicationType) {
        this.approvalType = applicationType;
    }

    public String getApprovalType() {
        return approvalType;
    }
}