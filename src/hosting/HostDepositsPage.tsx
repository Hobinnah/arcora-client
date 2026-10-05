import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, CreditCardIcon, HomeIcon, ShieldIcon } from "../components/Icons";
import { fetchSecurityDeposits } from "../apis/useSecurityDeposit";
import type { SecurityDeposit } from "../types/SecurityDeposit";
import { useAuth } from "../hooks/useAuth";
import HostingHeader from "./HostingHeader";
import "../marketplace/MarketplaceHome.css";
import "../pages/shared/TrustOperations.css";
import "./HostDepositsPage.css";

type DepositStatus = "Held" | "Return due" | "Review needed" | "Partially returned" | "Returned";
type Deposit = { tenant: string; initials: string; property: string; lease: string; amount: number; heldAmount: number; status: DepositStatus; date: string; color: string };
type DamageItem = { id: number; description: string; amount: string; evidence: string };
const money = (amount: number) => `CAD $${amount.toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;
const displayStatus = (status: string): DepositStatus => {
  const normalized = status.toLowerCase().replaceAll("_", " ").replaceAll("-", " ");
  if (normalized.includes("partial") && normalized.includes("return")) return "Partially returned";
  if (normalized.includes("returned") || normalized === "closed") return "Returned";
  if (normalized.includes("return") || normalized.includes("due")) return "Return due";
  if (normalized.includes("review") || normalized.includes("dispute")) return "Review needed";
  return "Held";
};
const formatDepositDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function HostDepositsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const profile = currentUser?.user;
  const hostName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || currentUser?.name || "Amara Cole";
  const userID = profile?.id ?? profile?.userId;
  const [depositRecords, setDepositRecords] = useState<SecurityDeposit[]>([]);
  const [loadedForUserID, setLoadedForUserID] = useState<number | null>(null);
  const [loadError, setLoadError] = useState("");
  const [activeLease, setActiveLease] = useState<string | null>(null);
  const [damageItems, setDamageItems] = useState<DamageItem[]>([{ id: 1, description: "", amount: "", evidence: "" }]);
  const [noticeSent, setNoticeSent] = useState<string[]>([]);
  const [returned, setReturned] = useState<string[]>([]);
  const isLoading = userID !== undefined && loadedForUserID !== userID;
  const deposits = (loadedForUserID === userID ? depositRecords : []).map((record, index): Deposit => {
    const tenantUser = record.tenant?.user ?? record.lease?.tenant?.user;
    const tenant = `${tenantUser?.firstName || ""} ${tenantUser?.lastName || ""}`.trim() || "Tenant";
    const heldAmount = Math.max(record.receivedAmount - record.appliedAmount - record.returnedAmount, 0);
    const status = displayStatus(record.status || "");
    const date = formatDepositDate(record.dueDate)
      ? `Due ${formatDepositDate(record.dueDate)}`
      : formatDepositDate(record.heldAt)
        ? `Held since ${formatDepositDate(record.heldAt)}`
        : "No due date";
    return {
      tenant,
      initials: tenant.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      property: record.lease?.listing?.title || "Property",
      lease: record.lease?.leaseCode || record.lease?.leaseNumber || `Lease ${record.leaseID}`,
      amount: record.receivedAmount || record.requiredAmount,
      heldAmount,
      status,
      date,
      color: ["teal", "coral", "sand"][index % 3],
    };
  });
  const totalHeld = deposits.reduce((total, deposit) => total + deposit.heldAmount, 0);
  const returnsDue = deposits.filter((deposit) => deposit.status === "Return due");
  const reviewNeeded = deposits.filter((deposit) => deposit.status === "Review needed");
  const returnDueTotal = returnsDue.reduce((total, deposit) => total + deposit.heldAmount, 0);
  const activePropertyCount = new Set(deposits.map((deposit) => deposit.property)).size;
  const initials = hostName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const activeDeposit = deposits.find((deposit) => deposit.lease === activeLease);
  const repairTotal = damageItems.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const returnAmount = Math.max((activeDeposit?.amount || 0) - repairTotal, 0);
  const balanceDue = Math.max(repairTotal - (activeDeposit?.amount || 0), 0);
  const hasDocumentedRepairs = damageItems.length > 0 && damageItems.every((item) => item.description.trim() && Number(item.amount) > 0 && item.evidence);
  const statusClass = (status: DepositStatus) => status === "Held" ? "is-held" : status === "Return due" || status === "Partially returned" || status === "Returned" ? "is-return" : "is-review";
  const updateDamage = (id: number, patch: Partial<DamageItem>) => setDamageItems((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  const openReview = (lease: string) => { setActiveLease(activeLease === lease ? null : lease); setDamageItems([{ id: 1, description: "", amount: "", evidence: "" }]); };

  useEffect(() => {
    if (userID === undefined) return;
    let cancelled = false;
    void (async () => {
      try {
        const pageSize = 100;
        const firstPage = await fetchSecurityDeposits({ pageSize, pageNumber: 0, userID });
        const records = [...firstPage.data];
        for (let pageNumber = 1; records.length < firstPage.totalCount; pageNumber += 1) {
          const nextPage = await fetchSecurityDeposits({ pageSize, pageNumber, userID });
          if (!nextPage.data.length) break;
          records.push(...nextPage.data);
        }
        if (!cancelled) {
          setDepositRecords(records);
          setLoadError("");
        }
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not load security deposits.");
      } finally {
        if (!cancelled) setLoadedForUserID(userID);
      }
    })();
    return () => { cancelled = true; };
  }, [userID]);

  return <main className="trust-ops-page host-deposits-page">
    <div className="marketplace host-deposits-header-context"><HostingHeader /></div>
    <header className="trust-ops-head host-deposits-head"><div><span className="trust-ops-kicker">Lease protection</span><h1>Security deposits</h1><p>Keep deposits, returns, and documented deductions organized for every tenancy.</p></div><button className="trust-ops-back" type="button" onClick={() => navigate("/hosting")}>Hosting dashboard</button></header>
    {loadError && <p className="hosting-editor-save-error" role="alert">{loadError}</p>}
    {isLoading && <p role="status">Loading security deposits...</p>}
    <section className="host-deposits-identity"><div className="host-deposits-avatar">{profile?.imageUrl ? <img src={profile.imageUrl} alt={`${hostName} profile`} /> : initials}</div><div><span className="trust-ops-kicker">Deposit account</span><h2>{hostName}</h2><p>{activePropertyCount} active properties · Deposit activity is auditable</p><div className="host-deposits-signals"><span><ShieldIcon /> Deposit activity is auditable</span><span><CheckIcon /> Tenant notices stay clear</span></div></div><div className="host-deposits-status"><strong>{reviewNeeded.length ? "Needs attention" : "In good standing"}</strong><span>Deposit account status</span></div></section>
    <div className="host-deposits-summary"><article><span><CreditCardIcon /></span><div><small>Currently held</small><strong>{money(totalHeld)}</strong><em>Across {deposits.length} tenancies</em></div></article><article><span className="is-return"><HomeIcon /></span><div><small>Returns due</small><strong>{money(returnDueTotal)}</strong><em>{returnsDue.length} return{returnsDue.length === 1 ? "" : "s"} due</em></div></article><article><span className="is-review"><ShieldIcon /></span><div><small>Needs review</small><strong>{reviewNeeded.length} deposit{reviewNeeded.length === 1 ? "" : "s"}</strong><em>{reviewNeeded.length ? "Move-out review required" : "No deposits need review"}</em></div></article></div>
    <div className="host-deposits-layout"><section className="trust-ops-panel host-deposits-list-panel"><div className="host-deposits-section-head"><div><span className="trust-ops-kicker">Deposit activity</span><h2>Tenancy deposits</h2></div><span>3 open</span></div><div className="host-deposits-list">{deposits.map((deposit) => <article className="host-deposit-row" key={deposit.lease}><span className={`host-deposit-tenant ${deposit.color}`}>{deposit.initials}</span><div><strong>{deposit.tenant}</strong><small>{deposit.property} · {deposit.lease}</small><em>{deposit.date}</em></div><div><b>{money(deposit.amount)}</b><span className={statusClass(returned.includes(deposit.lease) ? "Held" : deposit.status)}>{returned.includes(deposit.lease) ? "Returned" : deposit.status}</span></div><button type="button" onClick={() => openReview(deposit.lease)}>{activeLease === deposit.lease ? "Close" : "Review"}</button>{activeLease === deposit.lease && activeDeposit && <section className="host-deposit-detail"><div className="host-deposit-detail-head"><div><span className="trust-ops-kicker">Settlement workspace</span><strong>{activeDeposit.tenant}'s deposit</strong><small>Deposit held: {money(activeDeposit.amount)} · {activeDeposit.property}</small></div><span><ShieldIcon /> Evidence required for deductions</span></div><p>Record only tenant-caused damage, never normal wear and tear. Add a repair quote or receipt before sending the settlement notice.</p><div className="host-deposit-damages">{damageItems.map((item, index) => <div className="host-deposit-damage" key={item.id}><label>Description<input value={item.description} onChange={(event) => updateDamage(item.id, { description: event.target.value })} placeholder={`Repair item ${index + 1}`} /></label><label>Repair cost<input type="number" min="0" step="0.01" value={item.amount} onChange={(event) => updateDamage(item.id, { amount: event.target.value })} placeholder="0.00" /></label><label className="host-deposit-evidence">Quote or receipt<input type="file" accept="image/*,.pdf" onChange={(event) => updateDamage(item.id, { evidence: event.target.files?.[0]?.name || "" })} /><span>{item.evidence || "Attach evidence"}</span></label></div>)}</div><button className="host-deposit-add-item" type="button" onClick={() => setDamageItems((items) => [...items, { id: Date.now(), description: "", amount: "", evidence: "" }])}>+ Add repair item</button><div className="host-deposit-settlement"><div><span>Deposit held</span><b>{money(activeDeposit.amount)}</b></div><div><span>Documented repairs</span><b className={repairTotal > 0 ? "is-deduction" : ""}>-{money(repairTotal)}</b></div><div className="host-deposit-outcome"><span>{balanceDue > 0 ? "Balance due from tenant" : "Return to tenant"}</span><b>{money(balanceDue > 0 ? balanceDue : returnAmount)}</b></div></div><small className="host-deposit-requirement">A description, cost, and supporting quote or receipt are required for each deduction.</small><div className="host-deposit-actions"><button className="trust-ops-action secondary" type="button" disabled={!hasDocumentedRepairs || noticeSent.includes(activeDeposit.lease)} onClick={() => setNoticeSent((current) => [...current, activeDeposit.lease])}>{noticeSent.includes(activeDeposit.lease) ? "Settlement notice sent" : "Send itemized notice"}</button><button className="trust-ops-action" type="button" disabled={repairTotal > 0 || returned.includes(activeDeposit.lease)} onClick={() => setReturned((current) => [...current, activeDeposit.lease])}>{returned.includes(activeDeposit.lease) ? "Return recorded" : `Return ${money(activeDeposit.amount)}`}</button></div>{noticeSent.includes(activeDeposit.lease) && <small className="host-deposit-dispute"><CheckIcon /> Notice sent. Keep the proposed settlement open for the tenant's dispute window before finalizing.</small>}</section>}</article>)}</div></section><aside className="host-deposits-side"><section className="trust-ops-panel host-deposits-guide"><span className="host-deposits-guide-icon"><ShieldIcon /></span><span className="trust-ops-kicker">Return workflow</span><h2>Make every decision clear</h2><p>Deposit decisions should be supported by evidence and communicated promptly to your tenant.</p><div className="host-deposits-steps"><span><b>1</b> Review move-out condition</span><span><b>2</b> Document any proposed deduction</span><span><b>3</b> Send a return or deduction notice</span></div></section><section className="host-deposits-notice"><CheckIcon /><div><strong>Tenant-first recordkeeping</strong><span>Keep receipts, photos, and notes with each deposit decision for a transparent resolution.</span></div></section></aside></div>
  </main>;
}
