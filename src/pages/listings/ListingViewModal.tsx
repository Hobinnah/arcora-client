{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { Listing } from '../../types/Listing';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface ListingViewModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingViewModal({ listing, isOpen, onClose }: ListingViewModalProps) {

  const [rentalUnitIDMap, setRentalUnitIDMap] = React.useState<Record<string, string>>({ });
  const [listingTypeIDMap, setListingTypeIDMap] = React.useState<Record<string, string>>({ });
  const [organizationIDMap, setOrganizationIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/rentalunit/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.rentalUnitID ?? it.id)] = it.title ?? it.name ?? String(it.rentalUnitID ?? ''); });
        setRentalUnitIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/listingtype/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.listingTypeID ?? it.id)] = it.name ?? it.name ?? String(it.listingTypeID ?? ''); });
        setListingTypeIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/organization/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.organizationID ?? it.id)] = it.displayName ?? it.name ?? String(it.organizationID ?? ''); });
        setOrganizationIDMap(map);
      } catch { /* non-critical */ }
    };
    if (isOpen) loadLookups();
  }, [isOpen]);
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'DRAFT': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'PUBLISHED': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'PAUSED': return { backgroundColor: '#e0ecff', color: '#1e3a8a' };
      case 'UNPUBLISHED': return { backgroundColor: '#f3e8ff', color: '#6b21a8' };
      case 'ARCHIVED': return { backgroundColor: '#ffe4e6', color: '#9f1239' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !listing) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000, padding: '20px'
      }}
    >
      <div
        className="card modal-content"
        style={{ padding: 0, maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'hidden', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>Listing Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Title</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {listing.title || 'N/A'}
              </div>
            </div>

            <div className="field">
              <label className="field-label">Description</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', whiteSpace: 'pre-wrap', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'auto' }}>
                {listing.description || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(listing.status || '') }}>
                    {listing.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Rental Unit</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rentalUnitIDMap[String(listing.rentalUnitID)] ?? listing.rentalUnitID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Listing Type</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listingTypeIDMap[String(listing.listingTypeID)] ?? listing.listingTypeID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Organization</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {organizationIDMap[String(listing.organizationID)] ?? listing.organizationID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Check-In Door Code</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.checkInDoorCode ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Bedrooms</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.bedrooms ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Bathrooms</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.bathrooms ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Square Feet</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.squareFeet ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Base Monthly Rent</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.baseMonthlyRentAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Security Deposit</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.securityDepositAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Year Built</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.yearBuilt ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Published At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.publishedAt ? new Date(listing.publishedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Unpublished At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.unpublishedAt ? new Date(listing.unpublishedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Currency</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.currency ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Available From</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.availableFrom ? new Date(listing.availableFrom as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Available To</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.availableTo ? new Date(listing.availableTo as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Minimum Lease Months</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.minimumLeaseMonths ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Maximum Lease Months</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.maximumLeaseMonths ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Application Deadline</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.applicationDeadline ? new Date(listing.applicationDeadline as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Notes</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.notes ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">WiFi Network</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listing.wIFINetwork ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Accepting Applications</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listing.acceptingApplications ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Listing ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.listingID ?? 'N/A'}
              </div>
            </div>

          </div>
        </div>

        <div className="card-footer">
          <div></div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

