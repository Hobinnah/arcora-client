{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { XIcon } from '../../components/Icons';
import type { ConversationMessage } from '../../types/ConversationMessage';
import { fetchData } from '../../apis/useApi';
import '../../themes/theme.css';

interface ConversationMessageViewModalProps {
  conversationMessage: ConversationMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConversationMessageViewModal({ conversationMessage, isOpen, onClose }: ConversationMessageViewModalProps) {

  const [conversationIDMap, setConversationIDMap] = React.useState<Record<string, string>>({ });
  const [senderUserIDMap, setSenderUserIDMap] = React.useState<Record<string, string>>({ });
  const [senderTenantIDMap, setSenderTenantIDMap] = React.useState<Record<string, string>>({ });
  const [senderOrganizationMemberIDMap, setSenderOrganizationMemberIDMap] = React.useState<Record<string, string>>({ });
  const [replyToMessageIDMap, setReplyToMessageIDMap] = React.useState<Record<string, string>>({ });

  React.useEffect(() => {
    const loadLookups = async () => {
      try {
        const res = await fetchData('api/conversation/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.conversationID ?? it.id)] = it.conversationID ?? it.name ?? String(it.conversationID ?? ''); });
        setConversationIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/account/getUsers?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.id ?? it.id)] = it.displayName ?? it.name ?? String(it.id ?? ''); });
        setSenderUserIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/tenant/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.tenantID ?? it.id)] = it.name ?? it.name ?? String(it.tenantID ?? ''); });
        setSenderTenantIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/organizationmember/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.organizationMemberID ?? it.id)] = it.displayName ?? it.name ?? String(it.organizationMemberID ?? ''); });
        setSenderOrganizationMemberIDMap(map);
      } catch { /* non-critical */ }
      try {
        const res = await fetchData('api/conversationmessage/get?pageSize=1000&pageNumber=1');
        const items = res?.data ?? res ?? [];
        const map: Record<string, string> = {};
        items.forEach((it: any) => { map[String(it.conversationMessageID ?? it.id)] = it.message ?? it.name ?? String(it.conversationMessageID ?? ''); });
        setReplyToMessageIDMap(map);
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

  if (!isOpen || !conversationMessage) return null;

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
          <h3 className="card-title" style={{ fontSize: '1.25rem', textTransform: 'none', color: 'var(--fg)' }}>ConversationMessage Details</h3>
          <button className="icon-btn close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <div className="form">
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="field">
              <label className="field-label">Message</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conversationMessage.message || 'N/A'}
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="field-label">Conversation</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {conversationIDMap[String(conversationMessage.conversationID)] ?? conversationMessage.conversationID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Sender User</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {senderUserIDMap[String(conversationMessage.senderUserID)] ?? conversationMessage.senderUserID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Sender Tenant</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {senderTenantIDMap[String(conversationMessage.senderTenantID)] ?? conversationMessage.senderTenantID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Sender Organization Member</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {senderOrganizationMemberIDMap[String(conversationMessage.senderOrganizationMemberID)] ?? conversationMessage.senderOrganizationMemberID ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Message Type</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {conversationMessage.messageType ?? 'N/A'}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Reply To Message</label>
                <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default' }}>
                  {replyToMessageIDMap[String(conversationMessage.replyToMessageID)] ?? conversationMessage.replyToMessageID ?? 'N/A'}
                </div>
              </div>

            </div>

            <div className="field">
              <label className="field-label">Conversation Message ID</label>
              <div className="input" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-2)', cursor: 'default', fontFamily: 'monospace', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conversationMessage.conversationMessageID ?? 'N/A'}
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

