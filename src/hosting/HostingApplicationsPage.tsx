import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceFooter from '../marketplace/MarketplaceFooter';
import HostingHeader from './HostingHeader';
import { useAuth } from '../hooks/useAuth';
import { getCurrentOrganizationMember } from './organizationMemberIdentity';
import { fetchRentalApplications } from '../apis/useRentalApplication';
import type { RentalApplication } from '../types/RentalApplication';
import { rentalApplicationStatuses, rentalApplicationStatusLabels, rentalApplicationStatusClass, normalizeRentalApplicationStatus } from './rentalApplicationStatus';
import './HostingApplicationsPage.css';

const listingLocation = (application: RentalApplication) => {
  const property = application.listing?.rentalUnit?.property;
  const address = property?.address;
  return [address?.city, address?.provinceCode].filter(Boolean).join(', ') || property?.name || '';
};

const dateOnly = (value?: string) => value
  ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
  : 'Not provided';

export default function HostingApplicationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<RentalApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
    if (!userID) return;
    let cancelled = false;
    (async () => {
      try {
        const member = await getCurrentOrganizationMember(userID);
        if (!member?.organizationID) {
          if (!cancelled) setLoadError('No organization membership found for this account.');
          return;
        }
        const { data } = await fetchRentalApplications({ organizationID: member.organizationID, pageSize: 200, pageNumber: 0 });
        if (!cancelled) setApplications(data);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'We could not load your applications.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser?.user?.id, currentUser?.user?.userId]);

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const status = normalizeRentalApplicationStatus(application.status);
    const applicantName = `${application.tenant?.user?.firstName ?? ''} ${application.tenant?.user?.lastName ?? ''}`.trim();
    return (filter === 'All' || rentalApplicationStatusLabels[status] === filter)
      && `${applicantName} ${application.listing?.title ?? ''} ${application.applicationCode}`.toLowerCase().includes(query.toLowerCase());
  }), [applications, filter, query]);

  const countFor = (label: string) => applications.filter((application) => rentalApplicationStatusLabels[normalizeRentalApplicationStatus(application.status)] === label).length;

  return <main className="marketplace hosting-applications-page"><HostingHeader /><section className="hosting-applications-content"><div className="hosting-applications-heading"><div><p className="marketplace-eyebrow">Tenant applications</p><h1>Review who wants to call your place home.</h1><p>Keep decisions focused, transparent, and tied to the home you are renting.</p></div><button type="button" className="hosting-applications-invite" onClick={() => navigate('/hosting/invitations/new')}>Invite a tenant</button></div><div className="hosting-applications-toolbar"><div className="hosting-application-filters" role="tablist" aria-label="Application status"><button type="button" className={filter === 'All' ? 'is-active' : ''} onClick={() => setFilter('All')}>All <span>{applications.length}</span></button>{rentalApplicationStatuses.map((status) => <button type="button" className={filter === rentalApplicationStatusLabels[status] ? 'is-active' : ''} key={status} onClick={() => setFilter(rentalApplicationStatusLabels[status])}>{rentalApplicationStatusLabels[status]} <span>{countFor(rentalApplicationStatusLabels[status])}</span></button>)}</div><input aria-label="Search applications" placeholder="Search applications" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="hosting-application-list">{isLoading && <div className="hosting-application-empty"><strong>Loading applications...</strong></div>}{!isLoading && loadError && <div className="hosting-application-empty"><strong>{loadError}</strong></div>}{!isLoading && !loadError && filteredApplications.map((application) => {
    const status = normalizeRentalApplicationStatus(application.status);
    const applicantName = `${application.tenant?.user?.firstName ?? ''} ${application.tenant?.user?.lastName ?? ''}`.trim() || 'Applicant';
    const initials = applicantName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    return <button type="button" className="hosting-application-card" key={application.rentalApplicationID} onClick={() => navigate(`/hosting/applications/${application.rentalApplicationID}`)}><span className="hosting-application-avatar">{initials}</span><span className="hosting-application-card-main"><span className="hosting-application-card-top"><strong>{applicantName}</strong><span className={`hosting-application-status status-${rentalApplicationStatusClass(status)}`}>{rentalApplicationStatusLabels[status]}</span></span><span className="hosting-application-property">{application.listing?.title ?? 'Listing'}{listingLocation(application) ? ` Ãƒâ€šÃ‚Â· ${listingLocation(application)}` : ''}</span><span className="hosting-application-card-meta"><span>Move-in <b>{dateOnly(application.desiredMoveInDate)}</b></span><span>Rent <b>${(application.proposedMonthlyRentAmount ?? 0).toLocaleString()}</b></span><span>Household <b>{application.adultOccupantCount ?? 1} adult{application.adultOccupantCount === 1 ? '' : 's'}</b></span><span>Screening <b>{application.screeningStatus || 'Not started'}</b></span></span></span><span className="hosting-application-card-arrow">View <span aria-hidden="true">&rarr;</span></span></button>;
  })}{!isLoading && !loadError && filteredApplications.length === 0 && <div className="hosting-application-empty"><strong>No applications match this view.</strong><span>Try another status or search term.</span></div>}</div></section><MarketplaceFooter /></main>;
}

