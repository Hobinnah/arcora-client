import { fetchConversations, createConversation } from "../apis/useConversation";
import { fetchConversationParticipants, createConversationParticipant } from "../apis/useConversationParticipant";
import { fetchConversationMessages, createConversationMessage } from "../apis/useConversationMessage";
import type { Conversation } from "../types/Conversation";
import type { ConversationParticipant } from "../types/ConversationParticipant";
import type { ConversationMessage } from "../types/ConversationMessage";

export const APPLICATION_CONVERSATION_TYPE = "RENTAL_APPLICATION";
export const APPLICATION_CARD_PREFIX = "__ARC_APP_CARD__";

export type ApplicationCardMessage = {
  type: "RENTAL_APPLICATION";
  applicationID?: string;
  applicationCode?: string;
  listingTitle?: string;
  applicantName?: string;
  monthlyRent?: number;
  securityDeposit?: number;
  netToLandlord?: number;
  moveInDate?: string | null;
  note?: string;
  url?: string;
};

export const parseApplicationCardMessage = (message: string): ApplicationCardMessage | null => {
  if (!message.startsWith(APPLICATION_CARD_PREFIX)) return null;
  const payload = message.slice(APPLICATION_CARD_PREFIX.length);
  try {
    const parsed = JSON.parse(payload) as ApplicationCardMessage;
    return parsed?.type === "RENTAL_APPLICATION" ? parsed : null;
  } catch {
    return null;
  }
};

export const buildApplicationCardMessage = (payload: ApplicationCardMessage): string => `${APPLICATION_CARD_PREFIX}${JSON.stringify({ ...payload, type: "RENTAL_APPLICATION" })}`;

export const applicationConversationSubject = (applicationCode: string) => `Application ${applicationCode}`;

// Conversation has no rentalApplicationID/tenantID/organizationID FK; subject narrows the candidate,
// participant rows (tenantID / organizationMemberID) confirm real identity before it's trusted.
const findConversationBySubject = async (applicationCode: string): Promise<Conversation | null> => {
  const { data } = await fetchConversations({ pageSize: 200, pageNumber: 0 });
  return data.find((conversation) =>
    conversation.conversationType === APPLICATION_CONVERSATION_TYPE
    && conversation.subject === applicationConversationSubject(applicationCode)) ?? null;
};

const ensureParticipant = async (
  conversationID: string,
  match: (participant: ConversationParticipant) => boolean,
  build: () => Partial<ConversationParticipant>,
): Promise<ConversationParticipant> => {
  const { data } = await fetchConversationParticipants({ pageSize: 200, pageNumber: 0 });
  const existing = data.find((participant) => participant.conversationID === conversationID && match(participant));
  if (existing) return existing;
  return createConversationParticipant({ conversationID, joinedAt: new Date().toISOString(), ...build() } as ConversationParticipant);
};

export const findApplicationConversationForTenant = async (tenantID: string, applicationCode: string): Promise<Conversation | null> => {
  const conversation = await findConversationBySubject(applicationCode);
  if (!conversation) return null;
  const { data } = await fetchConversationParticipants({ pageSize: 200, pageNumber: 0 });
  const belongsToTenant = data.some((participant) => participant.conversationID === conversation.conversationID && participant.tenantID === tenantID);
  return belongsToTenant ? conversation : null;
};

export const findApplicationConversationForOrganization = async (organizationMemberID: string, applicationCode: string): Promise<Conversation | null> => {
  const conversation = await findConversationBySubject(applicationCode);
  if (!conversation) return null;
  const { data } = await fetchConversationParticipants({ pageSize: 200, pageNumber: 0 });
  const belongsToOrg = data.some((participant) => participant.conversationID === conversation.conversationID && participant.organizationMemberID === organizationMemberID);
  return belongsToOrg ? conversation : null;
};

export const fetchApplicationConversationMessages = async (conversationID: string): Promise<ConversationMessage[]> => {
  const { data } = await fetchConversationMessages({ pageSize: 200, pageNumber: 0 });
  return data
    .filter((message) => message.conversationID === conversationID)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
};

// Called on tenant submit success: creates (or reuses) the thread and seeds the first message
// so both tenant and landlord get an in-app alert immediately.
export const ensureApplicationConversation = async (params: {
  applicationID?: string;
  applicationCode: string;
  listingTitle: string;
  tenantID: string;
  userID?: number;
  organizationMemberID: string;
  capturedBy: string;
  applicantName?: string;
  monthlyRent?: number;
  securityDeposit?: number;
  netToLandlord?: number;
  note?: string;
  moveInDate?: string | null;
  viewUrl?: string;
}): Promise<Conversation> => {
  const now = new Date().toISOString();
  let conversation = await findConversationBySubject(params.applicationCode);
  const isNew = !conversation;
  if (!conversation) {
    conversation = await createConversation({
      conversationType: APPLICATION_CONVERSATION_TYPE,
      subject: applicationConversationSubject(params.applicationCode),
      status: "OPEN",
      lastMessageAt: now,
      capturedDate: now,
      capturedBy: params.capturedBy,
    } as Conversation);
  }

  await ensureParticipant(conversation.conversationID, (participant) => participant.tenantID === params.tenantID, () => ({
    tenantID: params.tenantID,
    userID: params.userID,
    participantRole: "TENANT",
  }));
  await ensureParticipant(conversation.conversationID, (participant) => participant.organizationMemberID === params.organizationMemberID, () => ({
    organizationMemberID: params.organizationMemberID,
    participantRole: "LANDLORD",
  }));

  if (isNew) {
    const message = buildApplicationCardMessage({
      type: "RENTAL_APPLICATION",
      applicationID: params.applicationID,
      applicationCode: params.applicationCode,
      listingTitle: params.listingTitle,
      applicantName: params.applicantName,
      monthlyRent: params.monthlyRent,
      securityDeposit: params.securityDeposit,
      netToLandlord: params.netToLandlord,
      moveInDate: params.moveInDate,
      note: params.note,
      url: params.viewUrl,
    });
    await createConversationMessage({
      conversationID: conversation.conversationID,
      senderTenantID: params.tenantID,
      senderUserID: params.userID,
      message,
      messageType: "APPLICATION_CARD",
      sentAt: now,
      capturedDate: now,
      capturedBy: params.capturedBy,
    } as ConversationMessage);
  }

  return conversation;
};
