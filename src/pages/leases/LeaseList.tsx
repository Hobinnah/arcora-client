{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import LeaseGrid from '../../grids/LeaseGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteLease, fetchLeases, fireLeaseAction } from '../../apis/useLease';
import { env, type AlertType } from '../../env';
import type { Lease } from '../../types/Lease';
import LeaseViewModal from './LeaseViewModal.tsx';

export default function LeaseList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [showActionDropdown, setShowActionDropdown] = React.useState(true);
  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Lease | null>(null);

  const handleAdd = () => {
    navigate('/leases/new');
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
      const exportData = await fetchLeases({ pageSize: 1000, pageNumber: 0, sortBy: 'organizationID', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `leases-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: Lease[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (k: string, v: any) => {
      try {
        if (!v) return '';
        switch (k) {
          case 'startDate': return new Date(v as any).toLocaleDateString();
          case 'endDate': return new Date(v as any).toLocaleDateString();
          case 'signedAt': return new Date(v as any).toLocaleDateString();
          case 'activatedAt': return new Date(v as any).toLocaleDateString();
          case 'actualMoveInAt': return new Date(v as any).toLocaleDateString();
          case 'actualMoveOutAt': return new Date(v as any).toLocaleDateString();
          case 'terminatedAt': return new Date(v as any).toLocaleDateString();
          case 'capturedDate': return new Date(v as any).toLocaleDateString();
          case 'updatedDate': return new Date(v as any).toLocaleDateString();
          default: return v;
        }
      } catch { return v; }
    };
    const headers = ["Organization", "Listing", "Rental Unit", "Tenancy Type", "Tenant", "Rental Application", "Lease Code", "Lease Number", "Status", "Start Date", "End Date", "Lease Term Months", "Base Rent Amount", "Currency", "Grace Period Days", "Late Fee Fixed Amount", "Late Fee Percentage", "Auto Renew", "Renewal Notice Days", "Signed At", "Activated At", "Actual Move In At", "Actual Move Out At", "Terminated At", "Termination Reason", "Captured Date", "Captured By", "Updated Date", "Updated By"];
    const keys = ["organizationID", "listingID", "rentalUnitID", "tenancyTypeID", "tenantID", "rentalApplicationID", "leaseCode", "leaseNumber", "status", "startDate", "endDate", "leaseTermMonths", "baseRentAmount", "currency", "gracePeriodDays", "lateFeeFixedAmount", "lateFeePercentage", "autoRenew", "renewalNoticeDays", "signedAt", "activatedAt", "actualMoveInAt", "actualMoveOutAt", "terminatedAt", "terminationReason", "capturedDate", "capturedBy", "updatedDate", "updatedBy"];
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

  const handleView = useCallback((row: Lease) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: Lease) => {
    const id = (row as any)?.leaseID;
    if (id === undefined || id === null) return;
    navigate(`/leases/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: Lease, setItems: React.Dispatch<React.SetStateAction<Lease[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.leaseID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteLease(id);
        setItems(prev => prev.filter(x => (x as any)?.leaseID !== id));
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
    "set-pending-signature": async (row: any) => {
      const id = row?.leaseID;
      if (id === undefined || id === null) return;
      await fireLeaseAction(id, "Set PENDING_SIGNATURE");
      handleAlert('Action executed', 'success');
    },
  }), [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="Lease List"
        trail={[{ label: 'Tables' }, { label: 'Lease List', href: '/leases', active: true }]}
        actions={[
          { label: 'Add Lease', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
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

      <LeaseGrid
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
      <LeaseViewModal
        lease={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

