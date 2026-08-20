{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../themes/theme.css';
import useCustomTooltips from '../../hooks/useCustomTooltips';
import InvoiceMasterGrid from '../../grids/InvoiceMasterGrid.tsx';
import BreadCrum  from '../../components/BreadCrum';
import MasterLayout from '../../components/MasterLayout';
import Alert from '../../components/Alert';
import { PlusIcon, DownloadIcon } from '../../components/Icons';
import { deleteInvoiceMaster, fetchInvoiceMasters, fireInvoiceMasterAction } from '../../apis/useInvoiceMaster';
import { env, type AlertType } from '../../env';
import type { InvoiceMaster } from '../../types/InvoiceMaster';
import InvoiceMasterViewModal from './InvoiceMasterViewModal.tsx';

export default function InvoiceMasterList() {
  useCustomTooltips();
  const navigate = useNavigate();

  const [showActionDropdown, setShowActionDropdown] = React.useState(true);
  const [alerts, setAlerts] = React.useState<{ message: string; type: AlertType; id: number }[]>([]);
  const [viewModalOpen, setViewModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<InvoiceMaster | null>(null);

  const handleAdd = () => {
    navigate('/invoicemasters/new');
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
      const exportData = await fetchInvoiceMasters({ pageSize: 1000, pageNumber: 0, sortBy: 'invoiceNumber', sortDirection: 'desc' });
      const csvContent = convertToCSV(exportData.data);
      downloadCSV(csvContent, `invoicemasters-export-${new Date().toISOString().split('T')[0]}.csv`);
      handleAlert(`Successfully exported ${exportData.data.length} records!`, 'success');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Export failed';
      handleAlert(msg, 'error');
      console.error('Export error:', error);
    }
  };

  const convertToCSV = (rows: InvoiceMaster[]): string => {
    if (!rows || rows.length === 0) return 'No data to export';
    const esc = (v: any) => String(v ?? '').replace(/"/g, '""');
    const fmt = (k: string, v: any) => {
      try {
        if (!v) return '';
        switch (k) {
          case 'billingPeriodStart': return new Date(v as any).toLocaleDateString();
          case 'billingPeriodEnd': return new Date(v as any).toLocaleDateString();
          case 'dueDate': return new Date(v as any).toLocaleDateString();
          case 'issuedAt': return new Date(v as any).toLocaleDateString();
          case 'paidAt': return new Date(v as any).toLocaleDateString();
          case 'voidedAt': return new Date(v as any).toLocaleDateString();
          case 'capturedDate': return new Date(v as any).toLocaleDateString();
          case 'updatedDate': return new Date(v as any).toLocaleDateString();
          default: return v;
        }
      } catch { return v; }
    };
    const headers = ["Invoice Number", "Billing Period Start", "Billing Period End", "Due Date", "Subtotal Amount", "Tax Amount", "Discount Amount", "Late Fee Amount", "Adjustment Amount", "Total Amount", "Amount Paid", "Balance Due", "Currency", "Status", "Issued At", "Paid At", "Voided At", "Captured Date", "Captured By", "Updated Date", "Updated By"];
    const keys = ["invoiceNumber", "billingPeriodStart", "billingPeriodEnd", "dueDate", "subtotalAmount", "taxAmount", "discountAmount", "lateFeeAmount", "adjustmentAmount", "totalAmount", "amountPaid", "balanceDue", "currency", "status", "issuedAt", "paidAt", "voidedAt", "capturedDate", "capturedBy", "updatedDate", "updatedBy"];
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

  const handleView = useCallback((row: InvoiceMaster) => {
    setSelected(row);
    setViewModalOpen(true);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewModalOpen(false);
    setSelected(null);
  }, []);

  const handleEdit = useCallback((row: InvoiceMaster) => {
    const id = (row as any)?.invoiceMasterID;
    if (id === undefined || id === null) return;
    navigate(`/invoicemasters/${id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (row: InvoiceMaster, setItems: React.Dispatch<React.SetStateAction<InvoiceMaster[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => {
    const id = (row as any)?.invoiceMasterID;
    if (id === undefined || id === null) return;
    if (confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        await deleteInvoiceMaster(id);
        setItems(prev => prev.filter(x => (x as any)?.invoiceMasterID !== id));
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
    "mark-as-paid": async (row: any) => {
      const id = row?.invoiceMasterID;
      if (id === undefined || id === null) return;
      await fireInvoiceMasterAction(id, "Mark as Paid");
      handleAlert('Action executed', 'success');
    },
    "void-invoice": async (row: any) => {
      const id = row?.invoiceMasterID;
      if (id === undefined || id === null) return;
      await fireInvoiceMasterAction(id, "Void Invoice");
      handleAlert('Action executed', 'success');
    },
  }), [handleAlert]);

  const pageContent = React.useMemo(() => [
    <div key="list-content">
      <BreadCrum
        title="InvoiceMaster List"
        trail={[{ label: 'Tables' }, { label: 'InvoiceMaster List', href: '/invoicemasters', active: true }]}
        actions={[
          { label: 'Add InvoiceMaster', variant: 'soft', onClick: handleAdd, icon: <PlusIcon /> },
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

      <InvoiceMasterGrid
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
      <InvoiceMasterViewModal
        invoiceMaster={selected}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}

