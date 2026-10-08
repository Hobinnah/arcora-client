import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { acceptedInvitationStorageKey, respondToTenantInvitation } from "../apis/useTenantInvitation";
import { useAuth } from "../hooks/useAuth";
import MarketplaceFooter from "./MarketplaceFooter";
import TenantHeader from "./TenantHeader";
import "./TenantInvitationResponsePage.css";

type ResponseState = "loading" | "success" | "error";
const invitationSetupBasePath = "/tenant/invitation/setup";

export default function TenantInvitationResponsePage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const token = searchParams.get("token") ?? "";
  const requestedResponse = searchParams.get("response")?.toUpperCase();
  const response = requestedResponse === "ACCEPT" || requestedResponse === "DECLINE"
    ? requestedResponse
    : null;
  const invalidLink = !token || !response;
  const requestStarted = useRef<string | null>(null);
  const [state, setState] = useState<ResponseState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const invitationSetupPath = invitationId
    ? `${invitationSetupBasePath}?invitationId=${encodeURIComponent(invitationId)}`
    : invitationSetupBasePath;

  useEffect(() => {
    const requestKey = `${token}:${response ?? "INVALID"}`;
    if (requestStarted.current === requestKey) return;
    requestStarted.current = requestKey;

    if (invalidLink) return;

    void respondToTenantInvitation(token, response)
      .then((result) => {
        if (response === "ACCEPT" && result.tenantInvitationID) {
          setInvitationId(result.tenantInvitationID);
          try {
            localStorage.setItem(acceptedInvitationStorageKey, result.tenantInvitationID);
          } catch {
            // Storage is optional; the query string still carries the invitation ID.
          }
        }
        setState("success");
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "";
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        setErrorMessage(
          /invalid invitation token|expired invitation/i.test(message) || status === 404
            ? "This invitation link is invalid or may have expired. Please ask the landlord to send a new invitation."
            : message || "We could not process this invitation. Please try again or contact the landlord.",
        );
        setState("error");
      });
  }, [invalidLink, response, token]);
  const pageState = invalidLink ? "error" : state;
  const pageError = invalidLink
    ? "This invitation link is missing a valid token or response."
    : errorMessage;

  return (
    <main className="marketplace tenant-invitation-response-page">
      <TenantHeader />
      <section className="tenant-invitation-response-layout">
        <div className={`tenant-invitation-response-card is-${pageState}`} aria-live="polite">
          {pageState === "loading" ? (
            <>
              <p className="marketplace-eyebrow">Tenant invitation</p>
              <h1>Processing your response…</h1>
            </>
          ) : pageState === "success" ? (
            <>
              <span>{response === "ACCEPT" ? "✓" : "–"}</span>
              <p className="marketplace-eyebrow">Tenant invitation</p>
              <h1>{response === "ACCEPT" ? "Invitation accepted" : "Invitation declined"}</h1>
              <p>
                {response === "ACCEPT"
                  ? "Your response was recorded. Sign in or create an account to continue with your tenant setup."
                  : "Your response was recorded. The landlord will be notified."}
              </p>
              {response === "ACCEPT" ? (
                isAuthenticated ? (
                  <Link className="tenant-invitation-response-button" to={invitationSetupPath}>
                    Continue tenant setup
                  </Link>
                ) : (
                  <div className="tenant-invitation-response-actions">
                    <Link
                      className="tenant-invitation-response-button"
                      to={`/login?redirect_url=${encodeURIComponent(invitationSetupPath)}`}
                    >
                      Log in
                    </Link>
                    <Link
                      className="tenant-invitation-response-button"
                      to={`/register?redirect_url=${encodeURIComponent(invitationSetupPath)}`}
                    >
                      Sign up
                    </Link>
                  </div>
                )
              ) : (
                <Link className="tenant-invitation-response-button" to="/">Return to Arcora</Link>
              )}
            </>
          ) : (
            <>
              <p className="marketplace-eyebrow">Tenant invitation</p>
              <h1>We couldn’t process this response.</h1>
              <p role="alert">{pageError}</p>
              <Link className="tenant-invitation-response-button" to="/">Return to Arcora</Link>
            </>
          )}
        </div>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
