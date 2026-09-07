import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarIcon, FilterIcon, SearchIcon, UsersIcon } from '../components/Icons';
import { fetchListings, searchListings } from '../apis/useListing';
import { fetchUnitTypes } from '../apis/useUnitType';
import { fallbackListings, normalizeListing, type MarketplaceListing } from './marketplaceData';
import CustomSelect from '../components/CustomSelect';
import type { UnitType } from '../types/UnitType';
import MarketplaceHeader from './MarketplaceHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './MarketplaceHome.css';
import './MarketplaceResults.css';

const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

export default function MarketplaceResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState<MarketplaceListing[]>(fallbackListings);
  const [query, setQuery] = useState(params.get('where') ?? '');
  const [moveInDate, setMoveInDate] = useState(params.get('moveIn') ?? '');
  const [monthCount, setMonthCount] = useState(params.get('stayLengthMonths') ?? params.get('months') ?? '1');
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 7, 1));
  const [occupantsOpen, setOccupantsOpen] = useState(false);
  const [occupants, setOccupants] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [activeFilter, setActiveFilter] = useState('All homes');
  const [unitTypes, setUnitTypes] = useState<UnitType[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayKey] = useState(() => new Date().toISOString().slice(0, 10));
  const [currentPage, setCurrentPage] = useState(Number(params.get('page') ?? 1));
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [favorites, setFavorites] = useState<string[]>([]);
  const occupantsRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (occupantsRef.current && !occupantsRef.current.contains(event.target as Node)) setOccupantsOpen(false);
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setDateOpen(false);
    };
    const esc = (event: KeyboardEvent) => { if (event.key === 'Escape') { setDateOpen(false); setOccupantsOpen(false); } };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchUnitTypes({ pageSize: 1000, pageNumber: 0 }).then((response) => {
      if (!cancelled) setUnitTypes(response.data);
    }).catch(() => {
      if (!cancelled) setUnitTypes([]);
    });
    return () => { cancelled = true; };
  }, []);

  const updateOccupants = (type: keyof typeof occupants, delta: number) => setOccupants((c) => ({ ...c, [type]: Math.max(type === 'adults' ? 1 : 0, c[type] + delta) }));
  const occupantSummary = `${occupants.adults} ${occupants.adults === 1 ? 'renter' : 'renters'}${occupants.children ? `, ${occupants.children} ${occupants.children === 1 ? 'child' : 'children'}` : ''}${occupants.infants ? `, ${occupants.infants} ${occupants.infants === 1 ? 'infant' : 'infants'}` : ''}${occupants.pets ? `, ${occupants.pets} ${occupants.pets === 1 ? 'pet' : 'pets'}` : ''}`;

  const monthOptions = Array.from({ length: 12 }, (_, index) => `${index + 1} month${index === 0 ? '' : 's'}`);

  const calendarDays = Array.from({ length: 42 }, (_, i) => { const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay(); return new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i - first + 1); });
  const selectedDate = moveInDate ? new Date(`${moveInDate}T00:00:00`) : null;
  const calendarMonthLabel = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectDate = (d: Date) => { setMoveInDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`); setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setDateOpen(false); };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const hasSearchCriteria = ['where', 'stayLengthMonths', 'moveIn', 'renters', 'isFurnished', 'isPetFriendly'].some((key) => params.has(key));
        const response = hasSearchCriteria
          ? await searchListings({
            where: query || undefined,
            stayLengthMonths: Number(monthCount) || undefined,
            moveInDate: moveInDate || undefined,
            renters: Number(params.get('renters')) || occupants.adults + occupants.children + occupants.infants,
            isFurnished: params.get('isFurnished') === 'true' ? true : undefined,
            isPetFriendly: params.get('isPetFriendly') === 'true' ? true : undefined,
            pageNumber: currentPage,
            pageSize,
          })
          : await fetchListings({ pageSize, pageNumber: currentPage - 1, statusFilter: 'PUBLISHED' });
        const live = Array.isArray(response?.data) ? response.data.map((item, index) => normalizeListing(item as unknown as Record<string, any>, index)).filter((item): item is MarketplaceListing => item !== null) : [];
        if (!cancelled) {
          setListings(live);
          setTotalCount(response.totalCount ?? 0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [currentPage, moveInDate, monthCount, occupants.adults, occupants.children, occupants.infants, params, query]);

  const visibleListings = useMemo(() => listings.filter((listing) => {
    const text = `${listing.title} ${listing.location} ${listing.type}`.toLowerCase();
    const selectedUnitType = unitTypes.find((unitType) => unitType.name === activeFilter);
    return text.includes(query.toLowerCase()) && (activeFilter === 'All homes' || listing.unitTypeID === selectedUnitType?.unitTypeID) && (!moveInDate || listing.availableFrom <= moveInDate);
  }), [activeFilter, listings, moveInDate, query, unitTypes]);

  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const getListingDetailUrl = (listingID: string) => {
    if (Array.from(params.keys()).length > 0) {
      const detailParams = new URLSearchParams();
      const moveIn = params.get('moveIn');
      const stayLengthMonths = params.get('stayLengthMonths') ?? params.get('months');
      const renters = params.get('renters');
      if (moveIn) detailParams.set('moveIn', moveIn);
      if (stayLengthMonths) detailParams.set('stayLengthMonths', stayLengthMonths);
      if (renters) detailParams.set('renters', renters);
      return `/homes/${listingID}${detailParams.toString() ? `?${detailParams.toString()}` : ''}`;
    }
    const today = new Date();
    const moveIn = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return `/homes/${listingID}?moveIn=${moveIn}&stayLengthMonths=1&renters=1`;
  };
  const submitSearch = async () => {
    const search = new URLSearchParams({
      ...(query ? { where: query } : {}),
      ...(moveInDate ? { moveIn: moveInDate } : {}),
      stayLengthMonths: monthCount,
      renters: String(occupants.adults + occupants.children + occupants.infants),
    });
    setCurrentPage(1);
    search.set('page', '1');
    navigate(`/search?${search.toString()}`);
    setLoading(true);
    try {
      const response = await searchListings({
        where: query || undefined,
        stayLengthMonths: Number(monthCount),
        moveInDate: moveInDate || undefined,
        renters: occupants.adults + occupants.children + occupants.infants,
        pageNumber: 1,
        pageSize,
      });
      const live = Array.isArray(response?.data) ? response.data.map((item, index) => normalizeListing(item as unknown as Record<string, any>, index)).filter((item): item is MarketplaceListing => item !== null) : [];
      setListings(live);
      setTotalCount(response.totalCount ?? 0);
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const visiblePages = Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 5);
  const goToPage = (page: number) => {
    const nextPage = Math.min(pageCount, Math.max(1, page));
    setCurrentPage(nextPage);
    const nextParams = new URLSearchParams(params);
    nextParams.set('page', String(nextPage));
    navigate(`/search?${nextParams.toString()}`);
  };

  return (
    <main className="marketplace marketplace-results">
      <MarketplaceHeader activeLink="find" />

      <section className="results-toolbar">
        <div className="results-searchbar">
          <label className="marketplace-search-field"><span>Where</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="City, neighborhood, or address" /></label>
          <div className={`marketplace-search-field marketplace-date-field ${dateOpen ? 'is-open' : ''}`} ref={datePickerRef}><span>Move-in date</span><button className="marketplace-date-trigger" type="button" onClick={() => setDateOpen((o) => !o)}><span>{moveInDate || 'yyyy-mm-dd'}</span><CalendarIcon /></button>{dateOpen && <div className="marketplace-calendar-popover" role="dialog"><div className="marketplace-calendar-header"><button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>‹</button><strong>{calendarMonthLabel}</strong><button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>›</button></div><div className="marketplace-calendar-weekdays">{['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => <span key={d}>{d}</span>)}</div><div className="marketplace-calendar-grid">{calendarDays.map((date) => { const cur = date.getMonth() === calendarMonth.getMonth(); const val = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; const sel = selectedDate?.toDateString() === date.toDateString(); return <button className={`${cur ? '' : 'is-muted'} ${sel ? 'is-selected' : ''}`} disabled={val < todayKey} type="button" key={val} onClick={() => selectDate(date)}>{date.getDate()}</button>; })}</div><div className="marketplace-calendar-actions"><button type="button" onClick={() => { setMoveInDate(''); setDateOpen(false); }}>Clear</button><button type="button" onClick={() => selectDate(new Date())}>Today</button></div></div>}</div>
          <div className="marketplace-search-field marketplace-month-count-field"><span>Stay length</span><CustomSelect value={`${monthCount} month${monthCount === '1' ? '' : 's'}`} options={monthOptions} onChange={(value) => setMonthCount(value.replace(/\D/g, ''))} ariaLabel="Choose stay length" /></div>
          <div className={`marketplace-search-field marketplace-occupants-field ${occupantsOpen ? 'is-open' : ''}`} ref={occupantsRef}><span>Who's moving in?</span><button className="marketplace-occupants-trigger" type="button" onClick={() => setOccupantsOpen((o) => !o)}><UsersIcon /><span>{occupantSummary}</span></button>{occupantsOpen && <div className="marketplace-occupants-popover" role="dialog"><div className="marketplace-occupants-header"><div><strong>Who's moving in?</strong><small>Tell us who will live in the home.</small></div><UsersIcon /></div>{([['adults','Adults','Ages 13 and above'],['children','Children','Ages 2–12'],['infants','Infants','Under 2'],['pets','Pets','Including service animals']] as const).map(([type, label, detail]) => <div className="marketplace-occupant-row" key={type}><div><strong>{label}</strong><small>{detail}</small></div><div className="marketplace-stepper"><button type="button" onClick={() => updateOccupants(type, -1)} disabled={occupants[type] === (type === 'adults' ? 1 : 0)}>−</button><span>{occupants[type]}</span><button type="button" onClick={() => updateOccupants(type, 1)}>+</button></div></div>)}<p className="marketplace-occupants-note">Occupancy limits may vary by home and lease.</p></div>}</div>
          <button className="results-search-icon" type="button" aria-label="Search" onClick={submitSearch}><SearchIcon /></button>
        </div>
        <div className="results-filter-row"><button className="results-filter-main" type="button"><FilterIcon /> Filters</button>{['All homes', ...unitTypes.map((unitType) => unitType.name)].map((filter) => <button className={activeFilter === filter ? 'is-active' : ''} type="button" key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
      </section>

      <div className="results-layout">
        <section className="results-list" aria-labelledby="results-heading"><div className="results-heading"><div><p className="marketplace-eyebrow">Monthly homes</p><h1 id="results-heading">{totalCount || visibleListings.length} homes{query ? ` in ${query}` : ' to explore'}</h1><p>{monthCount} month{monthCount === '1' ? '' : 's'} stays with transparent monthly pricing</p></div><button className="results-sort" type="button">Sort: Recommended</button></div>{loading && <div className="results-loading">Finding available homes...</div>}<div className="results-grid">{visibleListings.map((listing, index) => <article className="results-card" style={{ '--card-index': index } as React.CSSProperties} key={listing.id}><div className="results-card-image"><a href={getListingDetailUrl(listing.id)} aria-label={`View ${listing.title}`}><img src={listing.image} alt={listing.title} /></a>{listing.tag && <span>{listing.tag}</span>}<button type="button" aria-label="Save home" className={favorites.includes(listing.id) ? 'is-saved' : ''} onClick={() => toggleFavorite(listing.id)}>{favorites.includes(listing.id) ? '♥' : '♡'}</button></div><div className="results-card-copy"><div className="results-card-title"><h2>{listing.title}</h2><strong>★ {listing.rating || 'New'}</strong></div><p>{listing.location}</p><p>{listing.details}</p><div><b>${formatPrice(listing.price)}</b><span> / month</span><a href={getListingDetailUrl(listing.id)}>View home →</a></div></div></article>)}</div>{!loading && !visibleListings.length && <div className="results-empty">No homes match these filters. Try a wider location or another move-in date.</div>}<nav className="results-pagination" aria-label="Results pages"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>‹</button>{visiblePages.map((page) => <button className={page === currentPage ? 'is-current' : ''} type="button" key={page} aria-current={page === currentPage ? 'page' : undefined} onClick={() => goToPage(page)}>{page}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => goToPage(currentPage + 1)}>›</button></nav></section>
        <aside className="results-map" aria-label="Map of available homes"><div className="results-map-grid" /><span className="results-map-label label-one">$1,850</span><span className="results-map-label label-two">$2,140</span><span className="results-map-label label-three">$2,675</span><span className="results-map-label label-four">$1,625</span><span className="results-map-pin pin-one" /><span className="results-map-pin pin-two" /><div className="results-map-controls"><button type="button" aria-label="Expand map">↗</button><button type="button" aria-label="Zoom in">+</button><button type="button" aria-label="Zoom out">−</button></div><div className="results-map-caption">Map preview · Select a home to explore its exact location</div></aside>
      </div>
      <MarketplaceFooter />
    </main>
  );
}
