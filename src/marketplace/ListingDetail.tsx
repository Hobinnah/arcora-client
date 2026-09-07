import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CalendarIcon, HomeIcon, MapPinIcon, ShieldIcon, StarIcon, WifiIcon } from '../components/Icons';
import { getListing } from '../apis/useListing';
import { fetchListings } from '../apis/useListing';
import { fetchAmenityCatalogs, getAmenityCatalog } from '../apis/useAmenityCatalog';
import { fetchRatings } from '../apis/useRating';
import { fallbackListings, type MarketplaceListing } from './marketplaceData';
import type { Rating } from '../types/Rating';
import { useAuth } from '../hooks/useAuth';
import MarketplaceHeader from './MarketplaceHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './MarketplaceHome.css';
import './ListingDetail.css';

type ListingWithReviews = {
  reviewList?: Rating[];
  organization?: Record<string, any>;
  listingRules?: Record<string, any>[];
  listingPolicies?: Record<string, any>[];
  safetyProperty?: Record<string, any> | Record<string, any>[];
  safetyAndProperty?: Record<string, any> | Record<string, any>[];
};

const blockedCalendarStatuses = new Set(['BOOKED', 'CONFIRMED', 'HELD', 'ACTIVE']);
const calendarDateKey = (value: string) => value.split('T')[0];

