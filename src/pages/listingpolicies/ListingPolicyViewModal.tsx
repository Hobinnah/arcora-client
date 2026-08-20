{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { ListingPolicy } from '../../types/ListingPolicy';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface ListingPolicyViewModalProps {
  listingPolicy: ListingPolicy | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingPolicyViewModal({ listingPolicy, isOpen, onClose }: ListingPolicyViewModalProps) {

  const [listingIDMap, setListingIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/listing/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.listingID ?? it.id)] = it.name ?? it.name ?? String(it.listingID ?? ''); });
        setListingIDMap(map);
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

  if (!isOpen || !listingPolicy) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>ListingPolicy Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Application Instructions</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {listingPolicy.applicationInstructions || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Listing</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listingIDMap[String(listingPolicy.listingID)] ?? listingPolicy.listingID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Allows Pets</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listingPolicy.allowsPets ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Allows Smoking</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listingPolicy.allowsSmoking ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Allows Children</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listingPolicy.allowsChildren ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Maximum Occupants</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listingPolicy.maximumOccupants ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Furnished</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listingPolicy.furnished ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Parking Included</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listingPolicy.parkingIncluded ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Utilities Included</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listingPolicy.utilitiesIncluded ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Minimum Credit Score</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {listingPolicy.minimumCreditScore ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Requires Background Check</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={listingPolicy.requiresBackgroundCheck ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Listing Policy ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listingPolicy.listingPolicyID ?? 'N/A'}
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

