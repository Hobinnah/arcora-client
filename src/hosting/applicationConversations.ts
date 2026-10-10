import { fetchConversations, createConversation } from "../apis/useConversation";
import { fetchConversationParticipants, createConversationParticipant, type CreateConversationParticipantInput } from "../apis/useConversationParticipant";
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

const fetchAllPages = async <T>(
  fetchPage: (params: { pageSize: number; pageNumber: number }) => Promise<{ data: T[]; totalCount: number }>,
): Promise<T[]> => {
  const result: T[] = [];
  for (let pageNumber = 0; ; pageNumber += 1) {
    const { data, totalCount } = await fetchPage({ pageSize: 200, pageNumber });
    result.push(...data);
    if (result.length >= totalCount) return result;
    if (data.length === 0) throw new Error("The list ended before all conversation records could be checked.");
  }
};

export const fetchApplicationConversationParticipants = async (conversationID: string): Promise<ConversationParticipant[]> =>
  (await fetchAllPages(fetchConversationParticipants)).filter((participant) => participant.conversationID === conversationID);

// Subject narrows the application thread; participants confirm its tenant/member identity.
const findConversationBySubject = async (applicationCode: string): Promise<Conversation | null> => {
  const data = await fetchAllPages(fetchConversations);
  return data.find((conversation) =>
    conversation.conversationType === APPLICATION_CONVERSATION_TYPE
    && conversation.subject === applicationConversationSubject(applicationCode)) ?? null;
};

const ensureParticipant = async (
  conversationID: string,
  match: (participant: ConversationParticipant) => boolean,
  build: () => Pick<CreateConversationParticipantInput, "tenantID" | "userID" | "organizationMemberID" | "participantRole">,
): Promise<ConversationParticipant> => {
  const participants = await fetchApplicationConversationParticipants(conversationID);
  const existing = participants.find(match);
  if (existing) return existing;
  const now = new Date().toISOString();
  return createConversationParticipant({
    conversationParticipantID: null,
    conversationID,
    joinedAt: now,
    capturedDate: now,
    isMuted: false,
    userID: null,
    tenantID: null,
    organizationMemberID: null,
    leftAt: null,
    lastReadAt: null,
    ...build(),
  });
};

export const findApplicationConversationForTenant = async (tenantID: string, applicationCode: string): Promise<Conversation | null> => {
  const conversation = await findConversationBySubject(applicationCode);
  if (!conversation) return null;
  const data = await fetchApplicationConversationParticipants(conversation.conversationID);
  const belongsToTenant = data.some((participant) => participant.tenantID === tenantID);
  return belongsToTenant ? conversation : null;
};

export const findApplicationConversationForOrganization = async (organizationMemberID: string, applicationCode: string): Promise<Conversation | null> => {
  const conversation = await findConversationBySubject(applicationCode);
  if (!conversation) return null;
  const data = await fetchApplicationConversationParticipants(conversation.conversationID);
  const belongsToOrg = data.some((participant) => participant.organizationMemberID === organizationMemberID);
  return belongsToOrg ? conversation : null;
};

export const fetchApplicationConversationMessages = async (conversationID: string): Promise<ConversationMessage[]> => {
  const data = await fetchAllPages(fetchConversationMessages);
  return data
    .filter((message) => message.conversationID === conversationID)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
};

type ApplicationConversationParams = {
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
};

// Share in-flight setup across duplicate effects; cross-client uniqueness must be enforced by the API.
const pendingApplicationConversations = new Map<string, Promise<Conversation>>();

export const ensureApplicationConversation = async (params: ApplicationConversationParams): Promise<Conversation> => {
  const key = JSON.stringify([params.applicationCode, params.tenantID, params.organizationMemberID]);
  const pending = pendingApplicationConversations.get(key);
  if (pending) return pending;
  const request = createApplicationConversation(params);
  pendingApplicationConversations.set(key, request);
  try {
    return await request;
  } finally {
    pendingApplicationConversations.delete(key);
  }
};

const createApplicationConversation = async (params: ApplicationConversationParams): Promise<Conversation> => {
  const now = new Date().toISOString();
  let conversation = await findConversationBySubject(params.applicationCode);
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
    userID: params.userID ?? null,
    participantRole: "TENANT",
  }));
  await ensureParticipant(conversation.conversationID, (participant) => participant.organizationMemberID === params.organizationMemberID, () => ({
    organizationMemberID: params.organizationMemberID,
    participantRole: "LANDLORD",
  }));

  const messages = await fetchApplicationConversationMessages(conversation.conversationID);
  if (!messages.some((message) => message.messageType === "APPLICATION_CARD" && parseApplicationCardMessage(message.message))) {
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
