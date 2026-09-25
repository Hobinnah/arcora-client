import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { GridIcon, PlusIcon, SearchIcon } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchListings } from '../apis/useListing';
import CustomSelect from '../components/CustomSelect';
import { hasHostingPermission, memberHasHostingPermission } from './cohostAccess';
import HostingHeader from './HostingHeader';
import HostingListingsTable, { type HostingListing } from './HostingListingsTable';
import '../marketplace/MarketplaceHome.css';
import './HostingPage.css';
import './HostingListingsPage.css';

const listingStatusFilter = {
  Listed: 'PUBLISHED',
  'In progress': 'DRAFT',
  Unlisted: 'UNPUBLISHED',
} as const;

export default function HostingListingsPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | HostingListing['status']>('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [listings, setListings] = useState<HostingListing[]>([]);
  const [loadError, setLoadError] = useState('');
  const [loadedRequestKey, setLoadedRequestKey] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const deferredQuery = useDeferredValue(query.trim());
  const canManageListings = hasHostingPermission(currentUser, 'manage');
  const organizationOptions = useMemo(() => {
    const options = new Map<string, string>();
    const directOrganization = currentUser?.organization;
    if (directOrganization?.organizationID) options.set(directOrganization.organizationID, directOrganization.displayName || directOrganization.legalName || 'My organization');
    (currentUser?.memberOrganizations ?? []).filter((member) => member.status?.toUpperCase() === 'ACTIVE' && memberHasHostingPermission(member, 'listings')).forEach((member) => {
      const organizationID = member.organizationID || member.organization?.organizationID;
      if (organizationID) options.set(organizationID, member.organization?.displayName || member.organization?.legalName || `Organization ${options.size + 1}`);
    });
    return [...options].map(([id, name]) => ({ id, name }));
  }, [currentUser?.memberOrganizations, currentUser?.organization]);
  const selectedOrganizationID = organizationOptions.some((organization) => organization.id === selectedOrganization)
    ? selectedOrganization
    : organizationOptions[0]?.id || '';
  const selectedOrganizationName = organizationOptions.find((organization) => organization.id === selectedOrganizationID)?.name || '';
  const hasNoOrganization = organizationOptions.length === 0;
  const requestKey = `${selectedOrganizationID}|${page}|${pageSize}|${deferredQuery}|${statusFilter}`;
  const isLoading = Boolean(selectedOrganizationID) && loadedRequestKey !== requestKey;

  useEffect(() => {
    if (!selectedOrganizationID) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetchListings({
          pageSize,
          pageNumber: page - 1,
          organizationID: selectedOrganizationID,
          searchQuery: deferredQuery || undefined,
          statusFilter: statusFilter === 'All' ? undefined : listingStatusFilter[statusFilter],
          sortBy: 'updatedDate',
          sortDirection: 'desc',
        });
        if (cancelled) return;
        setLoadError('');
        setTotalCount(response.totalCount);
        setListings(response.data.map((listing) => {
          const address = listing.rentalUnit?.property?.address;
          const coverPhoto = listing.listingPhotos?.find((photo) => photo.isCoverPhoto) ?? listing.listingPhotos?.[0];
          const status = String(listing.status || '').toUpperCase();
          return {
            id: listing.listingID,
            title: listing.title || listing.rentalUnit?.name || listing.rentalUnit?.unitNumber || 'Untitled listing',
            image: coverPhoto?.url || '',
            type: listing.listingType?.name || 'Home',
            location: [address?.city, address?.provinceCode, address?.countryCode].filter(Boolean).join(', '),
            status: status === 'PUBLISHED' ? 'Listed' : ['UNPUBLISHED', 'PAUSED', 'ARCHIVED'].includes(status) ? 'Unlisted' : 'In progress',
          };
        }));
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'We could not load your listings.');
      } finally {
        if (!cancelled) setLoadedRequestKey(requestKey);
      }
    })();
    return () => { cancelled = true; };
  }, [deferredQuery, page, pageSize, requestKey, selectedOrganizationID, statusFilter]);

  const filteredListings = useMemo(() => {
    return listings;
  }, [listings]);

  const statusCounts = useMemo(() => ({
    All: listings.length,
    Listed: listings.filter((listing) => listing.status === 'Listed').length,
    Unlisted: listings.filter((listing) => listing.status === 'Unlisted').length,
    'In progress': listings.filter((listing) => listing.status === 'In progress').length,
  }), [listings]);
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedListings = filteredListings;
  const firstResult = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastResult = Math.min(currentPage * pageSize, totalCount);

  return (
    <main className="marketplace hosting-page hosting-listings-page">
      <HostingHeader />
      <section className="hosting-listings-content" aria-labelledby="listings-title">
        <div className="hosting-listings-toolbar">
          <div><span className="hosting-listings-eyebrow">Portfolio</span><h1 id="listings-title">Your listings</h1><p>Manage every home you own or co-host from one place.</p></div>
          <div className="hosting-listings-actions">
            {organizationOptions.length > 1 && <div className="hosting-listings-organization"><CustomSelect value={selectedOrganizationName} options={organizationOptions.map((organization) => organization.name)} onChange={(name) => { const organization = organizationOptions.find((option) => option.name === name); if (organization) { setSelectedOrganization(organization.id); setPage(1); } }} ariaLabel="Choose organization" /></div>}
            <div className="hosting-listings-view-toggle" aria-label="Listing view"><button type="button" className={viewMode === 'list' ? 'is-active' : ''} onClick={() => setViewMode('list')}>List</button><button type="button" className={viewMode === 'grid' ? 'is-active' : ''} onClick={() => setViewMode('grid')}><GridIcon /> Grid</button></div>
            {canManageListings && <button type="button" className="hosting-listings-icon-button" aria-label="Create a new listing" title="Create a new listing" onClick={() => navigate('/hosting/listings/new')}><PlusIcon /></button>}
          </div>
        </div>
        <div className="hosting-listings-overview" aria-label="Listing totals">
          {(['All', 'Listed', 'In progress', 'Unlisted'] as const).map((status) => <button type="button" key={status} className={statusFilter === status ? 'is-active' : ''} onClick={() => { setStatusFilter(status); setPage(1); }}><strong>{statusCounts[status]}</strong><span>{status}</span></button>)}
        </div>
        <div className="hosting-listings-results-head"><div><h2>Listings</h2><p>{organizationOptions.find((organization) => organization.id === selectedOrganizationID)?.name || 'Your organization'}</p></div><div className="hosting-listings-controls"><label className="hosting-listings-search"><SearchIcon /><input type="search" placeholder="Search by name, type, or location" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} aria-label="Search listings by name, type, or location" /></label><span>{firstResult}-{lastResult} of {totalCount}</span></div></div>
        <div className="hosting-listings-results">
        {hasNoOrganization ? <div className="hosting-listings-state is-error"><h2>No active organization</h2><p>You need an active organization membership before listings can be displayed.</p></div>
          : isLoading ? <div className="hosting-listings-state"><i /><h2>Loading listings</h2><p>Gathering homes for the selected organization.</p></div>
          : loadError ? <div className="hosting-listings-state is-error"><h2>Listings unavailable</h2><p>{loadError}</p></div>
          : filteredListings.length > 0
          ? <>{viewMode === 'list'
            ? <HostingListingsTable listings={pagedListings} onSelect={(listing) => navigate(`/hosting/listings/${listing.id}/edit`)} />
            : <div className="hosting-listings-grid">{pagedListings.map((listing) => <button type="button" className="hosting-listings-grid-card" key={listing.id} onClick={() => navigate(`/hosting/listings/${listing.id}/edit`)}>{listing.image ? <img src={listing.image} alt="" /> : <span className="hosting-listings-image-placeholder"><GridIcon /></span>}<div><span className={`hosting-listing-status is-${listing.status.toLowerCase().replace(' ', '-')}`}><span className="hosting-listing-status-dot" aria-hidden="true" />{listing.status}</span><h2>{listing.title}</h2><p>{listing.type}</p><small>{listing.location || 'Location not added'}</small></div></button>)}</div>}
            <nav className="hosting-listings-pagination" aria-label="Listings pagination"><label>Rows <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select></label><span>Page {currentPage} of {pageCount}</span><div><button type="button" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button><button type="button" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next</button></div></nav></>
          : <div className="hosting-listings-state"><h2>No matching listings</h2><p>{query ? `Try a different search or status filter.` : 'Create a listing to start managing your portfolio.'}</p>{!query && <button type="button" onClick={() => navigate('/hosting/listings/new')}><PlusIcon /> Create listing</button>}</div>}
        </div>
      </section>
    </main>
  );
}
