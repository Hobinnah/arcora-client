import type { Lease } from "./Lease";
import type { LeaseRenewals } from "./LeaseRenewals";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type LeaseDocuments = {
    leaseDocumentID: string;
    leaseID: string;
    leaseRenewalID: string;
    documentType: string;
    documentStatus: string;
    originalFilename: string;
    storageProvider: string;
    storageContainer: string;
    storageReference: string;
    fileHash: string;
    isPrimary: boolean;
    generatedAt: string;
    sentForSignatureAt: string;
    fullySignedAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    updatedBy: string;
    lease: Lease;
    leaseRenewals: LeaseRenewals;
};
