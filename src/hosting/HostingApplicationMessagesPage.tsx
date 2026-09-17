import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import HostingHeader from "./HostingHeader";
import MarketplaceFooter from "../marketplace/MarketplaceFooter";
import { useAuth } from "../hooks/useAuth";
import { getConversation } from "../apis/useConversation";
import { createConversationMessage } from "../apis/useConversationMessage";
import { getCurrentOrganizationMember } from "./organizationMemberIdentity";
import { fetchApplicationConversationMessages } from "./applicationConversations";
import type { Conversation } from "../types/Conversation";
import type { ConversationMessage } from "../types/ConversationMessage";
import "./HostingApplicationsPage.css";

export default function HostingApplicationMessagesPage() {
  const { conversationID } = useParams<{ conversationID: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!conversationID) return;
    let cancelled = false;
    (async () => {
      try {
        const loadedConversation = await getConversation(conversationID);
        const loadedMessages = await fetchApplicationConversationMessages(conversationID);
        if (cancelled) return;
        setConversation(loadedConversation);
        setMessages(loadedMessages);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We could not load this conversation.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [conversationID]);

  const sendMessage = async () => {
    if (!conversationID || !draft.trim()) return;
    const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
    const member = await getCurrentOrganizationMember(userID);
    if (!member) {
      setError("No landlord organization membership was found for this account.");
      return;
    }
    setIsSending(true);
    setError("");
    try {
      const now = new Date().toISOString();
      await createConversationMessage({
        conversationID,
        senderOrganizationMemberID: member.organizationMemberID,
        message: draft.trim(),
        messageType: "TEXT",
        sentAt: now,
        capturedDate: now,
        capturedBy: `${currentUser?.user?.firstName ?? "Landlord"} ${currentUser?.user?.lastName ?? ""}`.trim(),
      } as ConversationMessage);
      setDraft("");
      setMessages(await fetchApplicationConversationMessages(conversationID));
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "We could not send your message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="marketplace hosting-application-messages-page">
      <HostingHeader />
      <div className="hosting-application-review-context">
        <button type="button" onClick={() => navigate(`/hosting/applications/${searchParams.get("application") || ""}`)}>← Application</button>
        <span>{conversation?.subject || "Application messages"}</span>
      </div>
      <section className="hosting-application-messages-layout">
        <div className="hosting-review-section-heading">
          <div>
            <p className="marketplace-eyebrow">Application conversation</p>
            <h1>Message the prospective tenant</h1>
          </div>
        </div>
        {isLoading && <p>Loading conversation...</p>}
        {error && <p className="hosting-review-snapshot-note">{error}</p>}
        {!isLoading && !error && <div className="hosting-application-message-thread">
          {messages.length === 0 && <p className="hosting-review-snapshot-note">No messages yet.</p>}
          {messages.map((message) => <div className={`hosting-application-message ${message.senderOrganizationMemberID ? "is-landlord" : "is-tenant"}`} key={message.conversationMessageID}><small>{message.senderOrganizationMemberID ? "You" : "Prospective tenant"}</small><p>{message.message}</p><time>{new Date(message.sentAt).toLocaleDateString()}</time></div>)}
        </div>}
        <div className="hosting-application-message-composer">
          <textarea aria-label="Message prospective tenant" placeholder="Write a message to the prospective tenant" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={isSending} />
          <button type="button" className="hosting-review-message-button" onClick={() => void sendMessage()} disabled={isSending || !draft.trim()}>{isSending ? "Sending..." : "Send message"}</button>
        </div>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
