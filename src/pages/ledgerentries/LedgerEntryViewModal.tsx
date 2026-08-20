{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { LedgerEntry } from '../../types/LedgerEntry';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface LedgerEntryViewModalProps {
  ledgerEntry: LedgerEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LedgerEntryViewModal({ ledgerEntry, isOpen, onClose }: LedgerEntryViewModalProps) {

  const [ledgerTransactionIDMap, setLedgerTransactionIDMap] = React.useState<Record<string, string>>({ });
  const [ledgerAccountIDMap, setLedgerAccountIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/ledgertransaction/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.ledgerTransactionID ?? it.id)] = it.ledgerTransactionID ?? it.name ?? String(it.ledgerTransactionID ?? ''); });
        setLedgerTransactionIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/ledgeraccount/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.ledgerAccountID ?? it.id)] = it.name ?? it.name ?? String(it.ledgerAccountID ?? ''); });
        setLedgerAccountIDMap(map);
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

  if (!isOpen || !ledgerEntry) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>LedgerEntry Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Currency</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ledgerEntry.currency || 'N/A'}
              </div>
            </div>

            <div className="field">
              <label className="field-label">Description</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', minHeight: '80px', whiteSpace: 'pre-wrap', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'auto' }}>
                {ledgerEntry.description || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Ledger Transaction</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {ledgerTransactionIDMap[String(ledgerEntry.ledgerTransactionID)] ?? ledgerEntry.ledgerTransactionID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Ledger Account</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {ledgerAccountIDMap[String(ledgerEntry.ledgerAccountID)] ?? ledgerEntry.ledgerAccountID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Debit Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {ledgerEntry.debitAmount ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Credit Amount</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {ledgerEntry.creditAmount ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Ledger Entry ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ledgerEntry.ledgerEntryID ?? 'N/A'}
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

