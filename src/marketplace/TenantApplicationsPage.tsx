import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TenantHeader from './TenantHeader';
import MarketplaceFooter from './MarketplaceFooter';
import { fallbackListings } from './marketplaceData';
import './TenantApplicationsPage.css';

type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'CHANGES_REQUESTED' | 'DECLINED' | 'EXPIRED';
type TenantApplicationCard = { id: string; listingIndex: number; status: ApplicationStatus; capturedDate: string; moveIn: string; term: number; code: string; nextAction: string };

const mockApplications: TenantApplicationCard[] = [
  { id: 'app-1024', listingIndex: 0, status: 'CHANGES_REQUESTED', capturedDate: '2026-08-18', moveIn: '2026-09-01', term: 6, code: 'ARC-1024', nextAction: 'Review changes' },
  { id: 'app-1017', listingIndex: 2, status: 'UNDER_REVIEW', capturedDate: '2026-08-11', moveIn: '2026-10-01', term: 12, code: 'ARC-1017', nextAction: 'View application' },
  { id: 'app-0998', listingIndex: 1, status: 'DRAFT', capturedDate: '2026-07-29', moveIn: '2026-09-15', term: 3, code: 'ARC-0998', nextAction: 'Complete application' },
  { id: 'app-0942', listingIndex: 3, status: 'APPROVED', capturedDate: '2026-06-20', moveIn: '2026-07-01', term: 12, code: 'ARC-0942', nextAction: 'View decision' },
];
const statusLabels: Record<ApplicationStatus, string> = { DRAFT: 'Draft', SUBMITTED: 'Submitted', UNDER_REVIEW: 'Under review', APPROVED: 'Approved', CHANGES_REQUESTED: 'Changes requested', DECLINED: 'Declined', EXPIRED: 'Expired' };
const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));

export default function TenantApplicationsPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [query, setQuery] = useState('');
  const applications = useMemo(() => [...mockApplications].sort((a, b) => b.capturedDate.localeCompare(a.capturedDate)).filter((application) => {
    const listing = fallbackListings[application.listingIndex];
    return (statusFilter === 'ALL' || application.status === statusFilter) && `${listing.title} ${listing.location} ${application.code}`.toLowerCase().includes(query.toLowerCase());
  }), [query, statusFilter]);
  const countFor = (status: ApplicationStatus) => mockApplications.filter((application) => application.status === status).length;
  useEffect(() => {
    const nativeSelect = document.querySelector<HTMLSelectElement>('.tenant-applications-sort select');
    if (!nativeSelect || nativeSelect.dataset.enhanced) return;
    nativeSelect.dataset.enhanced = 'true';
    nativeSelect.hidden = true;
    const wrapper = nativeSelect.parentElement;
    if (!wrapper) return;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'tenant-applications-sort-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span>Captured date: newest first</span><b aria-hidden="true">⌄</b>';
    const menu = document.createElement('div');
    menu.className = 'tenant-applications-sort-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    ['Captured date: newest first', 'Captured date: oldest first'].forEach((label, index) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      option.innerHTML = `<span>${label}</span>${index === 0 ? '<b>✓</b>' : ''}`;
      option.addEventListener('click', () => {
        trigger.firstElementChild!.textContent = label;
        menu.querySelectorAll('button').forEach((item) => item.setAttribute('aria-selected', item === option ? 'true' : 'false'));
        menu.querySelectorAll('b').forEach((item) => item.remove());
        const check = document.createElement('b'); check.textContent = '✓'; option.append(check);
        menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
      });
      menu.append(option);
    });
    trigger.addEventListener('click', () => { menu.hidden = !menu.hidden; trigger.setAttribute('aria-expanded', String(!menu.hidden)); });
    wrapper.append(trigger, menu);
    const close = (event: MouseEvent) => { if (!wrapper.contains(event.target as Node)) { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); } };
    document.addEventListener('mousedown', close);
    return () => { document.removeEventListener('mousedown', close); trigger.remove(); menu.remove(); };
  }, []);

  return <main className="tenant-applications-page"><TenantHeader /><section className="tenant-applications-content"><div className="tenant-applications-heading"><div><p className="marketplace-eyebrow">Your rental journey</p><h1>Lease applications</h1><p>Keep track of the homes you’re considering and what happens next.</p></div><div className="tenant-applications-summary"><strong>{mockApplications.length}</strong><span>applications</span></div></div><div className="tenant-applications-toolbar"><label className="tenant-applications-search"><span>Search applications</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Home, location, or application code" /></label><label className="tenant-applications-sort"><span>Sort</span><select defaultValue="newest"><option value="newest">Captured date: newest first</option></select></label></div><div className="tenant-applications-filters" role="tablist" aria-label="Filter applications"><button type="button" className={statusFilter === 'ALL' ? 'is-active' : ''} onClick={() => setStatusFilter('ALL')}>All <small>{mockApplications.length}</small></button>{(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'CHANGES_REQUESTED', 'DECLINED', 'EXPIRED'] as ApplicationStatus[]).map((status) => <button type="button" key={status} className={statusFilter === status ? 'is-active' : ''} onClick={() => setStatusFilter(status)}>{statusLabels[status]} <small>{countFor(status)}</small></button>)}</div>{applications.length > 0 ? <div className="tenant-application-card-grid">{applications.map((application) => { const listing = fallbackListings[application.listingIndex]; return <article className="tenant-application-card" key={application.id} tabIndex={0} role="link" onClick={() => navigate(`/applications/${application.id}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/applications/${application.id}`); }}><div className="tenant-application-card-image"><img src={listing.image} alt="" /><span className={`tenant-application-status tenant-application-status-${application.status.toLowerCase()}`}>{statusLabels[application.status]}</span></div><div className="tenant-application-card-body"><div className="tenant-application-card-title"><div><h2>{listing.title}</h2><p>{listing.location}</p></div><span aria-hidden="true">›</span></div><div className="tenant-application-card-meta"><span><small>Captured</small>{formatDate(application.capturedDate)}</span><span><small>Move-in</small>{formatDate(application.moveIn)}</span><span><small>Lease</small>{application.term} months</span></div><div className="tenant-application-card-footer"><span>{application.code}</span><button type="button" onClick={(event) => { event.stopPropagation(); navigate(`/applications/${application.id}`); }}>{application.nextAction} <span aria-hidden="true">→</span></button></div></div></article>; })}</div> : <div className="tenant-applications-empty"><h2>No applications found</h2><p>Try another status or search term.</p><button type="button" onClick={() => { setStatusFilter('ALL'); setQuery(''); }}>Clear filters</button></div>}</section><MarketplaceFooter /></main>;
}
