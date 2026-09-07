import type { Conversation } from "./Conversation";
import type { OrganizationMember } from "./OrganizationMember";
import type { Tenant } from "./Tenant";
import type { User } from "./User";

{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

export type ConversationMessage = {
    conversationMessageID: string;
    conversationID: string;
    senderUserID: number;
    senderTenantID: string;
    senderOrganizationMemberID: string;
    message: string;
    messageType: string;
    replyToMessageID: string;
    sentAt: string;
    editedAt: string;
    deletedAt: string;
    capturedDate: string;
    capturedBy: string;
    conversation: Conversation;
    senderUser: User;
    senderTenant: Tenant;
    senderOrganizationMember: OrganizationMember;
    replyToMessageConversationMessage: ConversationMessage;
};
