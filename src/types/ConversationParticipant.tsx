import type { Conversation } from "./Conversation";
import type { User } from "./User";
import type { Tenant } from "./Tenant";
import type { OrganizationMember } from "./OrganizationMember";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ConversationParticipant = {
    conversationParticipantID: string;
    conversationID: string;
    userID: number;
    tenantID: string;
    organizationMemberID: string;
    participantRole: string;
    joinedAt: string;
    leftAt: string;
    lastReadAt: string;
    isMuted: boolean;
    capturedDate: string;
    conversation: Conversation;
    user: User;
    tenant: Tenant;
    organizationMember: OrganizationMember;
};
