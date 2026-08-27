{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import LedgerEntryGrid from '../../grids/LedgerEntryGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteLedgerEntry, fetchLedgerEntries } from '../../apis/useLedgerEntry';
import { env, type AlertType } from '../../env';
import type { LedgerEntry } from '../../types/LedgerEntry';
import LedgerEntryViewModal from './LedgerEntryViewModal.tsx';

export default function LedgerEntryList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<LedgerEntry | null>(null);

  const handleAdd = () => {
    navigate('/ledgerentries/new');
  };

  const handleAlert = useCallback((message: string, type: AlertType) => {
    const id = Date.now();
    setAlerts(prev => {
      const filtered = prev.filter(a => a.type !== type && a.message !== message);
      return [...filtered, { message, type, id }];
    });
  }, []);

  const removeAlert = (id: number | string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleExportData = async () => {
    handleAlert('Data export started...', 'info');
    try {
      const exportData = await fetchLedgerEntries({ pageSize: 1000, pageNumber: 0, sortBy: 'debitAmount', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `ledgerentries-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: LedgerEntry[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (v: any) => {
      try {
        if (!v) return '';
        return v;
      } catch { return v; }
    };
    const headers = ["Debit Amount", "Credit Amount", "Currency"];
    const keys = ["debitAmount", "creditAmount", "currency"];
    const body = rows.map(r => keys.map(k => `"${esc(fmt((r as any)?.[k]))}"`).join(','));
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

  const handleView = useCallback((row: LedgerEntry) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: LedgerEntry) => {
    const id = (row as any)?.ledgerEntryID;
    if (id === undefined || id === null) return;
    navigate(`/ledgerentries/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: LedgerEntry, setItems: React.Dispatch<React.SetStateAction<LedgerEntry[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.ledgerEntryID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteLedgerEntry(id);
        setItems(prev => prev.filter(x => (x as any)?.ledgerEntryID !== id));
        handleAlert('Record deleted successfully', 'success');
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to delete';
        console.error('Delete error:', error);
        setError(msg);
        handleAlert(msg, 'error');
      }
    }
  }, [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="LedgerEntry List"
        trail={[{ label: 'Tables' }, { label: 'LedgerEntry List', href: '/ledgerentries', active: true }]}
        actions={[
          { label: 'Add LedgerEntry', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
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

      <LedgerEntryGrid
        initialPageSize={5}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAlert={handleAlert}
      />

    </div>
  ], [alerts, handleAdd, handleExportData, handleAlert, handleView, handleEdit, handleDelete]);

  return (
    <>
      <MasterLayout showFooter={true}>
        {...pageContent}
      </MasterLayout>

      {/* Optional View Modal (ensure component exists) */}
      <LedgerEntryViewModal
        ledgerEntry={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

