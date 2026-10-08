import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckIcon, CreditCardIcon, DownloadIcon, InfoIcon, TrendingUpIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { getLandlordOrganization } from "../apis/useLandlordOrganization";
import { exportEarningsStatement, getEarningsSummary, getListingBreakdown, fetchPayouts, type EarningsPeriod, type EarningsSummary, type ListingEarningsBreakdown } from "../apis/usePayout";
import { createPayoutOnboardingLink, getOrganizationPayoutAccountStatus, refreshPayoutAccountStatus, type PayoutAccountStatus } from "../apis/useOrgPayoutAccount";
import "../marketplace/MarketplaceHome.css";
import "../pages/shared/TrustOperations.css";
import HostingHeader from "./HostingHeader";
import "./HostEarningsPage.css";

type Period = EarningsPeriod;
type PayoutRow = { payoutID: number; date: string; amount: number; currency: string; status: string; detail: string };

const formatCurrency = (amount: number, currency = "CAD") => new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(amount || 0);
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "-";

export default function HostEarningsPage() {
  const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const profile = currentUser?.user;
  const hostName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || currentUser?.name || "Host account";
  const requestedPeriod = searchParams.get("period");
  const [period, setPeriod] = useState<Period>(
    requestedPeriod === "Last 3 months" || requestedPeriod === "Year to date" ? requestedPeriod : "This month",
  );
  const showAllPayouts = searchParams.get("view") === "all";
  const payoutPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const [organizationID, setOrganizationID] = useState<string>();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [breakdown, setBreakdown] = useState<ListingEarningsBreakdown[]>([]);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [payoutTotalCount, setPayoutTotalCount] = useState(0);
  const [isPayoutLoading, setIsPayoutLoading] = useState(false);
  const [payoutAccount, setPayoutAccount] = useState<PayoutAccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [isStartingPayoutOnboarding, setIsStartingPayoutOnboarding] = useState(false);
  const initials = hostName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
    const directOrganizationID = currentUser?.organization?.organizationID ?? currentUser?.memberOrganizations?.find((member) => member.organization)?.organization?.organizationID;
    if (!userID && !directOrganizationID) return;
    let cancelled = false;
    void (async () => {
      try {
        const organization = directOrganizationID ? null : await getLandlordOrganization(userID!);
        if (!cancelled) setOrganizationID(directOrganizationID || organization?.organizationID || undefined);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not identify your organization.");
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => {
    if (!organizationID) return;
    let cancelled = false;
    void Promise.all([
      getEarningsSummary(organizationID, period),
      getListingBreakdown(organizationID, period),
      getOrganizationPayoutAccountStatus(organizationID),
    ]).then(([loadedSummary, loadedBreakdown, accountStatus]) => {
      if (cancelled) return;
      setLoadError("");
      setSummary(loadedSummary);
      setBreakdown(loadedBreakdown);
      setPayoutAccount(accountStatus);
    }).catch((error: unknown) => {
      if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not load earnings data.");
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [organizationID, period]);

  useEffect(() => {
    if (!organizationID) return;
    let cancelled = false;
    setIsPayoutLoading(true);
    void fetchPayouts({
      organizationID,
      period,
      pageSize: 10,
      pageNumber: showAllPayouts ? payoutPage - 1 : 0,
    }).then((payoutResult) => {
      if (cancelled) return;
      setPayouts(payoutResult.data.map((payout) => ({
        payoutID: payout.payoutID,
        date: payout.scheduledAt || payout.paidAt || payout.requestedAt,
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        detail: payout.providerName || "Payout",
      })));
      setPayoutTotalCount(payoutResult.totalCount);
    }).catch((error: unknown) => {
      if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not load payout history.");
    }).finally(() => {
      if (!cancelled) setIsPayoutLoading(false);
    });
    return () => { cancelled = true; };
  }, [organizationID, period, payoutPage, showAllPayouts]);

  const changePeriod = (nextPeriod: Period) => {
    setPeriod(nextPeriod);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("period", nextPeriod);
      next.delete("page");
      return next;
    });
  };

  const changePayoutPage = (nextPage: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("view", "all");
      next.set("page", String(nextPage));
      return next;
    });
  };

  const toggleAllPayouts = () => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (showAllPayouts) {
        next.delete("view");
        next.delete("page");
      } else {
        next.set("view", "all");
        next.set("page", "1");
      }
      return next;
    });
  };

  useEffect(() => {
    const payoutReturnState = searchParams.get("payout");
    if (!organizationID || (payoutReturnState !== "complete" && payoutReturnState !== "refresh")) return;
    let cancelled = false;
    void refreshPayoutAccountStatus(organizationID).then((status) => {
      console.info("Stripe payout status refresh response:", status);
      if (!cancelled) setPayoutAccount(status);
    }).catch((error: unknown) => {
      if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not refresh your payout account status.");
    }).finally(() => {
      if (!cancelled) {
        setSearchParams((current) => {
          const next = new URLSearchParams(current);
          next.delete("payout");
          return next;
        }, { replace: true });
      }
    });
    return () => { cancelled = true; };
  }, [organizationID, searchParams, setSearchParams]);

  useEffect(() => {
    if (!organizationID) return;
    let cancelled = false;
    const refreshStatus = () => {
      void refreshPayoutAccountStatus(organizationID).then((status) => {
        if (!cancelled) setPayoutAccount(status);
      }).catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not refresh your payout account status.");
      });
    };
    window.addEventListener("focus", refreshStatus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshStatus);
    };
  }, [organizationID]);

  const handleExport = async () => {
    if (!organizationID || isExporting) return;
    setIsExporting(true);
    try {
      const csv = await exportEarningsStatement(organizationID, period, "csv");
      const url = URL.createObjectURL(csv as Blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `arcora-earnings-${period.toLowerCase().replaceAll(" ", "-")}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "We could not export the earnings statement.");
    } finally {
      setIsExporting(false);
    }
  };

  const startPayoutOnboarding = async () => {
    if (!organizationID || isStartingPayoutOnboarding) return;
    const onboardingWindow = window.open("about:blank", "_blank");
    if (!onboardingWindow) {
      setLoadError("Your browser blocked the Stripe tab. Allow pop-ups for Arcora and try again.");
      return;
    }
    onboardingWindow.opener = null;
    setIsStartingPayoutOnboarding(true);
    setLoadError("");
    try {
      const { onboardingUrl } = await createPayoutOnboardingLink(organizationID);
      onboardingWindow.location.href = onboardingUrl;
    } catch (error) {
      onboardingWindow.close();
      setLoadError(error instanceof Error ? error.message : "We could not start Stripe payout setup.");
    } finally {
      setIsStartingPayoutOnboarding(false);
    }
  };

  const hasPayoutAccount = payoutAccount !== null;
  const payoutNeedsAction = hasPayoutAccount && (
    !payoutAccount.isConnected ||
    payoutAccount.detailsSubmitted === false ||
    (payoutAccount.requirementsCurrentlyDue?.length ?? 0) > 0
  );
  const payoutStatusLabel = !hasPayoutAccount
    ? "Payout account not set up"
    : payoutAccount.payoutsEnabled
      ? "Payouts enabled"
      : payoutAccount.verificationStatus.toLowerCase() === "pending"
        ? "Verification pending"
        : payoutNeedsAction
          ? "Payout setup needs attention"
          : "Payout account connected";
  const payoutStatusDetail = !hasPayoutAccount
    ? "Connect an account to receive payouts"
    : payoutNeedsAction
      ? `${payoutAccount.provider || "Stripe"} · Additional information required`
      : `${payoutAccount.provider || "Payout provider"} · ${payoutAccount.maskedAccount || "Account on file"}`;
  const payoutActionLabel = !hasPayoutAccount ? "Set up" : payoutNeedsAction ? "Continue setup" : "Manage";

  const primaryCurrency = payouts[0]?.currency || "CAD";
  const maximumBreakdown = Math.max(...breakdown.map((item) => item.rentCollected), 1);
  const payoutPageCount = Math.max(1, Math.ceil(payoutTotalCount / 10));

  return <main className="host-earnings-page">
    <div className="marketplace host-earnings-header-context">
      <HostingHeader />
      {payoutModalOpen && <div className="host-earnings-modal-overlay" role="presentation" onMouseDown={() => !isStartingPayoutOnboarding && setPayoutModalOpen(false)}><section className="host-earnings-payout-modal" role="dialog" aria-modal="true" aria-labelledby="payout-modal-title" onMouseDown={(event) => event.stopPropagation()}><div className="host-earnings-modal-head"><div><span className="trust-ops-kicker">{hasPayoutAccount ? "Payout account" : "Secure payout setup"}</span><h2 id="payout-modal-title">{hasPayoutAccount ? "Continue payout setup" : "Connect your payout account"}</h2></div><button type="button" aria-label="Close payout setup" disabled={isStartingPayoutOnboarding} onClick={() => setPayoutModalOpen(false)}>×</button></div><p className="host-earnings-modal-note">You will complete payout setup securely with Stripe. Arcora does not store full banking or void cheque details.</p><div className="host-earnings-modal-actions"><button type="button" disabled={isStartingPayoutOnboarding} onClick={() => setPayoutModalOpen(false)}>Cancel</button><button type="button" disabled={isStartingPayoutOnboarding || !organizationID} onClick={() => void startPayoutOnboarding()}>{isStartingPayoutOnboarding ? "Opening Stripe..." : "Continue to Stripe"}</button></div></section></div>}
    </div>
    <div className="trust-ops-page host-earnings-content" aria-busy={isLoading}>
      <header className="trust-ops-head host-earnings-head"><div><span className="trust-ops-kicker">Host finances</span><h1>Earnings &amp; payouts</h1><p>Track rent income, fees, and the money heading to your bank account.</p></div><button className="trust-ops-back" type="button" onClick={() => navigate("/hosting")}>Hosting dashboard</button></header>
      <section className="host-earnings-identity"><div className="host-earnings-avatar">{profile?.imageUrl ? <img src={profile.imageUrl} alt={`${hostName} profile`} /> : initials}</div><div><span className="trust-ops-kicker">Host account</span><h2>{hostName}</h2><p>{breakdown.length} active listings · Payouts in {primaryCurrency}</p></div><div className="host-earnings-bank"><span className={payoutAccount?.isConnected ? "is-ready" : ""}><CreditCardIcon /></span><div><strong>{payoutStatusLabel}</strong><small>{payoutStatusDetail}</small></div><button type="button" onClick={() => setPayoutModalOpen(true)}>{payoutActionLabel}</button></div></section>
    {loadError && <p className="hosting-editor-save-error" role="alert">{loadError}</p>}
    <div className="host-earnings-toolbar"><div className="host-earnings-period" role="tablist" aria-label="Earnings period">{(["This month", "Last 3 months", "Year to date"] as Period[]).map((item) => <button key={item} type="button" role="tab" aria-selected={period === item} className={period === item ? "is-active" : ""} onClick={() => changePeriod(item)}>{item}</button>)}</div><button type="button" className="host-earnings-export" disabled={isExporting || !organizationID} onClick={() => void handleExport()}><DownloadIcon /> {isExporting ? "Exporting..." : "Export statement"}</button></div>
      <section className="host-earnings-hero"><div><span>Available to pay out</span><strong>{formatCurrency(summary?.netEarnings ?? 0, primaryCurrency)}</strong><small>{summary?.periodEnd ? `Period ending ${formatDate(summary.periodEnd)}` : "No earnings data available"}</small><div className="host-earnings-hero-meta"><span><CheckIcon /> {breakdown.length} listings included</span><span><CheckIcon /> {summary?.pastDue ? "Past due balance" : "No payout holds"}</span></div></div><button className="trust-ops-action" type="button" onClick={() => setPayoutModalOpen(true)}>{!hasPayoutAccount ? "Set up payout account" : payoutNeedsAction ? "Continue payout setup" : "View payout details"}</button></section>
    <div className="host-earnings-metrics"><article><span className="host-earnings-metric-icon"><TrendingUpIcon /></span><div><small>Rent collected</small><strong>{formatCurrency(summary?.rentCollected ?? 0, primaryCurrency)}</strong><span>{summary?.period || period}</span></div></article><article><span className="host-earnings-metric-icon"><CreditCardIcon /></span><div><small>Service fees</small><strong>{formatCurrency(summary?.serviceFees ?? 0, primaryCurrency)}</strong><span>{summary?.period || period}</span></div></article><article><span className="host-earnings-metric-icon is-muted"><InfoIcon /></span><div><small>Past due</small><strong>{formatCurrency(summary?.pastDue ?? 0, primaryCurrency)}</strong><span>{summary?.pastDue ? "Payment attention needed" : "All tenants are current"}</span></div></article></div>
      <div className="host-earnings-layout">
        <section className="trust-ops-panel host-earnings-payouts">
          <div className="host-earnings-section-head">
            <div><span className="trust-ops-kicker">Payout activity</span><h2>{showAllPayouts ? "Payout history" : "Upcoming & recent payouts"}</h2></div>
            <button type="button" onClick={toggleAllPayouts}>{showAllPayouts ? "Back to overview" : "View all"}</button>
          </div>
          {isPayoutLoading && <p role="status">Loading payouts...</p>}
          {!isPayoutLoading && payouts.length === 0 && <p>No payouts were found for this period.</p>}
          {payouts.map((payout) => (
            <article className="host-earnings-payout" key={payout.payoutID}>
              <span className={`host-earnings-payout-dot ${payout.status.toLowerCase() === "scheduled" ? "is-scheduled" : ""}`}><CreditCardIcon /></span>
              <div><strong>{formatDate(payout.date)}</strong><small>{payout.detail}</small></div>
              <div><b>{formatCurrency(payout.amount, payout.currency)}</b><span className={payout.status.toLowerCase() === "paid" ? "is-paid" : "is-scheduled"}>{payout.status}</span></div>
            </article>
          ))}
          {showAllPayouts && payoutTotalCount > 10 && (
            <nav className="host-earnings-pagination" aria-label="Payout history pages">
              <button type="button" disabled={payoutPage <= 1 || isPayoutLoading} onClick={() => changePayoutPage(payoutPage - 1)}>Previous</button>
              <span>Page {payoutPage} of {payoutPageCount} · {payoutTotalCount} payouts</span>
              <button type="button" disabled={payoutPage >= payoutPageCount || isPayoutLoading} onClick={() => changePayoutPage(payoutPage + 1)}>Next</button>
            </nav>
          )}
        </section>
        <aside className="trust-ops-panel host-earnings-breakdown"><span className="trust-ops-kicker">{period}</span><h2>Where your earnings came from</h2>{breakdown.map((item) => <div className="host-earnings-bar" key={item.listingID}><div><span>{item.listingName}</span><b>{formatCurrency(item.rentCollected, primaryCurrency)}</b></div><i><em style={{ width: `${Math.max(4, (item.rentCollected / maximumBreakdown) * 100)}%` }} /></i></div>)}<div className="host-earnings-breakdown-total"><span>Net earnings</span><b>{formatCurrency(summary?.netEarnings ?? 0, primaryCurrency)}</b></div></aside>
      </div>
    </div>
  </main>;
}
