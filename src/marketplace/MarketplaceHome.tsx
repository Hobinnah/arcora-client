import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, UsersIcon } from '../components/Icons';
import { fetchListings } from '../apis/useListing';
import { fallbackListings, normalizeListing, type MarketplaceListing } from './marketplaceData';
import MarketplaceHeader from './MarketplaceHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './MarketplaceHome.css';

const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

export default function MarketplaceHome() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<MarketplaceListing[]>(fallbackListings);
  const [query, setQuery] = useState('');
  const [term, setTerm] = useState('1 month');
  const [termOpen, setTermOpen] = useState(false);
  const [occupantsOpen, setOccupantsOpen] = useState(false);
  const [occupants, setOccupants] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [moveInDate, setMoveInDate] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 7, 1));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All homes');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const occupantsRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadListings = async () => {
      try {
        const response = await fetchListings({ pageSize: 1000, pageNumber: 0, statusFilter: 'PUBLISHED' });
        const liveListings = Array.isArray(response?.data)
          ? response.data.map((listing, index) => normalizeListing(listing as unknown as Record<string, any>, index)).filter((listing): listing is MarketplaceListing => listing !== null)
          : [];
        if (!cancelled && liveListings.length > 0) {
          setListings(liveListings);
        }
      } catch (error) {
        console.warn('Marketplace listings unavailable; using static fallback data.', error);
      }
    };
    loadListings();
    return () => { cancelled = true; };
  }, []);

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
    const matchesCategory = activeCategory === 'All homes' || listing.type === activeCategory;
    const matchesFilters = !selectedFilters.includes('Under $2,000') || listing.price < 2000;
    const matchesDate = !moveInDate || listing.availableFrom <= moveInDate;
    return matchesSearch && matchesCategory && matchesFilters && matchesDate;
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

  const updateOccupants = (type: keyof typeof occupants, delta: number) => {
    setOccupants((current) => ({ ...current, [type]: Math.max(type === 'adults' ? 1 : 0, current[type] + delta) }));
  };

  const occupantSummary = `${occupants.adults} ${occupants.adults === 1 ? 'renter' : 'renters'}${occupants.children ? `, ${occupants.children} ${occupants.children === 1 ? 'child' : 'children'}` : ''}${occupants.infants ? `, ${occupants.infants} ${occupants.infants === 1 ? 'infant' : 'infants'}` : ''}${occupants.pets ? `, ${occupants.pets} ${occupants.pets === 1 ? 'pet' : 'pets'}` : ''}`;

  const calendarDays = Array.from({ length: 42 }, (_, dayIndex) => {
    const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
    return new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayIndex - firstDay + 1);
  });
  const selectedDate = moveInDate ? new Date(`${moveInDate}T00:00:00`) : null;
  const calendarMonthLabel = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectDate = (date: Date) => {
    const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    setMoveInDate(dateValue);
    setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setDateOpen(false);
  };

  const stayOptions = [
    { label: '1 month', detail: 'Flexible month-to-month living' },
    { label: '3 months', detail: 'A little more time to settle in' },
    { label: '6 months', detail: 'Make a place yours for a season' },
    { label: '12 months', detail: 'Your long-term home base' },
  ];

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
          <div className={`marketplace-search-field marketplace-term-field ${termOpen ? 'is-open' : ''}`}>
            <span>Stay length</span>
            <button className="marketplace-term-trigger" type="button" aria-haspopup="listbox" aria-expanded={termOpen} onClick={() => setTermOpen((open) => !open)}>
              <span>{term}</span>
            </button>
            {termOpen && <div className="marketplace-term-popover" role="listbox" aria-label="Choose stay length">
              {stayOptions.map((option) => <button className={term === option.label ? 'is-selected' : ''} type="button" role="option" aria-selected={term === option.label} key={option.label} onClick={() => { setTerm(option.label); setTermOpen(false); }}><span className="marketplace-term-radio" aria-hidden="true" /><span><strong>{option.label}</strong><small>{option.detail}</small></span>{term === option.label && <span className="marketplace-term-check" aria-hidden="true">✓</span>}</button>)}
            </div>}
          </div>
          <div className={`marketplace-search-field marketplace-date-field ${dateOpen ? 'is-open' : ''}`} ref={datePickerRef}>
            <span>Move-in date</span>
            <button className="marketplace-date-trigger" type="button" aria-haspopup="dialog" aria-expanded={dateOpen} onClick={() => setDateOpen((open) => !open)}><span>{moveInDate || 'yyyy-mm-dd'}</span><CalendarIcon /></button>
            {dateOpen && <div className="marketplace-calendar-popover" role="dialog" aria-label="Choose move-in date">
              <div className="marketplace-calendar-header"><button type="button" aria-label="Previous month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>‹</button><strong>{calendarMonthLabel}</strong><button type="button" aria-label="Next month" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>›</button></div>
              <div className="marketplace-calendar-weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}</div>
              <div className="marketplace-calendar-grid">{calendarDays.map((date) => { const isCurrentMonth = date.getMonth() === calendarMonth.getMonth(); const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; const isSelected = selectedDate?.toDateString() === date.toDateString(); const isPast = dateValue < '2026-08-21'; return <button className={`${isCurrentMonth ? '' : 'is-muted'} ${isSelected ? 'is-selected' : ''}`} disabled={isPast} type="button" key={dateValue} onClick={() => selectDate(date)}>{date.getDate()}</button>; })}</div>
              <div className="marketplace-calendar-actions"><button type="button" onClick={() => { setMoveInDate(''); setDateOpen(false); }}>Clear</button><button type="button" onClick={() => selectDate(new Date())}>Today</button></div>
            </div>}
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
          <button className="marketplace-search-button" type="button" onClick={() => { const search = new URLSearchParams({ where: query, term, moveIn: moveInDate }); navigate(`/search?${search.toString()}`); }}>Search homes</button>
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
          {['All homes', 'Apartment', 'House', 'Loft', 'Studio'].map((category) => (
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
            <article className="marketplace-listing" style={{ '--card-index': index } as React.CSSProperties} key={listing.id}>
              <div className="marketplace-image-wrap">
                <img src={listing.image} alt={listing.title} />
                {listing.tag && <span className="marketplace-tag">{listing.tag}</span>}
                <button className={`marketplace-favorite ${favorites.includes(listing.id) ? 'is-favorite' : ''}`} type="button" onClick={() => toggleFavorite(listing.id)} aria-label={favorites.includes(listing.id) ? `Remove ${listing.title} from favorites` : `Save ${listing.title}`}>
                  {favorites.includes(listing.id) ? '♥' : '♡'}
                </button>
              </div>
              <div className="marketplace-listing-copy">
                <div className="marketplace-listing-topline"><h3>{listing.title}</h3><span>{listing.type}</span></div>
                <p>{listing.location}</p>
                <p className="marketplace-listing-details">{listing.details}</p>
                <div className="marketplace-listing-price"><strong>${formatPrice(listing.price)}</strong><span>/ month</span><span className="marketplace-rating">★ {listing.rating} <small>({listing.reviews})</small></span><button type="button">View home <span aria-hidden="true">-&gt;</span></button></div>
              </div>
            </article>
          ))}
        </div>
        {visibleListings.length === 0 && <div className="marketplace-empty">No homes match that search yet. Try a nearby city or neighborhood.</div>}
      </section>

      <MarketplaceFooter />
    </main>
  );
}
