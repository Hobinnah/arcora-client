import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import { useAuth } from '../hooks/useAuth';
import { getLandlordOrganization } from '../apis/useLandlordOrganization';
import { countListingsByOrganization } from '../apis/useListing';
import { useVerificationCenter } from '../apis/useVerificationCenter';
import '../marketplace/MarketplaceHome.css';
import './HostingPage.css';

const followUps = [
  { name: "Omolade", action: "Read Omolade's 5-star review", initials: 'O', tone: 'coral' },
  { name: 'Kalyn', action: "Read Kalyn's 5-star review", initials: 'K', tone: 'violet' },
  { name: 'Susan', action: "Read Susan's 5-star review", initials: 'S', tone: 'teal' },
];

export default function HostingPage() {
  const [view, setView] = useState<'today' | 'upcoming'>('today');
  const [checkingHostReadiness, setCheckingHostReadiness] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const roles = [...(currentUser?.roles ?? []), ...(currentUser?.user?.roles ?? [])].map((role) => role.toLowerCase());
  const isHost = roles.includes('landlord') || roles.includes('host');
  const verification = useVerificationCenter(userID);
  useEffect(() => {
    if (!userID || !isHost || verification.loading) return;
    let cancelled = false;
    const verificationSubmitted = localStorage.getItem(`arcora:verification-submitted:${userID}`) === 'true';
    if (!verification.identityVerified && !verificationSubmitted) {
      navigate('/verify-identity', { replace: true });
      return () => { cancelled = true; };
    }
    const checkHostReadiness = async () => {
      try {
        const organization = currentUser?.organization ?? currentUser?.memberOrganizations?.find((item) => item.organization)?.organization ?? await getLandlordOrganization(userID);
        if (cancelled) return;
        if (!organization?.organizationID) {
          navigate('/hosting/setup-business', { replace: true });
          return;
        }
        const listingCount = await countListingsByOrganization(organization.organizationID);
        if (cancelled) return;
        if (import.meta.env.DEV) console.info('[Hosting] Listing count for organization', { organizationID: organization.organizationID, listingCount });
        if (listingCount === 0) {
          navigate('/hosting/listings/new', { replace: true });
          return;
        }
        setCheckingHostReadiness(false);
      } catch (error) {
        if (!cancelled) {
          console.error('[Hosting] Unable to determine hosting readiness:', error);
          setCheckingHostReadiness(false);
        }
      }
    };
    void checkHostReadiness();
    return () => { cancelled = true; };
  }, [userID, isHost, verification.loading, verification.identityVerified, navigate]);

  if (checkingHostReadiness && isHost) {
    return <main className="marketplace hosting-page" aria-busy="true"><p style={{ padding: '48px', textAlign: 'center' }}>Preparing your hosting account...</p></main>;
  }

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