import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TenantHeader from "./TenantHeader";
import MarketplaceFooter from "./MarketplaceFooter";
import { useAuth } from "../hooks/useAuth";
import { getTenantByUserID } from "../apis/useTenant";
import { getConversation } from "../apis/useConversation";
import { createConversationMessage } from "../apis/useConversationMessage";
import { fetchApplicationConversationMessages } from "../hosting/applicationConversations";
import type { Conversation } from "../types/Conversation";
import type { ConversationMessage } from "../types/ConversationMessage";
import "./TenantApplicationDetailPage.css";

export default function TenantApplicationMessagesPage() {
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
    if (!userID) return;
    setIsSending(true);
    setError("");
    try {
      const tenant = await getTenantByUserID(userID);
      if (!tenant?.tenantID) throw new Error("Your tenant profile could not be found.");
      const now = new Date().toISOString();
      await createConversationMessage({
        conversationID,
        senderTenantID: tenant.tenantID,
        senderUserID: userID,
        message: draft.trim(),
        messageType: "TEXT",
        sentAt: now,
        capturedDate: now,
        capturedBy: `${currentUser?.user?.firstName ?? "Tenant"} ${currentUser?.user?.lastName ?? ""}`.trim(),
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
    <main className="marketplace tenant-application-messages-page">
      <TenantHeader />
      <div className="tenant-application-review-context">
        <button type="button" onClick={() => navigate(`/applications/${searchParams.get("application") || ""}`)}>← Application</button>
        <span>{conversation?.subject || "Application messages"}</span>
      </div>
      <section className="tenant-application-messages-layout">
        <p className="marketplace-eyebrow">Application conversation</p>
        <h1>Message your landlord</h1>
        {isLoading && <p>Loading conversation...</p>}
        {error && <p role="alert">{error}</p>}
        {!isLoading && !error && <div className="tenant-application-message-thread">
          {messages.length === 0 && <p>No messages yet.</p>}
          {messages.map((message) => <div className={`tenant-application-message ${message.senderTenantID ? "is-tenant" : "is-landlord"}`} key={message.conversationMessageID}><small>{message.senderTenantID ? "You" : "Landlord"}</small><p>{message.message}</p><time>{new Date(message.sentAt).toLocaleDateString()}</time></div>)}
        </div>}
        <div className="tenant-application-message-composer">
          <textarea aria-label="Message landlord" placeholder="Write a message to your landlord" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={isSending} />
          <button type="button" className="tenant-application-complete-button" onClick={() => void sendMessage()} disabled={isSending || !draft.trim()}>{isSending ? "Sending..." : "Send message"}</button>
        </div>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
