import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import { useAuth } from '../hooks/useAuth';
import { getLandlordOrganization } from '../apis/useLandlordOrganization';
import { countListingsByOrganization } from '../apis/useListing';
import { useVerificationCenter } from '../apis/useVerificationCenter';
import { fetchReceivedReviews, type ReceivedReview } from '../apis/useRating';
import '../marketplace/MarketplaceHome.css';
import './HostingPage.css';

export default function HostingPage() {
  const [view, setView] = useState<'today' | 'upcoming'>('today');
  const [reviews, setReviews] = useState<ReceivedReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [checkingHostReadiness, setCheckingHostReadiness] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const roles = [...(currentUser?.roles ?? []), ...(currentUser?.user?.roles ?? [])].map((role) => role.toLowerCase());
  const isHost = roles.includes('landlord') || roles.includes('host');
  const verification = useVerificationCenter(userID);
  useEffect(() => {
    let cancelled = false;
    fetchReceivedReviews()
      .then((data) => { if (!cancelled) setReviews(data.filter((review) => review.subjectType.toUpperCase() === 'HOST')); })
      .catch((error: unknown) => { if (!cancelled) setReviewsError(error instanceof Error ? error.message : 'We could not load your reviews.'); })
      .finally(() => { if (!cancelled) setReviewsLoading(false); });
    return () => { cancelled = true; };
  }, []);
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
          <p>{view === 'today' ? 'Reservation activity will appear here when you have an active reservation.' : 'No upcoming reservations are available.'}</p>
          <section className="hosting-reviews-section" aria-labelledby="hosting-reviews-title">
            <h2 id="hosting-reviews-title">Reviews about your listings</h2>
            {reviewsLoading ? <p role="status">Loading reviews…</p> : reviewsError ? <p role="alert">{reviewsError}</p> : reviews.length === 0 ? <p>No published reviews yet. Reviews remain private until both sides submit or 14 days pass.</p> : (
              <div className="hosting-followups">
                {reviews.map((review) => (
                  <article className="hosting-followup" key={review.ratingID}>
                    <div className="hosting-stars" aria-label={`${review.overallRating} out of 5 stars`}>{'★'.repeat(review.overallRating)}{'☆'.repeat(Math.max(0, 5 - review.overallRating))}</div>
                    <strong>{review.reviewerName || 'Tenant'} · {review.listingTitle}</strong>
                    <p>{review.reviewBody}</p>
                    <button type="button" className="hosting-all-link" onClick={() => navigate(`/hosting/review?id=${encodeURIComponent(review.ratingID)}`)}>Read review</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
      <MarketplaceFooter />
    </main>
  );
}