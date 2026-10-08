import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckIcon, ShieldIcon } from "../components/Icons";
import { createTenant, getTenantByUserID } from "../apis/useTenant";
import { acceptedInvitationStorageKey, createLeaseFromTenantInvitation, fetchPendingInvitationsForMe, getAcceptedInvitationForMe } from "../apis/useTenantInvitation";
import type { TenantInvitation } from "../types/TenantInvitation";
import {
  createPaymentOnboardingSetupIntent,
  getPaymentOnboardingStatus,
  savePaymentOnboardingMethod,
  startPaymentOnboarding,
} from "../apis/usePaymentOnboarding";
import { useAuth } from "../hooks/useAuth";
import MarketplaceFooter from "./MarketplaceFooter";
import TenantHeader from "./TenantHeader";
import "./TenantLeaseExperience.css";
import "./TenantInvitationSetupPage.css";

type PaymentStatus = {
  hasVerifiedPad: boolean;
  hasVerifiedCard: boolean;
  padMandateActive: boolean;
  isReady: boolean;
};

type MethodFeedback = {
  type: "success" | "error";
  message: string;
};

function CardSetupForm({
  tenantId,
  cardholderName,
  email,
  authorized,
  busy,
  onSaved,
  onFeedback,
  onBusyChange,
}: {
  tenantId: string;
  cardholderName: string;
  email: string;
  authorized: boolean;
  busy: boolean;
  onSaved: () => Promise<void>;
  onFeedback: (feedback: MethodFeedback | null) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState(cardholderName);

  const saveCard = async () => {
    if (!authorized) {
      onFeedback({ type: "error", message: "Please authorize the use of these payment methods before saving them." });
      return;
    }
    if (!stripe || !elements) {
      onFeedback({ type: "error", message: "Secure card entry is still loading. Please try again." });
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onFeedback({ type: "error", message: "Card entry is not ready yet. Please try again." });
      return;
    }

    onBusyChange(true);
    onFeedback(null);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: name.trim() || cardholderName, email },
      });
      if (error) throw new Error(error.message || "Your card could not be verified by Stripe.");
      if (!paymentMethod?.id) throw new Error("Stripe did not return a payment method ID for the card.");

      await savePaymentOnboardingMethod({
        tenantID: tenantId,
        providerPaymentMethodID: paymentMethod.id,
        methodKind: "CARD",
      });
      onFeedback({ type: "success", message: "Card details saved successfully." });
      await onSaved();
    } catch (error) {
      onFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Card setup could not be completed. Please try again.",
      });
    } finally {
      onBusyChange(false);
    }
  };

  return (
    <div className="tenant-invitation-setup-fields">
      <label className="tenant-lease-form-field">
        <span>Name on card</span>
        <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="cc-name" />
      </label>
      <label className="tenant-lease-form-field">
        <span>Card details</span>
        <CardElement
          options={{
            style: {
              base: {
                color: "#1f2a2d",
                fontSize: "14px",
                fontFamily: "system-ui, sans-serif",
                "::placeholder": { color: "#7f8f91" },
              },
            },
          }}
        />
      </label>
      <button className="tenant-lease-primary" type="button" disabled={!authorized || busy || !stripe || !elements} onClick={() => void saveCard()}>
        <CheckIcon /> {busy ? "Saving…" : "Save card"}
      </button>
    </div>
  );
}

