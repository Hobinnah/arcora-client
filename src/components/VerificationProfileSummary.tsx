import { CheckIcon, IdCardIcon, MailIcon, PhoneIcon, ShieldIcon } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { useVerificationCenter, type VerificationStatus } from "../apis/useVerificationCenter";
import "./VerificationProfileSummary.css";

const statusLabel = (status: VerificationStatus) => status === "APPROVED" ? "Verified" : status === "UNDER_REVIEW" ? "Reviewing" : status === "REJECTED" ? "Action needed" : status === "PENDING" || status === "SUBMITTED" ? "Pending" : "Not started";
const statusClass = (status: VerificationStatus) => status === "APPROVED" ? "is-verified" : status === "UNDER_REVIEW" ? "is-review" : status === "REJECTED" ? "is-rejected" : status === "PENDING" || status === "SUBMITTED" ? "is-pending" : "is-not-started";

export default function VerificationProfileSummary() {
  const { currentUser, isAuthenticated } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const verification = useVerificationCenter(userID);
  if (!isAuthenticated || !userID) return null;

  const checks = [
    { label: "Email", icon: <MailIcon />, status: verification.emailStatus },
    { label: "Phone", icon: <PhoneIcon />, status: verification.phoneStatus },
    { label: "Government ID", icon: <IdCardIcon />, status: verification.idStatus },
    { label: "Selfie", icon: <CheckIcon />, status: verification.selfieStatus },
  ];
  const verifiedChecks = checks.filter((check) => check.status === "APPROVED").length;

  return <section className="verification-profile-summary" aria-label="Verification status">
    <header><span className="verification-profile-summary-icon"><ShieldIcon /></span><span><strong>Trust &amp; verification</strong><small>{verifiedChecks} of {checks.length} checks complete</small></span><b className={`verification-profile-summary-overall ${statusClass(verification.overallLabel === "Verified" ? "APPROVED" : verification.overallLabel === "Under review" ? "UNDER_REVIEW" : "PENDING")}`}>{verification.overallLabel}</b></header>
    <div className="verification-profile-summary-meter" aria-label={`${verifiedChecks} of ${checks.length} checks complete`}><span style={{ width: `${(verifiedChecks / checks.length) * 100}%` }} /></div>
    <div className="verification-profile-summary-checks">
      {checks.map((check) => <div className={`verification-profile-summary-check ${statusClass(check.status)}`} key={check.label}><span className="verification-profile-summary-check-icon">{check.icon}</span><span>{check.label}</span><b>{statusLabel(check.status)}</b></div>)}
    </div>
  </section>;
}
