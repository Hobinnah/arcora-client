import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckIcon, FileIcon, ShieldIcon } from "../components/Icons";
import { hostApplications } from "./hostApplicationsData";
import { getHostApplicationNotification, type HostApplicationNotification } from "./hostApplicationNotifications";
import HostingHeader from "./HostingHeader";
import MarketplaceFooter from "../marketplace/MarketplaceFooter";
import "./HostingApplicationsPage.css";

export default function HostingApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const application =
    hostApplications.find((item) => item.id === id) || hostApplications[0];
  const [status, setStatus] = useState(application.status);
  const [modal, setModal] = useState<"approve" | "changes" | "decline" | null>(
    null,
  );
  const [detailModal, setDetailModal] = useState<"employment" | "household" | "guarantors" | "documents" | "payment" | null>(null);
  const [reason, setReason] = useState("");
  const [submissionNotice, setSubmissionNotice] = useState<HostApplicationNotification | undefined>(() => getHostApplicationNotification(application.id));
  useEffect(() => { const refreshNotice = () => setSubmissionNotice(getHostApplicationNotification(application.id)); window.addEventListener("storage", refreshNotice); return () => window.removeEventListener("storage", refreshNotice); }, [application.id]);
  const confirmAction = () => {
    if (modal === "approve") setStatus("Approved");
    if (modal === "changes") setStatus("Changes requested");
    if (modal === "decline") setStatus("Declined");
    setModal(null);
    setReason("");
  };

  return (
    <main className="marketplace hosting-review-application-page">
      <HostingHeader />
      <div className="hosting-application-review-context">
        <button type="button" onClick={() => navigate("/hosting/applications")}>
          ← Applications
        </button>
        <span>{application.code}</span>
      </div>
      {submissionNotice && <section className="hosting-application-notification"><div className="hosting-application-notification-icon">✉</div><div><span className="hosting-application-notification-label">New tenant submission · Chat &amp; email sent</span><strong>{submissionNotice.applicantName} submitted an application for {submissionNotice.listingName}.</strong><small>The tenant is ready for your review.</small></div><button type="button" onClick={() => navigate(`/hosting/applications/${submissionNotice.applicationId}`)}>View application <span aria-hidden="true">→</span></button></section>}
      <section className="hosting-application-review-layout">
        <div className="hosting-application-review-main">
          <div className="hosting-application-review-header">
            <div>
              <p className="marketplace-eyebrow">{application.unit}</p>
              <h1>{application.applicant}&apos;s application</h1>
              <p>
                Submitted {application.submitted} · {application.code}
              </p>
            </div>
            <span
              className={`hosting-application-status status-${status.toLowerCase().replaceAll(" ", "-")}`}
            >
              {status}
            </span>
          </div>
          <section className="hosting-review-section">
            <div className="hosting-review-section-heading">
              <div>
                <p className="marketplace-eyebrow">Application overview</p>
                <h2>At a glance</h2>
              </div>
              <span className="hosting-review-screening">
                <ShieldIcon /> Screening {application.screening}
              </span>
            </div>
            <div className="hosting-review-facts">
              <div>
                <span>Move-in</span>
                <strong>{application.moveIn}</strong>
              </div>
              <div>
                <span>Lease term</span>
                <strong>{application.term}</strong>
              </div>
              <div>
                <span>Proposed rent</span>
                <strong>${application.rent.toLocaleString()} / mo</strong>
              </div>
              <div>
                <span>Household</span>
                <strong>
                  {application.occupants} adult
                  {application.occupants === 1 ? "" : "s"}
                </strong>
              </div>
            </div>
          </section>
          <section className="hosting-review-section hosting-review-decision-snapshot">
            <div className="hosting-review-section-heading">
              <div>
                <p className="marketplace-eyebrow">Decision snapshot</p>
                <h2>What you need to decide</h2>
              </div>
              <span className="hosting-review-snapshot-note">Updated with application</span>
            </div>
            <div className="hosting-review-snapshot-grid">
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("employment")}><div><strong>Employment &amp; income</strong><span className="hosting-review-snapshot-status is-pending">Needs review</span></div><p>Employed · Employer not yet verified</p><b>Annual income: Not provided</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("household")}><div><strong>Household</strong><span className="hosting-review-snapshot-status is-ready">1 adult</span></div><p>Primary applicant: {application.applicant}</p><b>No additional occupants listed</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("guarantors")}><div><strong>Guarantors</strong><span className="hosting-review-snapshot-status is-neutral">None</span></div><p>No guarantor has been added to this application.</p><b>Not required for this review</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("documents")}><div><strong>Documents</strong><span className="hosting-review-snapshot-status is-ready">2 submitted</span></div><p>Identity verification and proof of income</p><b>Ready to review</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("payment")}><div><strong>Payment authorization</strong><span className="hosting-review-snapshot-status is-ready">Authorized</span></div><p>PAD / ACSS debit <em>Authorized</em> · Card fallback <em>On file</em></p><b>No charge until approval</b><small>View details →</small></button>
            </div>
          </section>
          <section className="hosting-review-section">
            <div className="hosting-review-section-heading">
              <div>
                <p className="marketplace-eyebrow">Applicant</p>
                <h2>About {application.applicant.split(" ")[0]}</h2>
              </div>
              <button type="button" className="hosting-review-text-action">
                Message applicant
              </button>
            </div>
            <div className="hosting-review-person">
              <span className="hosting-application-avatar">
                {application.initials}
              </span>
              <div>
                <strong>{application.applicant}</strong>
                <span>Primary applicant · Profile verified</span>
                <span>obinna@example.com · +1 ***-***-0753</span>
              </div>
            </div>
          </section>
          <section className="hosting-review-section">
            <div className="hosting-review-section-heading">
              <div>
                <p className="marketplace-eyebrow">Documents</p>
                <h2>Submitted for review</h2>
              </div>
              <button type="button" className="hosting-review-text-action">
                View all
              </button>
            </div>
            <div className="hosting-review-document">
              <FileIcon />
              <div>
                <strong>Proof of income</strong>
                <span>Uploaded · Ready to review</span>
              </div>
              <button type="button">Open</button>
            </div>
            <div className="hosting-review-document">
              <FileIcon />
              <div>
                <strong>Identity verification</strong>
                <span>Verified by Arcora</span>
              </div>
              <button type="button">Open</button>
            </div>
          </section>
        </div>
        <aside className="hosting-application-review-sidebar">
          <div className="hosting-review-decision-card">
            <p className="marketplace-eyebrow">Your decision</p>
            <h2>Choose what happens next.</h2>
            <p>
              Review the details, then keep the applicant informed with one
              clear action.
            </p>
            <button
              type="button"
              className="hosting-review-approve"
              onClick={() => setModal("approve")}
              disabled={status === "Approved"}
            >
              {status === "Approved"
                ? "Application approved"
                : "Approve application"}
            </button>
            <button
              type="button"
              className="hosting-review-secondary"
              onClick={() => setModal("changes")}
            >
              Request changes
            </button>
            <button
              type="button"
              className="hosting-review-decline"
              onClick={() => setModal("decline")}
            >
              Decline application
            </button>
          </div>
          <div className="hosting-review-sidebar-note">
            <CheckIcon />
            <span>
              Submitting a decision notifies the applicant. A lease is created
              separately after approval.
            </span>
          </div>
        </aside>
      </section>
      {detailModal && <div className="hosting-review-modal-overlay" onClick={() => setDetailModal(null)}><section className="hosting-review-modal hosting-review-detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button type="button" className="hosting-review-modal-close" aria-label="Close details" onClick={() => setDetailModal(null)}>×</button><p className="marketplace-eyebrow">Application details</p><h2>{detailModal === "employment" ? "Employment & income" : detailModal === "household" ? "Household" : detailModal === "guarantors" ? "Guarantors" : detailModal === "documents" ? "Documents" : "Payment authorization"}</h2>{detailModal === "employment" && <div className="hosting-review-detail-list"><div><span>Employment status</span><strong>Employed</strong></div><div><span>Employer or business</span><strong>Not provided</strong></div><div><span>Job title</span><strong>Not provided</strong></div><div><span>Annual income</span><strong>Not provided</strong></div><div><span>Verification</span><strong className="is-warning">Needs review</strong></div></div>}{detailModal === "household" && <div className="hosting-review-detail-list"><div><span>Primary tenant</span><strong>{application.applicant}</strong></div><div><span>Adults listed</span><strong>{application.occupants}</strong></div><div><span>Additional occupants</span><strong>None listed</strong></div><div><span>Financially responsible</span><strong>Primary tenant</strong></div></div>}{detailModal === "guarantors" && <div className="hosting-review-detail-empty"><strong>No guarantors added</strong><span>This application does not include a guarantor. No guarantor review is required.</span></div>}{detailModal === "documents" && <div className="hosting-review-detail-list"><div><span>Identity verification</span><strong className="is-ready">Verified</strong></div><div><span>Proof of income</span><strong className="is-ready">Submitted</strong></div><div><span>Supporting documents</span><strong>None submitted</strong></div><div><span>Screening</span><strong>{application.screening}</strong></div></div>}{detailModal === "payment" && <div className="hosting-review-detail-list"><div><span>PAD / ACSS debit</span><strong className="is-ready">Authorized</strong></div><div><span>Card fallback</span><strong className="is-ready">On file</strong></div><div><span>Charge timing</span><strong>Only after approval</strong></div><div><span>Payment decision</span><strong>Approval only</strong></div></div>}<button type="button" className="hosting-review-modal-dismiss" onClick={() => setDetailModal(null)}>Close details</button></section></div>}
      {modal && (
        <div
          className="hosting-review-modal-overlay"
          onClick={() => setModal(null)}
        >
          <section
            className="hosting-review-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="hosting-review-modal-close"
              aria-label="Close"
              onClick={() => setModal(null)}
            >
              ×
            </button>
            <p className="marketplace-eyebrow">
              {modal === "approve"
                ? "Confirm approval"
                : modal === "changes"
                  ? "Request changes"
                  : "Decline application"}
            </p>
            <h2>
              {modal === "approve"
                ? "Approve this application?"
                : modal === "changes"
                  ? "What needs another look?"
                  : "Decline this application?"}
            </h2>
            <p>
              {modal === "approve"
                ? "The applicant will be notified. Confirm the proposed lease terms before creating a lease."
                : modal === "changes"
                  ? "Tell the applicant what they should update before you review again."
                  : "A short reason helps keep the decision clear and respectful."}
            </p>
            {modal === "approve" ? (
              <div className="hosting-review-modal-facts">
                <span>
                  Monthly rent <b>${application.rent.toLocaleString()}</b>
                </span>
                <span>
                  Lease term <b>{application.term}</b>
                </span>
                <span>
                  Start date <b>{application.moveIn}</b>
                </span>
              </div>
            ) : (
              <textarea
                aria-label="Decision reason"
                placeholder="Add a note for the applicant"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            )}
            <div className="hosting-review-modal-actions">
              <button type="button" onClick={() => setModal(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={modal === "decline" ? "is-danger" : "is-primary"}
                disabled={modal !== "approve" && !reason.trim()}
                onClick={confirmAction}
              >
                {modal === "approve"
                  ? "Approve application"
                  : modal === "changes"
                    ? "Send request"
                    : "Decline application"}
              </button>
            </div>
          </section>
        </div>
      )}
      <MarketplaceFooter />
    </main>
  );
}
