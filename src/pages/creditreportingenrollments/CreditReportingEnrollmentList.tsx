{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import CreditReportingEnrollmentGrid from '../../grids/CreditReportingEnrollmentGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteCreditReportingEnrollment, fetchCreditReportingEnrollments, fireCreditReportingEnrollmentAction } from '../../apis/useCreditReportingEnrollment';
import { env, type AlertType } from '../../env';
import type { CreditReportingEnrollment } from '../../types/CreditReportingEnrollment';
import CreditReportingEnrollmentViewModal from './CreditReportingEnrollmentViewModal.tsx';

export default function CreditReportingEnrollmentList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [showActionDropdown, setShowActionDropdown] = React.useState(true);
  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<CreditReportingEnrollment | null>(null);

  const handleAdd = () => {
    navigate('/creditreportingenrollments/new');
  };

  const handleAlert = useCallback((message: string, type: AlertType) => {
    const id = Date.now();
    setAlerts(prev => {
      const filtered = prev.filter(a => a.type !== type && a.message !== message);
      setShowActionDropdown(true);
      return [...filtered, { message, type, id }];
    });
  }, []);

  const removeAlert = (id: number | string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleExportData = async () => {
    handleAlert('Data export started...', 'info');
    try {
      const exportData = await fetchCreditReportingEnrollments({ pageSize: 1000, pageNumber: 0, sortBy: 'status', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `creditreportingenrollments-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: CreditReportingEnrollment[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (k: string, v: any) => {
      try {
        if (!v) return '';
        switch (k) {
          case 'consentedAt': return new Date(v as any).toLocaleDateString();
          case 'cancelledAt': return new Date(v as any).toLocaleDateString();
          default: return v;
        }
      } catch { return v; }
    };
    const headers = ["Status", "Consented At", "Cancelled At"];
    const keys = ["status", "consentedAt", "cancelledAt"];
    const body = rows.map(r => keys.map(k => `"${esc(fmt(k, (r as any)?.[k]))}"`).join(','));
    return [headers.join(','), ...body].join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleView = useCallback((row: CreditReportingEnrollment) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: CreditReportingEnrollment) => {
    const id = (row as any)?.creditReportingEnrollmentID;
    if (id === undefined || id === null) return;
    navigate(`/creditreportingenrollments/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: CreditReportingEnrollment, setItems: React.Dispatch<React.SetStateAction<CreditReportingEnrollment[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.creditReportingEnrollmentID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteCreditReportingEnrollment(id);
        setItems(prev => prev.filter(x => (x as any)?.creditReportingEnrollmentID !== id));
        handleAlert('Record deleted successfully', 'success');
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to delete';
        console.error('Delete error:', error);
        setError(msg);
        handleAlert(msg, 'error');
      }
    }
  }, [handleAlert]);

  // Dynamic per-action handlers (fallback).
  const actionHandlers = React.useMemo(() => ({
    "set-active": async (row: any) => {
      const id = row?.creditReportingEnrollmentID;
      if (id === undefined || id === null) return;
      await fireCreditReportingEnrollmentAction(id, "Set ACTIVE");
      handleAlert('Action executed', 'success');
    },
  }), [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="CreditReportingEnrollment List"
        trail={[{ label: 'Tables' }, { label: 'CreditReportingEnrollment List', href: '/creditreportingenrollments', active: true }]}
        actions={[
          { label: 'Add CreditReportingEnrollment', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
          { label: 'Export Data', variant: 'warning', onClick: handleExportData, icon: <DownloadIcon /> },
        ]}
      />

      {alerts.map(alert => (
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

      <CreditReportingEnrollmentGrid
        initialPageSize={5}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAlert={handleAlert}
        actionHandlers={actionHandlers}
        showActionDropdown={showActionDropdown}
      />

    </div>
  ], [alerts, handleAdd, handleExportData, handleAlert, handleView, handleEdit, handleDelete, actionHandlers]);

  return (
    <>
      <MasterLayout showFooter={true}>
        {...pageContent}
      </MasterLayout>

      {/* Optional View Modal (ensure component exists) */}
      <CreditReportingEnrollmentViewModal
        creditReportingEnrollment={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

