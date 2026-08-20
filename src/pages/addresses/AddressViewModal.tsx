{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { Address } from '../../types/Address';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface AddressViewModalProps {
  address: Address | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddressViewModal({ address, isOpen, onClose }: AddressViewModalProps) {

  const [organizationIDMap, setOrganizationIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
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

  if (!isOpen || !address) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>Address Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Address Type</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {address.addressType || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Organization</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {organizationIDMap[String(address.organizationID)] ?? address.organizationID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Line 1</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.line1 ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Line 2</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.line2 ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">City</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.city ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Province Code</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.provinceCode ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Postal Code</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.postalCode ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Country Code</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.countryCode ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Latitude</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.latitude ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Longitude</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.longitude ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Place Provider</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.placeProvider ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Place Provider Reference ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.placeProviderReferenceID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Captured Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.capturedDate ? new Date(address.capturedDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Captured By</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.capturedBy ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Updated Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.updatedDate ? new Date(address.updatedDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Updated By</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {address.updatedBy ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Address ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {address.addressID ?? 'N/A'}
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

