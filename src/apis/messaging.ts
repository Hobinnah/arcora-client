import axios from "axios";
import { env } from "../env";

export type ConversationActor = {
  userID?: number | null;
  tenantID?: string | null;
  organizationMemberID?: string | null;
  organizationID?: string | null;
};

export type ConversationSummary = {
  conversationID: string;
  tenantID?: string | null;
  organizationID?: string | null;
  subject?: string | null;
  status?: string | null;
  counterpartyName: string;
  counterpartyPhotoUrl?: string | null;
  lastMessagePreview?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
};

export type MessagingMessage = {
  conversationMessageID: string;
  conversationID: string;
  senderUserID?: number | null;
  senderTenantID?: string | null;
  senderOrganizationMemberID?: string | null;
  message: string;
  messageType: string;
  replyToMessageID?: string | null;
  sentAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
};

const messagingUrl = (path: string) => `${env.API_BASE_URL}api/Messaging/${path}`;

export const fetchMessagingInbox = async (params: {
  organizationID?: string;
  tenantID?: string;
  unreadOnly?: boolean;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}): Promise<{ data: ConversationSummary[]; totalCount: number }> => {
  const response = await axios.get(messagingUrl("Inbox"), { params });
  return { data: response.data.data ?? [], totalCount: response.data.totalCount ?? 0 };
};

export const fetchMessagingThread = async (conversationID: string, pageNumber = 1, pageSize = 30): Promise<{ data: MessagingMessage[]; totalCount: number }> => {
  const response = await axios.get(messagingUrl(`Thread/${conversationID}`), { params: { pageNumber, pageSize } });
  return { data: response.data.data ?? [], totalCount: response.data.totalCount ?? 0 };
};

export const sendMessagingMessage = async (payload: {
  conversationID: string;
  message: string;
  messageType?: string;
  replyToMessageID?: string | null;
  senderTenantID?: string | null;
  senderOrganizationMemberID?: string | null;
  senderUserID?: number | null;
}): Promise<MessagingMessage> => {
  const response = await axios.post(messagingUrl("SendMessage"), { messageType: "TEXT", ...payload });
  return response.data as MessagingMessage;
};

export const markMessagingThreadRead = async (conversationID: string, actor: ConversationActor): Promise<void> => {
  await axios.post(messagingUrl(`MarkRead/${conversationID}`), actor);
};

export const startMessagingThread = async (payload: { tenantID: string; organizationID: string; subject?: string }): Promise<{ conversationID: string }> => {
  const response = await axios.post(messagingUrl("StartThread"), payload);
  return response.data;
};
