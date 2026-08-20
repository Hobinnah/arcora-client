{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { ReservationHold } from '../../types/ReservationHold';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface ReservationHoldViewModalProps {
  reservationHold: ReservationHold | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationHoldViewModal({ reservationHold, isOpen, onClose }: ReservationHoldViewModalProps) {

  const [listingIDMap, setListingIDMap] = React.useState<Record<string, string>>({ });
  const [rentalApplicationIDMap, setRentalApplicationIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/listing/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.listingID ?? it.id)] = it.listingID ?? it.name ?? String(it.listingID ?? ''); });
        setListingIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/rentalapplication/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.rentalApplicationID ?? it.id)] = it.applicationCode ?? it.name ?? String(it.rentalApplicationID ?? ''); });
        setRentalApplicationIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.tenantID ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
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
      case 'ACTIVE': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'RELEASED': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'EXPIRED': return { backgroundColor: '#e0ecff', color: '#1e3a8a' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !reservationHold) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>ReservationHold Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Hold Reason</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {reservationHold.holdReason || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(reservationHold.status || '') }}>
                    {reservationHold.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Listing</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listingIDMap[String(reservationHold.listingID)] ?? reservationHold.listingID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Rental Application</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rentalApplicationIDMap[String(reservationHold.rentalApplicationID)] ?? reservationHold.rentalApplicationID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(reservationHold.tenantID)] ?? reservationHold.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Start Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {reservationHold.startDate ? new Date(reservationHold.startDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">End Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {reservationHold.endDate ? new Date(reservationHold.endDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Reservation Hold ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {reservationHold.reservationHoldID ?? 'N/A'}
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

