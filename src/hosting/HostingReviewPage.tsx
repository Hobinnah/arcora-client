import { useNavigate } from 'react-router-dom';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import '../marketplace/MarketplaceHome.css';
import './HostingReviewPage.css';

const guestAvatarUrl = 'https://randomuser.me/api/portraits/women/44.jpg';

const detailReview = {
  guestName: 'Omolade',
  propertyName: "Daisy's Inn",
  stayRange: 'August 21 – 23',
  overallRating: 5,
  publicReview: 'Very serene environment, friendly host/co-host, quiet and welcoming place. Flexibility in checkout time, and clear instructions. I will definitely revisit.',
  privateNote: 'Love the place',
  categories: [
    { label: 'Check-in', rating: 5, items: ['Responsive host', 'Clear instructions', 'Easy to find', 'Easy to get inside', '+2 more'] },
    { label: 'Cleanliness', rating: 5, items: ['Spotless furniture & linens', 'Free of clutter', 'Squeaky-clean bathroom', 'Pristine kitchen'] },
    { label: 'Accuracy', rating: 5, items: ['Looked like the photos', 'Matched the description', 'Had listed amenities & services'] },
    { label: 'Communication', rating: 5, items: ['Always responsive', 'Helpful instructions', 'Friendly'] },
    { label: 'Location', rating: 5, items: [] },
    { label: 'Value', rating: 5, items: [] },
  ],
};

export default function HostingReviewPage() {
  const navigate = useNavigate();

  return (
    <main className="marketplace hosting-page hosting-review-page">
      <HostingHeader />
      <section className="hosting-review-content" aria-labelledby="review-page-title">
        <div className="hosting-review-backlink-wrap">
          <button type="button" className="hosting-review-backlink" onClick={() => navigate('/hosting/messages')}>
            ‹ All listing reviews
          </button>
        </div>

        <article className="hosting-review-detail-card" aria-label="Review details">
          <div className="hosting-review-detail-header">
            <div className="hosting-review-detail-title-wrap">
              <h2>{detailReview.guestName}'s review of your place</h2>
              <p>{detailReview.propertyName}</p>
              <small>{detailReview.stayRange}</small>
            </div>
            <div className="hosting-review-portrait" aria-hidden="true">
              <img src={guestAvatarUrl} alt="Omolade" />
            </div>
          </div>

          <div className="hosting-review-total-row">
            <span>Overall rating</span>
            <strong>{detailReview.overallRating} ★</strong>
          </div>

          <div className="hosting-review-public-review">
            <h3>Public review</h3>
            <p>{detailReview.publicReview}</p>
            <button type="button">Write a public reply</button>
          </div>

          <div className="hosting-review-private-note">
            <h3>Private note from {detailReview.guestName}</h3>
            <p>{detailReview.privateNote}</p>
          </div>

          <div className="hosting-review-category-list">
            {detailReview.categories.map((category) => (
              <div key={category.label} className="hosting-review-category-row">
                <span>{category.label}</span>
                <strong>{category.rating} ★</strong>
                {category.items.length > 0 && (
                  <div className="hosting-review-category-items">
                    <div className="hosting-review-category-column">
                      {category.items.slice(0, Math.ceil(category.items.length / 2)).map((item) => (
                        <div key={item} className="hosting-review-check-item">✓ {item}</div>
                      ))}
                    </div>
                    <div className="hosting-review-category-column">
                      {category.items.slice(Math.ceil(category.items.length / 2)).map((item) => (
                        <div key={item} className="hosting-review-check-item">✓ {item}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
