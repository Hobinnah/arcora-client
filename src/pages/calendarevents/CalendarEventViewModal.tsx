{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { CalendarEvent } from '../../types/CalendarEvent';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface CalendarEventViewModalProps {
  calendarEvent: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarEventViewModal({ calendarEvent, isOpen, onClose }: CalendarEventViewModalProps) {

  const [listingIDMap, setListingIDMap] = React.useState<Record<string, string>>({ });
  const [leaseIDMap, setLeaseIDMap] = React.useState<Record<string, string>>({ });
  const [rentalApplicationIDMap, setRentalApplicationIDMap] = React.useState<Record<string, string>>({ });
  const [reservationHoldIDMap, setReservationHoldIDMap] = React.useState<Record<string, string>>({ });
  const [maintenanceRequestIDMap, setMaintenanceRequestIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/listing/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.listingID ?? it.id)] = it.name ?? it.name ?? String(it.listingID ?? ''); });
        setListingIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/lease/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseID ?? it.id)] = it.name ?? it.name ?? String(it.leaseID ?? ''); });
        setLeaseIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/rentalapplication/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.rentalApplicationID ?? it.id)] = it.name ?? it.name ?? String(it.rentalApplicationID ?? ''); });
        setRentalApplicationIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/reservationhold/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.reservationHoldID ?? it.id)] = it.name ?? it.name ?? String(it.reservationHoldID ?? ''); });
        setReservationHoldIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/maintenancerequest/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.maintenanceRequestID ?? it.id)] = it.name ?? it.name ?? String(it.maintenanceRequestID ?? ''); });
        setMaintenanceRequestIDMap(map);
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
      case 'Completed': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'In Progress': return { backgroundColor: '#fef3c7', color: '#92400e' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !calendarEvent) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>CalendarEvent Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Title</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {calendarEvent.title || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(calendarEvent.status || '') }}>
                    {calendarEvent.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Listing</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listingIDMap[String(calendarEvent.listingID)] ?? calendarEvent.listingID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseIDMap[String(calendarEvent.leaseID)] ?? calendarEvent.leaseID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Rental Application</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rentalApplicationIDMap[String(calendarEvent.rentalApplicationID)] ?? calendarEvent.rentalApplicationID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reservation Hold</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {reservationHoldIDMap[String(calendarEvent.reservationHoldID)] ?? calendarEvent.reservationHoldID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Maintenance Request</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {maintenanceRequestIDMap[String(calendarEvent.maintenanceRequestID)] ?? calendarEvent.maintenanceRequestID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Event Type</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.eventType ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Start At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.startAt ? new Date(calendarEvent.startAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">End At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.endAt ? new Date(calendarEvent.endAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Is All Day</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={calendarEvent.isAllDay ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Occupant Name</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.occupantName ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Occupant Count</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.occupantCount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Source System</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.sourceSystem ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Source Reference ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.sourceReferenceID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">External Calendar ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.externalCalendarID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Blocks Availability</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={calendarEvent.blocksAvailability ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Notes</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {calendarEvent.notes ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Calendar Event ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {calendarEvent.calendarEventID ?? 'N/A'}
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

