{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import MaintenanceRequestGrid from '../../grids/MaintenanceRequestGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteMaintenanceRequest, fetchMaintenanceRequests, fireMaintenanceRequestAction } from '../../apis/useMaintenanceRequest';
import { env, type AlertType } from '../../env';
import type { MaintenanceRequest } from '../../types/MaintenanceRequest';
import MaintenanceRequestViewModal from './MaintenanceRequestViewModal.tsx';

export default function MaintenanceRequestList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [showActionDropdown, setShowActionDropdown] = React.useState(true);
  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<MaintenanceRequest | null>(null);

  const handleAdd = () => {
    navigate('/maintenancerequests/new');
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
      const exportData = await fetchMaintenanceRequests({ pageSize: 1000, pageNumber: 0, sortBy: 'priority', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `maintenancerequests-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: MaintenanceRequest[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (k: string, v: any) => {
      try {
        if (!v) return '';
        switch (k) {
          case 'submittedAt': return new Date(v as any).toLocaleDateString();
          case 'acknowledgedAt': return new Date(v as any).toLocaleDateString();
          case 'scheduledAt': return new Date(v as any).toLocaleDateString();
          case 'completedAt': return new Date(v as any).toLocaleDateString();
          case 'cancelledAt': return new Date(v as any).toLocaleDateString();
          default: return v;
        }
      } catch { return v; }
    };
    const headers = ["Priority", "Status", "Title", "Permission To Enter", "Submitted At", "Acknowledged At", "Scheduled At", "Completed At", "Cancelled At"];
    const keys = ["priority", "status", "title", "permissionToEnter", "submittedAt", "acknowledgedAt", "scheduledAt", "completedAt", "cancelledAt"];
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

  const handleView = useCallback((row: MaintenanceRequest) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: MaintenanceRequest) => {
    const id = (row as any)?.maintenanceRequestID;
    if (id === undefined || id === null) return;
    navigate(`/maintenancerequests/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: MaintenanceRequest, setItems: React.Dispatch<React.SetStateAction<MaintenanceRequest[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.maintenanceRequestID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteMaintenanceRequest(id);
        setItems(prev => prev.filter(x => (x as any)?.maintenanceRequestID !== id));
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
    "set-acknowledged": async (row: any) => {
      const id = row?.maintenanceRequestID;
      if (id === undefined || id === null) return;
      await fireMaintenanceRequestAction(id, "Set ACKNOWLEDGED");
      handleAlert('Action executed', 'success');
    },
  }), [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="MaintenanceRequest List"
        trail={[{ label: 'Tables' }, { label: 'MaintenanceRequest List', href: '/maintenancerequests', active: true }]}
        actions={[
          { label: 'Add MaintenanceRequest', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
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

      <MaintenanceRequestGrid
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
      <MaintenanceRequestViewModal
        maintenanceRequest={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