export default function TenantInvitationSetupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [invitationId, setInvitationId] = useState<string | null>(() => {
    const fromQuery = searchParams.get("invitationId");
    if (fromQuery) return fromQuery;
    try {
      return localStorage.getItem(acceptedInvitationStorageKey);
    } catch {
      return null;
    }
  });
  const [lookingUpInvitation, setLookingUpInvitation] = useState(false);
  const [leaseId, setLeaseId] = useState<string | null>(null);
  const [creatingLease, setCreatingLease] = useState(false);
  const [invitationQuote, setInvitationQuote] = useState<TenantInvitation | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [leaseError, setLeaseError] = useState("");
  const leaseRequested = useRef(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [publishableKey, setPublishableKey] = useState("");
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [savingMethod, setSavingMethod] = useState<"PAD" | "CARD" | null>(null);
  const [error, setError] = useState("");
  const [padSaved, setPadSaved] = useState(false);
  const [padFeedback, setPadFeedback] = useState<MethodFeedback | null>(null);
  const [cardFeedback, setCardFeedback] = useState<MethodFeedback | null>(null);
  const [replacingCard, setReplacingCard] = useState(false);
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [padForm, setPadForm] = useState({
    accountHolderName: "",
    institutionNumber: "",
    transitNumber: "",
    accountNumber: "",
  });

  const user = currentUser?.user;
  const userId = user?.id ?? user?.userId;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  const stripePromise = useMemo(
    () => publishableKey ? loadStripe(publishableKey) : null,
    [publishableKey],
  );
  const isPadVerified = Boolean(status?.hasVerifiedPad && status?.padMandateActive);
  const isCardVerified = Boolean(status?.hasVerifiedCard);
  const methodsSaved = Boolean((padSaved || isPadVerified) && isCardVerified);
  const paymentReady = Boolean(status?.isReady);
  const quoteReady = invitationQuote?.tenantInvitationID === invitationId
    && invitationQuote.price != null && invitationQuote.securityDepositAmount != null
    && Boolean(invitationQuote.currency && invitationQuote.startDate && invitationQuote.endDate && invitationQuote.leaseTermMonths);
  const canResolveLease = invitationQuote?.tenantInvitationID === invitationId
    && (quoteReady || Boolean(invitationQuote.leaseID));

  useEffect(() => {
    if (!invitationId || !userId) return;
    let cancelled = false;
    void getAcceptedInvitationForMe(invitationId).then((invitation) => {
      if (!cancelled) {
        setInvitationQuote(invitation);
        setQuoteError(!invitation.leaseID && (invitation.price == null || invitation.securityDepositAmount == null
          || !invitation.currency || !invitation.startDate || !invitation.endDate || !invitation.leaseTermMonths)
          ? "This invitation has no complete saved quote. Ask the landlord to revoke it and send a new invitation."
          : "");
      }
    }).catch((loadError: unknown) => {
      if (!cancelled) setQuoteError(loadError instanceof Error ? loadError.message : "Unable to load the invitation quote.");
    });
    return () => { cancelled = true; };
  }, [invitationId, userId]);

  useEffect(() => {
    if (isPadVerified) setPadSaved(true);
  }, [isPadVerified]);

  const createLease = useCallback(async () => {
    if (!invitationId || !tenantId) return;
    if (!canResolveLease) {
      setLeaseError("The saved invitation terms must load before creating your lease.");
      return;
    }
    leaseRequested.current = true;
    setCreatingLease(true);
    setLeaseError("");
    try {
      const lease = await createLeaseFromTenantInvitation(invitationId, tenantId);
      setLeaseId(lease.leaseID);
      try {
        localStorage.removeItem(acceptedInvitationStorageKey);
      } catch {
        // Ignore storage cleanup failures.
      }
    } catch (createError) {
      setLeaseError(
        createError instanceof Error && createError.message
          ? createError.message
          : "Your payment methods are saved, but the lease could not be created. Please try again.",
      );
    } finally {
      setCreatingLease(false);
    }
  }, [invitationId, tenantId, canResolveLease]);

  useEffect(() => {
    if (paymentReady && canResolveLease && !leaseRequested.current) void createLease();
  }, [createLease, paymentReady, canResolveLease]);

  // Recover the accepted invitation when the tenant returns without the email link (new device, cleared storage, normal login).
  useEffect(() => {
    if (invitationId || !userId) return;
    let cancelled = false;
    setLookingUpInvitation(true);
    fetchPendingInvitationsForMe()
      .then((pending) => {
        if (cancelled || !pending.length) return;
        const recovered = pending[0].tenantInvitationID;
        setInvitationId(recovered);
        try {
          localStorage.setItem(acceptedInvitationStorageKey, recovered);
        } catch {
          // Storage is optional.
        }
      })
      .catch((lookupError: unknown) => {
        if (!cancelled) setQuoteError(lookupError instanceof Error ? lookupError.message : "Unable to find your accepted invitation.");
      })
      .finally(() => {
        if (!cancelled) setLookingUpInvitation(false);
      });
    return () => {
      cancelled = true;
    };
  }, [invitationId, userId]);

  useEffect(() => {
    if (!userId) {
      setError("Your signed-in account is not available. Please log in again.");
      setProfileLoading(false);
      return;
    }

    let cancelled = false;
    const ensureTenant = async () => {
      try {
        let tenant = await getTenantByUserID(userId);
        if (!tenant?.tenantID) {
          const now = new Date().toISOString();
          const tenantPayload = {
            tenantID: null,
            code: `TEN-${userId}`,
            userID: userId,
            description: "Tenant profile created from an accepted invitation.",
            phoneNumber: user?.phoneNumber ?? "",
            photoUrl: user?.imageUrl ?? "",
            dateOfBirth: user?.dateOfBirth || "",
            profileStatus: "COMPLETE",
            isActive: true,
            isPADRegistered: false,
            isCardRegistered: false,
            capturedBy: fullName,
            capturedDate: now,
            updatedBy: fullName,
            updatedDate: now,
          };
          tenant = await createTenant(tenantPayload);
        }
        if (!tenant?.tenantID) throw new Error("Your tenant profile could not be created.");
        if (!cancelled) setTenantId(tenant.tenantID);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load your tenant profile.");
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    };

    void ensureTenant();
    return () => {
      cancelled = true;
    };
  }, [fullName, user?.dateOfBirth, user?.imageUrl, user?.phoneNumber, userId]);

  useEffect(() => {
    if (!tenantId) return;

    let cancelled = false;
    const loadPaymentSetup = async () => {
      try {
        const onboarding = await startPaymentOnboarding(tenantId);
        if (!onboarding.publishableKey) {
          throw new Error("Secure card setup is unavailable right now. Please try again later.");
        }
        if (!cancelled) {
          setPublishableKey(onboarding.publishableKey);
          setError("");
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to initialize secure payment setup.");
        }
      }

      try {
        const paymentStatus = await getPaymentOnboardingStatus(tenantId);
        if (!cancelled) {
          setStatus(paymentStatus);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load payment setup status.");
        }
      }
    };

    void loadPaymentSetup();
    return () => {
      cancelled = true;
    };
  }, [tenantId]);

  const refreshPaymentStatus = async () => {
    if (!tenantId) throw new Error("Your tenant profile is not available.");
    const paymentStatus = await getPaymentOnboardingStatus(tenantId);
    setStatus(paymentStatus);
  };

  const handleRefreshStatus = async () => {
    setRefreshingStatus(true);
    try {
      await refreshPaymentStatus();
      setError("");
    } catch {
      setError("Unable to refresh payment setup status. Please try again.");
    } finally {
      setRefreshingStatus(false);
    }
  };

  const savePad = async () => {
    if (!tenantId) {
      setError("Your tenant profile is not available.");
      return;
    }
    if (!authorized) {
      setError("Please authorize the use of these payment methods before saving them.");
      return;
    }
    if (
      !padForm.accountHolderName.trim()
      || !/^\d{3}$/.test(padForm.institutionNumber)
      || !/^\d{5}$/.test(padForm.transitNumber)
      || !/^\d+$/.test(padForm.accountNumber)
    ) {
      setError("Enter the account holder name, a 3-digit institution number, a 5-digit transit number, and a numeric account number.");
      return;
    }

    setSavingMethod("PAD");
    setError("");
    setPadFeedback(null);
    try {
      const setup = await createPaymentOnboardingSetupIntent(tenantId, "PAD");
      if (!setup.clientSecret) throw new Error("Stripe did not provide a secure bank setup session.");
      const stripe = await loadStripe(setup.publishableKey || publishableKey);
      if (!stripe) throw new Error("Stripe failed to initialize.");

      const { error: stripeError, setupIntent } = await stripe.confirmAcssDebitSetup(setup.clientSecret, {
        payment_method: {
          acss_debit: {
            institution_number: padForm.institutionNumber,
            transit_number: padForm.transitNumber,
            account_number: padForm.accountNumber,
          },
          billing_details: {
            name: padForm.accountHolderName.trim(),
            email: user?.email || "",
          },
        },
      });
      if (stripeError) throw new Error(stripeError.message || "Your bank account could not be verified by Stripe.");
      const paymentMethodId = String(setupIntent?.payment_method || "");
      if (!paymentMethodId) throw new Error("Stripe did not return a payment method ID for the bank account.");

      await savePaymentOnboardingMethod({
        tenantID: tenantId,
        providerPaymentMethodID: paymentMethodId,
        methodKind: "PAD",
      });
      setPadSaved(true);
      setPadFeedback({ type: "success", message: "Bank account details saved successfully. You can now add your card." });
      try {
        await refreshPaymentStatus();
      } catch {
        setError("Your bank account was saved, but its latest verification status could not be refreshed.");
      }
    } catch (saveError) {
      setPadFeedback({
        type: "error",
        message: saveError instanceof Error ? saveError.message : "Bank account setup could not be completed. Please try again.",
      });
    } finally {
      setSavingMethod(null);
    }
  };

  const handleCardSaved = async () => {
    setReplacingCard(false);
    try {
      await refreshPaymentStatus();
    } catch {
      setError("Your card was saved, but its latest verification status could not be refreshed.");
    }
  };

  if (profileLoading) {
    return (
      <main className="marketplace tenant-lease-page">
        <TenantHeader />
        <section className="tenant-lease-payment-layout">
          {quoteError && <p className="tenant-lease-error" role="alert">{quoteError}</p>}
          {quoteReady && invitationQuote && (
            <section className="tenant-invitation-payment-method tenant-invitation-saved-quote" aria-label="Agreed invitation terms">
              <h2>Your saved invitation terms</h2>
              <p>These terms will not change if the listing is updated.</p>
              <dl>
                <div><dt>Monthly rent</dt><dd>{invitationQuote.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })} {invitationQuote.currency}</dd></div>
                <div><dt>Security deposit</dt><dd>{invitationQuote.securityDepositAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })} {invitationQuote.currency}</dd></div>
                <div><dt>Lease dates</dt><dd>{invitationQuote.startDate?.slice(0, 10)} to {invitationQuote.endDate?.slice(0, 10)}</dd></div>
                <div><dt>Lease term</dt><dd>{invitationQuote.leaseTermMonths} months</dd></div>
              </dl>
            </section>
          )}
          <p className="marketplace-eyebrow">Tenant setup</p>
          <h1>Preparing your secure setup…</h1>
        </section>
        <MarketplaceFooter />
      </main>
    );
  }

  return (
    <main className="marketplace tenant-lease-page">
      <TenantHeader />
      <section className="tenant-lease-payment-layout">
        {methodsSaved ? (
          <div className="tenant-lease-success">
            <span className="tenant-lease-success-icon">✓</span>
            <p className="marketplace-eyebrow">Tenant setup</p>
            <h1>
              {leaseId
                ? "Your lease is ready to review."
                : creatingLease
                  ? "Creating your lease…"
                  : "Your bank and card details are saved."}
            </h1>
            <p>
              {leaseId
                ? "Your payment methods are saved and your lease has been created from the landlord’s invitation. Review and sign it to continue. You will not be charged until the lease is signed."
                : !invitationId
                  ? lookingUpInvitation
                    ? "Looking up your accepted invitation…"
                    : "We couldn’t find an accepted invitation for your account, so your lease could not be created. Please open the invitation link from your email again."
                  : !paymentReady
                    ? "We’re waiting for your bank account (PAD) authorization to be confirmed. Your lease will be created as soon as it’s verified. You will not be charged during setup."
                    : "Payment setup is complete. You will not be charged during setup."}
            </p>
            {leaseError ? <p className="tenant-lease-error" role="alert">{leaseError}</p> : null}
            <div className="tenant-lease-success-actions">
              {leaseId ? (
                <button className="tenant-lease-primary tenant-invitation-setup-continue" type="button" onClick={() => navigate(`/tenant/leases/${encodeURIComponent(leaseId)}/review`)}>
                  Review &amp; sign lease
                </button>
              ) : !paymentReady && invitationId ? (
                <button className="tenant-lease-secondary" type="button" disabled={refreshingStatus} onClick={() => void handleRefreshStatus()}>
                  {refreshingStatus ? "Checking…" : "Check verification status"}
                </button>
              ) : leaseError && invitationId ? (
                <button className="tenant-lease-primary tenant-invitation-setup-continue" type="button" disabled={creatingLease} onClick={() => void createLease()}>
                  Try again
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="tenant-lease-payment-main tenant-invitation-setup-main">
            <p className="marketplace-eyebrow">Accepted tenant invitation</p>
            <h1>Complete your tenant setup.</h1>
            <p className="tenant-lease-lead">
              Add both a Canadian bank account and a card for rent payment setup. Arcora does not
              store your payment credentials, and you will not be charged during setup.
            </p>

            {error ? <div className="tenant-lease-error" role="alert">{error}</div> : null}
            {!tenantId ? (
              <p className="tenant-lease-error" role="alert">
                Your tenant profile could not be loaded. Please try again or contact support.
              </p>
            ) : (
              <>
                <div className="tenant-lease-payment-provider">
                  <ShieldIcon />
                  <div>
                    <strong>Secure setup through Stripe</strong>
                    <p>Your bank and card details are sent directly to Stripe for secure setup.</p>
                  </div>
                </div>

                <label className="tenant-lease-authorization tenant-invitation-setup-authorization">
                  <input type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
                  <span>
                    I authorize Arcora to use my bank account as the primary rent payment method
                    and my card as a backup, subject to the lease terms. This authorization is
                    required before either payment method can be saved.
                  </span>
                </label>

                <section className="tenant-invitation-payment-method">
                  <div className="tenant-invitation-payment-heading">
                    <div>
                      <h2>Bank account (PAD / ACSS debit)</h2>
                      <p>For recurring rent payments from a Canadian bank account.</p>
                    </div>
                    <span className={padSaved ? "is-complete" : ""}>
                      {savingMethod === "PAD" ? "Saving…" : padSaved ? "Saved" : "Required"}
                    </span>
                  </div>
                  {padSaved ? (
                    <p className="tenant-invitation-payment-complete">
                      {isPadVerified
                        ? "Your bank account is verified."
                        : "Bank account details are saved. Verification status is still updating."}
                    </p>
                  ) : (
                    <div className="tenant-invitation-setup-fields">
                      <label className="tenant-lease-form-field">
                        <span>Account holder name</span>
                        <input
                          autoComplete="name"
                          value={padForm.accountHolderName}
                          onChange={(event) => setPadForm((current) => ({ ...current, accountHolderName: event.target.value }))}
                        />
                      </label>
                      <div className="tenant-lease-form-row">
                        <label className="tenant-lease-form-field">
                          <span>Institution number</span>
                          <input inputMode="numeric" autoComplete="off" value={padForm.institutionNumber} onChange={(event) => setPadForm((current) => ({ ...current, institutionNumber: event.target.value }))} />
                        </label>
                        <label className="tenant-lease-form-field">
                          <span>Transit number</span>
                          <input inputMode="numeric" autoComplete="off" value={padForm.transitNumber} onChange={(event) => setPadForm((current) => ({ ...current, transitNumber: event.target.value }))} />
                        </label>
                      </div>
                      <label className="tenant-lease-form-field">
                        <span>Account number</span>
                        <input inputMode="numeric" autoComplete="off" value={padForm.accountNumber} onChange={(event) => setPadForm((current) => ({ ...current, accountNumber: event.target.value }))} />
                      </label>
                      <button className="tenant-lease-primary" type="button" disabled={!authorized || savingMethod !== null} onClick={() => void savePad()}>
                        <CheckIcon /> {savingMethod === "PAD" ? "Saving bank account…" : "Save bank account"}
                      </button>
                      {padFeedback ? (
                        <p className={`tenant-invitation-method-feedback is-${padFeedback.type}`} role={padFeedback.type === "error" ? "alert" : "status"}>
                          {padFeedback.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                  {padSaved && padFeedback ? (
                    <p className={`tenant-invitation-method-feedback is-${padFeedback.type}`} role="status">
                      {padFeedback.message}
                    </p>
                  ) : null}
                </section>

                <section className="tenant-invitation-payment-method">
                  <div className="tenant-invitation-payment-heading">
                    <div>
                      <h2>Card</h2>
                      <p>Keep a card on file for rent payments according to the lease.</p>
                    </div>
                    <span className={isCardVerified ? "is-complete" : ""}>
                      {isCardVerified ? "Verified" : "Required"}
                    </span>
                  </div>
                  {!padSaved ? (
                    <p className="tenant-invitation-payment-complete">
                      Save your bank account first to unlock secure card entry.
                    </p>
                  ) : isCardVerified && !replacingCard ? (
                    <div className="tenant-invitation-setup-fields">
                      <p className="tenant-invitation-payment-complete">
                        A verified card is already on file for your tenant profile.
                      </p>
                      <button className="tenant-lease-secondary" type="button" onClick={() => { setCardFeedback(null); setReplacingCard(true); }}>
                        Use a different card
                      </button>
                    </div>
                  ) : stripePromise ? (
                    <Elements stripe={stripePromise}>
                      <CardSetupForm
                        tenantId={tenantId}
                        cardholderName={fullName}
                        email={user?.email || ""}
                        authorized={authorized}
                        busy={savingMethod === "CARD"}
                        onSaved={handleCardSaved}
                        onFeedback={setCardFeedback}
                        onBusyChange={(busy) => setSavingMethod(busy ? "CARD" : null)}
                      />
                    </Elements>
                  ) : (
                    <p className="tenant-lease-form-hint">Loading secure card entry…</p>
                  )}
                  {padSaved && cardFeedback ? (
                    <p className={`tenant-invitation-method-feedback is-${cardFeedback.type}`} role={cardFeedback.type === "error" ? "alert" : "status"}>
                      {cardFeedback.message}
                    </p>
                  ) : null}
                </section>

                {status ? (
                  <p className="tenant-lease-status-line">
                    Payment setup status:{" "}
                    <strong>
                      {status.isReady
                        ? "Ready"
                        : !isPadVerified && isCardVerified
                          ? "Waiting for bank account (PAD mandate) verification"
                          : "Both methods must be verified"}
                    </strong>{" "}
                    <button className="tenant-lease-text-action" type="button" disabled={refreshingStatus} onClick={() => void handleRefreshStatus()}>
                      {refreshingStatus ? "Refreshing…" : "Refresh status"}
                    </button>
                  </p>
                ) : null}
              </>
            )}
          </div>
        )}
      </section>
      <MarketplaceFooter />
    </main>
  );
}
