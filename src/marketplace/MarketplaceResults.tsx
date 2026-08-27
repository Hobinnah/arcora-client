import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarIcon, FilterIcon, SearchIcon, UsersIcon } from '../components/Icons';
import { fetchListings } from '../apis/useListing';
import { fallbackListings, normalizeListing, type MarketplaceListing } from './marketplaceData';
import MarketplaceHeader from './MarketplaceHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './MarketplaceHome.css';
import './MarketplaceResults.css';

const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

export default function MarketplaceResults() {
  const [params] = useSearchParams();
  const [listings, setListings] = useState<MarketplaceListing[]>(fallbackListings);
  const [query, setQuery] = useState(params.get('where') ?? '');
  const [moveInDate, setMoveInDate] = useState(params.get('moveIn') ?? '');
  const [term, setTerm] = useState(params.get('term') ?? '1 month');
  const [termOpen, setTermOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 7, 1));
  const [occupantsOpen, setOccupantsOpen] = useState(false);
  const [occupants, setOccupants] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [activeFilter, setActiveFilter] = useState('All homes');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const occupantsRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (occupantsRef.current && !occupantsRef.current.contains(event.target as Node)) setOccupantsOpen(false);
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setDateOpen(false);
    };
    const esc = (event: KeyboardEvent) => { if (event.key === 'Escape') { setTermOpen(false); setDateOpen(false); setOccupantsOpen(false); } };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  const updateOccupants = (type: keyof typeof occupants, delta: number) => setOccupants((c) => ({ ...c, [type]: Math.max(type === 'adults' ? 1 : 0, c[type] + delta) }));
  const occupantSummary = `${occupants.adults} ${occupants.adults === 1 ? 'renter' : 'renters'}${occupants.children ? `, ${occupants.children} ${occupants.children === 1 ? 'child' : 'children'}` : ''}${occupants.infants ? `, ${occupants.infants} ${occupants.infants === 1 ? 'infant' : 'infants'}` : ''}${occupants.pets ? `, ${occupants.pets} ${occupants.pets === 1 ? 'pet' : 'pets'}` : ''}`;

  const stayOptions = [
    { label: '1 month', detail: 'Flexible month-to-month living' },
    { label: '3 months', detail: 'A little more time to settle in' },
    { label: '6 months', detail: 'Make a place yours for a season' },
    { label: '12 months', detail: 'Your long-term home base' },
  ];

  const calendarDays = Array.from({ length: 42 }, (_, i) => { const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay(); return new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i - first + 1); });
  const selectedDate = moveInDate ? new Date(`${moveInDate}T00:00:00`) : null;
  const calendarMonthLabel = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectDate = (d: Date) => { setMoveInDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`); setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setDateOpen(false); };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetchListings({ pageSize: 1000, pageNumber: 0, statusFilter: 'PUBLISHED', availableFrom: moveInDate || undefined });
        const live = Array.isArray(response?.data) ? response.data.map((item, index) => normalizeListing(item as unknown as Record<string, any>, index)).filter((item): item is MarketplaceListing => item !== null) : [];
        if (!cancelled && live.length) setListings(live);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [moveInDate]);

  const visibleListings = useMemo(() => listings.filter((listing) => {
    const text = `${listing.title} ${listing.location} ${listing.type}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (activeFilter === 'All homes' || listing.type === activeFilter) && (!moveInDate || listing.availableFrom <= moveInDate);
  }), [activeFilter, listings, moveInDate, query]);

  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <main className="marketplace marketplace-results">
      <MarketplaceHeader activeLink="find" />

      <section className="results-toolbar">
        <div className="results-searchbar">
          <label className="marketplace-search-field"><span>Where</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="City, neighborhood, or address" /></label>
          <div className={`marketplace-search-field marketplace-term-field ${termOpen ? 'is-open' : ''}`}><span>Stay length</span><button className="marketplace-term-trigger" type="button" onClick={() => setTermOpen((o) => !o)}><span>{term}</span></button>{termOpen && <div className="marketplace-term-popover" role="listbox">{stayOptions.map((opt) => <button className={term === opt.label ? 'is-selected' : ''} type="button" role="option" key={opt.label} onClick={() => { setTerm(opt.label); setTermOpen(false); }}><span className="marketplace-term-radio" /><span><strong>{opt.label}</strong><small>{opt.detail}</small></span>{term === opt.label && <span className="marketplace-term-check">✓</span>}</button>)}</div>}</div>
          <div className={`marketplace-search-field marketplace-date-field ${dateOpen ? 'is-open' : ''}`} ref={datePickerRef}><span>Move-in date</span><button className="marketplace-date-trigger" type="button" onClick={() => setDateOpen((o) => !o)}><span>{moveInDate || 'yyyy-mm-dd'}</span><CalendarIcon /></button>{dateOpen && <div className="marketplace-calendar-popover" role="dialog"><div className="marketplace-calendar-header"><button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>‹</button><strong>{calendarMonthLabel}</strong><button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>›</button></div><div className="marketplace-calendar-weekdays">{['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => <span key={d}>{d}</span>)}</div><div className="marketplace-calendar-grid">{calendarDays.map((date) => { const cur = date.getMonth() === calendarMonth.getMonth(); const val = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; const sel = selectedDate?.toDateString() === date.toDateString(); return <button className={`${cur ? '' : 'is-muted'} ${sel ? 'is-selected' : ''}`} disabled={val < '2026-08-21'} type="button" key={val} onClick={() => selectDate(date)}>{date.getDate()}</button>; })}</div><div className="marketplace-calendar-actions"><button type="button" onClick={() => { setMoveInDate(''); setDateOpen(false); }}>Clear</button><button type="button" onClick={() => selectDate(new Date())}>Today</button></div></div>}</div>
          <div className={`marketplace-search-field marketplace-occupants-field ${occupantsOpen ? 'is-open' : ''}`} ref={occupantsRef}><span>Who's moving in?</span><button className="marketplace-occupants-trigger" type="button" onClick={() => setOccupantsOpen((o) => !o)}><UsersIcon /><span>{occupantSummary}</span></button>{occupantsOpen && <div className="marketplace-occupants-popover" role="dialog"><div className="marketplace-occupants-header"><div><strong>Who's moving in?</strong><small>Tell us who will live in the home.</small></div><UsersIcon /></div>{([['adults','Adults','Ages 13 and above'],['children','Children','Ages 2–12'],['infants','Infants','Under 2'],['pets','Pets','Including service animals']] as const).map(([type, label, detail]) => <div className="marketplace-occupant-row" key={type}><div><strong>{label}</strong><small>{detail}</small></div><div className="marketplace-stepper"><button type="button" onClick={() => updateOccupants(type, -1)} disabled={occupants[type] === (type === 'adults' ? 1 : 0)}>−</button><span>{occupants[type]}</span><button type="button" onClick={() => updateOccupants(type, 1)}>+</button></div></div>)}<p className="marketplace-occupants-note">Occupancy limits may vary by home and lease.</p></div>}</div>
          <button className="results-search-icon" type="button" aria-label="Search"><SearchIcon /></button>
        </div>
        <div className="results-filter-row"><button className="results-filter-main" type="button"><FilterIcon /> Filters</button>{['All homes', 'Apartment', 'House', 'Loft', 'Studio'].map((filter) => <button className={activeFilter === filter ? 'is-active' : ''} type="button" key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
      </section>

      <div className="results-layout">
        <section className="results-list" aria-labelledby="results-heading"><div className="results-heading"><div><p className="marketplace-eyebrow">Monthly homes</p><h1 id="results-heading">{visibleListings.length} homes{query ? ` in ${query}` : ' to explore'}</h1><p>{term} stays with transparent monthly pricing</p></div><button className="results-sort" type="button">Sort: Recommended</button></div>{loading && <div className="results-loading">Finding available homes...</div>}<div className="results-grid">{visibleListings.map((listing, index) => <article className="results-card" style={{ '--card-index': index } as React.CSSProperties} key={listing.id}><div className="results-card-image"><img src={listing.image} alt={listing.title} />{listing.tag && <span>{listing.tag}</span>}<button type="button" aria-label="Save home" className={favorites.includes(listing.id) ? 'is-saved' : ''} onClick={() => toggleFavorite(listing.id)}>{favorites.includes(listing.id) ? '♥' : '♡'}</button></div><div className="results-card-copy"><div className="results-card-title"><h2>{listing.title}</h2><strong>★ {listing.rating || 'New'}</strong></div><p>{listing.location}</p><p>{listing.details}</p><div><b>${formatPrice(listing.price)}</b><span> / month</span><a href={`/listings/${listing.id}`}>View home →</a></div></div></article>)}</div>{!loading && !visibleListings.length && <div className="results-empty">No homes match these filters. Try a wider location or another move-in date.</div>}<nav className="results-pagination" aria-label="Results pages"><button type="button">‹</button><b>1</b><button type="button">2</button><button type="button">3</button><span>...</span><button type="button">12</button><button type="button">›</button></nav></section>
        <aside className="results-map" aria-label="Map of available homes"><div className="results-map-grid" /><span className="results-map-label label-one">$1,850</span><span className="results-map-label label-two">$2,140</span><span className="results-map-label label-three">$2,675</span><span className="results-map-label label-four">$1,625</span><span className="results-map-pin pin-one" /><span className="results-map-pin pin-two" /><div className="results-map-controls"><button type="button" aria-label="Expand map">↗</button><button type="button" aria-label="Zoom in">+</button><button type="button" aria-label="Zoom out">−</button></div><div className="results-map-caption">Map preview · Select a home to explore its exact location</div></aside>
      </div>
      <MarketplaceFooter />
    </main>
  );
}
