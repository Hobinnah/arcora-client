import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchReceivedReview, type ReceivedReview } from '../apis/useRating';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import '../marketplace/MarketplaceHome.css';
import './HostingReviewPage.css';

const reviewCategories = [
  ['Payment reliability', 'paymentRating'],
  ['Communication', 'communicationRating'],
  ['Property care', 'propertyCareRating'],
  ['Responsiveness', 'responsivenessRating'],
  ['Listing accuracy', 'accuracyRating'],
  ['Cleanliness', 'cleanlinessRating'],
] as const;

export default function HostingReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ratingID = searchParams.get('id');
  const [review, setReview] = useState<ReceivedReview | null>(null);
  const [loading, setLoading] = useState(Boolean(ratingID));
  const [error, setError] = useState(ratingID ? '' : 'Select a published review from your hosting overview.');

  useEffect(() => {
    if (!ratingID) return;
    let cancelled = false;
    fetchReceivedReview(ratingID)
      .then((result) => { if (!cancelled) setReview(result); })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'We could not load this review.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [ratingID]);

  const categoryRatings = review ? reviewCategories
    .map(([label, key]) => ({ label, rating: review[key] }))
    .filter((category) => typeof category.rating === 'number') : [];

  return (
    <main className="marketplace hosting-page hosting-review-page">
      <HostingHeader />
      <section className="hosting-review-content" aria-labelledby="review-page-title">
        <div className="hosting-review-backlink-wrap">
          <button type="button" className="hosting-review-backlink" onClick={() => navigate('/hosting')}>
            ‹ All listing reviews
          </button>
        </div>
        {loading ? (
          <article className="hosting-review-detail-card" role="status">Loading review…</article>
        ) : error || !review ? (
          <article className="hosting-review-detail-card" role="alert">
            <h1 id="review-page-title">Review unavailable</h1>
            <p>{error || 'This review is unavailable or has not been published yet.'}</p>
          </article>
        ) : (
          <article className="hosting-review-detail-card" aria-label="Review details">
            <div className="hosting-review-detail-header">
              <div className="hosting-review-detail-title-wrap">
                <span className="hosting-review-kicker">Published review</span>
                <h1 id="review-page-title">{review.reviewerName || 'Tenant'}’s review</h1>
                <p>{review.listingTitle}</p>
                <small>{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(review.publishedAt))}</small>
              </div>
            </div>

            <div className="hosting-review-total-row">
              <span>Overall rating</span>
              <strong>{review.overallRating} ★</strong>
            </div>

            <div className="hosting-review-public-review">
              <h2>Public review</h2>
              <p>{review.reviewBody}</p>
            </div>

            <div className="hosting-review-category-list">
              {categoryRatings.map((category) => (
                <div key={category.label} className="hosting-review-category-row">
                  <span>{category.label}</span>
                  <strong>{category.rating} ★</strong>
                </div>
              ))}
            </div>
            <p className="hosting-review-private-note">A public reply is not available yet.</p>
          </article>
        )}
      </section>
      <MarketplaceFooter />
    </main>
  );
}
