{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { Dispute } from '../../types/Dispute';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface DisputeViewModalProps {
  dispute: Dispute | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DisputeViewModal({ dispute, isOpen, onClose }: DisputeViewModalProps) {

  const [tenantIDMap, setTenantIDMap] = React.useState<Record<string, string>>({ });
  const [organizationIDMap, setOrganizationIDMap] = React.useState<Record<string, string>>({ });
  const [leaseIDMap, setLeaseIDMap] = React.useState<Record<string, string>>({ });
  const [leaseRenewalIDMap, setLeaseRenewalIDMap] = React.useState<Record<string, string>>({ });
  const [invoiceMasterIDMap, setInvoiceMasterIDMap] = React.useState<Record<string, string>>({ });
  const [paymentIDMap, setPaymentIDMap] = React.useState<Record<string, string>>({ });
  const [chargebackIDMap, setChargebackIDMap] = React.useState<Record<string, string>>({ });
  const [maintenanceRequestIDMap, setMaintenanceRequestIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.name ?? it.name ?? String(it.tenantID ?? ''); });
        setTenantIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/organization/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.organizationID ?? it.id)] = it.name ?? it.name ?? String(it.organizationID ?? ''); });
        setOrganizationIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/lease/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseID ?? it.id)] = it.leaseID ?? it.name ?? String(it.leaseID ?? ''); });
        setLeaseIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/leaserenewal/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseRenewalID ?? it.id)] = it.leaseRenewalID ?? it.name ?? String(it.leaseRenewalID ?? ''); });
        setLeaseRenewalIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/invoicemaster/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.invoiceMasterID ?? it.id)] = it.invoiceNumber ?? it.name ?? String(it.invoiceMasterID ?? ''); });
        setInvoiceMasterIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/payment/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.paymentID ?? it.id)] = it.paymentID ?? it.name ?? String(it.paymentID ?? ''); });
        setPaymentIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/chargeback/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.chargebackID ?? it.id)] = it.chargebackID ?? it.name ?? String(it.chargebackID ?? ''); });
        setChargebackIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/maintenancerequest/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.maintenanceRequestID ?? it.id)] = it.title ?? it.name ?? String(it.maintenanceRequestID ?? ''); });
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

  if (!isOpen || !dispute) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>Dispute Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Title</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {dispute.title || 'N/A'}
              </div>
            </div>

            <div className="field">
              <label className="field-label">Description</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', whiteSpace: 'pre-wrap', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'auto' }}>
                {dispute.description || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Status</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, ...getStatusStyle(dispute.status || '') }}>
                    {dispute.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {tenantIDMap[String(dispute.tenantID)] ?? dispute.tenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Organization</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {organizationIDMap[String(dispute.organizationID)] ?? dispute.organizationID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseIDMap[String(dispute.leaseID)] ?? dispute.leaseID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Lease Renewal</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseRenewalIDMap[String(dispute.leaseRenewalID)] ?? dispute.leaseRenewalID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Invoice Master</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {invoiceMasterIDMap[String(dispute.invoiceMasterID)] ?? dispute.invoiceMasterID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Payment</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {paymentIDMap[String(dispute.paymentID)] ?? dispute.paymentID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Chargeback</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {chargebackIDMap[String(dispute.chargebackID)] ?? dispute.chargebackID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Maintenance Request</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {maintenanceRequestIDMap[String(dispute.maintenanceRequestID)] ?? dispute.maintenanceRequestID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Resolution Notes</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {dispute.resolutionNotes ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Dispute ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {dispute.disputeID ?? 'N/A'}
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

