{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { ViewingAppointments } from '../../types/ViewingAppointments';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface ViewingAppointmentsViewModalProps {
  viewingAppointments: ViewingAppointments | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewingAppointmentsViewModal({ viewingAppointments, isOpen, onClose }: ViewingAppointmentsViewModalProps) {

  const [listingIDMap, setListingIDMap] = React.useState<Record<string, string>>({ });
  const [requestedByUserIDMap, setRequestedByUserIDMap] = React.useState<Record<string, string>>({ });
  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });
  const [assignedOrganizationMemberIDMap, setAssignedOrganizationMemberIDMap] = React.useState<Record<string, string>>({ });

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
        const res = await fetchData('api/account/getUsers?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.id ?? it.id)] = it.displayName ?? it.name ?? String(it.id ?? ''); });
        setRequestedByUserIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.name ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/organizationmember/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.organizationMemberID ?? it.id)] = it.name ?? it.name ?? String(it.organizationMemberID ?? ''); });
        setAssignedOrganizationMemberIDMap(map);
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
      case 'REQUESTED': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'CONFIRMED': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'CANCELLED': return { backgroundColor: '#e0ecff', color: '#1e3a8a' };
      case 'COMPLETED': return { backgroundColor: '#f3e8ff', color: '#6b21a8' };
      default: return { backgroundColor: 'var(--surface)', color: 'var(--muted)' };
    }
  };

  if (!isOpen || !viewingAppointments) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>ViewingAppointments Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Time Zone</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {viewingAppointments.timeZone || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(viewingAppointments.status || '') }}>
                    {viewingAppointments.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Listing</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listingIDMap[String(viewingAppointments.listingID)] ?? viewingAppointments.listingID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Requested By User</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {requestedByUserIDMap[String(viewingAppointments.requestedByUserID)] ?? viewingAppointments.requestedByUserID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(viewingAppointments.tenantID)] ?? viewingAppointments.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Assigned Organization Member</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {assignedOrganizationMemberIDMap[String(viewingAppointments.assignedOrganizationMemberID)] ?? viewingAppointments.assignedOrganizationMemberID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Scheduled For</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {viewingAppointments.scheduledFor ? new Date(viewingAppointments.scheduledFor as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Duration Minutes</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {viewingAppointments.durationMinutes ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Viewing Type</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {viewingAppointments.viewingType ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Meeting URL</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {viewingAppointments.meetingUrl ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Notes</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {viewingAppointments.notes ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Cancelled At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {viewingAppointments.cancelledAt ? new Date(viewingAppointments.cancelledAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Cancellation Reason</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {viewingAppointments.cancellationReason ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Viewing Appointment ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {viewingAppointments.viewingAppointmentID ?? 'N/A'}
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

