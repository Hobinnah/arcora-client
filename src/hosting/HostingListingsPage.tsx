import { useMemo, useState } from 'react';
import { GridIcon, PlusIcon, SearchIcon } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import HostingListingsTable, { type HostingListing } from './HostingListingsTable';
import '../marketplace/MarketplaceHome.css';
import './HostingPage.css';
import './HostingListingsPage.css';

const listings: HostingListing[] = [
  {
    id: 'daisys-inn',
    title: "Daisy's Inn",
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=85',
    type: 'Home',
    location: 'Saskatoon, Canada',
    status: 'Listed',
  },
];

export default function HostingListingsPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const filteredListings = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return listings;
    return listings.filter((listing) => listing.title.toLowerCase().includes(search) || listing.location.toLowerCase().includes(search));
  }, [query]);

  return (
    <main className="marketplace hosting-page hosting-listings-page">
      <HostingHeader />
      <section className="hosting-listings-content" aria-labelledby="listings-title">
        <div className="hosting-listings-toolbar">
          <h1 id="listings-title">Your listing{listings.length === 1 ? '' : 's'}</h1>
          <div className="hosting-listings-actions">
            <button type="button" className="hosting-listings-icon-button" aria-label="Switch to grid view"><GridIcon /></button>
            <button type="button" className="hosting-listings-icon-button" aria-label="Create a new listing" onClick={() => navigate('/hosting/listings/new')}><PlusIcon /></button>
          </div>
        </div>
        <label className="hosting-listings-search">
          <SearchIcon />
          <input type="search" placeholder="Search by name or location" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search listings by name or location" />
        </label>
        {filteredListings.length > 0
          ? <HostingListingsTable listings={filteredListings} onSelect={(listing) => navigate(`/hosting/listings/${listing.id}/edit`)} />
          : <p className="hosting-listings-empty">No listings match "{query}".</p>}
      </section>
      <MarketplaceFooter />
    </main>
  );
}
