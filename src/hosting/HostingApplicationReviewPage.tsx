import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckIcon, ShieldIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { getRentalApplication, updateRentalApplication } from "../apis/useRentalApplication";
import { fetchTenantEmployments } from "../apis/useTenantEmployment";
import { fetchApplicationOccupants } from "../apis/useApplicationOccupant";
import { fetchTenantGuarantors } from "../apis/useTenantGuarantor";
import { fetchLeaseDocuments } from "../apis/useLeaseDocuments";
import { fetchFees } from "../apis/useFee";
import { fetchTenants, getTenant } from "../apis/useTenant";
import { fetchListingPhotos } from "../apis/useListingPhoto";
import { env } from "../env";
import { fetchConversationParticipants, updateConversationParticipant } from "../apis/useConversationParticipant";
import { getCurrentOrganizationMember } from "./organizationMemberIdentity";
import { ensureApplicationConversation, fetchApplicationConversationMessages, findApplicationConversationForOrganization, parseApplicationCardMessage } from "./applicationConversations";
import { normalizeRentalApplicationStatus, rentalApplicationStatusClass, rentalApplicationStatusLabels } from "./rentalApplicationStatus";
import type { RentalApplication } from "../types/RentalApplication";
import type { TenantEmployment } from "../types/TenantEmployment";
import type { ApplicationOccupant } from "../types/ApplicationOccupant";
import type { TenantGuarantor } from "../types/TenantGuarantor";
import type { LeaseDocuments } from "../types/LeaseDocuments";
import type { Conversation } from "../types/Conversation";
import type { ConversationMessage } from "../types/ConversationMessage";
import type { OrganizationMember } from "../types/OrganizationMember";
import HostingHeader from "./HostingHeader";
import MarketplaceFooter from "../marketplace/MarketplaceFooter";
import "./HostingApplicationsPage.css";

