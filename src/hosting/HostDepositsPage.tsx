import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, CreditCardIcon, HomeIcon, ShieldIcon } from "../components/Icons";
import {
  fetchHostSecurityDeposits,
  returnSecurityDeposit,
  sendSecurityDepositSettlementNotice,
  uploadSecurityDepositEvidence,
  type HostSecurityDeposit,
} from "../apis/useSecurityDeposit";
import { useAuth } from "../hooks/useAuth";
import HostingHeader from "./HostingHeader";
import "../marketplace/MarketplaceHome.css";
import "../pages/shared/TrustOperations.css";
import "./HostDepositsPage.css";

type DepositStatus = "Held" | "Return due" | "Review needed" | "Partially returned" | "Returned" | "Expected";
type DamageItem = {
  id: number;
  description: string;
  amount: string;
  fileName: string;
  evidenceAttachmentIDs: string[];
  uploading: boolean;
};

const money = (amount: number, currency = "CAD") =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(amount || 0);

const displayStatus = (status: string): DepositStatus => {
  const normalized = status.toLowerCase().replaceAll("_", " ").replaceAll("-", " ");
  if (normalized.includes("partial") && normalized.includes("return")) return "Partially returned";
  if (normalized.includes("returned") || normalized === "closed") return "Returned";
  if (normalized.includes("return") || normalized.includes("due")) return "Return due";
  if (normalized.includes("review") || normalized.includes("dispute")) return "Review needed";
  if (normalized.includes("expected")) return "Expected";
  return "Held";
};

const formatDepositDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

const getStoredIdempotencyKey = (keyName: string) => {
  try {
    const existing = localStorage.getItem(keyName);
    if (existing) return existing;
    const key = crypto.randomUUID();
    localStorage.setItem(keyName, key);
    return key;
  } catch {
    return crypto.randomUUID();
  }
};

const clearStoredIdempotencyKey = (keyName: string) => {
  try {
    localStorage.removeItem(keyName);
  } catch {
    // Idempotency remains enforced by the server for the duration of this request.
  }
};

const newDamageItem = (id: number): DamageItem => ({
  id,
  description: "",
  amount: "",
  fileName: "",
  evidenceAttachmentIDs: [],
  uploading: false,
});

