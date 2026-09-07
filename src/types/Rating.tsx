import type { Lease } from "./Lease";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type Rating = {
    ratingID: string;
    leaseID: string;
    reviewerUserID: number;
    subjectType: string;
    subjectReferenceID: string;
    overallRating: number;
    paymentRating: number;
    communicationRating: number;
    propertyCareRating: number;
    responsivenessRating: number;
    accuracyRating: number;
    cleanlinessRating: number;
    reviewBody: string;
    isPublic: boolean;
    publishedAt: string;
    capturedDate: string;
    capturedBy: string;
    updatedDate: string;
    reviewerFirstName?: string;
    reviewerLocation?: string;
    reviewerPhotoUrl?: string;
    lease: Lease;
    reviewerUser: User;
};
