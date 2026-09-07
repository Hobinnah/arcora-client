import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, UsersIcon } from '../components/Icons';
import { fetchListings } from '../apis/useListing';
import { fetchUnitTypes } from '../apis/useUnitType';
import { fallbackListings, normalizeListing, type MarketplaceListing } from './marketplaceData';
import type { UnitType } from '../types/UnitType';
import CustomSelect from '../components/CustomSelect';
import { useAuth } from '../hooks/useAuth';
import { useVerificationCenter } from '../apis/useVerificationCenter';
import MarketplaceHeader from './MarketplaceHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './MarketplaceHome.css';

const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

export default function MarketplaceHome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const hasSubmittedVerification = localStorage.getItem(`arcora:verification-submitted:${userID || "session"}`) === "true";
  const verification = useVerificationCenter(userID);
  useEffect(() => {
    if (!userID || verification.loading || verification.identityVerified || hasSubmittedVerification) return;
    navigate('/verify-identity', { replace: true });
  }, [userID, verification.loading, verification.identityVerified, hasSubmittedVerification, navigate]);
  const [listings, setListings] = useState<MarketplaceListing[]>(fallbackListings);
  const [query, setQuery] = useState('');
  const [occupantsOpen, setOccupantsOpen] = useState(false);
  const [occupants, setOccupants] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [moveInDate, setMoveInDate] = useState('');
  const [monthCount, setMonthCount] = useState('1 month');
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All homes');
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const occupantsRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadListings = async () => {
      try {
        const response = await fetchListings({ pageSize, pageNumber: currentPage - 1, statusFilter: 'PUBLISHED' });
        const liveListings = Array.isArray(response?.data)
          ? response.data
            .filter((listing) => listing.status === 'PUBLISHED')
            .map((listing, index) => normalizeListing(listing as unknown as Record<string, any>, index))
            .filter((listing): listing is MarketplaceListing => listing !== null)
          : [];
        if (!cancelled && liveListings.length > 0) {
          setListings(liveListings);
          setTotalCount(response.totalCount ?? 0);
        }
      } catch (error) {
        console.warn('Marketplace listings unavailable; using static fallback data.', error);
      }
    };
    const loadUnitTypes = async () => {
      try {
        const response = await fetchUnitTypes({ pageSize: 1000, pageNumber: 0 });
        if (!cancelled && Array.isArray(response?.data)) setUnitTypes(response.data);
      } catch (error) {
        console.warn('Marketplace unit types unavailable.', error);
      }
    };
    loadListings();
    loadUnitTypes();
    return () => { cancelled = true; };
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [activeCategory, moveInDate, query, selectedFilters, occupants.pets]);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (occupantsRef.current && !occupantsRef.current.contains(event.target as Node)) setOccupantsOpen(false);
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setDateOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOccupantsOpen(false);
      if (event.key === 'Escape') setDateOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const visibleListings = listings.filter((listing) => {
    const searchText = `${listing.title} ${listing.location} ${listing.type}`.toLowerCase();
    const matchesSearch = searchText.includes(query.toLowerCase());
    const selectedUnitType = unitTypes.find((unitType) => unitType.name === activeCategory);
    const matchesCategory = activeCategory === 'All homes' || listing.unitTypeID === selectedUnitType?.unitTypeID;
    const matchesFilters =
      (!selectedFilters.includes('Under $2,000') || listing.price < 2000) &&
      (!selectedFilters.includes('Pet friendly') || listing.isPetFriendly) &&
      (!selectedFilters.includes('Furnished') || listing.isFurnished);
    const matchesDate = !moveInDate || listing.availableFrom <= moveInDate;
    const matchesPets = occupants.pets === 0 || listing.isPetFriendly;
    return matchesSearch && matchesCategory && matchesFilters && matchesDate && matchesPets;
  });

  const toggleFilter = (filter: string) => {
    setSelectedFilters((current) => current.includes(filter)
      ? current.filter((item) => item !== filter)
      : [...current, filter]);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]);
  };

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const visiblePages = Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 5);
  const goToPage = (page: number) => setCurrentPage(Math.min(pageCount, Math.max(1, page)));

  const openListing = (listingID: string) => navigate(`/homes/${listingID}`);

  const updateOccupants = (type: keyof typeof occupants, delta: number) => {
    setOccupants((current) => ({ ...current, [type]: Math.max(type === 'adults' ? 1 : 0, current[type] + delta) }));
  };

  const occupantSummary = `${occupants.adults} ${occupants.adults === 1 ? 'renter' : 'renters'}${occupants.children ? `, ${occupants.children} ${occupants.children === 1 ? 'child' : 'children'}` : ''}${occupants.infants ? `, ${occupants.infants} ${occupants.infants === 1 ? 'infant' : 'infants'}` : ''}${occupants.pets ? `, ${occupants.pets} ${occupants.pets === 1 ? 'pet' : 'pets'}` : ''}`;

  const calendarDays = Array.from({ length: 42 }, (_, dayIndex) => {
    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
    return new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayIndex - firstDay + 1);
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCurrentMonth = calendarMonth.getFullYear() === today.getFullYear() && calendarMonth.getMonth() === today.getMonth();
  const selectedDate = moveInDate ? new Date(`${moveInDate}T00:00:00`) : null;
  const calendarMonthLabel = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectDate = (date: Date) => {
    if (date < today) return;
    const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setMoveInDate(dateValue);
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setDateOpen(false);
  };

  const monthOptions = Array.from({ length: 12 }, (_, index) => `${index + 1} month${index === 0 ? '' : 's'}`);

  return (
    <main className="marketplace">
      <MarketplaceHeader activeLink="find" />

      <section className="marketplace-hero">
        <div className="marketplace-hero-copy">
          <p className="marketplace-eyebrow">A better way to settle in</p>
          <h1>Find a place that feels like <em>home.</em></h1>
          <p className="marketplace-hero-text">Flexible monthly rentals, thoughtfully managed and ready for your next chapter.</p>
          <div className="marketplace-hero-proof"><span>4.9/5 average stay rating</span><span>1,200+ homes managed</span></div>
        </div>
        <div className="marketplace-hero-visual" aria-hidden="true">
          <div className="marketplace-hero-image marketplace-hero-image-main"><img src={listings[2].image} alt="" /></div>
          <div className="marketplace-hero-image marketplace-hero-image-small"><img src={listings[1].image} alt="" /></div>
          <div className="marketplace-hero-status"><span className="marketplace-status-dot" /> Available monthly</div>
        </div>
        <div className="marketplace-search" role="search">
          <label className="marketplace-search-field">
            <span>Where</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="City, neighborhood, or address" />
          </label>
          <div className={`marketplace-search-field marketplace-date-field ${dateOpen ? 'is-open' : ''}`} ref={datePickerRef}>
            <span>Move-in date</span>
            <button className="marketplace-date-trigger" type="button" aria-haspopup="dialog" aria-expanded={dateOpen} onClick={() => setDateOpen((open) => !open)}><span>{moveInDate || 'yyyy-mm-dd'}</span><CalendarIcon /></button>
            {dateOpen && <div className="marketplace-calendar-popover" role="dialog" aria-label="Choose move-in date">
              <div className="marketplace-calendar-header"><button type="button" aria-label="Previous month" disabled={isCurrentMonth} onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>‹</button><strong>{calendarMonthLabel}</strong><button type="button" aria-label="Next month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>›</button></div>
              <div className="marketplace-calendar-weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}</div>
              <div className="marketplace-calendar-grid">{calendarDays.map((date) => { const isDateInCurrentMonth = date.getMonth() === calendarMonth.getMonth(); const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; const isSelected = selectedDate?.toDateString() === date.toDateString(); const isPast = date < today; return <button className={`${isDateInCurrentMonth ? '' : 'is-muted'} ${isSelected ? 'is-selected' : ''}`} disabled={isPast} type="button" key={dateValue} onClick={() => selectDate(date)}>{date.getDate()}</button>; })}</div>
              <div className="marketplace-calendar-actions"><button type="button" onClick={() => { setMoveInDate(''); setDateOpen(false); }}>Clear</button><button type="button" onClick={() => selectDate(new Date())}>Today</button></div>
            </div>}
          </div>
          <div className="marketplace-search-field marketplace-month-count-field">
            <span>Stay length</span>
            <CustomSelect value={monthCount} options={monthOptions} onChange={setMonthCount} ariaLabel="Choose stay length" />
          </div>
          <div className={`marketplace-search-field marketplace-occupants-field ${occupantsOpen ? 'is-open' : ''}`} ref={occupantsRef}>
            <span>Who's moving in?</span>
            <button className="marketplace-occupants-trigger" type="button" aria-haspopup="dialog" aria-expanded={occupantsOpen} onClick={() => setOccupantsOpen((open) => !open)}><UsersIcon /><span>{occupantSummary}</span></button>
            {occupantsOpen && <div className="marketplace-occupants-popover" role="dialog" aria-label="Choose who is moving in">
              <div className="marketplace-occupants-header"><div><strong>Who's moving in?</strong><small>Tell us who will live in the home.</small></div><UsersIcon /></div>
              {([
                ['adults', 'Adults', 'Ages 13 and above'],
                ['children', 'Children', 'Ages 2–12'],
                ['infants', 'Infants', 'Under 2'],
                ['pets', 'Pets', 'Including service animals'],
              ] as const).map(([type, label, detail]) => <div className="marketplace-occupant-row" key={type}><div><strong>{label}</strong><small>{detail}</small></div><div className="marketplace-stepper"><button type="button" aria-label={`Remove ${label.toLowerCase()}`} onClick={() => updateOccupants(type, -1)} disabled={occupants[type] === (type === 'adults' ? 1 : 0)}>−</button><span>{occupants[type]}</span><button type="button" aria-label={`Add ${label.toLowerCase()}`} onClick={() => updateOccupants(type, 1)}>+</button></div></div>)}
              <p className="marketplace-occupants-note">Occupancy limits may vary by home and lease.</p>
            </div>}
          </div>
          <button className="marketplace-search-button" type="button" onClick={() => { const search = new URLSearchParams({ where: query, moveIn: moveInDate, stayLengthMonths: monthCount.replace(/\D/g, ''), renters: String(occupants.adults + occupants.children + occupants.infants), ...(selectedFilters.includes('Pet friendly') ? { isPetFriendly: 'true' } : {}), ...(selectedFilters.includes('Furnished') ? { isFurnished: 'true' } : {}) }); navigate(`/search?${search.toString()}`); }}>Search homes</button>
        </div>
      </section>

      <section className="marketplace-content" id="homes">
        <div className="marketplace-section-heading">
          <div>
            <p className="marketplace-eyebrow">Curated for you</p>
            <h2>Homes for the way you live</h2>
          </div>
          <button className="marketplace-filter-button" type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
            <span aria-hidden="true">+</span> Filters
          </button>
        </div>
        <div className="marketplace-categories" role="tablist" aria-label="Home categories">
          {['All homes', ...unitTypes.map((unitType) => unitType.name)].map((category) => (
            <button className={activeCategory === category ? 'is-active' : ''} key={category} type="button" role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>
          ))}
        </div>
        {filtersOpen && (
          <div className="marketplace-filter-panel" aria-label="Filters">
            <span>Monthly budget</span>
            {['Under $2,000', 'Pet friendly', 'Furnished'].map((filter) => <button className={selectedFilters.includes(filter) ? 'is-selected' : ''} type="button" key={filter} onClick={() => toggleFilter(filter)}>{filter}</button>)}
          </div>
        )}
        <div className="marketplace-grid">
          {visibleListings.map((listing, index) => (
            <article className="marketplace-listing" style={{ '--card-index': index } as React.CSSProperties} key={listing.id} role="link" tabIndex={0} onClick={() => openListing(listing.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openListing(listing.id); } }}>
              <div className="marketplace-image-wrap">
                <img src={listing.image} alt={listing.title} />
                {listing.tag && <span className="marketplace-tag">{listing.tag}</span>}
                <button className={`marketplace-favorite ${favorites.includes(listing.id) ? 'is-favorite' : ''}`} type="button" onClick={(event) => { event.stopPropagation(); toggleFavorite(listing.id); }} aria-label={favorites.includes(listing.id) ? `Remove ${listing.title} from favorites` : `Save ${listing.title}`}>
                  {favorites.includes(listing.id) ? '♥' : '♡'}
                </button>
              </div>
              <div className="marketplace-listing-copy">
                <div className="marketplace-listing-topline"><h3>{listing.title}</h3><span>{listing.type}</span></div>
                <p>{listing.location}</p>
                <p className="marketplace-listing-details">{listing.details}</p>
                <div className="marketplace-listing-price"><strong>${formatPrice(listing.price)}</strong><span>/ month</span><span className="marketplace-rating">★ {listing.rating} <small>({listing.reviews})</small></span><button type="button" onClick={(event) => { event.stopPropagation(); openListing(listing.id); }}>View home <span aria-hidden="true">-&gt;</span></button></div>
              </div>
            </article>
          ))}
        </div>
        {visibleListings.length === 0 && <div className="marketplace-empty">No homes match that search yet. Try a nearby city or neighborhood.</div>}
        <nav className="marketplace-pagination" aria-label="Marketplace home pages">
          <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>‹</button>
          {visiblePages.map((page) => <button className={page === currentPage ? 'is-current' : ''} type="button" key={page} aria-current={page === currentPage ? 'page' : undefined} onClick={() => goToPage(page)}>{page}</button>)}
          <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => goToPage(currentPage + 1)}>›</button>
        </nav>
      </section>

      <MarketplaceFooter />
    </main>
  );
}
