{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { SortIcon, PencilIcon, TrashIcon, EyeIcon } from '../components/Icons';
import { fetchTenantInvitations } from '../apis/useTenantInvitation';
import type { TenantInvitation } from '../types/TenantInvitation';
import { env, type AlertType } from '../env';

export interface ActionItem {
  label: string;
  onClick: (record: any) => Promise<void> | void;
  condition?: (record: any) => boolean;
  variant?: 'default' | 'danger' | 'warning';
}

export interface TenantInvitationGridProps {
  initialPageSize?: number; // default: 5
  onView?: (r: TenantInvitation)=>void;
  onEdit?: (r: TenantInvitation)=>void;
  onDelete?: (r: TenantInvitation, setItems: React.Dispatch<React.SetStateAction<TenantInvitation[]>>, setError: React.Dispatch<React.SetStateAction<string | null>>) => Promise<void>;
  onAlert?: (message: string, type: AlertType) => void;
  actionHandlers?: Record<string, (record: any) => Promise<void> | void>;
  showActionDropdown?: boolean;
  actionItems?: ActionItem[]; // Do NOT include 'View' here; it's provided by default
  onAction?: (key: string, record: any) => Promise<void> | void;
}

const TenantInvitationGrid: React.FC<TenantInvitationGridProps> = ({
  initialPageSize = 5,
  onView,
  onEdit,
  onDelete,
  onAlert,
  actionHandlers,
  showActionDropdown = false,
  actionItems = [],
  onAction,
}) => {

  const columns = [
    { key: "invitationPurpose", label: "Invitation Purpose" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "status", label: "Status" },
    { key: "expiresAt", label: "Expires At" },
    { key: "acceptedAt", label: "Accepted At" },
    { key: "revokedAt", label: "Revoked At" },
    { key: "capturedBy", label: "Captured By" },
    { key: "capturedDate", label: "Captured Date" },
  ] as const;

  const [items, setItems] = useState<TenantInvitation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [pageSize, setPageSize] = useState(initialPageSize); // default 5
  const [page, setPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{[key: string]: {top?: string, bottom?: string}}>({});
  const [visible] = useState<Record<string, boolean>>({});

  const [status, set_status] = useState<string>('');

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const params: any = env.SEARCH_STRATEGY === 'server' ? {
        pageSize, pageNumber: page - 1,
        searchQuery: query || undefined,
        sortBy: sort?.key || undefined,
        sortDirection: sort?.dir || undefined,
        status: status || undefined,
      } : {
        // client-side fetch: still respect the selected pageSize; pagination happens locally
        pageSize: 1000,
        pageNumber: 0
      };

      const result = await fetchTenantInvitations(params);
      if (!result || !Array.isArray(result.data)) {
        console.error('Invalid API response structure:', result);
        throw new Error('Invalid data structure received from API');
      }
      setItems(result.data || []);
      setTotalCount(result.totalCount || 0);
    } catch (err: any) {
      const msg = err?.message ?? 'Failed to load records';
      console.error('Grid load error:', err);
      setError(msg); onAlert?.(msg, 'error'); setItems([]); setTotalCount(0);
    } finally { setLoading(false); }
  }, env.SEARCH_STRATEGY === 'server'
    ? [pageSize, page, query, sort, status, onAlert]
    : [pageSize, onAlert]
  );

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (env.SEARCH_STRATEGY === 'server') return items;
    if ( !query && !sort && status === '') return items;

    let res = items.filter((r: TenantInvitation) => {
      const s = (String((r as any)?.invitationPurpose ?? '') + ' ' + String((r as any)?.email ?? '') + ' ' + String((r as any)?.phoneNumber ?? '') + ' ' + String((r as any)?.status ?? '') + ' ' + String((r as any)?.expiresAt ?? '') + ' ' + String((r as any)?.acceptedAt ?? '') + ' ' + String((r as any)?.revokedAt ?? '') + ' ' + String((r as any)?.capturedBy ?? '') + ' ' + String((r as any)?.capturedDate ?? '')).toLowerCase();
      const matchesSearch = !query || s.includes(query.toLowerCase());
      const match_status = !status || String((r as any)?.status ?? '') === status;
      return matchesSearch && match_status;
    });
    if (sort) {
      const { key, dir } = sort;
      res = [...res].sort((a: any, b: any) => String(a?.[key]).localeCompare(String(b?.[key]), undefined, { numeric: true }));
      if (dir === 'desc') res.reverse();
    }
    return res;
  }, [items, query, sort, status]);

  const filteredCount = env.SEARCH_STRATEGY === 'server' ? totalCount : filtered.length;
  const pages = Math.max(1, Math.ceil(filteredCount / pageSize));
  const start = (page - 1) * pageSize;
  const current = env.SEARCH_STRATEGY === 'server' ? filtered : filtered.slice(start, start + pageSize);

  useEffect(() => { if (query || sort || status) setPage(1); }, [query, sort, status]);
  useEffect(() => { setPage(1); }, [pageSize]);

  useEffect(() => {
    const close = () => { setActiveDropdown(null); setDropdownPosition({}); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleView = (r:any) => {
    if (onView) onView(r);
    else alert('view functionality not implemented');
  };

  const handleEdit = (r:any) => {
    if (onEdit) onEdit(r);
    else alert('Edit functionality not implemented');
  };

  const handleDelete = async (row: TenantInvitation) => {
    if (onDelete) await onDelete(row, setItems, setError);
    else alert('Delete functionality not implemented');
  };

  const defaultActionItems: ActionItem[] = useMemo(() => (
    [{ label: 'View', onClick: handleView }]
  ), [handleView]);

  const customActionItems = useMemo(() => (
    (actionItems || []).filter(a => String(a?.label || '').toLowerCase() !== 'view')
  ), [actionItems]);

  const actions = useMemo(() => [
    {
      key: "accept-invitation",
      label: "Accept Invitation",
      variant: "default",
      values: ["PENDING"],
      api: {
        method: "POST",
        pathTemplate: "api/tenantinvitation/updateTenantInvitationStatus/{TenantInvitationID}",
        queryTemplate: {  },
        headers: {  },
        bodyTemplate: null,
        useFormData: false,
        requiresConfirm: true,
        params: [ { name: "TenantInvitationID", type: "string", required: true, source: "record", options: [] }, { name: "Status", type: "string", required: true, source: "constant", default: "ACCEPTED", options: [] } ]
      }
    },
    {
      key: "revoke-invitation",
      label: "Revoke Invitation",
      variant: "danger",
      values: ["PENDING"],
      api: {
        method: "POST",
        pathTemplate: "api/tenantinvitation/updateTenantInvitationStatus/{TenantInvitationID}",
        queryTemplate: {  },
        headers: {  },
        bodyTemplate: null,
        useFormData: false,
        requiresConfirm: true,
        params: [ { name: "TenantInvitationID", type: "string", required: true, source: "record", options: [] }, { name: "Status", type: "string", required: true, source: "constant", default: "REVOKED", options: [] } ]
      }
    },
  ], []);

  function isActionVisible(action: any, row: any) {
    if (!action.values || action.values.length === 0) return true;
    const v = String(row?.status ?? '');
    return action.values.includes(v);
  }

  function camel(s:string){ return s ? s[0].toLowerCase() + s.slice(1) : s; }
  function pascal(s:string){ return s ? s[0].toUpperCase() + s.slice(1) : s; }
  function getField(row:any, name:string){ return row?.[name] ?? row?.[camel(name)] ?? row?.[pascal(name)]; }
  function fillTokens(template:string, values:Record<string,any>):string {
    if (!template) return ''; let out = template;
    out = out.replace(/\{env:([a-zA-Z0-9_]+)\}/g, (_,k)=> String((env as any)[k] ?? ''));
    out = out.replace(/\{now:(iso|unix)\}/g, (_,fmt)=> fmt==='unix' ? String(Math.floor(Date.now()/1000)) : new Date().toISOString());
    out = out.replace(/\{([a-zA-Z0-9_]+)\}/g, (_,k)=> values[k] !== undefined && values[k] !== null ? String(values[k]) : '');
    return out;
  }

  async function resolveParams(spec:any, row:any):Promise<Record<string,any>>{
    const vals: Record<string,any> = {};
    for (const p of (spec?.params ?? [])) {
      const name = p.name;
      let v: any = undefined;
      switch ((p.source||'record')) {
        case 'record': v = getField(row, name); break;
        case 'constant': v = p.default ?? ''; break;
        case 'env': v = (env as any)[p.default || name]; break;
        case 'now': v = p.default==='unix' ? Math.floor(Date.now()/1000) : new Date().toISOString(); break;
        case 'user': {
          const promptLabel = p.label || name;
          v = window.prompt(promptLabel, p.default || '');
        } break;
      }
      if (p.required && (v === undefined || v === null || v === '')) throw new Error(`${name} is required`);
      vals[name] = v;
    }
    return vals;
  }

  function toQuery(q:any, values:Record<string,any>):string{
    if (!q || Object.keys(q).length===0) return '';
    const usp = new URLSearchParams();
    for (const [k,v] of Object.entries(q)) { const s = fillTokens(String(v), values); if (s !== '') usp.append(k, s); }
    const t = usp.toString(); return t ? `?${t}` : '';
  }

  function toHeaders(h:any, values:Record<string,any>):Record<string,string>{
    const out: Record<string,string> = {}; if (!h) return out;
    for (const [k,v] of Object.entries(h)) out[k] = fillTokens(String(v), values);
    return out;
  }

  function toFormData(spec:any, values:Record<string,any>):FormData{
    const fd = new FormData();
    for (const p of (spec?.params ?? [])) { if (values[p.name] !== undefined) fd.append(p.name, values[p.name]); }
    return fd;
  }

  async function runAction(api:any, row:any){
    const vals = await resolveParams(api, row);
    const url = fillTokens(api.pathTemplate || '', vals) + toQuery(api.queryTemplate, vals);
    const headers = toHeaders(api.headers, vals);
    const method = (api.method || 'POST').toUpperCase();
    if (api.requiresConfirm && !window.confirm('Proceed?')) return;
    let init: RequestInit = { method, headers };
    if (method !== 'GET' && method !== 'DELETE'){
      if (api.useFormData){
        const fd = toFormData(api, vals);
        init.body = fd;
      } else {
        const s = api.bodyTemplate ? fillTokens(api.bodyTemplate, vals) : ''; 
        init.headers = { 'Content-Type': 'application/json', ...headers };
        // If no body template, send non-path params as JSON body
        if (!s) {
          const pathKeys = new Set((api.pathTemplate || '').match(/\{([^}]+)\}/g)?.map((t:string) => t.slice(1,-1)) || []);
          const bodyVals: Record<string,any> = {};
          for (const [k,v] of Object.entries(vals)) { if (!pathKeys.has(k)) bodyVals[k] = v; }
          init.body = Object.keys(bodyVals).length > 0 ? JSON.stringify(bodyVals) : undefined;
        } else {
          init.body = s || undefined;
        }
      }
    }
    const res = await fetch(url, init);
    if (!res.ok) throw new Error('Action failed');
  }

  function getQualifyingActions(record: any) {
    const base = (defaultActionItems || []).filter(a => !a?.condition || a.condition(record));
    const extras = (customActionItems || []).filter(a => !a?.condition || a.condition(record));
    const generated = (actions || []).filter((a:any) => isActionVisible(a, record)).map((a:any) => ({
      label: a.label, variant: a.variant,
      onClick: async (row:any) => {
        try {
          if (actionHandlers?.[a.key]) await actionHandlers[a.key](row);
          else if (onAction) await onAction(a.key, row);
          else await runAction(a.api, row);
          await load();
        } catch (e:any) { onAlert?.(e?.message ?? 'Action failed', 'error'); }
      }
    }));
    const combined = [...base, ...extras, ...generated];
    const seen = new Set<string>();
    return combined.filter(a => {
      const k = String(a?.label || '').toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  const toggleDropdown = (recordId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (activeDropdown === recordId) { setActiveDropdown(null); setDropdownPosition({}); return; }
    const buttonElement = e.currentTarget as HTMLElement;
    const buttonRect = buttonElement.getBoundingClientRect();
    const container = buttonElement.closest('.table-wrap') || buttonElement.closest('section');
    const containerRect = container?.getBoundingClientRect() || { bottom: window.innerHeight } as DOMRect;
    const record = (items || []).find(r => String((r as any)?.tenantInvitationID) === recordId);
    const actions = record ? getQualifyingActions(record) : [];
    const estimatedDropdownHeight = actions.length * 40 + 8;
    const spaceBelow = (containerRect.bottom as number) - buttonRect.bottom;
    const shouldOpenUpward = spaceBelow < estimatedDropdownHeight && buttonRect.top > estimatedDropdownHeight;
    setDropdownPosition({ [recordId]: shouldOpenUpward ? { bottom: '100%' } : { top: '100%' } });
    setActiveDropdown(recordId);
  };

  return (
    <section className="card container">
      <div className="card-header">
        <div className="datatable-controls">
          <label className="show">Show
            <select className="select" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[5, 10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            entries
          </label>
          {env.NODE_ENV === 'development' && (
            <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: env.SEARCH_STRATEGY === 'server' ? '#e0f2fe' : '#fff3e0', color: env.SEARCH_STRATEGY === 'server' ? '#0277bd' : '#ef6c00', borderRadius: '4px', fontWeight: 500 }}>{env.SEARCH_STRATEGY.toUpperCase()} SEARCH</span>
          )}
          <div className="spacer" />
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
            <span>Status</span>
            <select className="select" value={ status } onChange={(e) => set_status(e.target.value)}>
              <option value="">All</option>
              <option value="PENDING">PENDING</option>
              <option value="ACCEPTED">ACCEPTED</option>
              <option value="REVOKED">REVOKED</option>
            </select>
          </label>
          <input className="input" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading && (<div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>)}
      {error && !loading && (<div style={{ padding: '20px', textAlign: 'center', color: 'var(--danger-color, #dc2626)' }}>Error: {error}</div>)}

      {!loading && !error && (
        <div className="table-wrap" style={{ overflow: 'visible' }}>
          <table className="table">
            <thead>
              <tr>
                {columns.map(c => (visible[c.key] ?? true) && (
                  <th key={c.key} onClick={() => setSort(s => s?.key === c.key ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' })}>
                    {c.label} {sort?.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : <SortIcon />}
                  </th>
                ))}
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                    {totalCount === 0 ? 'No entries available' : 'Loading...'}
                  </td>
                </tr>
              ) : (
                current.map(r => r && (
                  <tr key={r?.tenantInvitationID ?? Math.random()}>
                    <td>{String(r?.invitationPurpose ?? '-')}</td>
                    <td>{String(r?.email ?? '-')}</td>
                    <td>{String(r?.phoneNumber ?? '-')}</td>
                    <td>{String(r?.status ?? '-')}</td>
                    <td>{r?.expiresAt ? new Date(r?.expiresAt as any).toLocaleDateString() : '-'}</td>
                    <td>{r?.acceptedAt ? new Date(r?.acceptedAt as any).toLocaleDateString() : '-'}</td>
                    <td>{r?.revokedAt ? new Date(r?.revokedAt as any).toLocaleDateString() : '-'}</td>
                    <td>{String(r?.capturedBy ?? '-')}</td>
                    <td>{r?.capturedDate ? new Date(r?.capturedDate as any).toLocaleDateString() : '-'}</td>
                    <td className="td-actions">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
                        <button className="icon-link" title="View Details" onClick={() => handleView(r)} style={{ color: 'var(--primary, #6366f1)' }}><EyeIcon/></button>
                        <button className="icon-link" title="Edit" onClick={() => handleEdit(r)} style={{ color: 'currentColor' }}><PencilIcon/></button>
                        <button className="icon-link danger" title="Delete" onClick={() => handleDelete(r)} style={{ color: 'var(--danger-color, #dc2626)' }}><TrashIcon/></button>
                        {showActionDropdown && getQualifyingActions(r).length > 0 && (
                          <>
                            <button
                              className="icon-link"
                              title="More actions"
                              onClick={(e) => toggleDropdown(String(r?.tenantInvitationID ?? ''), e)}
                              style={{ fontSize: '14px', padding: '4px 8px', color: 'currentColor' }}
                            >⋮</button>
                            {activeDropdown === String(r?.tenantInvitationID ?? '') && (
                              <div style={{
                                position: 'absolute',
                                ...(dropdownPosition[String(r?.tenantInvitationID ?? '')] || {}),
                                right: 0,
                                backgroundColor: 'var(--card-bg, white)',
                                border: '1px solid var(--border-color, #e5e7eb)',
                                borderRadius: '6px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                                zIndex: 1000,
                                minWidth: '160px',
                                padding: '4px 0',
                                display: 'flex',
                                flexDirection: 'column'
                              }}>
                                {getQualifyingActions(r).map((action, index) => (
                                  <button
                                    key={index}
                                    className={`dropdown-item ${action.variant === 'danger' ? 'danger' : action.variant === 'warning' ? 'warning' : ''}`}
                                    onClick={async () => { await action.onClick(r); setActiveDropdown(null); }}
                                    style={{
                                      width: '100%', padding: '8px 12px', border: 'none', background: 'transparent',
                                      textAlign: 'left', cursor: 'pointer', fontSize: '14px', display: 'block', whiteSpace: 'nowrap',
                                      color: action.variant === 'danger' ? 'var(--danger-color, #dc2626)' : action.variant === 'warning' ? 'var(--warning-color, #d97706)' : '#1f2937',
                                      fontWeight: '500'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = action.variant === 'danger' ? 'var(--danger-bg-hover, rgba(220, 38, 38, 0.1))' : action.variant === 'warning' ? 'var(--warning-bg-hover, rgba(217, 119, 6, 0.1))' : '#f3f4f6';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >{action.label}</button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredCount > 0 && (
        <div className="card-footer">
          <div className="muted">
            {filteredCount === 0
              ? 'No entries found'
              : env.SEARCH_STRATEGY === 'server'
                ? `Showing ${start + 1} to ${Math.min(start + items.length, totalCount)} of ${totalCount} entries`
                : `Showing ${start + 1} to ${Math.min(start + current.length, filteredCount)} of ${filteredCount} entries${filteredCount !== totalCount ? ` (filtered from ${totalCount} total)` : ''}`
            }
          </div>
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
            {Array.from({ length: pages }).slice(0, 6).map((_, i) => (
              <button key={i} className={`page-btn ${page === i + 1 ? 'is-active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => Math.min(pages, p + 1))}>Next</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TenantInvitationGrid;
