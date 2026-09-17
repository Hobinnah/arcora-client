import { useEffect, useMemo, useState } from 'react';
import { GridIcon, PlusIcon, SearchIcon } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getLandlordOrganization } from '../apis/useLandlordOrganization';
import { fetchListingsByOrganization } from '../apis/useListing';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import HostingListingsTable, { type HostingListing } from './HostingListingsTable';
import '../marketplace/MarketplaceHome.css';
import './HostingPage.css';
import './HostingListingsPage.css';

export default function HostingListingsPage() {
  const [query, setQuery] = useState('');
  const [listings, setListings] = useState<HostingListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;

  useEffect(() => {
    if (!userID) return;
    let cancelled = false;
    (async () => {
      try {
        const organization = currentUser?.organization
          ?? currentUser?.memberOrganizations?.find((item) => item.organization)?.organization
          ?? await getLandlordOrganization(userID);
        if (!organization?.organizationID) throw new Error('No organization found for this account.');
        const records = await fetchListingsByOrganization(organization.organizationID);
        if (cancelled) return;
        setListings(records.map((listing) => {
          const address = listing.rentalUnit?.property?.address;
          const coverPhoto = listing.listingPhotos?.find((photo) => photo.isCoverPhoto) ?? listing.listingPhotos?.[0];
          const status = String(listing.status || '').toLowerCase();
          return {
            id: listing.listingID,
            title: listing.title || listing.rentalUnit?.name || listing.rentalUnit?.unitNumber || 'Untitled listing',
            image: coverPhoto?.url || '',
            type: listing.listingType?.name || 'Home',
            location: [address?.city, address?.provinceCode, address?.countryCode].filter(Boolean).join(', '),
            status: status === 'active' || status === 'listed' || status === 'published' ? 'Listed' : status === 'inactive' || status === 'unlisted' ? 'Unlisted' : 'In progress',
          };
        }));
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'We could not load your listings.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser?.organization, currentUser?.memberOrganizations, userID]);

  const filteredListings = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return listings;
    return listings.filter((listing) => listing.title.toLowerCase().includes(search) || listing.location.toLowerCase().includes(search));
  }, [listings, query]);

  return (
    <main className="marketplace hosting-page hosting-listings-page">
      <HostingHeader />
      <section className="hosting-listings-content" aria-labelledby="listings-title">
        <div className="hosting-listings-toolbar">
          <h1 id="listings-title">Your listings</h1>
          <div className="hosting-listings-actions">
            <button type="button" className="hosting-listings-icon-button" aria-label="Switch to grid view"><GridIcon /></button>
            <button type="button" className="hosting-listings-icon-button" aria-label="Create a new listing" onClick={() => navigate('/hosting/listings/new')}><PlusIcon /></button>
          </div>
        </div>
        <label className="hosting-listings-search">
          <SearchIcon />
          <input type="search" placeholder="Search by name or location" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search listings by name or location" />
        </label>
        {isLoading && <p className="hosting-listings-empty">Loading your listings...</p>}
        {!isLoading && loadError && <p className="hosting-listings-empty">{loadError}</p>}
        {!isLoading && !loadError && filteredListings.length > 0
          ? <HostingListingsTable listings={filteredListings} onSelect={(listing) => navigate(`/hosting/listings/${listing.id}/edit`)} />
          : !isLoading && !loadError && <p className="hosting-listings-empty">No listings match "{query}".</p>}
      </section>
      <MarketplaceFooter />
    </main>
  );
}
