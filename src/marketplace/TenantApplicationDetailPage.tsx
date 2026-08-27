import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckIcon, FileIcon, ShieldIcon } from "../components/Icons";
import { fallbackListings } from "./marketplaceData";
import TenantHeader from "./TenantHeader";
import MarketplaceFooter from "./MarketplaceFooter";
import TenantDatePicker from "./TenantDatePicker";
import CustomSelect from "../components/CustomSelect";
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
  { key: "guarantor", label: "Guarantors", detail: "Optional" },
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
  const [verificationAuthorized, setVerificationAuthorized] = useState(false);
  const [guarantors, setGuarantors] = useState<Array<{ firstName: string; lastName: string; email: string; phoneNumber: string; relationship: string; annualIncome: string; status: string }>>([]);
  const [guarantorForm, setGuarantorForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", relationship: "Parent", annualIncome: "" });
  const [occupants, setOccupants] = useState<Array<{ firstName: string; lastName: string; dateOfBirth: string; email: string; phoneNumber: string; occupantType: string; isPrimaryTenant: boolean; isFinanciallyResponsible: boolean }>>([]);
  const [occupantForm, setOccupantForm] = useState({ firstName: "", lastName: "", dateOfBirth: "", email: "", phoneNumber: "", occupantType: "ADULT", isPrimaryTenant: false, isFinanciallyResponsible: false });
  const [employment, setEmployment] = useState({ employmentType: "Employed", employerName: "", jobTitle: "", employerEmail: "", employerPhoneNumber: "", annualIncome: "", currency: "CAD", startedAt: "", endedAt: "", isCurrent: true });
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
  const updateEmployment = (field: keyof typeof employment, value: string | boolean) => setEmployment((current) => ({ ...current, [field]: value }));
  const updateGuarantor = (field: keyof typeof guarantorForm, value: string) => setGuarantorForm((current) => ({ ...current, [field]: value }));
  const addGuarantor = () => { if (guarantors.length >= 2 || !guarantorForm.firstName || !guarantorForm.lastName || !guarantorForm.email || !guarantorForm.phoneNumber || !guarantorForm.annualIncome) return; setGuarantors((current) => [...current, { ...guarantorForm, status: "PENDING" }]); setGuarantorForm({ firstName: "", lastName: "", email: "", phoneNumber: "", relationship: "Parent", annualIncome: "" }); };
  const updateOccupant = (field: keyof typeof occupantForm, value: string | boolean) => setOccupantForm((current) => ({ ...current, [field]: value }));
  const addOccupant = () => { if (!occupantForm.firstName || !occupantForm.lastName) return; setOccupants((current) => [...current, { ...occupantForm }]); setOccupantForm({ firstName: "", lastName: "", dateOfBirth: "", email: "", phoneNumber: "", occupantType: "ADULT", isPrimaryTenant: false, isFinanciallyResponsible: false }); };

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
          {activeSection === "household" && (
            <section className="tenant-application-panel tenant-application-household-panel">
              <p className="marketplace-eyebrow">Household details</p>
              <h3>Who will live in this home?</h3>
              <p className="tenant-application-panel-lead">Add the adults who will live with you. Your authenticated profile is already included as the primary tenant.</p>
              <article className="tenant-application-occupant-card tenant-application-primary-occupant"><div className="tenant-application-guarantor-card-header"><span className="tenant-application-avatar">O</span><div><strong>Obinna Eze</strong><small>Primary tenant</small></div><span className="tenant-application-occupant-status">Financially responsible</span></div><div className="tenant-application-occupant-meta"><span>hobinnah@yahoo.com</span><span>+1 ***-***-0753</span></div></article>
              {occupants.length > 0 && <div className="tenant-application-occupant-grid">{occupants.map((occupant) => <article className="tenant-application-occupant-card" key={`${occupant.email}-${occupant.firstName}`}><div className="tenant-application-guarantor-card-header"><span className="tenant-application-avatar">{occupant.firstName[0]}</span><div><strong>{occupant.firstName} {occupant.lastName}</strong><small>{occupant.occupantType} adult</small></div><span className="tenant-application-occupant-status">{occupant.isFinanciallyResponsible ? "Financially responsible" : "Not financially responsible"}</span></div><div className="tenant-application-occupant-meta"><span>{occupant.email || "No email provided"}</span><span>{occupant.phoneNumber || "No phone provided"}</span></div></article>)}</div>}
              <div className="tenant-application-occupant-form"><div className="tenant-application-form-grid"><label>First name<input value={occupantForm.firstName} onChange={(event) => updateOccupant("firstName", event.target.value)} /></label><label>Last name<input value={occupantForm.lastName} onChange={(event) => updateOccupant("lastName", event.target.value)} /></label><label>Date of birth<TenantDatePicker value={occupantForm.dateOfBirth} onChange={(value) => updateOccupant("dateOfBirth", value)} ariaLabel="Occupant date of birth" /></label><label>Email<input type="email" value={occupantForm.email} onChange={(event) => updateOccupant("email", event.target.value)} /></label><label>Phone number<input type="tel" value={occupantForm.phoneNumber} onChange={(event) => updateOccupant("phoneNumber", event.target.value)} /></label></div><label className="tenant-application-current-toggle"><input type="checkbox" checked={occupantForm.isFinanciallyResponsible} onChange={(event) => updateOccupant("isFinanciallyResponsible", event.target.checked)} /><span><strong>Financially responsible</strong><small>This adult will be responsible for rent or other lease obligations.</small></span></label><button type="button" className="tenant-application-complete-button" disabled={!occupantForm.firstName || !occupantForm.lastName} onClick={addOccupant}>Add adult occupant</button><small className="tenant-application-guarantor-count">{occupants.length} additional adult{occupants.length === 1 ? "" : "s"} added</small></div>
              <div className="tenant-application-household-note"><ShieldIcon /><span>Only adults can be added here. The primary tenant remains the authenticated applicant.</span></div><button type="button" className="tenant-application-complete-button" onClick={() => toggleComplete("household")}>{isComplete("household") ? "Marked complete" : "Save household"}</button>
            </section>
          )}
          {activeSection === "guarantor" && (
            <section className="tenant-application-panel tenant-application-guarantor-panel">
              <p className="marketplace-eyebrow">Optional support</p>
              <h3>Add a guarantor</h3>
              <p className="tenant-application-panel-lead">You can add up to two guarantors. We&apos;ll email each person a secure link to accept or decline their invitation.</p>
              {guarantors.length > 0 && <div className="tenant-application-guarantor-grid">{guarantors.map((guarantor) => <article className="tenant-application-guarantor-card" key={guarantor.email}><div className="tenant-application-guarantor-card-header"><span className="tenant-application-avatar">{guarantor.firstName[0]}</span><div><strong>{guarantor.firstName} {guarantor.lastName}</strong><small>{guarantor.relationship}</small></div><span className={`tenant-application-guarantor-status is-${guarantor.status.toLowerCase()}`}>{guarantor.status === "PENDING" ? "Invitation pending" : guarantor.status}</span></div><dl><div><dt>Email</dt><dd>{guarantor.email}</dd></div><div><dt>Annual income</dt><dd>${Number(guarantor.annualIncome).toLocaleString()} CAD</dd></div></dl></article>)}</div>}
              {guarantors.length < 2 && <div className="tenant-application-guarantor-form"><div className="tenant-application-form-grid"><label>First name<input value={guarantorForm.firstName} onChange={(event) => updateGuarantor("firstName", event.target.value)} /></label><label>Last name<input value={guarantorForm.lastName} onChange={(event) => updateGuarantor("lastName", event.target.value)} /></label><label>Email<input type="email" value={guarantorForm.email} onChange={(event) => updateGuarantor("email", event.target.value)} /></label><label>Phone number<input type="tel" value={guarantorForm.phoneNumber} onChange={(event) => updateGuarantor("phoneNumber", event.target.value)} /></label><label>Relationship<CustomSelect value={guarantorForm.relationship} options={["Parent", "Partner", "Family member", "Friend", "Other"]} onChange={(value) => updateGuarantor("relationship", value)} ariaLabel="Guarantor relationship" /></label><label>Annual income<input inputMode="numeric" value={guarantorForm.annualIncome} onChange={(event) => updateGuarantor("annualIncome", event.target.value.replace(/[^0-9]/g, ""))} onBlur={() => updateGuarantor("annualIncome", guarantorForm.annualIncome ? Number(guarantorForm.annualIncome.replace(/,/g, "")).toLocaleString("en-US") : "")} placeholder="0" /></label></div><button type="button" className="tenant-application-complete-button" disabled={!guarantorForm.firstName || !guarantorForm.lastName || !guarantorForm.email || !guarantorForm.phoneNumber || !guarantorForm.annualIncome} onClick={addGuarantor}>Send guarantor invitation</button><small className="tenant-application-guarantor-count">{guarantors.length} of 2 guarantors added</small></div>}
              {guarantors.length === 2 && <div className="tenant-application-callout"><ShieldIcon /><div><strong>Two guarantors added</strong><p>Both invitations are pending. You&apos;ll see their response here.</p></div></div>}
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
              <div className="tenant-application-payment-methods tenant-application-required-methods">
                <div className="tenant-application-required-method is-selected"><span className="tenant-application-payment-method-icon">PAD</span><span><strong>Stripe PAD / ACSS debit <small>Primary payment method</small></strong><small>Canadian bank account for the approval charge</small></span><span className="tenant-application-method-check">✓</span></div>
                <div className="tenant-application-required-method"><span className="tenant-application-payment-method-icon">VISA</span><span><strong>Card <small>Fallback payment method</small></strong><small>Used only if the PAD payment cannot be completed</small></span><span className="tenant-application-method-check">✓</span></div>
              </div>
              <div className="tenant-application-pad-form"><h4>Connect your primary bank account</h4><p>Stripe will securely verify your Canadian bank account. Arcora will never see or store your banking credentials.</p><label>Account holder name<input placeholder="Obinna Eze" /></label><label>Institution number<input placeholder="000" /></label><label>Transit number<input placeholder="00000" /></label><label>Account number<input placeholder="Account number" /></label></div>
              <div className="tenant-application-saved-card">
                <span className="tenant-application-card-brand">VISA</span>
                <div>
                  <strong>Visa ending in 4242</strong>
                  <small>Expires 08/28</small>
                </div>
                <span className="tenant-application-card-default">Default</span>
              </div>
              <div className="tenant-application-card-form">
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
              </div>
              <label className="tenant-application-consent-row">
                <input
                  type="checkbox"
                  checked={paymentAuthorized}
                  onChange={(event) =>
                    setPaymentAuthorized(event.target.checked)
                  }
                />
                <span>
                  I authorize Arcora to charge my PAD / ACSS bank account first, and use my card as a fallback, only if my application is approved.
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
          {activeSection === "employment" && (
            <section className="tenant-application-panel tenant-application-employment-panel">
            <p className="marketplace-eyebrow">Income verification</p>
            <h3>Employment &amp; income</h3>
            <p className="tenant-application-panel-lead">
              Tell us about your current source of income. You can save this section and return to it later.
            </p>
            <div className="tenant-application-form-grid">
              <label>
                Employment status
                <select value={employment.employmentType} onChange={(event) => updateEmployment("employmentType", event.target.value)}>
                  <option>Employed</option>
                  <option>Self-employed</option>
                  <option>Student</option>
                  <option>Retired</option>
                  <option>Unemployed</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Employer or business name
                <input value={employment.employerName} onChange={(event) => updateEmployment("employerName", event.target.value)} placeholder="Company or business name" />
              </label>
              <label>
                Employer email <span>(optional)</span>
                <input type="email" value={employment.employerEmail} onChange={(event) => updateEmployment("employerEmail", event.target.value)} placeholder="employer@example.com" />
              </label>
              <label>
                Employer phone number <span>(optional)</span>
                <input type="tel" value={employment.employerPhoneNumber} onChange={(event) => updateEmployment("employerPhoneNumber", event.target.value)} placeholder="Employer phone number" />
              </label>
              <label>
                Job title or role
                <input value={employment.jobTitle} onChange={(event) => updateEmployment("jobTitle", event.target.value)} placeholder="Your role" />
              </label>
              <label>
                Annual income
                <input type="number" min="0" value={employment.annualIncome} onChange={(event) => updateEmployment("annualIncome", event.target.value)} placeholder="0" />
              </label>
              <label>
                Income currency
                <select value={employment.currency} onChange={(event) => updateEmployment("currency", event.target.value)}>
                  <option>CAD</option>
                  <option>USD</option>
                  <option>GBP</option>
                  <option>EUR</option>
                </select>
              </label>
              <label>
                Employment start date
                <TenantDatePicker value={employment.startedAt} onChange={(value) => updateEmployment("startedAt", value)} ariaLabel="Employment start date" />
              </label>
              {!employment.isCurrent && (
                <label>
                  Employment end date
                  <TenantDatePicker value={employment.endedAt} onChange={(value) => updateEmployment("endedAt", value)} ariaLabel="Employment end date" />
                </label>
              )}
            </div>
            <label className="tenant-application-current-toggle">
              <input type="checkbox" checked={employment.isCurrent} onChange={(event) => updateEmployment("isCurrent", event.target.checked)} />
              <span>
                <strong>This is my current employment</strong>
                <small>Keep this selected if you currently work here.</small>
              </span>
            </label>
            <div className="tenant-application-upload-placeholder">
              <FileIcon />
              <div>
                <strong>Add proof of income</strong>
                <small>Optional for now. You can upload a pay stub, employment letter, or tax document.</small>
              </div>
              <button type="button">Add document</button>
            </div>
            <div className="tenant-application-callout">
              <ShieldIcon />
              <div>
                <strong>Verification happens with your permission</strong>
                <p>Your landlord can verify these details only after you authorize screening.</p>
              </div>
            </div>
            <button type="button" className="tenant-application-complete-button" disabled={!employment.employerName || !employment.jobTitle || !employment.annualIncome || !employment.startedAt} onClick={() => toggleComplete("employment")}>
              {isComplete("employment") ? "Marked complete" : "Save employment details"}
            </button>
          </section>
          )}
          {!['readiness', 'profile', 'rules', 'payment', 'employment', 'household', 'guarantor', 'documents'].includes(activeSection) && (
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
