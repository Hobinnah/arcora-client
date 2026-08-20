{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import RentalApplicationGrid from '../../grids/RentalApplicationGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteRentalApplication, fetchRentalApplications, fireRentalApplicationAction } from '../../apis/useRentalApplication';
import { env, type AlertType } from '../../env';
import type { RentalApplication } from '../../types/RentalApplication';
import RentalApplicationViewModal from './RentalApplicationViewModal.tsx';

export default function RentalApplicationList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [showActionDropdown, setShowActionDropdown] = React.useState(true);
  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<RentalApplication | null>(null);

  const handleAdd = () => {
    navigate('/rentalapplications/new');
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
      const exportData = await fetchRentalApplications({ pageSize: 1000, pageNumber: 0, sortBy: 'applicationCode', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `rentalapplications-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: RentalApplication[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (k: string, v: any) => {
      try {
        if (!v) return '';
        switch (k) {
          case 'desiredMoveInDate': return new Date(v as any).toLocaleDateString();
          case 'desiredMoveOutDate': return new Date(v as any).toLocaleDateString();
          case 'submittedAt': return new Date(v as any).toLocaleDateString();
          case 'reviewedAt': return new Date(v as any).toLocaleDateString();
          case 'approvedAt': return new Date(v as any).toLocaleDateString();
          case 'declinedAt': return new Date(v as any).toLocaleDateString();
          case 'expiresAt': return new Date(v as any).toLocaleDateString();
          case 'capturedDate': return new Date(v as any).toLocaleDateString();
          case 'updatedDate': return new Date(v as any).toLocaleDateString();
          default: return v;
        }
      } catch { return v; }
    };
    const headers = ["Application Code", "Desired Move-In Date", "Desired Move-Out Date", "Status", "Screening Status", "Submitted At", "Reviewed At", "Approved At", "Declined At", "Expires At", "Captured Date", "Captured By", "Updated Date", "Updated By"];
    const keys = ["applicationCode", "desiredMoveInDate", "desiredMoveOutDate", "status", "screeningStatus", "submittedAt", "reviewedAt", "approvedAt", "declinedAt", "expiresAt", "capturedDate", "capturedBy", "updatedDate", "updatedBy"];
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

  const handleView = useCallback((row: RentalApplication) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: RentalApplication) => {
    const id = (row as any)?.rentalApplicationID;
    if (id === undefined || id === null) return;
    navigate(`/rentalapplications/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: RentalApplication, setItems: React.Dispatch<React.SetStateAction<RentalApplication[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.rentalApplicationID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteRentalApplication(id);
        setItems(prev => prev.filter(x => (x as any)?.rentalApplicationID !== id));
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
    "set-submitted": async (row: any) => {
      const id = row?.rentalApplicationID;
      if (id === undefined || id === null) return;
      await fireRentalApplicationAction(id, "Set SUBMITTED");
      handleAlert('Action executed', 'success');
    },
  }), [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="RentalApplication List"
        trail={[{ label: 'Tables' }, { label: 'RentalApplication List', href: '/rentalapplications', active: true }]}
        actions={[
          { label: 'Add RentalApplication', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
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

      <RentalApplicationGrid
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
      <RentalApplicationViewModal
        rentalApplication={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

