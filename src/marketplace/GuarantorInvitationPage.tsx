import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPublicGuarantorInvitation,
  respondToPublicGuarantorInvitation,
  type PublicGuarantorInvitation,
} from "../apis/useTenantGuarantor";
import "./GuarantorInvitationPage.css";

type PageState = "loading" | "ready" | "accepted" | "declined" | "error";

const formatMoney = (value?: string) => value || "Not provided";

export default function GuarantorInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const [invitation, setInvitation] = useState<PublicGuarantorInvitation | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [confirmed, setConfirmed] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setPageState("error");
      setError("This guarantor invitation link is incomplete.");
      return;
    }
    let cancelled = false;
    getPublicGuarantorInvitation(token)
      .then((result) => {
        if (cancelled) return;
        setInvitation(result);
        const status = result.status.toUpperCase();
        setPageState(status === "ACCEPTED" ? "accepted" : status === "DECLINED" ? "declined" : "ready");
      })
      .catch(() => {
        if (!cancelled) {
          setPageState("error");
          setError("This invitation may have expired or already been closed.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const respond = async (decision: "ACCEPT" | "DECLINE") => {
    if (!token) return;
    setError("");
    try {
      await respondToPublicGuarantorInvitation(token, decision);
      window.history.replaceState({}, "", `/guarantor-invite/${encodeURIComponent(token)}?response=${decision}`);
      setPageState(decision === "ACCEPT" ? "accepted" : "declined");
      setDeclineOpen(false);
    } catch (responseError) {
      setError(responseError instanceof Error ? responseError.message : "We could not record your response. Please try again.");
    }
  };

  const firstName = invitation?.guarantorName?.split(" ")[0] || "there";
  const isResponded = pageState === "accepted" || pageState === "declined";

  return (
    <main className="marketplace guarantor-invitation-page">
      <header className="guarantor-invitation-header">
        <a className="guarantor-invitation-brand" href="/" aria-label="Arcora home">
          <span className="guarantor-invitation-brand-mark"><span className="guarantor-invitation-brand-letter">a</span></span>
          <span>arcora</span>
        </a>
        <span className="guarantor-invitation-secure-label">Private invitation</span>
      </header>

      <section className="guarantor-invitation-shell">
        {pageState === "loading" && <div className="guarantor-invitation-state"><span className="guarantor-invitation-spinner" /><p>Loading your invitation...</p></div>}
        {pageState === "error" && <div className="guarantor-invitation-state"><span className="guarantor-invitation-state-icon">!</span><p className="marketplace-eyebrow">Invitation unavailable</p><h1>We could not open this invitation.</h1><p>{error}</p></div>}
        {invitation && isResponded && (
          <div className="guarantor-invitation-state">
            <span className={`guarantor-invitation-state-icon ${pageState === "accepted" ? "is-success" : "is-declined"}`}>{pageState === "accepted" ? "✓" : "–"}</span>
            <p className="marketplace-eyebrow">Guarantor response recorded</p>
            <h1>{pageState === "accepted" ? `Thank you, ${firstName}.` : "Your response has been recorded."}</h1>
            <p>{pageState === "accepted" ? "You have accepted the request to act as guarantor. Arcora will keep you updated as the application moves forward." : "The applicant and landlord will be notified that you declined this request."}</p>
          </div>
        )}
        {invitation && pageState === "ready" && (
          <div className="guarantor-invitation-content">
            <div className="guarantor-invitation-intro">
              <p className="marketplace-eyebrow">Guarantor request</p>
              <h1>Hello, {firstName}.</h1>
              <p>{invitation.tenantName} has asked you to act as a guarantor for their rental application.</p>
            </div>

            <section className="guarantor-invitation-card" aria-labelledby="guarantor-invitation-details">
              <div className="guarantor-invitation-card-heading">
                <div>
                  <p className="marketplace-eyebrow">Rental application</p>
                  <h2 id="guarantor-invitation-details">{invitation.listingTitle}</h2>
                </div>
                <span className="guarantor-invitation-status">Awaiting response</span>
              </div>
              <div className="guarantor-invitation-facts">
                <div><span>Tenant</span><strong>{invitation.tenantName}</strong></div>
                <div><span>Tenant phone</span><strong>{invitation.tenantPhone || "Not provided"}</strong></div>
                <div><span>Monthly rent</span><strong>{formatMoney(invitation.monthlyRent)}</strong></div>
                <div><span>Security deposit</span><strong>{formatMoney(invitation.securityDeposit)}</strong></div>
                <div><span>Lease term</span><strong>{invitation.leaseTerm || "Not provided"}</strong></div>
                <div><span>Guarantor</span><strong>{invitation.guarantorName}</strong></div>
              </div>
              {invitation.listingImageUrl && <img className="guarantor-invitation-listing-image" src={invitation.listingImageUrl} alt={invitation.listingTitle} />}
            </section>

            <div className="guarantor-invitation-note"><strong>What this means</strong><p>As guarantor, you may be responsible for the tenant's obligations under the final agreement if they are unable to meet them. Review the final lease and guarantor terms carefully before accepting.</p></div>

            <label className="guarantor-invitation-confirmation">
              <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
              <span>I have reviewed this request and understand that accepting may create financial obligations under the final guarantor agreement.</span>
            </label>
            {error && <p className="guarantor-invitation-error" role="alert">{error}</p>}
            <div className="guarantor-invitation-actions">
              <button type="button" className="guarantor-invitation-decline" onClick={() => setDeclineOpen(true)}>Decline request</button>
              <button type="button" className="guarantor-invitation-accept" disabled={!confirmed} onClick={() => void respond("ACCEPT")}>Accept guarantor request</button>
            </div>
            {declineOpen && <div className="guarantor-invitation-decline-panel"><p>Are you sure you want to decline this guarantor request?</p><div><button type="button" className="guarantor-invitation-cancel" onClick={() => setDeclineOpen(false)}>Cancel</button><button type="button" className="guarantor-invitation-decline-confirm" onClick={() => void respond("DECLINE")}>Confirm decline</button></div></div>}
          </div>
        )}
      </section>
      <footer className="guarantor-invitation-footer">Arcora keeps your response private and shares it only with the people involved in this rental application.</footer>
    </main>
  );
}
