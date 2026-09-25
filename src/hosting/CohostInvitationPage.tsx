import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCohostInviteDetails, respondToCohostInvitation, type CohostInvitationDetails } from "../apis/useOrganizationMember";
import { CheckIcon, MailIcon, ShieldIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import "../marketplace/MarketplaceHome.css";
import "./CohostInvitationPage.css";

type InviteResponse = "ACCEPT" | "DECLINE";
type InviteStatus = "loading" | "ready" | "submitting" | "success" | "unavailable" | "error";

const STORAGE_KEY = "arcora:cohost-invite";

const readStoredContext = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}") as { token?: string; response?: InviteResponse };
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return {};
  }
};

const errorMessage = (error: unknown) => {
  const response = (error as { response?: { status?: number; data?: { message?: string } } })?.response;
  if (response?.status === 400 || response?.status === 404) {
    return response.data?.message || "This invitation is invalid, expired, or has already been used.";
  }
  return error instanceof Error ? error.message : "We could not verify this invitation. Please try again.";
};

const isMissingInviteDetailsEndpoint = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status === 404;

export default function CohostInvitationPage() {
  const { token: routeToken = "" } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken, currentUser, isAuthenticated } = useAuth();
  const stored = readStoredContext();
  const queryResponse = new URLSearchParams(location.search).get("response")?.toUpperCase();
  const initialResponse = queryResponse === "ACCEPT" || queryResponse === "DECLINE" ? queryResponse : stored.response;
  const token = routeToken || stored.token || "";
  const [status, setStatus] = useState<InviteStatus>(token ? "loading" : "error");
  const [details, setDetails] = useState<CohostInvitationDetails | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<InviteResponse | undefined>(initialResponse);
  const [message, setMessage] = useState(token ? "" : "This invitation link is missing its token.");

  const invitePath = `/cohost-invite/${encodeURIComponent(token)}${initialResponse ? `?response=${initialResponse}` : ""}`;
  const signedInEmail = currentUser?.user?.email?.trim().toLowerCase() || "";
  const emailMatches = !details || !signedInEmail || details.email.trim().toLowerCase() === signedInEmail;
  const authIsHydrating = currentUser === undefined || authToken === undefined || isAuthenticated === undefined;
  const hasValidSession = Boolean(isAuthenticated && currentUser && (authToken || currentUser.accessToken));

  useEffect(() => {
    if (!token) return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, response: initialResponse }));
    if (authIsHydrating) return;
    if (!hasValidSession) {
      navigate(`/login?redirect_url=${encodeURIComponent(invitePath)}`, { replace: true });
      return;
    }
    let cancelled = false;
    void getCohostInviteDetails(token)
      .then((inviteDetails) => {
        if (cancelled) return;
        setDetails(inviteDetails);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (isMissingInviteDetailsEndpoint(error)) {
          setStatus("unavailable");
          return;
        }
        setMessage(errorMessage(error));
        setStatus("error");
      });
    return () => { cancelled = true; };
  }, [authIsHydrating, hasValidSession, initialResponse, invitePath, navigate, token]);

  const submitResponse = async (response: InviteResponse) => {
    if (!details || !emailMatches || status === "submitting") return;
    setStatus("submitting");
    setMessage("");
    try {
      const refreshedDetails = await getCohostInviteDetails(token);
      if (refreshedDetails.email.trim().toLowerCase() !== signedInEmail) {
        setDetails(refreshedDetails);
        setMessage(`This invitation was sent to ${refreshedDetails.email}. Sign in with that email to continue.`);
        setStatus("error");
        return;
      }
      await respondToCohostInvitation(token, response);
      sessionStorage.removeItem(STORAGE_KEY);
      setSelectedResponse(response);
      setStatus("success");
    } catch (error) {
      setMessage(errorMessage(error));
      setStatus("error");
    }
  };

  const expiresAt = details?.expiresAtUtc
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(details.expiresAtUtc))
    : "";

  return (
    <main className="marketplace cohost-invite-page">
      <header className="cohost-invite-header"><a className="marketplace-brand" href="/" aria-label="Arcora home"><span className="marketplace-brand-mark"><span className="marketplace-brand-letter">a</span></span><span>arcora</span></a></header>
      <section className="cohost-invite-shell">
        {status === "loading" ? (
          <div className="cohost-invite-state" role="status"><i /><h1>Checking your invitation</h1><p>Verifying the secure invitation details.</p></div>
        ) : status === "success" ? (
          <div className="cohost-invite-state is-success"><span className="cohost-invite-state-icon"><CheckIcon /></span><p className="cohost-invite-eyebrow">Invitation complete</p><h1>{selectedResponse === "ACCEPT" ? "You are now a co-host." : "Invitation declined."}</h1><p>{selectedResponse === "ACCEPT" ? "Your organization access is ready." : "The organization has been notified of your decision."}</p><button type="button" onClick={() => selectedResponse === "ACCEPT" ? window.location.assign("/hosting/listings") : navigate("/")}>{selectedResponse === "ACCEPT" ? "Go to listings" : "Return home"}</button></div>
        ) : status === "unavailable" ? (
          <div className="cohost-invite-state"><span className="cohost-invite-state-icon"><ShieldIcon /></span><p className="cohost-invite-eyebrow">Invitation saved</p><h1>Your invitation link is ready to resume.</h1><p>Arcora preserved this invitation securely. Invite verification and final acceptance will be available when the backend invitation-details endpoint is enabled.</p><button type="button" onClick={() => navigate("/")}>Return home</button></div>
        ) : status === "error" ? (
          <div className="cohost-invite-state is-error"><span className="cohost-invite-state-icon">!</span><p className="cohost-invite-eyebrow">Invitation unavailable</p><h1>We could not complete this invitation.</h1><p>{message}</p>{details && !emailMatches && <button type="button" onClick={() => navigate(`/login?redirect_url=${encodeURIComponent(invitePath)}`)}>Sign in with {details.email}</button>}<a href="mailto:support@arcora.ca">Contact support or request a new invite</a></div>
        ) : details ? (
          <article className="cohost-invite-card">
            <div className="cohost-invite-card-mark"><ShieldIcon /></div>
            <p className="cohost-invite-eyebrow">Co-host invitation</p>
            <h1>Join {details.organizationName}</h1>
            <p className="cohost-invite-intro">You have been invited to help manage this organization on Arcora.</p>
            <dl>
              <div><dt><MailIcon /> Invited email</dt><dd>{details.email}</dd></div>
              <div><dt>Access level</dt><dd>{details.cohostAccess}</dd></div>
              {details.phoneNumber && <div><dt>Phone</dt><dd>{details.phoneNumber}</dd></div>}
              <div><dt>Expires</dt><dd>{expiresAt}</dd></div>
            </dl>
            {!emailMatches ? <div className="cohost-invite-warning">This invite belongs to {details.email}. You are signed in as {signedInEmail}.</div> : null}
            <div className="cohost-invite-actions">
              {selectedResponse ? <button type="button" className={selectedResponse === "ACCEPT" ? "is-primary" : "is-decline"} disabled={!emailMatches || status === "submitting"} onClick={() => void submitResponse(selectedResponse)}>{status === "submitting" ? "Submitting..." : selectedResponse === "ACCEPT" ? "Accept invitation" : "Decline invitation"}</button> : <><button type="button" className="is-decline" disabled={!emailMatches || status === "submitting"} onClick={() => void submitResponse("DECLINE")}>Decline</button><button type="button" className="is-primary" disabled={!emailMatches || status === "submitting"} onClick={() => void submitResponse("ACCEPT")}>{status === "submitting" ? "Submitting..." : "Accept invitation"}</button></>}
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
