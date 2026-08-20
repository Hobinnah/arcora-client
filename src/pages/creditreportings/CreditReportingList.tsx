{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import CreditReportingGrid from '../../grids/CreditReportingGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteCreditReporting, fetchCreditReportings, fireCreditReportingAction } from '../../apis/useCreditReporting';
import { env, type AlertType } from '../../env';
import type { CreditReporting } from '../../types/CreditReporting';
import CreditReportingViewModal from './CreditReportingViewModal.tsx';

export default function CreditReportingList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [showActionDropdown, setShowActionDropdown] = React.useState(true);
  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<CreditReporting | null>(null);

  const handleAdd = () => {
    navigate('/creditreportings/new');
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
      const exportData = await fetchCreditReportings({ pageSize: 1000, pageNumber: 0, sortBy: 'reportedAmount', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `creditreportings-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: CreditReporting[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (k: string, v: any) => {
      try {
        if (!v) return '';
        switch (k) {
          case 'reportingPeriodStart': return new Date(v as any).toLocaleDateString();
          case 'reportingPeriodEnd': return new Date(v as any).toLocaleDateString();
          case 'reportedAt': return new Date(v as any).toLocaleDateString();
          default: return v;
        }
      } catch { return v; }
    };
    const headers = ["Reported Amount", "Was Paid On Time", "Reporting Period Start", "Reporting Period End", "Provider Response", "Reported At"];
    const keys = ["reportedAmount", "wasPaidOnTime", "reportingPeriodStart", "reportingPeriodEnd", "providerResponse", "reportedAt"];
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

  const handleView = useCallback((row: CreditReporting) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: CreditReporting) => {
    const id = (row as any)?.creditReportingID;
    if (id === undefined || id === null) return;
    navigate(`/creditreportings/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: CreditReporting, setItems: React.Dispatch<React.SetStateAction<CreditReporting[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.creditReportingID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteCreditReporting(id);
        setItems(prev => prev.filter(x => (x as any)?.creditReportingID !== id));
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
      const id = row?.creditReportingID;
      if (id === undefined || id === null) return;
      await fireCreditReportingAction(id, "Set ACTIVE");
      handleAlert('Action executed', 'success');
    },
  }), [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="CreditReporting List"
        trail={[{ label: 'Tables' }, { label: 'CreditReporting List', href: '/creditreportings', active: true }]}
        actions={[
          { label: 'Add CreditReporting', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
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

      <CreditReportingGrid
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
      <CreditReportingViewModal
        creditReporting={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