export default function HostDepositsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const profile = currentUser?.user;
  const hostName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || currentUser?.name || "Host";
  const userID = profile?.id ?? profile?.userId;
  const [depositRecords, setDepositRecords] = useState<HostSecurityDeposit[]>([]);
  const [loadedForUserID, setLoadedForUserID] = useState<number | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [activeDepositID, setActiveDepositID] = useState<string | null>(null);
  const [damageItems, setDamageItems] = useState<DamageItem[]>([newDamageItem(1)]);
  const [busyAction, setBusyAction] = useState<"notice" | "return" | null>(null);
  const isLoading = userID !== undefined && loadedForUserID !== userID;

  const reloadDeposits = useCallback(async () => {
    const pageSize = 100;
    const firstPage = await fetchHostSecurityDeposits({ pageSize, pageNumber: 1 });
    const records = [...firstPage.data];
    for (let pageNumber = 2; records.length < firstPage.totalCount; pageNumber += 1) {
      const nextPage = await fetchHostSecurityDeposits({ pageSize, pageNumber });
      if (!nextPage.data.length) break;
      records.push(...nextPage.data);
    }
    setDepositRecords(records);
    setLoadError("");
  }, []);

  useEffect(() => {
    if (userID === undefined) return;
    let cancelled = false;
    void (async () => {
      try {
        await reloadDeposits();
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not load security deposits.");
      } finally {
        if (!cancelled) setLoadedForUserID(userID);
      }
    })();
    return () => { cancelled = true; };
  }, [reloadDeposits, userID]);

  const deposits = useMemo(() => depositRecords.map((record, index) => {
    const tenant = record.tenantDisplayName?.trim() || record.tenantEmail || "Tenant";
    const date = formatDepositDate(record.dueDate)
      ? `Due ${formatDepositDate(record.dueDate)}`
      : formatDepositDate(record.heldAt)
        ? `Held since ${formatDepositDate(record.heldAt)}`
        : "No due date";
    return {
      ...record,
      tenant,
      initials: tenant.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      property: record.listingDisplay || "Property",
      lease: record.leaseDisplay || `Lease ${record.leaseID || "not assigned"}`,
      amount: record.receivedAmount || record.requiredAmount,
      status: displayStatus(record.status || ""),
      date,
      color: ["teal", "coral", "sand"][index % 3],
    };
  }), [depositRecords]);

  const totalHeld = deposits.reduce((total, deposit) => total + deposit.heldAmount, 0);
  const returnsDue = deposits.filter((deposit) => ["Return due", "Partially returned"].includes(deposit.status));
  const reviewNeeded = deposits.filter((deposit) => deposit.status === "Review needed");
  const returnDueTotal = returnsDue.reduce((total, deposit) => total + deposit.heldAmount, 0);
  const activePropertyCount = new Set(deposits.map((deposit) => deposit.property)).size;
  const initials = hostName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const activeDeposit = deposits.find((deposit) => deposit.securityDepositID === activeDepositID);
  const repairTotal = damageItems.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const returnAmount = Math.max((activeDeposit?.heldAmount || 0) - repairTotal, 0);
  const balanceDue = Math.max(repairTotal - (activeDeposit?.heldAmount || 0), 0);
  const hasDocumentedRepairs = damageItems.length > 0 && damageItems.every((item) =>
    item.description.trim()
    && Number(item.amount) > 0
    && item.evidenceAttachmentIDs.length > 0
    && !item.uploading);
  const statusClass = (status: DepositStatus) =>
    status === "Held" || status === "Expected"
      ? "is-held"
      : status === "Return due" || status === "Partially returned" || status === "Returned"
        ? "is-return"
        : "is-review";

  const updateDamage = (id: number, patch: Partial<DamageItem>) =>
    setDamageItems((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));

  const openReview = (securityDepositID: string) => {
    setActiveDepositID(activeDepositID === securityDepositID ? null : securityDepositID);
    setDamageItems([newDamageItem(1)]);
    setActionError("");
    setActionMessage("");
  };

  const handleEvidenceUpload = async (itemID: number, file?: File) => {
    if (!file || !activeDeposit) return;
    const allowedType = ["image/jpeg", "image/png", "application/pdf"].includes(file.type);
    if (!allowedType || file.size > 10 * 1024 * 1024) {
      setActionError("Evidence must be a JPEG, PNG, or PDF no larger than 10 MB.");
      return;
    }
    updateDamage(itemID, { uploading: true });
    setActionError("");
    setActionMessage("");
    try {
      const uploaded = await uploadSecurityDepositEvidence(activeDeposit.securityDepositID, file);
      updateDamage(itemID, {
        fileName: uploaded.fileName,
        evidenceAttachmentIDs: [uploaded.attachmentID],
        uploading: false,
      });
      setActionMessage(`${uploaded.fileName} uploaded successfully.`);
    } catch (error) {
      updateDamage(itemID, { uploading: false });
      setActionError(error instanceof Error ? error.message : "We could not upload the evidence file.");
    }
  };

  const sendNotice = async () => {
    if (!activeDeposit || busyAction || !hasDocumentedRepairs) return;
    setBusyAction("notice");
    setActionError("");
    setActionMessage("");
    const deductions = damageItems.map((item) => ({
      description: item.description.trim(),
      amount: Number(item.amount),
      evidenceAttachmentIDs: item.evidenceAttachmentIDs,
    }));
    const idempotencyStorageKey = `arcora:deposit-notice:${activeDeposit.securityDepositID}`;
    try {
      const result = await sendSecurityDepositSettlementNotice(
        activeDeposit.securityDepositID,
        { deductions, currency: activeDeposit.currency || "CAD" },
        getStoredIdempotencyKey(idempotencyStorageKey),
      );
      clearStoredIdempotencyKey(idempotencyStorageKey);
      setActionMessage(
        `Settlement notice sent to ${result.recipientEmail || "the tenant"}. `
        + `${money(result.returnAmount ?? returnAmount, result.currency || activeDeposit.currency)} remains to return.`,
      );
      setDepositRecords((records) => records.map((record) => record.securityDepositID === activeDeposit.securityDepositID
        ? {
          ...record,
          appliedAmount: record.appliedAmount + result.deductionsTotal,
          heldAmount: Math.max(0, record.heldAmount - result.deductionsTotal),
          status: result.status,
        }
        : record));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "We could not send the settlement notice.");
    } finally {
      setBusyAction(null);
    }
  };

  const recordReturn = async () => {
    if (!activeDeposit || busyAction || activeDeposit.heldAmount <= 0) return;
    setBusyAction("return");
    setActionError("");
    setActionMessage("");
    const idempotencyStorageKey = `arcora:deposit-return:${activeDeposit.securityDepositID}:${activeDeposit.heldAmount}`;
    try {
      const result = await returnSecurityDeposit(activeDeposit.securityDepositID, {
        amount: activeDeposit.heldAmount,
        currency: activeDeposit.currency || "CAD",
        idempotencyKey: getStoredIdempotencyKey(idempotencyStorageKey),
      });
      clearStoredIdempotencyKey(idempotencyStorageKey);
      setActionMessage(
        `${money(activeDeposit.heldAmount, activeDeposit.currency)} was recorded as returned. `
        + "Issue the refund through your payment provider separately; this action records it in Arcora.",
      );
      setDepositRecords((records) => records.map((record) => record.securityDepositID === activeDeposit.securityDepositID
        ? {
          ...record,
          returnedAmount: result.returnedAmount,
          heldAmount: Math.max(0, record.receivedAmount - record.appliedAmount - result.returnedAmount),
          status: result.status,
          closedAt: result.status === "RETURNED" ? new Date().toISOString() : record.closedAt,
        }
        : record));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "We could not record the deposit return.");
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <main className="trust-ops-page host-deposits-page">
      <div className="marketplace host-deposits-header-context"><HostingHeader /></div>
      <header className="trust-ops-head host-deposits-head">
        <div><span className="trust-ops-kicker">Lease protection</span><h1>Security deposits</h1><p>Keep deposits, returns, and documented deductions organized for every tenancy.</p></div>
        <button className="trust-ops-back" type="button" onClick={() => navigate("/hosting")}>Hosting dashboard</button>
      </header>
      {loadError && <p className="hosting-editor-save-error" role="alert">{loadError}</p>}
      {isLoading && <p role="status">Loading security deposits...</p>}
      <section className="host-deposits-identity">
        <div className="host-deposits-avatar">{profile?.imageUrl ? <img src={profile.imageUrl} alt={`${hostName} profile`} /> : initials}</div>
        <div><span className="trust-ops-kicker">Deposit account</span><h2>{hostName}</h2><p>{activePropertyCount} active properties · Deposit activity is auditable</p>
          <div className="host-deposits-signals"><span><ShieldIcon /> Deposit activity is auditable</span><span><CheckIcon /> Tenant notices stay clear</span></div>
        </div>
        <div className="host-deposits-status"><strong>{reviewNeeded.length ? "Needs attention" : "In good standing"}</strong><span>Deposit account status</span></div>
      </section>
      <div className="host-deposits-summary">
        <article><span><CreditCardIcon /></span><div><small>Currently held</small><strong>{money(totalHeld)}</strong><em>Across {deposits.length} deposits</em></div></article>
        <article><span className="is-return"><HomeIcon /></span><div><small>Returns due</small><strong>{money(returnDueTotal)}</strong><em>{returnsDue.length} return{returnsDue.length === 1 ? "" : "s"} due</em></div></article>
        <article><span className="is-review"><ShieldIcon /></span><div><small>Needs review</small><strong>{reviewNeeded.length} deposit{reviewNeeded.length === 1 ? "" : "s"}</strong><em>{reviewNeeded.length ? "Move-out review required" : "No deposits need review"}</em></div></article>
      </div>
      <div className="host-deposits-layout">
        <section className="trust-ops-panel host-deposits-list-panel">
          <div className="host-deposits-section-head"><div><span className="trust-ops-kicker">Deposit activity</span><h2>Tenancy deposits</h2></div><span>{deposits.length} records</span></div>
          <div className="host-deposits-list">
            {!isLoading && !loadError && deposits.length === 0 && <p>No security deposit records were found for your organization.</p>}
            {deposits.map((deposit) => (
              <article className="host-deposit-row" key={deposit.securityDepositID}>
                <span className={`host-deposit-tenant ${deposit.color}`}>{deposit.initials || "T"}</span>
                <div><strong>{deposit.tenant}</strong><small>{deposit.property} · {deposit.lease}</small><em>{deposit.date}</em></div>
                <div><b>{money(deposit.amount, deposit.currency)}</b><span className={statusClass(deposit.status)}>{deposit.status}</span></div>
                <button type="button" onClick={() => openReview(deposit.securityDepositID)}>{activeDepositID === deposit.securityDepositID ? "Close" : "Review"}</button>
                {activeDepositID === deposit.securityDepositID && activeDeposit && (
                  <section className="host-deposit-detail">
                    <div className="host-deposit-detail-head">
                      <div><span className="trust-ops-kicker">Settlement workspace</span><strong>{activeDeposit.tenant}&apos;s deposit</strong><small>Amount currently held: {money(activeDeposit.heldAmount, activeDeposit.currency)} · {activeDeposit.property}</small></div>
                      <span><ShieldIcon /> Evidence required for deductions</span>
                    </div>
                    <p>Record tenant-caused damage only. Upload a repair quote or receipt for every proposed deduction. Sending the notice records the deductions and emails the tenant.</p>
                    {actionError && <p className="hosting-editor-save-error" role="alert">{actionError}</p>}
                    {actionMessage && <p className="host-deposit-dispute" role="status"><CheckIcon /> {actionMessage}</p>}
                    <div className="host-deposit-damages">
                      {damageItems.map((item, index) => (
                        <div className="host-deposit-damage" key={item.id}>
                          <label>Description<input value={item.description} onChange={(event) => updateDamage(item.id, { description: event.target.value })} placeholder={`Repair item ${index + 1}`} /></label>
                          <label>Repair cost<input type="number" min="0.01" step="0.01" value={item.amount} onChange={(event) => updateDamage(item.id, { amount: event.target.value })} placeholder="0.00" /></label>
                          <label className="host-deposit-evidence">Quote or receipt<input type="file" accept="image/jpeg,image/png,application/pdf" disabled={item.uploading || busyAction !== null} onChange={(event) => void handleEvidenceUpload(item.id, event.target.files?.[0])} /><span>{item.uploading ? "Uploading…" : item.fileName || "Upload evidence (PDF, PNG, JPEG · max 10 MB)"}</span></label>
                        </div>
                      ))}
                    </div>
                    <button className="host-deposit-add-item" type="button" onClick={() => setDamageItems((items) => [...items, newDamageItem(Date.now())])}>+ Add repair item</button>
                    <div className="host-deposit-settlement">
                      <div><span>Amount held</span><b>{money(activeDeposit.heldAmount, activeDeposit.currency)}</b></div>
                      <div><span>Proposed deductions</span><b className={repairTotal > 0 ? "is-deduction" : ""}>-{money(repairTotal, activeDeposit.currency)}</b></div>
                      <div className="host-deposit-outcome"><span>{balanceDue > 0 ? "Balance due from tenant" : "Return to tenant"}</span><b>{money(balanceDue > 0 ? balanceDue : returnAmount, activeDeposit.currency)}</b></div>
                    </div>
                    <small className="host-deposit-requirement">Each deduction needs a description, positive amount, and uploaded evidence.</small>
                    <div className="host-deposit-actions">
                      <button className="trust-ops-action secondary" type="button" disabled={!hasDocumentedRepairs || busyAction !== null} onClick={() => void sendNotice()}>
                        {busyAction === "notice" ? "Sending notice…" : "Send itemized notice"}
                      </button>
                      <button className="trust-ops-action" type="button" disabled={activeDeposit.heldAmount <= 0 || busyAction !== null} onClick={() => void recordReturn()}>
                        {busyAction === "return" ? "Recording…" : `Record return · ${money(activeDeposit.heldAmount, activeDeposit.currency)}`}
                      </button>
                    </div>
                    <small className="host-deposit-requirement">The return action records the return in Arcora. It does not send money through Stripe or another payment provider.</small>
                  </section>
                )}
              </article>
            ))}
          </div>
        </section>
        <aside className="host-deposits-side">
          <section className="trust-ops-panel host-deposits-guide"><span className="host-deposits-guide-icon"><ShieldIcon /></span><span className="trust-ops-kicker">Return workflow</span><h2>Make every decision clear</h2><p>Deposit decisions should be supported by evidence and communicated promptly to your tenant.</p><div className="host-deposits-steps"><span><b>1</b> Review move-out condition</span><span><b>2</b> Document any proposed deduction</span><span><b>3</b> Send a return or deduction notice</span></div></section>
          <section className="host-deposits-notice"><CheckIcon /><div><strong>Tenant-first recordkeeping</strong><span>Keep receipts, photos, and notes with each deposit decision for a transparent resolution.</span></div></section>
        </aside>
      </div>
    </main>
  );
}
