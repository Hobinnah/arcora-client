import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDemoInvitation,
  acceptDemoInvitation,
} from "../hosting/tenantInvitationDemo";
import TenantHeader from "./TenantHeader";
import MarketplaceFooter from "./MarketplaceFooter";
import "../hosting/HostingApplicationsPage.css";
import { AuthContext } from "../contexts/AuthProvider";

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const invitation = getDemoInvitation(token);
  useEffect(() => { if (invitation && auth && !auth.isAuthenticated) { localStorage.setItem("arcora:pending-invite", `/accept-invite/${token}`); navigate(`/login?redirect_url=${encodeURIComponent(`/accept-invite/${token}`)}`, { replace: true }); } }, [auth, invitation, navigate, token]);
  const [accepted, setAccepted] = useState(invitation?.status === "ACCEPTED");
  const [confirmed, setConfirmed] = useState(false);
  const [occupants, setOccupants] = useState(0);
  const acceptInvitation = () => {
    if (token && confirmed) {
      acceptDemoInvitation(token);
      setAccepted(true);
    }
  };

  return (
    <main className="marketplace hosting-accept-invitation-page">
      <TenantHeader />
      <section className="hosting-accept-layout">
        {!invitation ? (
          <div className="hosting-invite-success">
            <h1>Invitation not found</h1>
            <p>This invitation may have expired or already been removed.</p>
            <button
              type="button"
              className="hosting-invite-primary"
              onClick={() => navigate("/")}
            >
              Return home
            </button>
          </div>
        ) : accepted ? (
          <div className="hosting-invite-success">
            <span>✓</span>
            <p className="marketplace-eyebrow">Lease invitation accepted</p>
            <h1>Welcome home, {invitation.tenantName.split(" ")[0]}.</h1>
            <p>
              Your lease is ready for the next step. Arcora will keep the terms,
              occupants, and documents together in one place.
            </p>
            <div>
              <span>Status</span>
              <strong>Accepted</strong>
              <span>Lease start</span>
              <strong>{invitation.startDate}</strong>
              <span>Monthly rent</span>
              <strong>${Number(invitation.rent).toLocaleString()}</strong>
            </div>
            <button
              type="button"
              className="hosting-invite-primary"
              onClick={() => navigate("/tenant/leases/demo-lease-001/payment")}
            >
              Set up rent payments
            </button>
          </div>
        ) : (
          <div className="hosting-accept-main">
            <p className="marketplace-eyebrow">Private lease invitation</p>
            <h1>Review your lease before accepting.</h1>
            <p className="hosting-accept-intro">
              {invitation.property}. This invitation was prepared for{" "}
              {invitation.tenantName}.
            </p>
            <section className="hosting-accept-card">
              <div className="hosting-accept-card-heading">
                <div>
                  <span className="marketplace-eyebrow">Lease terms</span>
                  <h2>{invitation.property}</h2>
                </div>
                <span className="hosting-application-status status-under-screening">
                  Pending acceptance
                </span>
              </div>
              <div className="hosting-review-facts">
                <div>
                  <span>Lease start</span>
                  <strong>{invitation.startDate}</strong>
                </div>
                <div>
                  <span>Lease term</span>
                  <strong>{invitation.term}</strong>
                </div>
                <div>
                  <span>Monthly rent</span>
                  <strong>${Number(invitation.rent).toLocaleString()}</strong>
                </div>
                <div>
                  <span>Security deposit</span>
                  <strong>
                    ${Number(invitation.deposit).toLocaleString()}
                  </strong>
                </div>
              </div>
              <div className="hosting-accept-household">
                <strong>Household</strong>
                <span>You are the primary tenant.</span>
                <label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={occupants}
                    onChange={(event) =>
                      setOccupants(Number(event.target.value))
                    }
                  />{" "}
                  additional adult occupants
                </label>
              </div>
            </section>
            <div className="hosting-invite-note">
              <span>🔒</span>
              <span>
                Review the full lease and house rules before accepting. The
                lease becomes active only according to its start date.
              </span>
            </div>
            <label className="hosting-accept-consent">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              <span>
                I confirm these lease terms are correct and agree to review and
                sign the lease electronically.
              </span>
            </label>
            <button
              type="button"
              className="hosting-invite-primary"
              disabled={!confirmed}
              onClick={acceptInvitation}
            >
              Accept invitation &amp; continue
            </button>
            <small className="hosting-accept-footnote">
              You can decline or ask the landlord a question before accepting.
            </small>
          </div>
        )}
      </section>
      <MarketplaceFooter />
    </main>
  );
}
