{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React from 'react';
import { useParams } from 'react-router-dom';
import MasterLayout from '../../components/MasterLayout';
import BreadCrum  from '../../components/BreadCrum';
import Alert from '../../components/Alert';
import { env } from '../../env';
import type { AlertType } from '../../env';
import '../../themes/theme.css';

/* Form & API for this entity */
/* Ensure these paths/components exist in your project */
/* You can make these paths configurable via Frontend if needed. */

/* default import for the form component */
import ConversationForm from '../../forms/ConversationForm.tsx';
import type {Conversation} from '../../types/Conversation';
import { getConversation } from '../../apis/useConversation';

export default function ConversationDetails() {

  // Get id from URL parameters
  const { id: idParam } = useParams<{ id: string }>();

  // Component state
  const [formAlerts, setFormAlerts] = React.useState<{ message: string; type: AlertType; id: string }[]>([]);
  const [conversation, setConversation] = React.useState<Conversation | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const alertIdCounterRef = React.useRef(0);

  // Alert helpers
  const handleAlert = React.useCallback((message: string, type: AlertType) => {
    alertIdCounterRef.current += 1;
    const id = `${Date.now()}-${alertIdCounterRef.current}`;
    setFormAlerts(prev => [...prev, { message, type, id }]);
  }, []);

  const removeAlert = (id: number | string) => {
    setFormAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Load data based on idParam
  React.useEffect(() => {
    const fetchItem = async () => {
      // Treat 'new'/'create' as new record; basic length gate for IDs (adjust to your ID format).
      const isValidId = idParam && idParam !== 'new' && idParam !== 'create' && idParam.length >= 1;
      if (isValidId) {
        setLoading(true);
        setIsEditMode(true);
        try {
          const data = await getConversation(idParam!);
          setConversation(data);
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Failed to load record';
          handleAlert(msg, 'error');
          console.error('Error fetching record:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // New record
        setIsEditMode(false);
        setConversation(null);
        setLoading(false);
      }
    };
    fetchItem();
  }, [idParam]);

  // ---------- Page content ----------
  const pageContent = [
    <React.Fragment key="details-content">
      <BreadCrum
        title={isEditMode ? "Edit Conversation" : "Create Conversation"}
        trail={[
          { label: 'Tables' },
          { label: 'Conversation List', href: '/conversations' },
          { label: isEditMode ? 'Edit Conversation' : 'Create Conversation', active: true }
        ]}
        actions={[]}
      />

      {/* Alerts */}
      {formAlerts.map(alert => (
        <Alert
          key={alert.id}
          id={alert.id}
          message={alert.message}
          type={alert.type}
          onRemove={removeAlert}
          autoClose={true}
          duration={env.ALERT_DURATIONS[alert.type]}
        />
      ))}

      {/* Loading */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading data...</div>
      )}

      {/* Form */}
      {!loading && (
        <ConversationForm
          key={isEditMode ? `edit-${idParam}` : 'create-new'}
          onAlert={handleAlert}
          initialConversation={conversation}
          isEditMode={isEditMode}
        />
      )}

    </React.Fragment>
  ];

  // ---------- Render ----------
  return (
    <MasterLayout showFooter={true}>
      {pageContent}
    </MasterLayout>
  );
}