const formatPrice = (p: number) => new Intl.NumberFormat('en-US').format(p);
const formatListingDate = (value?: string) => {
  if (!value) return '—';
  const [year, month, day] = value.split('T')[0].split('-').map(Number);
  if (!year || !month || !day) return value.split('T')[0];
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(year, month - 1, day));
};
const formatRelativeDate = (value?: string) => {
  if (!value) return 'Recent';
  const elapsedDays = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000));
  if (elapsedDays < 7) return `${Math.max(1, elapsedDays)} ${elapsedDays === 1 ? 'day' : 'days'} ago`;
  if (elapsedDays < 31) return `${Math.floor(elapsedDays / 7)} ${Math.floor(elapsedDays / 7) === 1 ? 'week' : 'weeks'} ago`;
  if (elapsedDays < 365) return `${Math.floor(elapsedDays / 30)} ${Math.floor(elapsedDays / 30) === 1 ? 'month' : 'months'} ago`;
  return `${Math.floor(elapsedDays / 365)} ${Math.floor(elapsedDays / 365) === 1 ? 'year' : 'years'} ago`;
};
const getFullMonthsBetween = (startValue: string, endValue: string) => {
  const start = new Date(`${startValue}T00:00:00`);
  const end = new Date(`${endValue}T00:00:00`);
  let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months -= 1;
  return months;
};
const addMonthsToDate = (dateString: string, months: number): string => {
  if (!dateString) return '';
  const parts = dateString.split('T')[0].split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return '';
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() + months);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const getCalendarMonth = (value?: string) => {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : new Date(date.getFullYear(), date.getMonth(), 1);
};

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [raw, setRaw] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [organizationListings, setOrganizationListings] = useState<Array<{ rating?: number; reviews?: number }>>([]);
  const [amenityCatalogNames, setAmenityCatalogNames] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [detailCalMonth, setDetailCalMonth] = useState(() => getCalendarMonth(searchParams.get('moveIn') ?? undefined));
  const [moveIn, setMoveIn] = useState(searchParams.get('moveIn') ?? '');
  const [moveOut, setMoveOut] = useState('');
  const [todayKey] = useState(() => new Date().toISOString().slice(0, 10));
  const [applicationDateError, setApplicationDateError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const applyDetail = (detail: Record<string, any>) => {
        setRaw(detail);
        const fb = fallbackListings.find((l) => l.id === id) ?? fallbackListings[0];
        const listingAddress = detail.rentalUnit?.property?.address;
        const listingLocation = [listingAddress?.city, listingAddress?.provinceCode].filter(Boolean).join(', ') || fb.location;
        const apiPhotos = Array.isArray(detail.listingPhotos) ? [...detail.listingPhotos].sort((first, second) => Number(first.displayOrder ?? 0) - Number(second.displayOrder ?? 0)) : [];
        const apiDetails = [
          detail.bedrooms ? `${detail.bedrooms} bed${detail.bedrooms === 1 ? '' : 's'}` : '',
          detail.bathrooms ? `${detail.bathrooms} bath${detail.bathrooms === 1 ? '' : 's'}` : '',
          detail.isFurnished ? 'Furnished' : '',
        ].filter(Boolean).join(' · ');
        setListing({
          id: String(detail.listingID ?? id),
          title: detail.title ?? fb.title,
          location: listingLocation,
          price: detail.baseMonthlyRentAmount ?? fb.price,
          type: detail.listingType?.name ?? fb.type,
          isPetFriendly: detail.isPetFriendly === true,
          isFurnished: detail.isFurnished === true || detail.IsFurnished === true,
          image: apiPhotos[0]?.url ?? apiPhotos[0]?.imageUrl ?? apiPhotos[0]?.image ?? '',
          details: apiDetails,
          rating: Number(detail.rating ?? 0),
          reviews: Number(detail.reviews ?? 0),
          availableFrom: detail.availableFrom ?? fb.availableFrom,
          tag: typeof detail.displayTag === 'string' ? detail.displayTag : undefined,
        });
      };
      try {
        if (id) {
          const data = await getListing(id);
          if (!cancelled && data) {
            const detail = (data as any).data ?? data;
            applyDetail(detail);
          }
        }
      } catch {
        let recoveredLiveListing = false;
        try {
          if (id) {
            const response = await fetchListings({ pageSize: 1000, pageNumber: 0, statusFilter: 'PUBLISHED' });
            const liveDetail = response.data.find((item) => String(item.listingID).toLowerCase() === id.toLowerCase());
            if (!cancelled && liveDetail) {
              applyDetail(liveDetail as unknown as Record<string, any>);
              recoveredLiveListing = true;
            }
          }
        } catch {
        }
        if (!cancelled && !recoveredLiveListing) {
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
    const organizationID = (raw as ListingWithReviews | null)?.organization?.organizationID;
    if (!organizationID) return;
    let cancelled = false;
    fetchListings({ pageSize: 1000, pageNumber: 0, organizationID, statusFilter: 'PUBLISHED' }).then((response) => {
      if (!cancelled) setOrganizationListings(response.data.map((item) => ({ rating: item.rating, reviews: item.reviews })));
    }).catch(() => {
      if (!cancelled) setOrganizationListings([]);
    });
    return () => { cancelled = true; };
  }, [raw]);

  useEffect(() => {
    const listingAmenities = (raw as any)?.listingAmenities;
    if (!Array.isArray(listingAmenities)) return;
    let cancelled = false;
    const loadAmenityNames = async () => {
      const catalogResponse = await fetchAmenityCatalogs({ pageSize: 1000, pageNumber: 0 });
      const catalogNames = Object.fromEntries(catalogResponse.data.map((catalog) => [catalog.amenityID, catalog.name]));
      const entries = await Promise.all(listingAmenities.map(async (item: Record<string, any>) => {
        if (item.amenityAmenityCatalog?.name) return [item.amenityID, item.amenityAmenityCatalog.name] as const;
        if (catalogNames[item.amenityID]) return [item.amenityID, catalogNames[item.amenityID]] as const;
        try {
          const catalog = await getAmenityCatalog(item.amenityID);
          return [item.amenityID, catalog.name] as const;
        } catch {
          return [item.amenityID, item.notes || ''] as const;
        }
      }));
      if (!cancelled) setAmenityCatalogNames(Object.fromEntries(entries));
    };
    loadAmenityNames();
    return () => { cancelled = true; };
  }, [raw]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const loadReviews = async () => {
      try {
        const listingData = await getListing(id);
        const reviewList = (listingData as ListingWithReviews).reviewList;
        if (Array.isArray(reviewList)) {
          if (!cancelled) setReviews(reviewList.filter((review) => review.isPublic !== false && Boolean(review.reviewBody?.trim())));
          return;
        }
        const response = await fetchRatings({ pageSize: 1000, pageNumber: 0 });
        if (!cancelled) setReviews(response.data.filter((review) => String(review.subjectReferenceID ?? '').toLowerCase() === id.toLowerCase() && review.isPublic !== false && Boolean(review.reviewBody?.trim())));
      } catch {
        if (!cancelled) setReviews([]);
      }
    };
    loadReviews();
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

  const bedrooms = (raw as any)?.bedrooms ?? 0;
  const bathrooms = (raw as any)?.bathrooms ?? 0;
  const sqft = (raw as any)?.squareFeet ?? 0;
  const minLease = (raw as any)?.minimumLeaseMonths ?? 0;
  const maxLease = (raw as any)?.maximumLeaseMonths ?? 0;
  const selectedStayLength = Number(searchParams.get('stayLengthMonths') ?? 0);
  const stayLengthMonths = selectedStayLength > 0 ? selectedStayLength : 1;
  const deposit = (raw as any)?.securityDepositAmount ?? 0;
  const description = (raw as any)?.description || 'No listing description available.';
  const photos = Array.isArray((raw as any)?.listingPhotos)
    ? [...(raw as any).listingPhotos].sort((first, second) => Number(first.displayOrder ?? 0) - Number(second.displayOrder ?? 0)).map((photo) => photo.url ?? photo.imageUrl ?? photo.image).filter(Boolean).slice(0, 5)
    : [];
  const gallerySource = photos.length > 0 ? photos : (listing.image ? [listing.image] : []);
  const galleryPhotos = gallerySource.length > 0 ? Array.from({ length: 5 }, (_, index) => gallerySource[index % gallerySource.length]) : [];
  const bedroomPhoto = [...((raw as any)?.listingPhotos ?? [])]
    .filter((photo: Record<string, any>) => String(photo.location ?? '').trim().toLowerCase() === 'bedroom')
    .sort((first: Record<string, any>, second: Record<string, any>) => Number(first.displayOrder ?? 0) - Number(second.displayOrder ?? 0))[0];
  const bedroomImage = bedroomPhoto?.url || bedroomPhoto?.imageUrl || bedroomPhoto?.image || galleryPhotos[0] || '';
  const amenityItems = ((raw as any)?.listingAmenities ?? [])
    .map((item: Record<string, any>) => String(item.amenityCatalog?.name ?? item.amenityAmenityCatalog?.name ?? item.name ?? amenityCatalogNames[item.amenityID] ?? item.notes ?? `Amenity ${item.amenityID}`).trim())
    .filter((name: string, index: number, names: string[]) => name && !name.startsWith('Amenity ') && names.indexOf(name) === index);
  const amenityNames = amenityItems;
  const organization = (raw as ListingWithReviews | null)?.organization ?? {};
  const organizationListingsWithCurrent = organizationListings.length > 0 ? organizationListings : [{ reviews: listing.reviews }];
  const hostRating = Number(organization.rankingScore ?? 0);
  const hostReviewCount = organizationListingsWithCurrent.reduce((sum, item) => sum + Number(item.reviews ?? 0), 0);
  const hostingYears = Math.max(0, Math.floor((Date.now() - new Date(String(organization.capturedDate ?? '')).getTime()) / (365.25 * 86400000)));
  const rules = ((raw as ListingWithReviews | null)?.listingRules ?? []).slice(0, 3);
  const policies = (raw as ListingWithReviews | null)?.listingPolicies ?? [];
  const policyLines = policies.flatMap((policy) => [
    policy.minimumCreditScore ? `Minimum credit score: ${policy.minimumCreditScore}` : '',
    policy.allowsPets === true ? 'Pets allowed' : policy.allowsPets === false ? 'No pets' : '',
    policy.allowsSmoking === true ? 'Smoking allowed' : policy.allowsSmoking === false ? 'No smoking' : '',
    policy.allowsChildren === false ? 'No children' : '',
    policy.parkingIncluded === true ? 'Parking included' : '',
    policy.utilitiesIncluded === true ? 'Utilities included' : '',
    policy.requiresBackgroundCheck === true ? 'Background check required' : '',
    policy.applicationInstructions ?? '',
  ].filter(Boolean)).slice(0, 3);
  const safetySource = (raw as ListingWithReviews | null)?.safetyProperty ?? (raw as ListingWithReviews | null)?.safetyAndProperty;
  const safetyItems = (Array.isArray(safetySource) ? safetySource : safetySource ? [safetySource] : []).flatMap((item) => Object.entries(item).filter(([key, value]) => !['id', 'listingID', 'propertyID', 'capturedDate', 'capturedBy', 'updatedDate', 'updatedBy'].includes(key) && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase())}: ${value ? 'Yes' : 'No'}`)).slice(0, 3);
  const maximumOccupants = (raw as any)?.rentalUnit?.maximumOccupants ?? (raw as any)?.listingPolicies?.[0]?.maximumOccupants ?? 0;
  const listingCoordinates = (raw as any)?.rentalUnit?.property?.address;
  const mapLatitude = Number(listingCoordinates?.latitude);
  const mapLongitude = Number(listingCoordinates?.longitude);
  const mapUrl = Number.isFinite(mapLatitude) && Number.isFinite(mapLongitude)
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapLongitude - 0.03}%2C${mapLatitude - 0.02}%2C${mapLongitude + 0.03}%2C${mapLatitude + 0.02}&layer=mapnik&marker=${mapLatitude}%2C${mapLongitude}`
    : '';
  const calendarEvents = Array.isArray((raw as any)?.calendarEvents) ? (raw as any).calendarEvents : [];
  const isBookedDate = (dateValue: string) => calendarEvents.some((event: Record<string, any>) => {
    const status = String(event.status ?? '').toUpperCase();
    const blocksAvailability = event.blocksAvailability === true || blockedCalendarStatuses.has(status);
    if (!blocksAvailability || !event.startAt || !event.endAt) return false;
    const startDate = calendarDateKey(String(event.startAt));
    const endDate = calendarDateKey(String(event.endAt));
    return startDate === endDate ? dateValue === startDate : dateValue >= startDate && dateValue < endDate;
  });
  const renderReview = (review: Rating) => {
    const reviewParts = String(review.reviewBody ?? '').split(' · ');
    const reviewerName = review.reviewerFirstName || review.reviewerUser?.firstName || reviewParts[0] || 'Arcora renter';
    const bodyDetails = reviewParts.slice(2).join(' · ');
    const bodySeparator = bodyDetails.indexOf('. ');
    const reviewText = bodySeparator > 0 ? bodyDetails.slice(bodySeparator + 2) : bodyDetails || String(review.reviewBody ?? '');
    const stayContext = bodySeparator > 0 ? bodyDetails.slice(0, bodySeparator) : '';
    const categoryRatings = [review.paymentRating, review.communicationRating, review.propertyCareRating, review.responsivenessRating, review.accuracyRating, review.cleanlinessRating].filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    const averageRating = categoryRatings.length > 0 ? categoryRatings.reduce((sum, value) => sum + value, 0) / categoryRatings.length : review.overallRating;
    const stars = Math.max(0, Math.min(5, Math.round(averageRating ?? 0)));
    return <div className="detail-review" key={review.ratingID}><div className="detail-review-header"><div className="detail-review-avatar">{reviewerName.charAt(0).toUpperCase()}</div><div><strong>{reviewerName}</strong><small>{listing.location}</small></div></div><div className="detail-review-meta"><span>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span> · <span>{formatRelativeDate(review.capturedDate)}</span>{stayContext && <> · <span>{stayContext}</span></>}</div><p>{reviewText}</p></div>;
  };
  const goBack = () => window.history.length > 1 ? nav(-1) : nav('/');
  const effectiveMoveIn = moveIn || listing?.availableFrom || todayKey;
  const effectiveMoveOut = moveOut || (effectiveMoveIn ? addMonthsToDate(effectiveMoveIn, stayLengthMonths) : '');
  const applyForHome = () => {
    const finalMoveIn = effectiveMoveIn;
    const finalMoveOut = effectiveMoveOut;
    if (!finalMoveIn || !finalMoveOut) {
      setApplicationDateError('Please select a move-in and a move-out date from the calendar.');
      return;
    }
    const selectedMonths = getFullMonthsBetween(finalMoveIn, finalMoveOut);
    if (selectedMonths < minLease) {
      setApplicationDateError(`Please select a lease of at least ${minLease} month${minLease === 1 ? '' : 's'}.`);
      return;
    }
    setApplicationDateError('');
    const renters = searchParams.get('renters') ?? '1';
    const applicationParams = new URLSearchParams({
      moveIn: finalMoveIn,
      stayLengthMonths: String(stayLengthMonths),
      renters,
    });
    nav(`/applications/${listing.id}?${applicationParams.toString()}`);
  };
  const messageHost = () => {
    const chatUrl = `/hosting/messages?listingID=${encodeURIComponent(listing.id)}`;
    nav(auth?.isAuthenticated ? chatUrl : `/login?redirect_url=${encodeURIComponent(chatUrl)}`);
  };

  return (
    <main className="marketplace listing-detail">
      <MarketplaceHeader />

      <div className="detail-container">
        <header className="detail-header">
          <div className="detail-header-start">
            <button type="button" className="detail-back" onClick={goBack}>← Back</button>
            <h1>{listing.title}</h1>
          </div>
          <div className="detail-header-actions">
            <button type="button" className="detail-action">↗ Share</button>
            <button type="button" className={`detail-action ${saved ? 'is-saved' : ''}`} onClick={() => setSaved(!saved)}>{saved ? '♥' : '♡'} Save</button>
          </div>
        </header>

        <section className="detail-gallery" onClick={() => nav(`/homes/${id}/photos`, { state: { title: listing.title, photos: galleryPhotos } })}>
          <div className="detail-gallery-main">{galleryPhotos[0] && <img src={galleryPhotos[0]} alt={listing.title} />}</div>
          <div className="detail-gallery-grid">
            {galleryPhotos.slice(1, 5).map((src, i) => <div key={i} className="detail-gallery-thumb"><img src={src} alt={`${listing.title} photo ${i + 2}`} /></div>)}
            <button className="detail-gallery-show" type="button" onClick={(e) => { e.stopPropagation(); nav(`/homes/${id}/photos`, { state: { title: listing.title, photos: galleryPhotos } }); }}>⊞ Show all photos</button>
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
              <div className="detail-host-avatar">{organization.brandLogoUrl ? <img src={organization.brandLogoUrl} alt="" /> : String(organization.displayName ?? organization.legalName ?? 'Host').charAt(0).toUpperCase()}</div>
              <div><strong>Managed by {organization.displayName ?? organization.legalName ?? 'Host'}</strong><p>{organization.isPersonal ? 'Personal host' : 'Professional host'} · Responsive support</p></div>
            </section>

            <section className="detail-highlights">
              <div className="detail-highlight"><ShieldIcon /><div><strong>Verified listing</strong><p>This home has been verified by Arcora for accuracy and management quality.</p></div></div>
              <div className="detail-highlight"><MapPinIcon /><div><strong>Great location</strong><p>Located in {listing.location}.</p></div></div>
              <div className="detail-highlight"><CalendarIcon /><div><strong>Flexible lease</strong><p>{minLease === maxLease ? `${minLease} month term` : `${minLease}–${maxLease} month terms`} available.</p></div></div>
            </section>

            <section className="detail-description">
              <p className={showMore ? '' : 'is-clamped'}>{description}</p>
              <button className="detail-show-more" type="button" onClick={() => setShowMore(!showMore)}>{showMore ? 'Show less' : 'Show more'} ›</button>
            </section>

            <section className="detail-sleep">
              <h3>Where you'll sleep</h3>
              <div className="detail-sleep-grid">
                {Array.from({ length: bedrooms }, (_, i) => <div className="detail-sleep-card" key={i}><img src={bedroomImage} alt={bedroomPhoto?.altText || `Bedroom ${i + 1}`} /><strong>Bedroom {i + 1}</strong><small>{i === 0 ? '1 king bed' : '1 queen bed'}</small></div>)}
              </div>
            </section>

            <section className="detail-availability">
              <div className="detail-availability-header">
                <div><h3>{effectiveMoveIn && effectiveMoveOut ? `${getFullMonthsBetween(effectiveMoveIn, effectiveMoveOut)} months in ${listing.location}` : `Select your dates`}</h3>{effectiveMoveIn && effectiveMoveOut && <p>{formatListingDate(effectiveMoveIn)} – {formatListingDate(effectiveMoveOut)}</p>}</div>
              </div>
              <div className="detail-cal-controls"><button type="button" onClick={() => setDetailCalMonth(new Date(detailCalMonth.getFullYear(), detailCalMonth.getMonth() - 1, 1))}>‹</button><button type="button" onClick={() => setDetailCalMonth(new Date(detailCalMonth.getFullYear(), detailCalMonth.getMonth() + 1, 1))}>›</button></div>
              <div className="detail-cal-months">
                {[0, 1].map((offset) => { const month = new Date(detailCalMonth.getFullYear(), detailCalMonth.getMonth() + offset, 1); const label = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); const firstDay = month.getDay(); const days = Array.from({ length: 42 }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i - firstDay + 1)); return <div className="detail-cal-month" key={offset}><strong>{label}</strong><div className="detail-cal-weekdays">{['S','M','T','W','T','F','S'].map((d, i) => <span key={i}>{d}</span>)}</div><div className="detail-cal-grid">{days.map((date, i) => { const isCur = date.getMonth() === month.getMonth(); const val = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; const isPast = val < todayKey; const isBooked = isBookedDate(val); const isStart = val === effectiveMoveIn; const isEnd = val === effectiveMoveOut; const inRange = effectiveMoveIn && effectiveMoveOut && val > effectiveMoveIn && val < effectiveMoveOut; return <button className={`${!isCur ? 'is-outside' : ''} ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''} ${inRange ? 'is-range' : ''} ${isBooked ? 'is-booked' : ''}`} disabled={isPast || isBooked || !isCur} type="button" key={i} aria-label={isBooked ? `${val}, booked` : val} onClick={() => { if (!moveIn || (moveIn && moveOut)) { setMoveIn(val); setMoveOut(''); } else if (val > moveIn) { setMoveOut(val); } else { setMoveIn(val); setMoveOut(''); } }}>{date.getDate()}</button>; })}</div></div>; })}
              </div>
              <div className="detail-cal-footer"><button type="button" onClick={() => { setMoveIn(''); setMoveOut(''); }}>Clear dates</button></div>
            </section>

            <section className="detail-amenities">
              <h3>What this home offers</h3>
              <div className="detail-amenities-grid">
                {amenityNames.slice(0, 6).map((name: string, index: number) => <div className="detail-amenity" key={name}>{[<WifiIcon key="wifi" />, <HomeIcon key="kitchen" />, <MapPinIcon key="park" />, <CalendarIcon key="work" />, <StarIcon key="wash" />, <ShieldIcon key="ac" />][index % 6]}<span>{name}</span></div>)}
              </div>
              <button className="detail-amenities-show" type="button" onClick={() => setAmenitiesOpen(true)}>Show all amenities</button>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="detail-booking">
              <div className="detail-booking-price"><strong>${formatPrice(listing.price)}</strong><span> / month</span></div>
              <div className="detail-booking-fields">
                <div className="detail-booking-row"><div><label>MOVE-IN</label><span>{formatListingDate(moveIn || listing.availableFrom)}</span></div><div><label>STAY LENGTH</label><span>{stayLengthMonths} Month{stayLengthMonths === 1 ? '' : 's'}</span></div></div>
                <div className="detail-booking-row detail-booking-row-full detail-booking-row-occupants"><div><label>Maximum Occupants</label><span className="detail-booking-occupant-count">{maximumOccupants || '—'} {maximumOccupants === 1 ? 'Occupant' : 'Occupants'}</span></div></div>
              </div>
              <p className="detail-booking-note">Free cancellation before 1 day to move-in</p>
              <button className="detail-booking-cta" type="button" onClick={applyForHome}>Apply for this home</button>
              {applicationDateError && <p className="detail-booking-date-error" role="alert">{applicationDateError}</p>}
              <p className="detail-booking-disclaimer">You won't be charged yet</p>
              <div className="detail-booking-breakdown">
                <div><span>${formatPrice(listing.price)} monthly</span><span>${formatPrice(listing.price)}</span></div>
                <div><span>Security deposit</span><span>${formatPrice(deposit)}</span></div>
                <div className="detail-booking-total"><span>Total due before move-in</span><span>${formatPrice(listing.price + deposit)}</span></div>
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
              {reviews.slice(0, 6).map(renderReview)}
            </div>
            <button className="detail-reviews-show" type="button" onClick={() => setReviewsOpen(true)}>Show all {listing.reviews || reviews.length} reviews</button>
          </section>

          <section className="detail-location">
            <h3>Where you'll be</h3>
            <p>{listing.location}</p>
            <div className="detail-location-map">{mapUrl ? <iframe title={`Map of ${listing.location}`} src={mapUrl} loading="lazy" /> : <p className="detail-location-unavailable">Location coordinates are not available.</p>}</div>
          </section>

          <section className="detail-host-card">
            <h3>Meet your host</h3>
            <div className="detail-host-card-layout">
              <div className="detail-host-card-profile"><div className="detail-host-card-avatar">{organization.brandLogoUrl ? <img src={organization.brandLogoUrl} alt="" /> : String(organization.displayName ?? organization.legalName ?? 'Host').charAt(0).toUpperCase()}</div><strong>{organization.displayName ?? organization.legalName ?? 'Host'}</strong><small>{organization.isPersonal ? 'Personal host' : 'Professional host'}</small><div className="detail-host-card-stats"><span>★ {hostRating ? hostRating.toFixed(2) : '—'}</span><span>{hostReviewCount} Reviews</span><span>{hostingYears} Years hosting</span></div></div>
              <div className="detail-host-card-info"><p>{organization.description || 'No host description available.'}</p><button className="detail-host-message" type="button" onClick={messageHost}>Message host</button></div>
            </div>
          </section>

          <section className="detail-know">
            <h3>Things to know</h3>
            <div className="detail-know-grid">
              <div><strong>Lease policies</strong>{policyLines.map((line) => <p key={line}>{line}</p>)}{policyLines.length === 0 && <p>No lease policies available.</p>}</div>
              <div><strong>House rules</strong>{rules.map((rule) => rule.ruleDescription || rule.ruleTitle).filter(Boolean).map((line) => <p key={line}>{line}</p>)}{rules.length === 0 && <p>No house rules available.</p>}</div>
              <div><strong>Safety &amp; property</strong>{safetyItems.map((line) => <p key={line}>{line}</p>)}{safetyItems.length === 0 && <p>No safety information available.</p>}</div>
            </div>
          </section>
        </div>
      </div>
      {amenitiesOpen && <div className="detail-amenities-modal-backdrop" role="presentation" onClick={() => setAmenitiesOpen(false)}>
        <section className="detail-amenities-modal" role="dialog" aria-modal="true" aria-labelledby="amenities-modal-title" onClick={(event) => event.stopPropagation()}>
          <header className="detail-amenities-modal-header"><div><span className="detail-modal-kicker">Included with this home</span><h2 id="amenities-modal-title">What this home offers</h2></div><button type="button" className="detail-amenities-modal-close" aria-label="Close amenities" onClick={() => setAmenitiesOpen(false)}>×</button></header>
          <div className="detail-amenities-modal-grid">{amenityNames.map((name: string) => <div className="detail-amenities-modal-item" key={name}><span aria-hidden="true">✓</span><span>{name}</span></div>)}</div>
        </section>
      </div>}
      {reviewsOpen && <div className="detail-reviews-modal-backdrop" role="presentation" onClick={() => setReviewsOpen(false)}>
        <section className="detail-reviews-modal" role="dialog" aria-modal="true" aria-labelledby="reviews-modal-title" onClick={(event) => event.stopPropagation()}>
          <header className="detail-amenities-modal-header"><div><span className="detail-modal-kicker">Guest experiences</span><h2 id="reviews-modal-title">All reviews</h2></div><button type="button" className="detail-amenities-modal-close" aria-label="Close reviews" onClick={() => setReviewsOpen(false)}>×</button></header>
          <div className="detail-reviews-modal-grid">{reviews.length > 0 ? reviews.map(renderReview) : <p className="detail-reviews-empty">No published reviews are available for this home yet.</p>}</div>
        </section>
      </div>}
      <MarketplaceFooter />
    </main>
  );
}
