import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketplaceFooter from "../marketplace/MarketplaceFooter";
import { fetchTenantInvitationsByOrganization, retryTenantInvitationEmail } from "../apis/useTenantInvitation";
import type { TenantInvitation } from "../types/TenantInvitation";
import { useAuth } from "../hooks/useAuth";
import { getCurrentOrganizationMember } from "./organizationMemberIdentity";
import HostingHeader from "./HostingHeader";
import "./HostingInvitationsPage.css";

type InvitationFilter = "All" | "Pending" | "Accepted" | "Declined" | "Revoked" | "Expired";

const invitationStatus = (invitation: TenantInvitation) => {
  const status = (invitation.status ?? "").trim().toUpperCase();
  if (["PENDING", "INVITED"].includes(status) && invitation.expiresAt) {
    const expiry = new Date(invitation.expiresAt);
    if (!Number.isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) return "EXPIRED";
  }
  return status || "UNKNOWN";
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const displayStatus = (status: string) =>
  status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());

const quoteMoney = (amount?: number | null, currency?: string | null) =>
  amount == null || !currency ? "Unavailable (legacy invitation)"
    : `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

export default function HostingInvitationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = Number(currentUser?.user?.id ?? currentUser?.user?.userId);
  const hasValidUser = Number.isFinite(userID) && userID > 0;
  const [invitations, setInvitations] = useState<TenantInvitation[]>([]);
  const [organizationID, setOrganizationID] = useState("");
  const [filter, setFilter] = useState<InvitationFilter>("All");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryingID, setRetryingID] = useState("");
  const [retryError, setRetryError] = useState("");

  const retryEmail = async (id: string) => {
    setRetryingID(id);
    setRetryError("");
    try {
      const result = await retryTenantInvitationEmail(id);
      setInvitations((current) => current.map((invitation) =>
        invitation.tenantInvitationID === id ? { ...invitation, ...result } : invitation));
    } catch (error) {
      setRetryError(error instanceof Error ? error.message : "Email retry failed.");
    } finally {
      setRetryingID("");
    }
  };

  useEffect(() => {
    if (!Number.isFinite(userID) || userID <= 0) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const member = await getCurrentOrganizationMember(userID);
        if (!member?.organizationID) {
          throw new Error("No organization membership was found for this account.");
        }
        const result = await fetchTenantInvitationsByOrganization(member.organizationID);
        if (!cancelled) {
          setOrganizationID(member.organizationID);
          setInvitations(result);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "We could not load your invitations.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userID]);

  const filteredInvitations = useMemo(() => invitations.filter((invitation) => {
    const status = invitationStatus(invitation);
    const matchesFilter = filter === "All"
      || (filter === "Pending" && ["PENDING", "INVITED"].includes(status))
      || status === filter.toUpperCase();
    const searchable = `${invitation.name ?? ""} ${invitation.email ?? ""} ${invitation.phoneNumber ?? ""} ${invitation.listingID ?? ""} ${status}`.toLowerCase();
    return matchesFilter && searchable.includes(query.trim().toLowerCase());
  }), [filter, invitations, query]);

  const countFor = (status: InvitationFilter) => invitations.filter((invitation) => {
    const currentStatus = invitationStatus(invitation);
    if (status === "All") return true;
    if (status === "Pending") return ["PENDING", "INVITED"].includes(currentStatus);
    return currentStatus === status.toUpperCase();
  }).length;

  return (
    <main className="marketplace hosting-invitations-page">
      <HostingHeader />
      <section className="hosting-invitations-content">
        <div className="hosting-invitations-heading">
          <div>
            <p className="marketplace-eyebrow">Direct lease invitations</p>
            <h1>Track your tenant invitations.</h1>
            <p>See which tenants have responded and when invitations were accepted or expired.</p>
          </div>
          <button type="button" onClick={() => navigate("/hosting/invitations/new")}>Invite a tenant</button>
        </div>

        <div className="hosting-invitations-toolbar">
          <div className="hosting-invitations-filters" role="tablist" aria-label="Invitation status">
            {(["All", "Pending", "Accepted", "Declined", "Revoked", "Expired"] as InvitationFilter[]).map((option) => (
              <button
                type="button"
                role="tab"
                aria-selected={filter === option}
                className={filter === option ? "is-active" : ""}
                key={option}
                onClick={() => setFilter(option)}
              >
                {option}<span>{countFor(option)}</span>
              </button>
            ))}
          </div>
          <input
            aria-label="Search tenant invitations"
            placeholder="Search tenants or listings"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {retryError && <p role="alert">{retryError}</p>}
        {!hasValidUser ? (
          <div className="hosting-invitations-empty is-error" role="alert">Your signed-in account could not be identified.</div>
        ) : isLoading ? (
          <div className="hosting-invitations-empty" role="status">Loading invitations…</div>
        ) : loadError ? (
          <div className="hosting-invitations-empty is-error" role="alert">{loadError}</div>
        ) : filteredInvitations.length ? (
          <div className="hosting-invitations-list">
            {filteredInvitations.map((invitation) => {
              const status = invitationStatus(invitation);
              const tenantName = invitation.name?.trim() || invitation.email || "Tenant";
              return (
                <article className="hosting-invitation-card" key={invitation.tenantInvitationID}>
                  <div className="hosting-invitation-card-heading">
                    <div>
                      <h2>{tenantName}</h2>
                      <p>{invitation.email || "No email provided"}</p>
                    </div>
                    <span className={`hosting-invitation-status status-${status.toLowerCase()}`}>
                      {displayStatus(status)}
                    </span>
                  </div>
                  <dl>
                    <div><dt>Listing ID</dt><dd>{invitation.listingID || "Not provided"}</dd></div>
                    <div><dt>Invitation type</dt><dd>{invitation.invitationPurpose || "Direct lease invitation"}</dd></div>
                    <div><dt>Quoted monthly rent</dt><dd>{quoteMoney(invitation.price, invitation.currency)}</dd></div>
                    <div><dt>Quoted security deposit</dt><dd>{quoteMoney(invitation.securityDepositAmount, invitation.currency)}</dd></div>
                    <div><dt>Lease start</dt><dd>{formatDate(invitation.startDate)}</dd></div>
                    <div><dt>Lease end</dt><dd>{formatDate(invitation.endDate)}</dd></div>
                    <div><dt>Lease term</dt><dd>{invitation.leaseTermMonths ? `${invitation.leaseTermMonths} months` : "Unavailable"}</dd></div>
                    <div><dt>Created</dt><dd>{formatDate(invitation.capturedDate)}</dd></div>
                    <div><dt>Email delivery</dt><dd>{invitation.emailDeliveryStatus === "SENT"
                      ? "Accepted by mail server"
                      : invitation.emailDeliveryStatus === "FAILED"
                        ? "Failed - automatic retry scheduled"
                        : invitation.emailDeliveryStatus
                          ? displayStatus(invitation.emailDeliveryStatus)
                          : "Not tracked (legacy invitation)"}</dd></div>
                    {invitation.emailSentAt && <div><dt>Email sent</dt><dd>{formatDate(invitation.emailSentAt)}</dd></div>}
                    <div><dt>Expires</dt><dd>{formatDate(invitation.expiresAt)}</dd></div>
                    <div><dt>Responded</dt><dd>{formatDate(invitation.acceptedAt)}</dd></div>
                    {invitation.revokedAt && <div><dt>Revoked</dt><dd>{formatDate(invitation.revokedAt)}</dd></div>}
                  </dl>
                  {status === "PENDING" && invitation.emailDeliveryStatus === "FAILED" && (
                    <button type="button" disabled={Boolean(retryingID)}
                      onClick={() => void retryEmail(invitation.tenantInvitationID)}>
                      {retryingID === invitation.tenantInvitationID ? "Requesting retry..." : "Retry email"}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="hosting-invitations-empty">
            <strong>{organizationID ? "No invitations match this view." : "No invitations found."}</strong>
            <span>Try another status or search, or send a new tenant invitation.</span>
          </div>
        )}
      </section>
      <MarketplaceFooter />
    </main>
  );
}
