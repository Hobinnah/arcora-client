{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { Rating } from '../../types/Rating';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface RatingViewModalProps {
  rating: Rating | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RatingViewModal({ rating, isOpen, onClose }: RatingViewModalProps) {

  const [leaseIDMap, setLeaseIDMap] = React.useState<Record<string, string>>({ });
  const [reviewerUserIDMap, setReviewerUserIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/lease/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.leaseID ?? it.id)] = it.leaseID ?? it.name ?? String(it.leaseID ?? ''); });
        setLeaseIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/account/getUsers?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.id ?? it.id)] = it.displayName ?? it.name ?? String(it.id ?? ''); });
        setReviewerUserIDMap(map);
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

  if (!isOpen || !rating) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>Rating Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Subject Type</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {rating.subjectType || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Lease</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {leaseIDMap[String(rating.leaseID)] ?? rating.leaseID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reviewer User</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {reviewerUserIDMap[String(rating.reviewerUserID)] ?? rating.reviewerUserID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Subject Reference ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.subjectReferenceID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Overall Rating</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.overallRating ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Payment Rating</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.paymentRating ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Communication Rating</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.communicationRating ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Property Care Rating</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.propertyCareRating ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Responsiveness Rating</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.responsivenessRating ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Accuracy Rating</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.accuracyRating ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Cleanliness Rating</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.cleanlinessRating ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Review Body</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {rating.reviewBody ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Is Public</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={rating.isPublic ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Rating ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {rating.ratingID ?? 'N/A'}
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

