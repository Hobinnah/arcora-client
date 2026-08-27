import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckIcon, FileIcon, ShieldIcon } from "../components/Icons";
import { fallbackListings } from "./marketplaceData";
import TenantHeader from "./TenantHeader";
import MarketplaceFooter from "./MarketplaceFooter";
import "./TenantApplicationDetailPage.css";

type SectionKey =
  | "readiness"
  | "profile"
  | "employment"
  | "household"
  | "guarantor"
  | "documents"
  | "rules"
  | "payment"
  | "review";
type Section = { key: SectionKey; label: string; detail: string };
const sections: Section[] = [
  { key: "readiness", label: "Readiness check", detail: "Start here" },
  { key: "profile", label: "Your profile", detail: "Complete" },
  { key: "employment", label: "Employment & income", detail: "Required" },
  { key: "household", label: "Household", detail: "Required" },
  { key: "guarantor", label: "Guarantor", detail: "Optional" },
  { key: "documents", label: "Documents & screening", detail: "Required" },
  { key: "rules", label: "Rules & contract", detail: "Required" },
  { key: "payment", label: "Payment method", detail: "Required" },
  { key: "review", label: "Review & submit", detail: "Locked" },
];

export default function TenantApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listing =
    fallbackListings[
      id === "app-1017" ? 2 : id === "app-0998" ? 1 : id === "app-0942" ? 3 : 0
    ];
  const [activeSection, setActiveSection] = useState<SectionKey>("readiness");
  const [completed, setCompleted] = useState<SectionKey[]>(["profile"]);
  const [rulesAcknowledged, setRulesAcknowledged] = useState(false);
  const [paymentAuthorized, setPaymentAuthorized] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pad">("pad");
  const [verificationAuthorized, setVerificationAuthorized] = useState(false);
  const currentIndex = sections.findIndex(
    (section) => section.key === activeSection,
  );
  const isComplete = (key: SectionKey) => completed.includes(key);
  const toggleComplete = (key: SectionKey) =>
    setCompleted((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  const goBack = () => {
    const previous = sections[currentIndex - 1];
    if (previous) setActiveSection(previous.key);
    else navigate("/applications");
  };
  const goNext = () => {
    const next = sections[currentIndex + 1];
    if (next) setActiveSection(next.key);
  };
  const detailPlaceholder = sections.find(
    (section) => section.key === activeSection,
  );

  return (
    <main className="marketplace tenant-application-detail-page">
      <TenantHeader />
      <div className="tenant-application-context">
        <button type="button" onClick={() => navigate("/applications")}>
          &lt; My applications
        </button>
        <span>Application {id || "ARC-1024"}</span>
        <strong>Saved just now</strong>
      </div>
      <div className="tenant-application-detail-layout">
        <aside className="tenant-application-detail-rail">
          <div className="tenant-application-detail-title">
            <p className="marketplace-eyebrow">Application progress</p>
            <h1>Make this home yours.</h1>
            <p>
              Complete each section at your pace. Your progress is saved
              automatically.
            </p>
          </div>
          <nav aria-label="Application sections">
            {sections.map((section, index) => (
              <button
                type="button"
                className={`${activeSection === section.key ? "is-active" : ""} ${isComplete(section.key) ? "is-complete" : ""}`}
                key={section.key}
                onClick={() => setActiveSection(section.key)}
              >
                <span className="tenant-application-step-number">
                  {isComplete(section.key) ? <CheckIcon /> : `0${index + 1}`}
                </span>
                <span>
                  <strong>{section.label}</strong>
                  <small>
                    {isComplete(section.key) ? "Complete" : section.detail}
                  </small>
                </span>
              </button>
            ))}
          </nav>
        </aside>
        <section className="tenant-application-detail-main">
          <header className="tenant-application-detail-header">
            <div>
              <p className="marketplace-eyebrow">{listing.location}</p>
              <h2>{listing.title}</h2>
              <p>
                Application captured August 18, 2026{" "}
                <span className="tenant-application-status-pill">
                  Changes requested
                </span>
              </p>
            </div>
            <div className="tenant-application-save-state">
              <span className="tenant-application-save-dot" /> Saved
            </div>
          </header>
          {activeSection === "readiness" && (
            <section className="tenant-application-panel">
              <h3>Application readiness</h3>
              <p className="tenant-application-panel-lead">
                We already have your name, email, and phone from your
                authenticated account.
              </p>
              <div className="tenant-application-account-summary">
                <span className="tenant-application-avatar">O</span>
                <div>
                  <strong>Obinna Eze</strong>
                  <small>Authenticated tenant profile</small>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/account-settings")}
                >
                  Edit profile
                </button>
              </div>
              <div className="tenant-application-readiness-list">
                {sections
                  .filter(
                    (section) => !["readiness", "review"].includes(section.key),
                  )
                  .map((section) => (
                    <button
                      type="button"
                      className="tenant-application-readiness-row"
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                    >
                      <span
                        className={`tenant-application-check ${isComplete(section.key) ? "is-complete" : ""}`}
                      >
                        {isComplete(section.key) ? <CheckIcon /> : "!"}
                      </span>
                      <span>
                        <strong>{section.label}</strong>
                        <small>
                          {isComplete(section.key)
                            ? "Your information is ready."
                            : section.detail === "Optional"
                              ? "Optional, if applicable."
                              : "About 5 minutes to complete."}
                        </small>
                      </span>
                      <span aria-hidden="true">&gt;</span>
                    </button>
                  ))}
              </div>
              <div className="tenant-application-callout">
                <ShieldIcon />
                <div>
                  <strong>Your information stays protected</strong>
                  <p>
                    We only request details needed to review this application.
                  </p>
                </div>
              </div>
            </section>
          )}
          {activeSection === "profile" && (
            <section className="tenant-application-panel">
              <h3>Your profile</h3>
              <p className="tenant-application-panel-lead">
                Your authenticated account details will be used on this
                application.
              </p>
              <div className="tenant-application-account-summary">
                <span className="tenant-application-avatar">O</span>
                <div>
                  <strong>Obinna Eze</strong>
                  <small>hobinnah@yahoo.com · +1 ***-***-0753</small>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/account-settings")}
                >
                  Edit profile
                </button>
              </div>
              <button
                type="button"
                className="tenant-application-complete-button"
                onClick={() => toggleComplete("profile")}
              >
                {isComplete("profile") ? "Marked complete" : "Mark as complete"}
              </button>
            </section>
          )}
          {activeSection === "documents" && (
            <section className="tenant-application-panel tenant-application-documents-panel">
              <p className="marketplace-eyebrow">Secure review</p>
              <h3>Documents &amp; screening</h3>
              <p className="tenant-application-panel-lead">
                Authorize Arcora and the landlord to verify the information and
                documents needed to review your application.
              </p>
              <div className="tenant-application-readiness-list">
                <div className="tenant-application-readiness-row">
                  <span className="tenant-application-check">!</span>
                  <span>
                    <strong>Employment &amp; income</strong>
                    <small>
                      Confirm your current employment and income details.
                    </small>
                  </span>
                </div>
                <div className="tenant-application-readiness-row">
                  <span className="tenant-application-check">!</span>
                  <span>
                    <strong>Credit &amp; background</strong>
                    <small>Run the checks required for this application.</small>
                  </span>
                </div>
                <div className="tenant-application-readiness-row">
                  <span className="tenant-application-check">!</span>
                  <span>
                    <strong>Supplied application information</strong>
                    <small>
                      Review the information you provided for accuracy.
                    </small>
                  </span>
                </div>
              </div>
              <label className="tenant-application-consent-row">
                <input
                  type="checkbox"
                  checked={verificationAuthorized}
                  onChange={(event) =>
                    setVerificationAuthorized(event.target.checked)
                  }
                />
                <span>
                  I authorize Arcora and the landlord to verify the information
                  I provide, including employment records, income, credit
                  history, background screening, and supporting documents, in
                  accordance with applicable law.
                </span>
              </label>
              <button
                type="button"
                className="tenant-application-complete-button"
                disabled={!verificationAuthorized}
                onClick={() => toggleComplete("documents")}
              >
                {isComplete("documents")
                  ? "Marked complete"
                  : "Authorize verification"}
              </button>
            </section>
          )}
          {activeSection === "rules" && (
            <section className="tenant-application-panel">
              <p className="marketplace-eyebrow">Before you sign</p>
              <h3>Rules &amp; contract</h3>
              <p className="tenant-application-panel-lead">
                Review the terms and rules before authorizing payment. This
                preview is informational and not a signature step.
              </p>
              <div className="tenant-application-rules-summary">
                <div>
                  <span>Lease term</span>
                  <strong>6 months</strong>
                </div>
                <div>
                  <span>Monthly rent</span>
                  <strong>${listing.price.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Security deposit</span>
                  <strong>${listing.price.toLocaleString()}</strong>
                </div>
              </div>
              <div className="tenant-application-contract-preview">
                <FileIcon />
                <div>
                  <strong>Residential lease preview</strong>
                  <small>Non-signable contract preview</small>
                </div>
                <p>
                  Quiet hours are 10:00 PM to 8:00 AM. No smoking or parties are
                  permitted.
                </p>
                <button type="button">Open full preview &gt;</button>
              </div>
              <label className="tenant-application-consent-row">
                <input
                  type="checkbox"
                  checked={rulesAcknowledged}
                  onChange={(event) =>
                    setRulesAcknowledged(event.target.checked)
                  }
                />
                <span>I have reviewed the lease summary and house rules.</span>
              </label>
              <button
                type="button"
                className="tenant-application-complete-button"
                disabled={!rulesAcknowledged}
                onClick={() => toggleComplete("rules")}
              >
                {isComplete("rules")
                  ? "Marked complete"
                  : "Mark rules reviewed"}
              </button>
            </section>
          )}
          {activeSection === "payment" && (
            <section className="tenant-application-panel">
              <p className="marketplace-eyebrow">Payment setup</p>
              <h3>Payment method</h3>
              <p className="tenant-application-panel-lead">
                Save a payment method for the move-in funds. You will not be
                charged today.
              </p>
              <div className="tenant-application-payment-due">
                <span>Amount due on approval</span>
                <strong>${listing.price.toLocaleString()}</strong>
                <small>
                  First month&apos;s rent, charged only after landlord approval.
                </small>
              </div>
              <div className="tenant-application-payment-methods" role="radiogroup" aria-label="Choose payment method">
                <button type="button" role="radio" aria-checked={paymentMethod === "pad"} className={paymentMethod === "pad" ? "is-selected" : ""} onClick={() => { setPaymentMethod("pad"); setPaymentAuthorized(false); }}><span className="tenant-application-payment-method-icon">PAD</span><span><strong>Stripe PAD / ACSS debit</strong><small>Connect a Canadian bank account securely through Stripe</small></span><span className="tenant-application-payment-radio" /></button>
                <button type="button" role="radio" aria-checked={paymentMethod === "card"} className={paymentMethod === "card" ? "is-selected" : ""} onClick={() => { setPaymentMethod("card"); setPaymentAuthorized(false); }}><span className="tenant-application-payment-method-icon">VISA</span><span><strong>Card</strong><small>Visa, Mastercard, American Express</small></span><span className="tenant-application-payment-radio" /></button>
              </div>
              {paymentMethod === "card" && <div className="tenant-application-saved-card">
                <span className="tenant-application-card-brand">VISA</span>
                <div>
                  <strong>Visa ending in 4242</strong>
                  <small>Expires 08/28</small>
                </div>
                <span className="tenant-application-card-default">Default</span>
              </div>}
              {paymentMethod === "card" && <div className="tenant-application-card-form">
                <h4>Use a different card</h4>
                <label>
                  Card number
                  <input placeholder="1234  5678  9012  3456" />
                </label>
                <div>
                  <label>
                    Expiry date
                    <input placeholder="MM / YY" />
                  </label>
                  <label>
                    CVC
                    <input placeholder="123" />
                  </label>
                </div>
                <label>
                  Name on card
                  <input placeholder="Obinna Eze" />
                </label>
              </div>}
              {paymentMethod === "pad" && <div className="tenant-application-pad-form"><h4>Connect your bank account</h4><p>Stripe will securely verify your Canadian bank account. Arcora will never see or store your banking credentials.</p><label>Account holder name<input placeholder="Obinna Eze" /></label><label>Institution number<input placeholder="000" /></label><label>Transit number<input placeholder="00000" /></label><label>Account number<input placeholder="Account number" /></label></div>}
              <label className="tenant-application-consent-row">
                <input
                  type="checkbox"
                  checked={paymentAuthorized}
                  onChange={(event) =>
                    setPaymentAuthorized(event.target.checked)
                  }
                />
                <span>
                  I authorize Arcora to charge this {paymentMethod === "card" ? "card" : "bank account"} only if my application is approved.
                </span>
              </label>
              <button
                type="button"
                className="tenant-application-complete-button"
                disabled={!paymentAuthorized}
                onClick={() => toggleComplete("payment")}
              >
                {isComplete("payment")
                  ? "Marked complete"
                  : "Save payment method"}
              </button>
            </section>
          )}
          {!["readiness", "profile", "rules", "payment"].includes(
            activeSection,
          ) && activeSection !== "documents" && (
            <section className="tenant-application-panel">
              <p className="marketplace-eyebrow">Next section</p>
              <h3>{detailPlaceholder?.label}</h3>
              <p className="tenant-application-panel-lead">
                This section is ready for the next stage of the application.
                Your answers will be saved as you move through the application.
              </p>
              <div className="tenant-application-placeholder">
                <FileIcon />
                <strong>Continue when you&apos;re ready</strong>
                <span>
                  We&apos;ll guide you through only the information needed for
                  this home.
                </span>
              </div>
            </section>
          )}
        </section>
        <aside className="tenant-application-detail-summary">
          <div className="tenant-application-summary-image">
            <img src={listing.image} alt="" />
          </div>
          <p className="marketplace-eyebrow">Your selected home</p>
          <h3>{listing.title}</h3>
          <p>{listing.location}</p>
          <div>
            <span>Monthly rent</span>
            <strong>${listing.price.toLocaleString()}</strong>
          </div>
          <div>
            <span>Security deposit</span>
            <strong>${listing.price.toLocaleString()}</strong>
          </div>
          <div>
            <span>Move-in</span>
            <strong>Sep 1, 2026</strong>
          </div>
          <div className="tenant-application-summary-total">
            <span>Lease term</span>
            <strong>6 months</strong>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/homes/${listing.id}`)}
          >
            View listing details &gt;
          </button>
        </aside>
      </div>
      <div className="tenant-application-detail-actions">
        <button type="button" onClick={goBack}>
          Back
        </button>
        <button
          type="button"
          className="tenant-application-next-button"
          onClick={goNext}
          disabled={currentIndex === sections.length - 1}
        >
          Next <span aria-hidden="true">&gt;</span>
        </button>
      </div>
      <MarketplaceFooter />
    </main>
  );
}
