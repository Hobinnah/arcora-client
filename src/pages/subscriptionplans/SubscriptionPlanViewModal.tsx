{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { SubscriptionPlan } from '../../types/SubscriptionPlan';
import '../../themes/theme.css';

interface SubscriptionPlanViewModalProps {
  subscriptionPlan: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionPlanViewModal({ subscriptionPlan, isOpen, onClose }: SubscriptionPlanViewModalProps) {
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

  if (!isOpen || !subscriptionPlan) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>SubscriptionPlan Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Code</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {subscriptionPlan.code || 'N/A'}
              </div>
            </div>

            <div className="field">
              <label className="field-label">Description</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', whiteSpace: 'pre-wrap', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'auto' }}>
                {subscriptionPlan.description || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Name</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.name ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Monthly Price</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.monthlyPrice ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Annual Price</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.annualPrice ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Currency</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.currency ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Max Properties</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.maxProperties ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Max Rental Units</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.maxRentalUnits ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Max Active Listings</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.maxActiveListings ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Max Organization Members</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.maxOrganizationMembers ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Features</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.features ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Product ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.providerProductID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Monthly Price ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.providerMonthlyPriceID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Provider Annual Price ID</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {subscriptionPlan.providerAnnualPriceID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Is Active</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  <input type="checkbox" checked={subscriptionPlan.isActive ?? false} readOnly style={{ cursor: 'default' }} />
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Subscription Plan ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {subscriptionPlan.subscriptionPlanID ?? 'N/A'}
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

