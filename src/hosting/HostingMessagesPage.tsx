import { useEffect, useMemo, useState } from 'react';import { useNavigate } from 'react-router-dom';import { CalendarIcon, ChevIcon, CopyIcon, DollarSignIcon, GlobeIcon, KeyIcon, MessageSquareIcon, PencilIcon, PlusIcon, PrintIcon, SearchIcon, SettingsIcon, ShieldIcon, StarIcon, XIcon } from '../components/Icons';
import HostingHeader from './HostingHeader';
import '../marketplace/MarketplaceHome.css';
import './HostingMessagesPage.css';

type MessageSender = 'guest' | 'host' | 'cohost';

interface ThreadMessage {
  id: string;
  sender: MessageSender;
  text: string;
  time?: string;
  senderLabel?: string;
  readBy?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  initials?: string;
  isSupport?: boolean;
  date: string;
  preview: string;
  stayRange: string;
  listing: string;
  messages: ThreadMessage[];
}

const conversations: Conversation[] = [
  {
    id: 'omolade', name: 'Omolade, Chimuanya', avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: 'Yesterday', preview: 'Omolade: Thank you and happy Sunday', stayRange: 'Aug 21 – 23', listing: "Daisy's Inn",
    messages: [
      { id: 'm0a', sender: 'guest', senderLabel: 'Omolade · Booker', time: 'Aug 21, 3:12 PM', text: 'Hi Obi! We just checked in, the place looks lovely. Thank you!' },
      { id: 'm0b', sender: 'host', time: '3:20 PM', text: "You're so welcome! Let me know if you need anything during your stay." },
      { id: 'm0c', sender: 'guest', senderLabel: 'Omolade · Booker', time: 'Aug 22, 9:04 AM', text: 'Quick question, is the parking spot in front reserved for us or shared with other units?' },
      { id: 'm0d', sender: 'host', time: '9:40 AM', text: "It's reserved just for you for the length of your stay." },
      { id: 'm1', sender: 'guest', text: "Good morning Obi, yes pleasant stay so far. We will observe your note, no worries. However, i had previously requested a checkout time for 12noon which was confirmed by Chim, please see attached and kindly reconfirm so we are alligned.\n\nRegards," },
      { id: 'm2', sender: 'cohost', senderLabel: 'Chimuanya · Co-host', time: '7:10 PM', readBy: 'Chimuanya', text: "Yes, please. You'd need to update the reservation to include another adult. Or, I could update the reservation and send you the updated request? Just let me know which option works for you!\n\nCheck out time by 12 noon is fine. 🙂🙂" },
      { id: 'm3', sender: 'host', time: '7:01 AM', readBy: 'Omolade', text: "Okay, that's fine. Happy Sunday." },
      { id: 'm4', sender: 'guest', senderLabel: 'Omolade · Booker', time: '7:12 AM', text: 'Thank you and happy Sunday' },
      { id: 'm5', sender: 'host', time: '7:30 AM', text: 'Safe travels, and thank you for staying with us!' },
    ],
  },
  {
    id: 'william', name: 'William Louie Laurent, Chimuanya', initials: 'W',
    date: 'Thursday', preview: "Chimuanya: That's okay! It does have a kitchen…", stayRange: 'Aug 23 – 30', listing: "Daisy's Inn",
    messages: [{ id: 'w1', sender: 'guest', text: "That's okay! It does have a kitchenette though, right?" }],
  },
  {
    id: 'sheila', name: 'Sheila, Chimuanya', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: 'Thursday', preview: "You: Hi Sheila, I hope you've had a wonderful st…", stayRange: 'Aug 18 – 20', listing: "Daisy's Inn",
    messages: [{ id: 's1', sender: 'host', text: "Hi Sheila, I hope you've had a wonderful stay!" }],
  },
  {
    id: 'support', name: 'Airbnb Support', isSupport: true,
    date: '8/16', preview: 'How did we do? Support', stayRange: '', listing: 'Support',
    messages: [{ id: 'sup1', sender: 'cohost', senderLabel: 'Support', text: 'How did we do?' }],
  },
  {
    id: 'tateesha', name: 'Tateesha, Chimuanya', avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: '8/16', preview: "You: Hi Tateesha, I hope you've had a wonderf…", stayRange: 'Aug 15 – 16', listing: "Daisy's Inn",
    messages: [{ id: 't1', sender: 'host', text: "Hi Tateesha, I hope you've had a wonderful stay!" }],
  },
  {
    id: 'kalyn', name: 'Kalyn, Chimuanya', avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    date: '8/15', preview: 'You: Thanks', stayRange: 'Aug 14 – 15', listing: "Daisy's Inn",
    messages: [{ id: 'k1', sender: 'host', text: 'Thanks' }],
  },
  {
    id: 'susan', name: 'Susan, Chimuanya', avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    date: '8/12', preview: 'Chimuanya: Thank you for your kind words Sus…', stayRange: 'Aug 9 – 12', listing: "Daisy's Inn",
    messages: [{ id: 'su1', sender: 'cohost', senderLabel: 'Chimuanya · Co-host', text: 'Thank you for your kind words Susan!' }],
  },
  {
    id: 'jocelyn', name: 'Jocelyn, Chimuanya', avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    date: '8/11', preview: 'You: Safe travels!', stayRange: 'Aug 5 – 8', listing: "Daisy's Inn",
    messages: [{ id: 'j1', sender: 'host', text: 'Safe travels!' }],
  },
  {
    id: 'nathan', name: 'Nathan, Chimuanya', avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    date: '8/9', preview: 'Nathan: Appreciate the early check-in!', stayRange: 'Aug 6 – 8', listing: "Daisy's Inn",
    messages: [{ id: 'n1', sender: 'guest', text: 'Appreciate the early check-in!' }],
  },
  {
    id: 'marina', name: 'Marina, Chimuanya', avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
    date: '8/7', preview: 'You: Glad you had a great stay!', stayRange: 'Aug 4 – 6', listing: "Daisy's Inn",
    messages: [{ id: 'ma1', sender: 'host', text: 'Glad you had a great stay!' }],
  },
  {
    id: 'derek', name: 'Derek, Chimuanya', avatar: 'https://randomuser.me/api/portraits/men/61.jpg',
    date: '8/5', preview: 'Derek: Thanks for the fast reply', stayRange: 'Jul 29 – Aug 2', listing: "Daisy's Inn",
    messages: [{ id: 'd1', sender: 'guest', text: 'Thanks for the fast reply' }],
  },
  {
    id: 'tanya', name: 'Tanya, Chimuanya', avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
    date: '8/2', preview: 'You: Checkout is at 11 AM, safe travels!', stayRange: 'Jul 27 – 29', listing: "Daisy's Inn",
    messages: [{ id: 'ta1', sender: 'host', text: 'Checkout is at 11 AM, safe travels!' }],
  },
  {
    id: 'cody', name: 'Cody, Chimuanya', avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
    date: '7/30', preview: 'Cody: Sounds great, see you then', stayRange: 'Jul 20 – 24', listing: "Daisy's Inn",
    messages: [{ id: 'co1', sender: 'guest', text: 'Sounds great, see you then' }],
  },
];

