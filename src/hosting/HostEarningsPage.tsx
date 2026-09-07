import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, CreditCardIcon, DownloadIcon, InfoIcon, TrendingUpIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import "../pages/shared/TrustOperations.css";
import "./HostEarningsPage.css";

type Period = "This month" | "Last 3 months" | "Year to date";

const payouts = [
  { date: "Sep 3, 2026", amount: "CAD $4,280.00", status: "Scheduled", detail: "Daisy's Inn and Pine Loft" },
  { date: "Aug 20, 2026", amount: "CAD $3,960.00", status: "Paid", detail: "Transferred to Stripe bank account" },
  { date: "Aug 6, 2026", amount: "CAD $4,010.00", status: "Paid", detail: "Transferred to Stripe bank account" },
];

export default function HostEarningsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const profile = currentUser?.user;
  const hostName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || currentUser?.name || "Amara Cole";
  const [period, setPeriod] = useState<Period>("This month");
  const [payoutSetup, setPayoutSetup] = useState(false);
  const initials = hostName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return <main className="trust-ops-page host-earnings-page">
    <header className="trust-ops-head host-earnings-head"><div><span className="trust-ops-kicker">Host finances</span><h1>Earnings &amp; payouts</h1><p>Track rent income, fees, and the money heading to your bank account.</p></div><button className="trust-ops-back" type="button" onClick={() => navigate("/hosting")}>Hosting dashboard</button></header>
    <section className="host-earnings-identity"><div className="host-earnings-avatar">{profile?.imageUrl ? <img src={profile.imageUrl} alt={`${hostName} profile`} /> : initials}</div><div><span className="trust-ops-kicker">Host account</span><h2>{hostName}</h2><p>Two active listings · Payouts in CAD</p></div><div className="host-earnings-bank"><span className={payoutSetup ? "is-ready" : ""}><CreditCardIcon /></span><div><strong>{payoutSetup ? "Bank account connected" : "Payout account needs attention"}</strong><small>{payoutSetup ? "Stripe · ···· 4821" : "Connect an account to receive payouts"}</small></div><button type="button" onClick={() => setPayoutSetup((current) => !current)}>{payoutSetup ? "Manage" : "Set up"}</button></div></section>
    <div className="host-earnings-toolbar"><div className="host-earnings-period" role="tablist" aria-label="Earnings period">{(["This month", "Last 3 months", "Year to date"] as Period[]).map((item) => <button key={item} type="button" role="tab" aria-selected={period === item} className={period === item ? "is-active" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div><button type="button" className="host-earnings-export"><DownloadIcon /> Export statement</button></div>
    <section className="host-earnings-hero"><div><span>Available to pay out</span><strong>CAD $4,280.00</strong><small>Expected in your bank account Sep 3, 2026</small><div className="host-earnings-hero-meta"><span><CheckIcon /> Two listings included</span><span><CheckIcon /> No payout holds</span></div></div><button className="trust-ops-action" type="button" onClick={() => setPayoutSetup(true)}>{payoutSetup ? "View payout details" : "Set up payout account"}</button></section>
    <div className="host-earnings-metrics"><article><span className="host-earnings-metric-icon"><TrendingUpIcon /></span><div><small>Rent collected</small><strong>CAD $8,460.00</strong><span>+12.4% from July</span></div></article><article><span className="host-earnings-metric-icon"><CreditCardIcon /></span><div><small>Service fees</small><strong>CAD $423.00</strong><span>5% of collected rent</span></div></article><article><span className="host-earnings-metric-icon is-muted"><InfoIcon /></span><div><small>Past due</small><strong>CAD $0.00</strong><span>All tenants are current</span></div></article></div>
    <div className="host-earnings-layout"><section className="trust-ops-panel host-earnings-payouts"><div className="host-earnings-section-head"><div><span className="trust-ops-kicker">Payout activity</span><h2>Upcoming &amp; recent payouts</h2></div><button type="button">View all</button></div>{payouts.map((payout) => <article className="host-earnings-payout" key={payout.date}><span className={`host-earnings-payout-dot ${payout.status === "Scheduled" ? "is-scheduled" : ""}`}><CreditCardIcon /></span><div><strong>{payout.date}</strong><small>{payout.detail}</small></div><div><b>{payout.amount}</b><span className={payout.status === "Paid" ? "is-paid" : "is-scheduled"}>{payout.status}</span></div></article>)}</section><aside className="trust-ops-panel host-earnings-breakdown"><span className="trust-ops-kicker">{period}</span><h2>Where your earnings came from</h2><div className="host-earnings-bar"><div><span>Daisy's Inn</span><b>CAD $5,100</b></div><i><em style={{ width: "60%" }} /></i></div><div className="host-earnings-bar"><div><span>Pine Loft</span><b>CAD $3,360</b></div><i><em style={{ width: "40%" }} /></i></div><div className="host-earnings-breakdown-total"><span>Net earnings</span><b>CAD $8,037.00</b></div></aside></div>
  </main>;
}