export default function HostingApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authToken, currentUser, isAuthenticated } = useAuth();

  const [application, setApplication] = useState<RentalApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [organizationMember, setOrganizationMember] = useState<OrganizationMember | null>(null);
  const [employment, setEmployment] = useState<TenantEmployment | null>(null);
  const [occupants, setOccupants] = useState<ApplicationOccupant[]>([]);
  const [guarantors, setGuarantors] = useState<TenantGuarantor[]>([]);
  const [documents, setDocuments] = useState<LeaseDocuments[]>([]);
  const [applicantTenant, setApplicantTenant] = useState<RentalApplication["tenant"] | null>(null);
  const [listingPhotoUrl, setListingPhotoUrl] = useState("");
  const [hostPlacementFee, setHostPlacementFee] = useState<number | null>(null);
  const [isHostPlacementFeeLoading, setIsHostPlacementFeeLoading] = useState(true);

  const [modal, setModal] = useState<"approve" | "changes" | "decline" | null>(null);
  const [detailModal, setDetailModal] = useState<"employment" | "household" | "guarantors" | "documents" | "payment" | null>(null);
  const [reason, setReason] = useState("");
  const [isSavingDecision, setIsSavingDecision] = useState(false);
  const [decisionError, setDecisionError] = useState("");

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  const landlordName = `${currentUser?.user?.firstName ?? ""} ${currentUser?.user?.lastName ?? ""}`.trim() || "Landlord";

  useEffect(() => {
    if (!id || !isAuthenticated || !(authToken || currentUser?.accessToken)) return;
    let cancelled = false;
    (async () => {
      try {
        const selectedApplication = await getRentalApplication(id);
        if (!cancelled) setApplication(selectedApplication);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not load this application.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [authToken, currentUser?.accessToken, currentUser?.user?.id, currentUser?.user?.userId, id, isAuthenticated]);

  useEffect(() => {
    const tenantID = application?.tenantID;
    if (!tenantID) return;
    let cancelled = false;
    (async () => {
      const [employmentResponse, occupantResponse, guarantorResponse, documentResponse] = await Promise.all([
        fetchTenantEmployments({ pageSize: 200, pageNumber: 0 }),
        fetchApplicationOccupants({ pageSize: 200, pageNumber: 0 }),
        fetchTenantGuarantors({ pageSize: 200, pageNumber: 0 }),
        fetchLeaseDocuments({ pageSize: 200, pageNumber: 0 }),
      ]);
      if (cancelled) return;
      setEmployment(employmentResponse.data.filter((record) => record.tenantID === tenantID).sort((a, b) => b.capturedDate.localeCompare(a.capturedDate))[0] ?? null);
      setOccupants(occupantResponse.data.filter((record) => record.tenantID === tenantID && !record.isPrimaryApplicant));
      setGuarantors(guarantorResponse.data.filter((record) => record.tenantID === tenantID));
      setDocuments(documentResponse.data.filter((record) => record.tenantID === tenantID));
    })();
    return () => { cancelled = true; };
  }, [application?.tenantID]);

  useEffect(() => {
    if (!isAuthenticated || !(authToken || currentUser?.accessToken)) return;
    let cancelled = false;
    fetchFees({ pageSize: 200, pageNumber: 0, isActive: "true" })
      .then(({ data }) => {
        const placementFee = data.find((fee) =>
          fee.isActive === true
          && fee.name === "Host Placement Fee"
          && fee.feeType?.isPlatformFee === true,
        );
        if (!cancelled) {
          setHostPlacementFee(placementFee?.fixedAmount ?? null);
          setIsHostPlacementFeeLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHostPlacementFee(null);
          setIsHostPlacementFeeLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [authToken, currentUser?.accessToken, isAuthenticated]);

  useEffect(() => {
    const tenantID = application?.tenantID;
    const listingID = application?.listingID;
    if (!tenantID && !listingID) return;
    let cancelled = false;
    (async () => {
      const [tenantResult, photoResult] = await Promise.allSettled([
        tenantID ? Promise.allSettled([getTenant(tenantID), fetchTenants({ pageSize: 200, pageNumber: 0 })]) : Promise.resolve([]),
        listingID ? fetchListingPhotos({ pageSize: 200, pageNumber: 0 }) : Promise.resolve({ data: [] }),
      ]);
      if (cancelled) return;
      if (tenantResult.status === "fulfilled" && Array.isArray(tenantResult.value)) {
        const directTenant = tenantResult.value[0]?.status === "fulfilled" ? tenantResult.value[0].value : null;
        const tenantList = tenantResult.value[1]?.status === "fulfilled" ? tenantResult.value[1].value.data : [];
        setApplicantTenant(directTenant ?? tenantList.find((item) => item.tenantID === tenantID) ?? null);
      }
      if (photoResult.status === "fulfilled") {
        const photo = photoResult.value.data.find((item) => item.listingID === listingID && item.isCoverPhoto) ?? photoResult.value.data.find((item) => item.listingID === listingID);
        if (photo) setListingPhotoUrl(photo.url);
      }
    })();
    return () => { cancelled = true; };
  }, [application?.listingID, application?.tenantID]);

  useEffect(() => {
    const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
    if (!userID) return;
    let cancelled = false;
    getCurrentOrganizationMember(userID).then((member) => { if (!cancelled) setOrganizationMember(member); });
    return () => { cancelled = true; };
  }, [currentUser?.user?.id, currentUser?.user?.userId]);

  useEffect(() => {
    if (!application?.applicationCode || !organizationMember?.organizationMemberID) return;
    let cancelled = false;
    (async () => {
      let found = await findApplicationConversationForOrganization(organizationMember.organizationMemberID, application.applicationCode);
      if (!found) {
        found = await ensureApplicationConversation({
          applicationCode: application.applicationCode,
          listingTitle: application.listing?.title ?? "this listing",
          tenantID: application.tenantID,
          organizationMemberID: organizationMember.organizationMemberID,
          capturedBy: landlordName,
        });
      }
      if (cancelled || !found) return;
      setConversation(found);
      const thread = await fetchApplicationConversationMessages(found.conversationID);
      if (cancelled) return;
      setMessages(thread);
      const { data: participants } = await fetchConversationParticipants({ pageSize: 200, pageNumber: 0 });
      const participant = participants.find((item) => item.conversationID === found!.conversationID && item.organizationMemberID === organizationMember.organizationMemberID);
      if (participant) await updateConversationParticipant({ ...participant, lastReadAt: new Date().toISOString() });
    })();
    return () => { cancelled = true; };
  }, [application?.applicationCode, application?.listing?.title, application?.tenantID, organizationMember?.organizationMemberID, landlordName]);

  const confirmAction = async () => {
    if (!application || !modal) return;
    setIsSavingDecision(true);
    setDecisionError("");
    try {
      const now = new Date().toISOString();
      const patch: RentalApplication = {
        ...application,
        updatedDate: now,
        updatedBy: landlordName,
        reviewedAt: now,
        reviewedByOrganizationMemberID: organizationMember?.organizationMemberID ?? application.reviewedByOrganizationMemberID,
      };
      if (modal === "approve") { patch.status = "APPROVED"; patch.approvedAt = now; }
      if (modal === "changes") { patch.status = "CHANGES_REQUESTED"; patch.declineReason = reason; }
      if (modal === "decline") { patch.status = "DECLINED"; patch.declinedAt = now; patch.declineReason = reason; }
      const updated = await updateRentalApplication(patch);
      setApplication(updated);
      setModal(null);
      setReason("");
    } catch (error) {
      setDecisionError(error instanceof Error ? error.message : "We could not save this decision. Please try again.");
    } finally {
      setIsSavingDecision(false);
    }
  };

  if (isLoading) {
    return <main className="marketplace hosting-review-application-page"><HostingHeader /><div className="hosting-application-review-context"><button type="button" onClick={() => navigate("/hosting/applications")}>← Applications</button></div><p style={{ padding: "24px" }}>Loading application...</p><MarketplaceFooter /></main>;
  }
  if (loadError || !application) {
    return <main className="marketplace hosting-review-application-page"><HostingHeader /><div className="hosting-application-review-context"><button type="button" onClick={() => navigate("/hosting/applications")}>← Applications</button></div><p style={{ padding: "24px" }}>{loadError || "Application not found."}</p><MarketplaceFooter /></main>;
  }

  const status = normalizeRentalApplicationStatus(application.status);
  const applicantRecord = applicantTenant ?? application.tenant;
  const applicantName = `${applicantRecord?.user?.firstName ?? ""} ${applicantRecord?.user?.lastName ?? ""}`.trim() || "Applicant";
  const applicantFirstName = applicantRecord?.user?.firstName || applicantName.split(" ")[0];
  const applicantInitials = `${applicantRecord?.user?.firstName?.charAt(0) ?? applicantFirstName.charAt(0)}${applicantRecord?.user?.lastName?.charAt(0) ?? ""}`.toUpperCase();
  const applicantDisplayName = status === "APPROVED" ? applicantName : applicantFirstName;
  const listingPhoto = listingPhotoUrl || application.listing?.listingPhotos?.find((photo) => photo.isCoverPhoto)?.url || application.listing?.listingPhotos?.[0]?.url;
  const listingProperty = application.listing?.rentalUnit?.property;
  const listingLocation = [listingProperty?.address?.city, listingProperty?.address?.provinceCode].filter(Boolean).join(", ") || listingProperty?.name || "Location not provided";
  const dateOnly = (value?: string) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "Not provided";
  const monthlyRent = application.proposedMonthlyRentAmount ?? application.listing?.baseMonthlyRentAmount ?? 0;
  const securityDeposit = application.listing?.securityDepositAmount ?? 0;
  const approvalAmount = monthlyRent + securityDeposit;
  const paymentAuthorized = application.tenant?.isPADRegistered === true && application.tenant?.isCardRegistered === true;

  return (
    <main className="marketplace hosting-review-application-page">
      <HostingHeader />
      <div className="hosting-application-review-context">
        <button type="button" onClick={() => navigate("/hosting/applications")}>
          ← Applications
        </button>
        <span>{application.applicationCode}</span>
      </div>
      <section className="hosting-application-review-layout">
        <div className="hosting-application-review-main">
          <div className="hosting-application-review-header">
            <div>
              <p className="marketplace-eyebrow">{application.listing?.title ?? "Listing"}</p>
              <h1>{applicantDisplayName}&apos;s application</h1>
              <p>
                Submitted {dateOnly(application.submittedAt)} · {application.applicationCode}
              </p>
            </div>
            <span className={`hosting-application-status status-${rentalApplicationStatusClass(status)}`}>
              {rentalApplicationStatusLabels[status]}
            </span>
          </div>
          <section className="hosting-review-section">
            <div className="hosting-review-section-heading">
              <div>
                <p className="marketplace-eyebrow">Application overview</p>
                <h2>At a glance</h2>
              </div>
              <span className="hosting-review-screening">
                <ShieldIcon /> Screening {application.screeningStatus || "Not started"}
              </span>
            </div>
            <div className="hosting-review-facts">
              <div>
                <span>Move-in</span>
                <strong>{dateOnly(application.desiredMoveInDate)}</strong>
              </div>
              <div>
                <span>Lease term</span>
                <strong>{application.requestedLeaseTermMonths ? `${application.requestedLeaseTermMonths} months` : "Not provided"}</strong>
              </div>
              <div>
                <span>Proposed rent</span>
                <strong>${(application.proposedMonthlyRentAmount ?? 0).toLocaleString()} / mo</strong>
              </div>
              <div>
                <span>Household</span>
                <strong>
                  {application.adultOccupantCount ?? 1} adult
                  {application.adultOccupantCount === 1 ? "" : "s"}
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
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("employment")}><div><strong>Employment &amp; income</strong><span className={`hosting-review-snapshot-status ${employment?.verificationStatus === "VERIFIED" ? "is-ready" : "is-pending"}`}>{employment?.verificationStatus === "VERIFIED" ? "Verified" : "Needs review"}</span></div><p>{employment?.employmentType ?? "Not provided"} · {employment?.employerName ?? "Employer not provided"}</p><b>Annual income: {employment ? `$${employment.annualIncome.toLocaleString()}` : "Not provided"}</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("household")}><div><strong>Household</strong><span className="hosting-review-snapshot-status is-ready">{(application.adultOccupantCount ?? 1)} adult{(application.adultOccupantCount ?? 1) === 1 ? "" : "s"}</span></div><p>Primary applicant: {applicantFirstName}</p><b>{occupants.length ? `${occupants.length} additional occupant${occupants.length === 1 ? "" : "s"}` : "No additional occupants listed"}</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("guarantors")}><div><strong>Guarantors</strong><span className="hosting-review-snapshot-status is-neutral">{guarantors.length || "None"}</span></div><p>{guarantors.length ? `${guarantors.length} guarantor${guarantors.length === 1 ? "" : "s"} on file` : "No guarantor has been added to this application."}</p><b>{guarantors.length ? guarantors.map((g) => g.status).join(", ") : "Not required for this review"}</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("documents")}><div><strong>Documents</strong><span className="hosting-review-snapshot-status is-ready">{documents.length} submitted</span></div><p>Identity verification and proof of income</p><b>{documents.length ? "Ready to review" : "None submitted"}</b><small>View details →</small></button>
              <button type="button" className="hosting-review-snapshot-card" onClick={() => setDetailModal("payment")}><div><strong>Payment authorization</strong><span className={`hosting-review-snapshot-status ${paymentAuthorized ? "is-ready" : "is-pending"}`}>{paymentAuthorized ? "Authorized" : "Pending"}</span></div><p>PAD / ACSS debit <em>{application.tenant?.isPADRegistered ? "Authorized" : "Pending"}</em> · Card fallback <em>{application.tenant?.isCardRegistered ? "On file" : "Not on file"}</em></p><b>No charge until approval</b><small>View details →</small></button>
            </div>
          </section>
          <section className="hosting-review-section">
            <div className="hosting-review-section-heading">
              <div>
                <p className="marketplace-eyebrow">Applicant</p>
                <h2>About Applicant</h2>
              </div>
            </div>
            <div className="hosting-review-person">
              {status === "APPROVED" && (applicantRecord?.photoUrl || applicantRecord?.user?.imageUrl) ? <img className="hosting-review-applicant-image" src={applicantRecord.photoUrl || applicantRecord.user?.imageUrl} alt={applicantName} /> : <span className="hosting-application-avatar">{applicantInitials}</span>}
              <div>
                <strong>{applicantFirstName}</strong>
                <span>Primary applicant</span>
                {status === "APPROVED" && <span>{applicantRecord?.user?.lastName ?? "Last name not provided"} · {applicantRecord?.user?.email ?? "Email not provided"} · {applicantRecord?.phoneNumber ?? applicantRecord?.user?.phoneNumber ?? "Phone not provided"}</span>}
              </div>
            </div>
          </section>
          <section className="hosting-review-section">
            <div className="hosting-review-section-heading">
              <div>
                <p className="marketplace-eyebrow">Message thread</p>
                <h2>Talk with {applicantFirstName}</h2>
              </div>
            </div>
            <div className="hosting-review-detail-list">
              {messages.length === 0 && <div><span>No messages yet.</span></div>}
              {messages.map((item) => {
                const applicationCard = item.messageType === "APPLICATION_CARD" ? parseApplicationCardMessage(item.message) : null;
                if (applicationCard) {
                  return (
                    <button type="button" key={item.conversationMessageID} className="hosting-review-application-card" onClick={() => navigate(applicationCard.url || `/hosting/applications/${application.rentalApplicationID}`)}>
                      <span>Rental application</span>
                      <strong>{applicationCard.listingTitle || "Rental application"}</strong>
                      <small>{applicationCard.applicantName || "Applicant"}</small>
                      <b>Net to landlord: ${Number(applicationCard.netToLandlord ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                      {applicationCard.note && <p>{applicationCard.note}</p>}
                    </button>
                  );
                }
                return (
                  <div key={item.conversationMessageID}>
                    <span>{item.senderOrganizationMemberID ? "You" : "Applicant"}</span>
                    <strong>{item.message}</strong>
                  </div>
                );
              })}
            </div>
            <button type="button" className="hosting-review-message-button" onClick={() => navigate(`/hosting/messages/application/${conversation?.conversationID ?? ""}?application=${encodeURIComponent(application.rentalApplicationID)}`)}>
              Send message
            </button>
          </section>
        </div>
        <aside className="hosting-application-review-sidebar">
          <article className="hosting-review-listing-card">
            {listingPhoto ? <img src={listingPhoto} alt={application.listing?.title ?? "Listing"} /> : <div className="hosting-review-listing-placeholder">Listing photo unavailable</div>}
            <div>
              <p className="marketplace-eyebrow">Rental listing</p>
              <h2>{application.listing?.title ?? "Listing"}</h2>
              <span>{listingLocation}</span>
              <div className="hosting-review-listing-facts"><span><small>Monthly rent</small><strong>${monthlyRent.toLocaleString()}</strong></span>{securityDeposit > 0 && <span><small>Security deposit</small><strong>${securityDeposit.toLocaleString()}</strong></span>}<span><small>Host placement fee</small><strong>{isHostPlacementFeeLoading ? "Loading..." : hostPlacementFee === null ? "Unavailable" : `$${hostPlacementFee.toFixed(2)} + tax`}</strong></span><span><small>Due at approval</small><strong>${approvalAmount.toLocaleString()}</strong></span></div>
            </div>
          </article>
          <div className="hosting-review-decision-card">
            <p className="marketplace-eyebrow">Your decision</p>
            <h2>Choose what happens next.</h2>
            <p>
              Review the details, then keep the applicant informed with one
              clear action.
            </p>
            {decisionError && <p className="hosting-review-snapshot-note">{decisionError}</p>}
            <button
              type="button"
              className="hosting-review-approve"
              onClick={() => setModal("approve")}
              disabled={status === "APPROVED"}
            >
              {status === "APPROVED"
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
      {detailModal && (
        <div className="hosting-review-modal-overlay" onClick={() => setDetailModal(null)}>
          <section className="hosting-review-modal hosting-review-detail-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="hosting-review-modal-close" aria-label="Close details" onClick={() => setDetailModal(null)}>×</button>
            <p className="marketplace-eyebrow">Application details</p>
            <h2>{detailModal === "employment" ? "Employment & income" : detailModal === "household" ? "Household" : detailModal === "guarantors" ? "Guarantors" : detailModal === "documents" ? "Documents" : "Payment authorization"}</h2>
            {detailModal === "employment" && <div className="hosting-review-detail-list"><div><span>Employment status</span><strong>{employment?.employmentType ?? "Not provided"}</strong></div><div><span>Employer or business</span><strong>{employment?.employerName ?? "Not provided"}</strong></div><div><span>Job title</span><strong>{employment?.jobTitle ?? "Not provided"}</strong></div><div><span>Annual income</span><strong>{employment ? `$${employment.annualIncome.toLocaleString()}` : "Not provided"}</strong></div><div><span>Verification</span><strong className={employment?.verificationStatus === "VERIFIED" ? "is-ready" : "is-warning"}>{employment?.verificationStatus ?? "Needs review"}</strong></div></div>}
            {detailModal === "household" && <div className="hosting-review-detail-list"><div><span>Primary tenant</span><strong>{applicantName}</strong></div><div><span>Adults listed</span><strong>{application.adultOccupantCount ?? 1}</strong></div>{occupants.map((occupant) => <div key={occupant.applicationOccupantID}><span>{occupant.firstName} {occupant.lastName}</span><strong>{occupant.occupantType}</strong></div>)}{occupants.length === 0 && <div><span>Additional occupants</span><strong>None listed</strong></div>}</div>}
            {detailModal === "guarantors" && (guarantors.length === 0 ? <div className="hosting-review-detail-empty"><strong>No guarantors added</strong><span>This application does not include a guarantor. No guarantor review is required.</span></div> : <div className="hosting-review-detail-list">{guarantors.map((guarantor) => <div className="hosting-review-guarantor-row" key={guarantor.tenantGuarantorID}><span><strong>{guarantor.firstName} {guarantor.lastName} · {guarantor.relationship}</strong><small>{guarantor.email || "Email not provided"} · {guarantor.phoneNumber || "Phone not provided"}</small></span><strong>{guarantor.status}</strong></div>)}</div>)}
            {detailModal === "documents" && <div className="hosting-review-detail-list">{documents.length === 0 ? <div><span>Documents</span><strong>None submitted</strong></div> : documents.map((document) => { const documentPath = document.url || document.storageReference; const documentTarget = document.url || (documentPath ? `${env.DOCUMENT_STORAGE_BASE_URL.replace(/\/$/, "")}/${document.storageContainer || "documents"}/${documentPath.replace(/^\/+/, "")}` : ""); return <a className={`hosting-review-document-link${documentTarget ? "" : "is-unavailable"}`} href={documentTarget || undefined} target="_blank" rel="noreferrer" key={document.leaseDocumentID}><span><strong>{document.originalFilename || document.documentType}</strong><small>{document.documentType}</small></span><strong className="is-ready">{documentTarget ? "View document" : document.documentStatus}</strong></a>; })}</div>}
            {detailModal === "payment" && <div className="hosting-review-detail-list"><div><span>PAD / ACSS debit</span><strong className={paymentAuthorized ? "is-ready" : "is-warning"}>{paymentAuthorized ? "Authorized" : "Pending"}</strong></div><div><span>Card fallback</span><strong className={application.tenant?.isCardRegistered ? "is-ready" : "is-warning"}>{application.tenant?.isCardRegistered ? "On file" : "Not on file"}</strong></div><div><span>Charge timing</span><strong>Only after approval</strong></div></div>}
            <button type="button" className="hosting-review-modal-dismiss" onClick={() => setDetailModal(null)}>Close details</button>
          </section>
        </div>
      )}
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
                  Monthly rent <b>${monthlyRent.toLocaleString()}</b>
                </span>
                <span>
                  Lease term <b>{application.requestedLeaseTermMonths ? `${application.requestedLeaseTermMonths} months` : "Not provided"}</b>
                </span>
                <span>
                  Start date <b>{dateOnly(application.desiredMoveInDate)}</b>
                </span>
                {securityDeposit > 0 && <span>
                  Security deposit <b>${securityDeposit.toLocaleString()}</b>
                </span>}
                <span>
                  Host placement fee <b>{isHostPlacementFeeLoading ? "Loading..." : hostPlacementFee === null ? "Unavailable" : `$${hostPlacementFee.toFixed(2)} + tax`}</b>
                </span>
                <span>
                  Due at approval <b>${approvalAmount.toLocaleString()}</b>
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
                disabled={isSavingDecision || (modal !== "approve" && !reason.trim())}
                onClick={() => void confirmAction()}
              >
                {isSavingDecision
                  ? "Saving..."
                  : modal === "approve"
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

