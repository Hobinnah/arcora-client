import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarIcon, HomeIcon, MapPinIcon, ShieldIcon, StarIcon, WifiIcon } from '../components/Icons';
import { getListing } from '../apis/useListing';
import { fallbackListings, type MarketplaceListing } from './marketplaceData';
import MarketplaceHeader from './MarketplaceHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './MarketplaceHome.css';
import './ListingDetail.css';

const formatPrice = (p: number) => new Intl.NumberFormat('en-US').format(p);

const fallbackPhotos = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=85',
];

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [raw, setRaw] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [saved, setSaved] = useState(false);
  const [detailCalMonth, setDetailCalMonth] = useState(new Date(2026, 8, 1));
  const [moveIn, setMoveIn] = useState('');
  const [moveOut, setMoveOut] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (id) {
          const data = await getListing(id);
          if (!cancelled && data) {
            setRaw(data as unknown as Record<string, any>);
            const fb = fallbackListings.find((l) => l.id === id) ?? fallbackListings[0];
            setListing({
              id: String((data as any).listingID ?? id),
              title: (data as any).title ?? fb.title,
              location: fb.location,
              price: (data as any).baseMonthlyRentAmount ?? fb.price,
              type: (data as any).listingType?.name ?? fb.type,
              image: fb.image,
              details: fb.details,
              rating: fb.rating,
              reviews: fb.reviews,
              availableFrom: (data as any).availableFrom ?? fb.availableFrom,
              tag: fb.tag,
            });
          }
        }
      } catch {
        if (!cancelled) {
          const fb = fallbackListings.find((l) => l.id === id) ?? fallbackListings[0];
          setListing(fb);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (!listing && !loading) {
      const fb = fallbackListings.find((l) => l.id === id) ?? fallbackListings[0];
      setListing(fb);
    }
  }, [id, listing, loading]);

  if (loading) return <main className="marketplace"><div className="detail-loading">Loading listing...</div></main>;
  if (!listing) return <main className="marketplace"><div className="detail-loading">Listing not found.</div></main>;

  const bedrooms = (raw as any)?.bedrooms ?? 2;
  const bathrooms = (raw as any)?.bathrooms ?? 1;
  const sqft = (raw as any)?.squareFeet ?? 850;
  const minLease = (raw as any)?.minimumLeaseMonths ?? 1;
  const maxLease = (raw as any)?.maximumLeaseMonths ?? 12;
  const deposit = (raw as any)?.securityDepositAmount ?? listing.price;
  const description = (raw as any)?.description || `Welcome to this beautifully maintained ${listing.type.toLowerCase()} in ${listing.location}. This home features ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}, ${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}, and ${sqft} sq ft of living space. Perfect for professionals, couples, or small families looking for a comfortable monthly rental with transparent pricing and flexible lease terms. The space is move-in ready and includes all essential furnishings.`;
  const photos = [listing.image, ...fallbackPhotos.filter((p) => p !== listing.image)].slice(0, 5);

  return (
    <main className="marketplace listing-detail">
      <MarketplaceHeader />

      <div className="detail-container">
        <header className="detail-header">
          <h1>{listing.title}</h1>
          <div className="detail-header-actions">
            <button type="button" className="detail-action">↗ Share</button>
            <button type="button" className={`detail-action ${saved ? 'is-saved' : ''}`} onClick={() => setSaved(!saved)}>{saved ? '♥' : '♡'} Save</button>
          </div>
        </header>

        <section className="detail-gallery" onClick={() => nav(`/homes/${id}/photos`)}>
          <div className="detail-gallery-main"><img src={photos[0]} alt={listing.title} /></div>
          <div className="detail-gallery-grid">
            {photos.slice(1, 5).map((src, i) => <div key={i} className="detail-gallery-thumb"><img src={src} alt={`${listing.title} photo ${i + 2}`} /></div>)}
            <button className="detail-gallery-show" type="button" onClick={(e) => { e.stopPropagation(); nav(`/homes/${id}/photos`); }}>⊞ Show all photos</button>
          </div>
        </section>

        <div className="detail-body">
          <div className="detail-main">
            <section className="detail-intro">
              <div>
                <h2>{listing.type} in {listing.location}</h2>
                <p className="detail-specs">{bedrooms} bedroom{bedrooms > 1 ? 's' : ''} · {bathrooms} bath{bathrooms > 1 ? 's' : ''} · {sqft} sq ft</p>
              </div>
              <div className="detail-badge">
                <div className="detail-badge-content"><span className="detail-badge-icon">🏆</span><div><strong>Renter favourite</strong><small>One of the most loved homes on Arcora</small></div></div>
                <div className="detail-badge-stats"><div><strong>{listing.rating || '4.9'}</strong><small>★★★★★</small></div><div><strong>{listing.reviews || '—'}</strong><small>Reviews</small></div></div>
              </div>
            </section>

            <section className="detail-host">
              <div className="detail-host-avatar">H</div>
              <div><strong>Managed by Arcora</strong><p>Professional property management · Responsive support</p></div>
            </section>

            <section className="detail-highlights">
              <div className="detail-highlight"><ShieldIcon /><div><strong>Verified listing</strong><p>This home has been verified by Arcora for accuracy and quality.</p></div></div>
              <div className="detail-highlight"><MapPinIcon /><div><strong>Great location</strong><p>Recent renters gave the location a 5-star rating.</p></div></div>
              <div className="detail-highlight"><CalendarIcon /><div><strong>Flexible lease</strong><p>{minLease}–{maxLease} month terms available. Cancel with notice.</p></div></div>
            </section>

            <section className="detail-description">
              <p className={showMore ? '' : 'is-clamped'}>{description}</p>
              <button className="detail-show-more" type="button" onClick={() => setShowMore(!showMore)}>{showMore ? 'Show less' : 'Show more'} ›</button>
            </section>

            <section className="detail-sleep">
              <h3>Where you'll sleep</h3>
              <div className="detail-sleep-grid">
                {Array.from({ length: bedrooms }, (_, i) => <div className="detail-sleep-card" key={i}><img src={photos[(i + 1) % photos.length]} alt={`Bedroom ${i + 1}`} /><strong>Bedroom {i + 1}</strong><small>{i === 0 ? '1 king bed' : '1 queen bed'}</small></div>)}
              </div>
            </section>

            <section className="detail-availability">
              <div className="detail-availability-header">
                <div><h3>{moveIn && moveOut ? `${Math.round((new Date(moveOut).getTime() - new Date(moveIn).getTime()) / 86400000 / 30)} months in ${listing.location}` : `Select your dates`}</h3>{moveIn && moveOut && <p>{moveIn} – {moveOut}</p>}</div>
              </div>
              <div className="detail-cal-controls"><button type="button" onClick={() => setDetailCalMonth(new Date(detailCalMonth.getFullYear(), detailCalMonth.getMonth() - 1, 1))}>‹</button><button type="button" onClick={() => setDetailCalMonth(new Date(detailCalMonth.getFullYear(), detailCalMonth.getMonth() + 1, 1))}>›</button></div>
              <div className="detail-cal-months">
                {[0, 1].map((offset) => { const month = new Date(detailCalMonth.getFullYear(), detailCalMonth.getMonth() + offset, 1); const label = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); const firstDay = month.getDay(); const days = Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - firstDay + 1)); return <div className="detail-cal-month" key={offset}><strong>{label}</strong><div className="detail-cal-weekdays">{['S','M','T','W','T','F','S'].map((d, i) => <span key={i}>{d}</span>)}</div><div className="detail-cal-grid">{days.map((date, i) => { const isCur = date.getMonth() === month.getMonth(); const val = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; const isPast = val < '2026-08-22'; const isStart = val === moveIn; const isEnd = val === moveOut; const inRange = moveIn && moveOut && val > moveIn && val < moveOut; return <button className={`${!isCur ? 'is-outside' : ''} ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''} ${inRange ? 'is-range' : ''}`} disabled={isPast || !isCur} type="button" key={i} onClick={() => { if (!moveIn || (moveIn && moveOut)) { setMoveIn(val); setMoveOut(''); } else if (val > moveIn) { setMoveOut(val); } else { setMoveIn(val); setMoveOut(''); } }}>{date.getDate()}</button>; })}</div></div>; })}
              </div>
              <div className="detail-cal-footer"><button type="button" onClick={() => { setMoveIn(''); setMoveOut(''); }}>Clear dates</button></div>
            </section>

            <section className="detail-amenities">
              <h3>What this home offers</h3>
              <div className="detail-amenities-grid">
                {[['WiFi', <WifiIcon key="wifi" />], ['Kitchen', <HomeIcon key="kitchen" />], ['Free parking', <MapPinIcon key="park" />], ['Workspace', <CalendarIcon key="work" />], ['Washer / Dryer', <StarIcon key="wash" />], ['Air conditioning', <ShieldIcon key="ac" />]].map(([name, icon]) => <div className="detail-amenity" key={String(name)}>{icon}<span>{String(name)}</span></div>)}
              </div>
              <button className="detail-amenities-show" type="button">Show all amenities</button>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="detail-booking">
              <div className="detail-booking-price"><strong>${formatPrice(listing.price)}</strong><span> / month</span></div>
              <div className="detail-booking-fields">
                <div className="detail-booking-row"><div><label>MOVE-IN</label><span>{listing.availableFrom || '—'}</span></div><div><label>LEASE TERM</label><span>{minLease}–{maxLease} mo</span></div></div>
                <div className="detail-booking-row detail-booking-row-full detail-booking-row-occupants"><div><label>OCCUPANTS</label><span className="detail-booking-occupant-count">1 renter</span></div></div>
              </div>
              <p className="detail-booking-note">Free cancellation before move-in</p>
              <button className="detail-booking-cta" type="button" onClick={() => nav(`/apply/${listing.id}`)}>Apply for this home</button>
              <p className="detail-booking-disclaimer">You won't be charged yet</p>
              <div className="detail-booking-breakdown">
                <div><span>${formatPrice(listing.price)} × 1 month</span><span>${formatPrice(listing.price)}</span></div>
                <div><span>Security deposit</span><span>${formatPrice(deposit)}</span></div>
                <div className="detail-booking-total"><span>Total due at move-in</span><span>${formatPrice(listing.price + deposit)}</span></div>
              </div>
            </div>
            <button className="detail-report" type="button">⚑ Report this listing</button>
          </aside>
        </div>

        <div className="detail-full-width">
          <section className="detail-rating-hero">
            <div className="detail-rating-hero-inner">
              <span className="detail-laurel-left">🌿</span>
              <span className="detail-rating-number">{listing.rating || '4.9'}</span>
              <span className="detail-laurel-right">🌿</span>
            </div>
            <strong className="detail-rating-label">Renter favourite</strong>
            <p>This home is in the <strong>top 5%</strong> of eligible listings<br />based on ratings, reviews, and reliability</p>
            <a href="#reviews" className="detail-rating-link">How reviews work</a>
          </section>

          <section className="detail-reviews">
            <h3>★ {listing.rating || '4.9'} · {listing.reviews || 0} reviews</h3>
            <div className="detail-reviews-grid">
              {[{ name: 'Sarah', location: 'Austin, Texas', time: '2 weeks ago', stars: 5, context: 'Stayed 3 months', text: 'Wonderful place! Clean, well-maintained, and the location is perfect. Would absolutely rent here again.' }, { name: 'James', location: 'Portland, Oregon', time: '1 month ago', stars: 5, context: 'Stayed with family', text: 'Great value for the price. The space is exactly as described. Management was responsive and helpful.' }, { name: 'Emily', location: 'Denver, Colorado', time: '3 weeks ago', stars: 5, context: 'Stayed 6 months', text: 'We loved staying here. The neighborhood is quiet and safe, and the home has everything you need.' }, { name: 'Michael', location: 'Chicago, Illinois', time: '1 month ago', stars: 4, context: 'Group lease', text: 'Smooth move-in process and the autopay setup made rent collection effortless. Highly recommend.' }, { name: 'David', location: 'Nashville, Tennessee', time: '2 months ago', stars: 5, context: 'Stayed 1 month', text: 'Everything was seamless from application to move-in. The home is well-kept and the neighbourhood is fantastic.' }, { name: 'Laura', location: 'Seattle, Washington', time: '6 weeks ago', stars: 5, context: 'Stayed with kids', text: 'Excellent value. Spacious layout, modern finishes, and management responds quickly to any question.' }].map((review) => <div className="detail-review" key={review.name}><div className="detail-review-header"><div className="detail-review-avatar">{review.name[0]}</div><div><strong>{review.name}</strong><small>{review.location}</small></div></div><div className="detail-review-meta"><span>{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span> · <span>{review.time}</span> · <span>{review.context}</span></div><p>{review.text}</p></div>)}
            </div>
            <button className="detail-reviews-show" type="button">Show all {listing.reviews || 0} reviews</button>
          </section>

          <section className="detail-location">
            <h3>Where you'll be</h3>
            <p>{listing.location}</p>
            <div className="detail-location-map"><div className="detail-location-map-inner" /><span className="detail-location-pin" /></div>
          </section>

          <section className="detail-host-card">
            <h3>Meet your host</h3>
            <div className="detail-host-card-layout">
              <div className="detail-host-card-profile"><div className="detail-host-card-avatar">A</div><strong>Arcora Property Management</strong><small>Professional host</small><div className="detail-host-card-stats"><span>★ 4.95</span><span>134 Reviews</span><span>3 Years hosting</span></div></div>
              <div className="detail-host-card-info"><p>Arcora hosts are experienced property managers committed to providing quality monthly rentals with transparent pricing and responsive support.</p><button className="detail-host-message" type="button">Message host</button></div>
            </div>
          </section>

          <section className="detail-know">
            <h3>Things to know</h3>
            <div className="detail-know-grid">
              <div><strong>Lease policies</strong><p>Minimum {minLease} month lease</p><p>Security deposit: ${formatPrice(deposit)}</p><p>Background check required</p></div>
              <div><strong>House rules</strong><p>No smoking</p><p>No parties or events</p><p>Quiet hours: 10pm–8am</p></div>
              <div><strong>Safety & property</strong><p>Smoke alarm</p><p>Carbon monoxide alarm</p><p>Security deposit protected</p></div>
            </div>
          </section>
        </div>
      </div>
      <MarketplaceFooter />
    </main>
  );
}
