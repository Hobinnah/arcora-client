{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import InspectionGrid from '../../grids/InspectionGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteInspection, fetchInspections, fireInspectionAction } from '../../apis/useInspection';
import { env, type AlertType } from '../../env';
import type { Inspection } from '../../types/Inspection';
import InspectionViewModal from './InspectionViewModal.tsx';

export default function InspectionList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [showActionDropdown, setShowActionDropdown] = React.useState(true);
  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Inspection | null>(null);

  const handleAdd = () => {
    navigate('/inspections/new');
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
      const exportData = await fetchInspections({ pageSize: 1000, pageNumber: 0, sortBy: 'inspectionType', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `inspections-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: Inspection[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (k: string, v: any) => {
      try {
        if (!v) return '';
        switch (k) {
          case 'scheduledFor': return new Date(v as any).toLocaleDateString();
          case 'startedAt': return new Date(v as any).toLocaleDateString();
          case 'completedAt': return new Date(v as any).toLocaleDateString();
          default: return v;
        }
      } catch { return v; }
    };
    const headers = ["Inspection Type", "Status", "Scheduled For", "Started At", "Completed At"];
    const keys = ["inspectionType", "status", "scheduledFor", "startedAt", "completedAt"];
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

  const handleView = useCallback((row: Inspection) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: Inspection) => {
    const id = (row as any)?.inspectionID;
    if (id === undefined || id === null) return;
    navigate(`/inspections/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: Inspection, setItems: React.Dispatch<React.SetStateAction<Inspection[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.inspectionID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteInspection(id);
        setItems(prev => prev.filter(x => (x as any)?.inspectionID !== id));
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
    "set-in-progress": async (row: any) => {
      const id = row?.inspectionID;
      if (id === undefined || id === null) return;
      await fireInspectionAction(id, "Set IN_PROGRESS");
      handleAlert('Action executed', 'success');
    },
  }), [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="Inspection List"
        trail={[{ label: 'Tables' }, { label: 'Inspection List', href: '/inspections', active: true }]}
        actions={[
          { label: 'Add Inspection', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
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

      <InspectionGrid
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
      <InspectionViewModal
        inspection={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

