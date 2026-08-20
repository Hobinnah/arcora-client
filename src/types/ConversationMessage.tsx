import type { Conversation } from "./Conversation";
import type { User } from "./User";
import type { Tenant } from "./Tenant";
import type { OrganizationMember } from "./OrganizationMember";
import type { ConversationMessage } from "./ConversationMessage";

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
    user: User;
    tenant: Tenant;
    organizationMember: OrganizationMember;
    conversationMessage: ConversationMessage;
};