export default function HostingMessagesPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isManageLeaseOpen, setIsManageLeaseOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsManageLeaseOpen(false);
    };
    if (isManageLeaseOpen) {
      document.addEventListener('keydown', closeOnEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [isManageLeaseOpen]);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesQuery = normalizedQuery.length === 0 || conversation.name.toLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'all' || conversation.messages.some((message) => message.sender === 'guest' && !message.readBy);

      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const active = filteredConversations.find((conversation) => conversation.id === selectedId) ?? filteredConversations[0] ?? conversations[0];

  return (
    <main className="marketplace hosting-messages-page">
      <HostingHeader />
      <div className="hosting-messages-layout">
        <aside className="hosting-messages-list" aria-label="Conversations">
          <div className="hosting-messages-list-header">
            <h1>Messages</h1>
            <div className="hosting-messages-list-actions">
              <button type="button" aria-label="Search conversations" onClick={() => setIsSearchOpen((open) => !open)}>
                <SearchIcon />
              </button>
              <button type="button" aria-label="Message settings"><SettingsIcon /></button>
            </div>
          </div>
          {isSearchOpen && (
            <div className="hosting-messages-search">
              <SearchIcon />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by renter name"
                aria-label="Search conversations by renter name"
              />
              {query && (
                <button type="button" className="hosting-messages-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <XIcon />
                </button>
              )}
            </div>
          )}
          <div className="hosting-messages-filters">
            <button className={filter === 'all' ? 'is-active' : ''} type="button" onClick={() => setFilter('all')}>All <ChevIcon /></button>
            <button className={filter === 'unread' ? 'is-active' : ''} type="button" onClick={() => setFilter('unread')}>Unread</button>
          </div>
          <ul className="hosting-messages-items">
            {filteredConversations.length > 0 ? filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                <button className={conversation.id === selectedId ? 'is-active' : ''} type="button" onClick={() => setSelectedId(conversation.id)}>
                  <span className={`hosting-messages-avatar ${conversation.isSupport ? 'is-support' : ''}`}>
                    {conversation.avatar ? <img src={conversation.avatar} alt="" /> : conversation.isSupport ? 'a' : conversation.initials}
                  </span>
                  <span className="hosting-messages-item-body">
                    <span className="hosting-messages-item-top"><strong>{conversation.name}</strong><small>{conversation.date}</small></span>
                    <span className="hosting-messages-item-preview">{conversation.preview}</span>
                    <small className="hosting-messages-item-meta">{conversation.stayRange ? `${conversation.stayRange} · ${conversation.listing}` : conversation.listing}</small>
                  </span>
                </button>
              </li>
            )) : (
              <li className="hosting-messages-empty">No renters match “{query}”.</li>
            )}
          </ul>
        </aside>

        <section className="hosting-messages-thread" aria-label="Conversation">
          <header className="hosting-messages-thread-header">
            <span className={`hosting-messages-avatar ${active.isSupport ? 'is-support' : ''}`}>
              {active.avatar ? <img src={active.avatar} alt="" /> : active.isSupport ? 'a' : active.initials}
            </span>
            <div className="hosting-messages-thread-title">
              <strong>{active.name}</strong>
              <small><GlobeIcon /> Translation on</small>
            </div>
            <button type="button" className="hosting-messages-thread-expand" aria-label="Expand conversation"><ChevIcon /></button>
          </header>
          <div className="hosting-messages-thread-body">
            {active.messages.map((message) => (
              <div className={`hosting-message hosting-message-${message.sender}`} key={message.id}>
                {message.senderLabel && <small className="hosting-message-label">{message.senderLabel}{message.time ? ` ${message.time}` : ''}</small>}
                <div className="hosting-message-bubble">{message.text.split('\n\n').map((line, index) => <p key={index}>{line}</p>)}</div>
                {message.time && !message.senderLabel && <small className="hosting-message-time">{message.time}</small>}
                {message.readBy && <small className="hosting-message-read">Read by {message.readBy}</small>}
              </div>
            ))}
          </div>
          <div className="hosting-messages-composer">
            <div className="hosting-messages-composer-box">
              <input type="text" placeholder="Write a message…" aria-label="Write a message" />
              <div className="hosting-messages-composer-actions">
                <button type="button" aria-label="Attach"><PlusIcon /></button>
                <button type="button" aria-label="Message templates"><MessageSquareIcon /></button>
                <button type="button" className="hosting-messages-send" aria-label="Send message"><ChevIcon /></button>
              </div>
            </div>
          </div>
        </section>

        <aside className="hosting-messages-reservation" aria-label="Reservation details">
          <div className="hosting-reservation-header">
            <h2>Reservation</h2>
            <button type="button" aria-label="Close reservation panel"><XIcon /></button>
          </div>
          <div className="hosting-reservation-scroll">
            <div className="hosting-reservation-profile">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
              <strong>Omolade</strong>
              <small>Aug 21 – 23 · 2 nights</small>
            </div>
            <button
              type="button"
              className="hosting-reservation-review"
              onClick={() => navigate('/hosting/review', { state: { review: { name: 'Omolade', stayRange: 'Aug 21 – 23', nights: 2, reviewTitle: "Read Omolade's review", reviewMessage: 'They gave your place 5 stars!', avatarInitials: 'O' } } })}
            >
              <span><strong>Read Omolade's review</strong><small>They gave your place 5 stars!</small></span>
              <span className="hosting-reservation-review-star"><StarIcon /></span>
            </button>
            <div className="hosting-reservation-dates">
              <div><label>Check-in</label><strong>Fri, Aug 21</strong><small>3:00 PM</small></div>
              <div><label>Checkout</label><strong>Sun, Aug 23</strong><small>11:00 AM</small></div>
            </div>
            <div className="hosting-reservation-row"><KeyIcon /><div><strong>Suggested door code</strong><small>0779</small></div></div>
            <div className="hosting-reservation-block">
              <strong>Your notes</strong>
              <button type="button" className="hosting-reservation-add-note"><span><PlusIcon /></span>Add a note to yourself</button>
            </div>
            <div className="hosting-reservation-block">
              <strong>Renter</strong>
              <div className="hosting-reservation-person"><img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" /><div><strong>Omolade Oludoyi</strong><small>Lives in Saskatoon, Canada</small></div></div>
            </div>
            <div className="hosting-reservation-block">
              <strong>Hosted by</strong>
              <div className="hosting-reservation-person"><img src="https://randomuser.me/api/portraits/men/54.jpg" alt="" /><div><strong>Obinna Eze (Obi)</strong><small>Listing owner</small></div></div>
            </div>
            <div className="hosting-reservation-block"><strong>Cancellation policy</strong><small>Flexible</small></div>
            <div className="hosting-reservation-total"><strong>$164.90</strong><span>Total for 2 nights</span></div>
            <button type="button" className="hosting-reservation-manage" onClick={() => setIsManageLeaseOpen(true)}><PencilIcon /> Manage lease <ChevIcon /></button>
            <div className="hosting-reservation-block"><strong>Booking date</strong><small>Thursday, August 20, 2026</small></div>
            <div className="hosting-reservation-block"><strong>Confirmation code</strong><small>HMJ9HM5SAB</small></div>
            <div className="hosting-reservation-block"><strong>Payout</strong><small>$148.41 · Paid out Aug 24, 2026</small></div>
            <div className="hosting-reservation-block"><strong>House rules</strong><small>No smoking · No parties or events · Quiet hours after 10 PM</small></div>
            <div className="hosting-reservation-block"><strong>Local laws and regulations</strong><small>Guests must comply with Saskatoon short-term rental bylaws</small></div>
            <div className="hosting-reservation-block"><strong>Get directions</strong><small>123 Daisy Lane, Saskatoon, SK</small></div>
            <div className="hosting-reservation-block"><strong>Contact support</strong><small>Available 24/7 for hosts and guests</small></div>
          </div>
        </aside>
      </div>
      {isManageLeaseOpen && (
        <div className="hosting-lease-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsManageLeaseOpen(false); }}>
          <section className="hosting-lease-modal" role="dialog" aria-modal="true" aria-labelledby="manage-lease-title">
            <header className="hosting-lease-modal-header">
              <h2 id="manage-lease-title">Manage lease</h2>
              <button type="button" aria-label="Close manage lease" onClick={() => setIsManageLeaseOpen(false)}><XIcon /></button>
            </header>
            <div className="hosting-lease-modal-options">
              <button type="button" className="hosting-lease-modal-option"><CalendarIcon /><span>View on calendar</span><ChevIcon /></button>
              <div className="hosting-lease-modal-option hosting-lease-modal-phone"><span className="hosting-lease-modal-option-icon">☎</span><span><strong>Omolade's phone number</strong><small>+49 1521 3080779</small></span><button type="button" aria-label="Copy phone number" onClick={() => navigator.clipboard?.writeText('+49 1521 3080779')}><CopyIcon /></button></div>
              <div className="hosting-lease-modal-divider" />
              <button type="button" className="hosting-lease-modal-option"><DollarSignIcon /><span><strong>Send or request money</strong><small>For fees, refunds, or changes</small></span><ChevIcon /></button>
              <button type="button" className="hosting-lease-modal-option"><ShieldIcon /><span>Start a liability claim</span><ChevIcon /></button>
              <button type="button" className="hosting-lease-modal-option"><PrintIcon /><span>Print</span><ChevIcon /></button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
