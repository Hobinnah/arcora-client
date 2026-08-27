import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import '../marketplace/MarketplaceHome.css';
import './HostingPage.css';

const followUps = [
  { name: "Omolade", action: "Read Omolade's 5-star review", initials: 'O', tone: 'coral' },
  { name: 'Kalyn', action: "Read Kalyn's 5-star review", initials: 'K', tone: 'violet' },
  { name: 'Susan', action: "Read Susan's 5-star review", initials: 'S', tone: 'teal' },
];

export default function HostingPage() {
  const [view, setView] = useState<'today' | 'upcoming'>('today');
  const navigate = useNavigate();

  return (
    <main className="marketplace hosting-page">
      <HostingHeader />
      <section className="hosting-content" aria-labelledby="hosting-title">
        <div className="hosting-view-toggle" role="tablist" aria-label="Reservation timeframe">
          <button className={view === 'today' ? 'is-active' : ''} type="button" role="tab" aria-selected={view === 'today'} onClick={() => setView('today')}>Today</button>
          <button className={view === 'upcoming' ? 'is-active' : ''} type="button" role="tab" aria-selected={view === 'upcoming'} onClick={() => setView('upcoming')}>Upcoming</button>
        </div>
        <div className="hosting-empty-state">
          <h1 id="hosting-title">You’re not hosting any reservations</h1>
          <p>{view === 'today' ? 'You have 3 follow-ups' : 'No upcoming reservations'}</p>
          {view === 'today' && <div className="hosting-followups">{followUps.map((item) => <article className="hosting-followup" key={item.name} onClick={() => navigate('/hosting/review', { state: { review: { name: item.name, stayRange: 'Aug 21 – 23', nights: 2, reviewTitle: `Read ${item.name}'s review`, reviewMessage: 'They gave your place 5 stars!', avatarInitials: item.initials } } })} style={{ cursor: 'pointer' }}><div className="hosting-stars" aria-label="5 stars">★★★★★</div><strong>{item.action}</strong><span className={`hosting-review-avatar ${item.tone}`}>{item.initials}</span><small>Hosted 1 day ago</small></article>)}</div>}
          <button className="hosting-all-link" type="button">See all reservations</button>
        </div>
      </section>
      <MarketplaceFooter />
    </main>
  );
}