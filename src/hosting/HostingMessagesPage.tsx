import { useEffect, useMemo, useState } from "react";
import { HubConnectionBuilder, LogLevel, type HubConnection } from "@microsoft/signalr";
import { ChevIcon, GlobeIcon, MessageSquareIcon, PlusIcon, SearchIcon, SettingsIcon, XIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { env } from "../env";
import { getCurrentOrganizationMember } from "./organizationMemberIdentity";
import { fetchMessagingInbox, fetchMessagingThread, markMessagingThreadRead, sendMessagingMessage, type ConversationSummary, type MessagingMessage } from "../apis/messaging";
import { parseApplicationCardMessage } from "./applicationConversations";
import HostingHeader from "./HostingHeader";
import MarketplaceFooter from "../marketplace/MarketplaceFooter";
import "../marketplace/MarketplaceHome.css";
import "./HostingMessagesPage.css";

type Filter = "all" | "unread";

const dateLabel = (value?: string | null) => value
  ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
  : "";

const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "?";

export default function HostingMessagesPage() {
  const { currentUser } = useAuth();
  const [organizationMemberID, setOrganizationMemberID] = useState<string>();
  const [organizationID, setOrganizationID] = useState<string>();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedID, setSelectedID] = useState<string>();
  const [messages, setMessages] = useState<MessagingMessage[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isThreadLoading, setIsThreadLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
    if (!userID || !currentUser?.accessToken) return;
    let cancelled = false;
    getCurrentOrganizationMember(userID).then((member) => {
      if (cancelled) return;
      if (!member) {
        setError("No active host organization membership was found for this account.");
        setIsLoading(false);
        return;
      }
      setOrganizationMemberID(member.organizationMemberID);
      setOrganizationID(member.organizationID);
    }).catch(() => {
      if (!cancelled) {
        setError("We could not resolve your host organization.");
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [currentUser?.accessToken, currentUser?.user?.id, currentUser?.user?.userId]);

  useEffect(() => {
    if (!organizationID) return;
    let cancelled = false;
    fetchMessagingInbox({ organizationID, pageNumber: 1, pageSize: 50, unreadOnly: filter === "unread", search: query || undefined })
      .then(({ data }) => {
        if (cancelled) return;
        setConversations(data);
        setSelectedID((current) => current && data.some((item) => item.conversationID === current) ? current : data[0]?.conversationID);
      })
      .catch((loadError) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We could not load your messages."); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [organizationID, filter, query]);

  const active = useMemo(() => conversations.find((item) => item.conversationID === selectedID) ?? null, [conversations, selectedID]);

  useEffect(() => {
    if (!selectedID || !organizationMemberID) return;
    let cancelled = false;
    fetchMessagingThread(selectedID)
      .then(({ data }) => { if (!cancelled) setMessages(data); return markMessagingThreadRead(selectedID, { organizationMemberID, organizationID }); })
      .then(() => { if (!cancelled) setConversations((current) => current.map((item) => item.conversationID === selectedID ? { ...item, unreadCount: 0 } : item)); })
      .catch((loadError) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We could not load this conversation."); })
      .finally(() => { if (!cancelled) setIsThreadLoading(false); });
    return () => { cancelled = true; };
  }, [organizationID, organizationMemberID, selectedID]);

  useEffect(() => {
    if (!selectedID || !currentUser?.accessToken) return;
    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(`${env.API_TARGET_URL.replace(/\/$/, "")}/hubs/messaging`, { accessTokenFactory: () => currentUser.accessToken ?? "" })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();
    const handleMessage = (message: MessagingMessage) => {
      if (message.conversationID === selectedID) setMessages((current) => current.some((item) => item.conversationMessageID === message.conversationMessageID) ? current : [...current, message]);
    };
    connection.on("MessageReceived", handleMessage);
    void connection.start().then(() => connection.invoke("JoinConversation", selectedID)).catch(() => undefined);
    return () => { connection.off("MessageReceived", handleMessage); void connection.invoke("LeaveConversation", selectedID).catch(() => undefined); void connection.stop(); };
  }, [currentUser?.accessToken, selectedID]);

  const sendMessage = async () => {
    if (!selectedID || !organizationMemberID || !draft.trim()) return;
    setIsSending(true);
    try {
      const message = await sendMessagingMessage({ conversationID: selectedID, message: draft.trim(), senderOrganizationMemberID: organizationMemberID, senderUserID: currentUser?.user?.id ?? currentUser?.user?.userId });
      setMessages((current) => [...current, message]);
      setConversations((current) => current.map((item) => item.conversationID === selectedID ? { ...item, lastMessagePreview: message.message, lastMessageAt: message.sentAt, unreadCount: 0 } : item));
      setDraft("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "We could not send your message.");
    } finally { setIsSending(false); }
  };

  const renderMessageContent = (message: MessagingMessage) => {
    const applicationCard = message.messageType === "APPLICATION_CARD" ? parseApplicationCardMessage(message.message) : null;
    if (!applicationCard) return <p>{message.message}</p>;
    const netAmount = Number(applicationCard.netToLandlord ?? 0);
    const viewUrl = applicationCard.url || "/hosting/applications";
    return (
      <button type="button" className="hosting-application-card-message" onClick={() => window.location.assign(viewUrl)}>
        <span className="hosting-application-card-message-label">Rental application</span>
        <strong>{applicationCard.listingTitle || "Rental application"}</strong>
        <small>{applicationCard.applicantName || "Applicant"}</small>
        <div className="hosting-application-card-message-row">
          <span>Net to landlord</span>
          <b>${netAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
        </div>
        {applicationCard.note && <p>{applicationCard.note}</p>}
        <em>Open application →</em>
      </button>
    );
  };

  return (
    <main className="marketplace hosting-messages-page">
      <HostingHeader />
      <div className="hosting-messages-layout">
        <aside className="hosting-messages-list" aria-label="Conversations">
          <div className="hosting-messages-list-header"><h1>Messages</h1><div className="hosting-messages-list-actions"><button type="button" aria-label="Search conversations" onClick={() => setIsSearchOpen((open) => !open)}><SearchIcon /></button><button type="button" aria-label="Message settings"><SettingsIcon /></button></div></div>
          {isSearchOpen && <div className="hosting-messages-search"><SearchIcon /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by renter name" aria-label="Search conversations" />{query && <button type="button" className="hosting-messages-search-clear" aria-label="Clear search" onClick={() => setQuery("")}><XIcon /></button>}</div>}
          <div className="hosting-messages-filters"><button className={filter === "all" ? "is-active" : ""} type="button" onClick={() => setFilter("all")}>All <ChevIcon /></button><button className={filter === "unread" ? "is-active" : ""} type="button" onClick={() => setFilter("unread")}>Unread</button></div>
          <ul className="hosting-messages-items">
            {isLoading && <li className="hosting-messages-empty">Loading messages...</li>}
            {!isLoading && conversations.map((conversation) => <li key={conversation.conversationID}><button className={conversation.conversationID === selectedID ? "is-active" : ""} type="button" onClick={() => { setSelectedID(conversation.conversationID); setIsThreadLoading(true); }}><span className="hosting-messages-avatar">{initials(conversation.counterpartyName)}</span><span className="hosting-messages-item-body"><span className="hosting-messages-item-top"><strong className={conversation.unreadCount > 0 ? "is-unread" : ""}>{conversation.counterpartyName}</strong><small>{dateLabel(conversation.lastMessageAt)}</small></span><span className="hosting-messages-item-preview">{conversation.lastMessagePreview || "No messages yet"}</span><small className="hosting-messages-item-meta">{conversation.subject || "Direct conversation"}</small></span></button></li>)}
            {!isLoading && conversations.length === 0 && <li className="hosting-messages-empty">No conversations found.</li>}
          </ul>
        </aside>
        <section className="hosting-messages-thread" aria-label="Conversation">
          {active ? <><header className="hosting-messages-thread-header"><span className="hosting-messages-avatar">{initials(active.counterpartyName)}</span><div className="hosting-messages-thread-title"><strong>{active.counterpartyName}</strong><small><GlobeIcon /> Translation on</small></div><button type="button" className="hosting-messages-thread-expand" aria-label="Toggle conversation details" onClick={() => setDetailsOpen((open) => !open)}><ChevIcon /></button></header><div className="hosting-messages-thread-body">{isThreadLoading && <p>Loading conversation...</p>}{!isThreadLoading && messages.map((message) => <div className={`hosting-message ${message.senderOrganizationMemberID ? "hosting-message-host" : "hosting-message-guest"}`} key={message.conversationMessageID}><small className="hosting-message-label">{message.senderOrganizationMemberID ? "You" : active.counterpartyName}</small><div className="hosting-message-bubble">{renderMessageContent(message)}</div><small className="hosting-message-time">{new Date(message.sentAt).toLocaleString()}</small></div>)}</div><div className="hosting-messages-composer"><div className="hosting-messages-composer-box"><input type="text" placeholder="Write a message..." aria-label="Write a message" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} disabled={isSending} /><div className="hosting-messages-composer-actions"><button type="button" aria-label="Attach"><PlusIcon /></button><button type="button" aria-label="Message templates"><MessageSquareIcon /></button><button type="button" className="hosting-messages-send" aria-label="Send message" onClick={() => void sendMessage()} disabled={isSending || !draft.trim()}><ChevIcon /></button></div></div></div></> : <div className="hosting-messages-empty">Select a conversation to start chatting.</div>}
        </section>
        {detailsOpen && <aside className="hosting-messages-reservation" aria-label="Conversation details"><div className="hosting-reservation-header"><h2>Conversation</h2><button type="button" aria-label="Close conversation details" onClick={() => setDetailsOpen(false)}><XIcon /></button></div><div className="hosting-reservation-scroll">{active ? <><div className="hosting-reservation-profile"><span className="hosting-messages-avatar">{initials(active.counterpartyName)}</span><strong>{active.counterpartyName}</strong><small>{active.subject || "Direct conversation"}</small></div><div className="hosting-reservation-block"><strong>Status</strong><small>{active.status || "OPEN"}</small></div><div className="hosting-reservation-block"><strong>Last activity</strong><small>{active.lastMessageAt ? new Date(active.lastMessageAt).toLocaleString() : "No activity yet"}</small></div><div className="hosting-reservation-block"><strong>Unread messages</strong><small>{active.unreadCount}</small></div></> : <p className="hosting-messages-empty">Select a conversation.</p>}</div></aside>}
      </div>
      {error && <p className="hosting-review-snapshot-note">{error}</p>}
      <MarketplaceFooter />
    </main>
  );
}
