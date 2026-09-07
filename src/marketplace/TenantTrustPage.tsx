import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, CreditCardIcon, HomeIcon, IdCardIcon, MailIcon, PhoneIcon, ShieldIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { useVerificationCenter, type VerificationStatus } from "../apis/useVerificationCenter";
import "../pages/shared/TrustOperations.css";
import "./TenantTrustPage.css";

const labelFor = (status: VerificationStatus) => status === "APPROVED" ? "Verified" : status === "UNDER_REVIEW" ? "Under review" : status === "PENDING" || status === "SUBMITTED" ? "Pending" : "Not started";
const toneFor = (status: VerificationStatus) => status === "APPROVED" ? "ok" : status === "UNDER_REVIEW" || status === "PENDING" || status === "SUBMITTED" ? "wait" : "neutral";

export default function TenantTrustPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const tenant = currentUser?.user;
  const userID = tenant?.id ?? tenant?.userId;
  const verification = useVerificationCenter(userID);
  const [creditConsent, setCreditConsent] = useState(false);
  const [creditRequested, setCreditRequested] = useState(false);
  const [reportingConsent, setReportingConsent] = useState(false);
  const [reportingEnrolled, setReportingEnrolled] = useState(false);
  const tenantName = `${tenant?.firstName || ""} ${tenant?.lastName || ""}`.trim() || currentUser?.name || "Obinna Eze";
  const tenantEmail = tenant?.email || "obinna@example.com";
  const initials = tenantName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const contactChecks = [
    { name: "Email address", detail: tenantEmail, Icon: MailIcon, status: verification.emailStatus },
    { name: "Phone number", detail: tenant?.phoneNumber || "+1 306 280 0753", Icon: PhoneIcon, status: verification.phoneStatus },
  ];
  const verifiedCount = contactChecks.filter((item) => item.status === "APPROVED").length + (verification.identityVerified ? 1 : 0);

  return <main className="trust-ops-page tenant-trust-page">
    <header className="trust-ops-head"><div><span className="trust-ops-kicker">Tenant trust profile</span><h1>Verification &amp; consent</h1><p>Manage the information landlords need to assess an application, with clear control over what you share and when.</p></div><button className="trust-ops-back" type="button" onClick={() => navigate("/")}>Back home</button></header>
    <section className="tenant-trust-identity"><div className="tenant-trust-avatar">{tenant?.imageUrl ? <img src={tenant.imageUrl} alt={`${tenantName} profile`} /> : initials}</div><div><span className="trust-ops-kicker">Tenant profile</span><h2>{tenantName}</h2><p>{tenantEmail} · Trust profile</p><div className="tenant-trust-summary"><span><CheckIcon /> {verifiedCount} core checks complete</span><span><ShieldIcon /> Your information is protected</span></div></div><div className="tenant-trust-score"><strong>{verification.overallLabel}</strong><span>Identity status</span></div></section>
    <div className="tenant-trust-layout">
      <section className="trust-ops-panel tenant-trust-main"><div className="tenant-trust-section-heading"><div><span className="trust-ops-kicker">{tenantName}'s account</span><h2>Contact &amp; identity</h2></div><span className="tenant-trust-section-count">{verifiedCount}/3 complete</span></div><div className="trust-ops-list">{contactChecks.map(({ name, detail, Icon, status }) => <div className="trust-ops-row" key={name}><span><Icon /></span><div><strong>{name}</strong><small>{detail}</small></div><b className={`trust-ops-chip ${toneFor(status)}`}>{labelFor(status)}</b></div>)}<div className="trust-ops-row"><span><IdCardIcon /></span><div><strong>Identity verification</strong><small>Government ID and live selfie verification.</small></div><button className={`trust-ops-chip ${verification.identityVerified ? "ok" : "wait"}`} type="button" onClick={() => navigate("/verify-identity")}>{verification.identityVerified ? "Verified" : "Continue"}</button></div></div><div className="tenant-trust-extra-grid"><article><HomeIcon /><strong>Address verification</strong><small>Proof of address will be requested only when required.</small><button type="button" onClick={() => navigate("/account-settings")}>Manage address</button></article><article><CreditCardIcon /><strong>Payment method</strong><small>Securely add a method before a rent payment is due.</small><button type="button" onClick={() => navigate("/account-settings")}>Manage payments</button></article></div></section>
      <aside className="tenant-trust-side">
        <section className="trust-ops-panel tenant-credit-card"><span className="tenant-credit-icon"><ShieldIcon /></span><span className="trust-ops-kicker">Optional screening</span><h2>Credit check</h2><p>Landlords can only request a credit check after you provide explicit consent. You can withdraw consent until a check begins.</p><label className="tenant-credit-consent"><input type="checkbox" checked={creditConsent} onChange={(event) => setCreditConsent(event.target.checked)} /><span>I consent to a credit check for a rental application.</span></label><button className="trust-ops-action" type="button" disabled={!creditConsent || creditRequested} onClick={() => setCreditRequested(true)}>{creditRequested ? "Consent recorded" : "Give consent"}</button>{creditRequested && <small className="tenant-credit-confirmation"><CheckIcon /> Consent recorded. A check starts only when a landlord requests it.</small>}</section>
        <section className="trust-ops-panel tenant-reporting-card"><div className="tenant-reporting-top"><span className="tenant-reporting-icon"><CreditCardIcon /></span><span><span className="trust-ops-kicker">Build your credit</span><strong>Rent reporting</strong></span><b>CAD $10<span>/ month</span></b></div><p>Enroll to have eligible on-time rent payments reported to participating credit bureaus. Consistent payments may help strengthen your credit history.</p><div className="tenant-reporting-points"><span><CheckIcon /> Consent required</span><span><CheckIcon /> Cancel before your next billing date</span></div><label className="tenant-reporting-consent"><input type="checkbox" checked={reportingConsent} onChange={(event) => setReportingConsent(event.target.checked)} /><span>I agree to the CAD $10 monthly rent-reporting charge and authorize Arcora to report eligible rent payments.</span></label><button className="trust-ops-action" type="button" disabled={!reportingConsent || reportingEnrolled} onClick={() => setReportingEnrolled(true)}>{reportingEnrolled ? "Rent reporting enrolled" : "Enroll for CAD $10/month"}</button>{reportingEnrolled && <small className="tenant-reporting-confirmation"><CheckIcon /> Enrollment saved. Reporting begins after your next eligible rent payment.</small>}</section>
        <section className="tenant-trust-privacy"><ShieldIcon /><div><strong>You stay in control</strong><span>Your profile details are shared only when needed to evaluate or manage a tenancy.</span></div></section>
      </aside>
    </div>
  </main>;
}
