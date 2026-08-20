{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { LeaseDocExtractedTerm } from '../../types/LeaseDocExtractedTerm';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface LeaseDocExtractedTermViewModalProps {
  leaseDocExtractedTerm: LeaseDocExtractedTerm | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaseDocExtractedTermViewModal({ leaseDocExtractedTerm, isOpen, onClose }: LeaseDocExtractedTermViewModalProps) {

  const [leaseDocumentIDMap, setLeaseDocumentIDMap] = React.useState<Record<string, string>>({ });
  const [reviewedByMap, setReviewedByMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/leasedocument/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseDocumentID ?? it.id)] = it.name ?? it.name ?? String(it.leaseDocumentID ?? ''); });
        setLeaseDocumentIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/account/getUsers?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.id ?? it.id)] = it.displayName ?? it.name ?? String(it.id ?? ''); });
        setReviewedByMap(map);
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

  if (!isOpen || !leaseDocExtractedTerm) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>LeaseDocExtractedTerm Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Extraction Status</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {leaseDocExtractedTerm.extractionStatus || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Lease Document</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocumentIDMap[String(leaseDocExtractedTerm.leaseDocumentID)] ?? leaseDocExtractedTerm.leaseDocumentID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Extracted Start Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.extractedStartDate ? new Date(leaseDocExtractedTerm.extractedStartDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Extracted End Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.extractedEndDate ? new Date(leaseDocExtractedTerm.extractedEndDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Extracted Rent Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.extractedRentAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Extracted Deposit Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.extractedDepositAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Extracted Renewal Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.extractedRenewalDate ? new Date(leaseDocExtractedTerm.extractedRenewalDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Extraction Confidence</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.extractionConfidence ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Extracted Date</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.extractedDate ? new Date(leaseDocExtractedTerm.extractedDate as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reviewed At</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseDocExtractedTerm.reviewedAt ? new Date(leaseDocExtractedTerm.reviewedAt as any).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reviewed By</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {reviewedByMap[String(leaseDocExtractedTerm.reviewedBy)] ?? leaseDocExtractedTerm.reviewedBy ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Lease Doc Extracted Term ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {leaseDocExtractedTerm.leaseDocExtractedTermID ?? 'N/A'}
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

