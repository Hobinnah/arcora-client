import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldIcon } from "../components/Icons";
import CustomSelect from "../components/CustomSelect";
import TenantDatePicker from "../marketplace/TenantDatePicker";
import HostingHeader from "./HostingHeader";
import MarketplaceFooter from "../marketplace/MarketplaceFooter";
import { saveDemoInvitation } from "./tenantInvitationDemo";
import "./HostingApplicationsPage.css";

const formatMoney = (value: string) => `$${Number(value.replace(/[^0-9]/g, "") || 0).toLocaleString("en-US")}`;
const rawMoney = (value: string) => value.replace(/[^0-9]/g, "");

export default function HostingInviteTenantPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId");
  const selectedListing = listingId === "daisys-inn" ? "Daisy's Inn · Saskatoon, Canada" : "Sunlit loft near the river · Unit 4B";
  const [step, setStep] = useState(1);
  const [source, setSource] = useState<"existing" | "new">("new");
  const [sent, setSent] = useState(false);
  const [tenant, setTenant] = useState({ name: "", email: "", phoneCountryCode: "+1", phone: "" });
  const selectedListingDetails = listingId === "daisys-inn" ? { title: "Daisy's Inn", location: "Saskatoon, Canada", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=85" } : { title: "Sunlit loft near the river", location: "Austin, Texas", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=85" };
  const [lease, setLease] = useState({
    property: selectedListing,
    startDate: "Sep 1, 2026",
    term: "6 months",
    rent: "1850",
    deposit: "1850",
  });
  const updateTenant = (field: keyof typeof tenant, value: string) =>
    setTenant((current) => ({ ...current, [field]: value }));
  const updateLease = (field: keyof typeof lease, value: string) =>
    setLease((current) => ({ ...current, [field]: value }));
  const sendInvitation = () => {
    saveDemoInvitation({
      token: "demo-lease-invite",
      tenantName: tenant.name,
      email: tenant.email,
      phone: tenant.phone ? `${tenant.phoneCountryCode} ${tenant.phone}` : "",
      property: lease.property,
      startDate: lease.startDate,
      term: lease.term,
      rent: lease.rent,
      deposit: lease.deposit,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    });
    setSent(true);
  };

  return (
    <main className="marketplace hosting-invite-page">
      <HostingHeader />
      <div className="hosting-application-review-context">
        <button type="button" onClick={() => navigate("/hosting/applications")}>
          ← Applications
        </button>
        <span>Invite a tenant</span>
      </div>
      <section className="hosting-invite-layout">
        <div className="hosting-invite-main">
          {!sent ? (
            <>
              <div className="hosting-invite-heading">
                <p className="marketplace-eyebrow">New lease relationship</p>
                <h1>Invite a tenant directly.</h1>
                <p>
                  For a lease that did not start with an Arcora application, set
                  up the terms and send a secure invitation.
                </p>
              </div>
              <div className="hosting-invite-progress">
                <span className={step >= 1 ? "is-active" : ""}>
                  01 <b>Tenant</b>
                </span>
                <i />
                <span className={step >= 2 ? "is-active" : ""}>
                  02 <b>Lease terms</b>
                </span>
                <i />
                <span className={step >= 3 ? "is-active" : ""}>
                  03 <b>Review</b>
                </span>
              </div>
              {step === 1 && (
                <section className="hosting-invite-section">
                  <h2>Who are you inviting?</h2>
                  <p>
                    Choose an existing Arcora tenant or invite someone using
                    their contact details.
                  </p>
                  <div className="hosting-invite-source">
                    <button
                      type="button"
                      className={source === "new" ? "is-selected" : ""}
                      onClick={() => setSource("new")}
                    >
                      <strong>Invite someone new</strong>
                      <span>
                        They will create or confirm their Arcora account.
                      </span>
                    </button>
                    <button
                      type="button"
                      className={source === "existing" ? "is-selected" : ""}
                      onClick={() => setSource("existing")}
                    >
                      <strong>Existing tenant</strong>
                      <span>Find a tenant already connected to Arcora.</span>
                    </button>
                  </div>
                  {source === "existing" ? (
                    <label>
                      Search by email, phone, or tenant code
                      <input
                        placeholder="Email, phone, or tenant code"
                        value={tenant.name}
                        onChange={(event) =>
                          updateTenant("name", event.target.value)
                        }
                      />
                    </label>
                  ) : (
                    <div className="hosting-invite-form-grid">
                      <label>
                        Tenant name
                        <input
                          value={tenant.name}
                          onChange={(event) =>
                            updateTenant("name", event.target.value)
                          }
                          placeholder="Full legal name"
                        />
                      </label>
                      <label>
                        Email address
                        <input
                          type="email"
                          value={tenant.email}
                          onChange={(event) =>
                            updateTenant("email", event.target.value)
                          }
                          placeholder="tenant@example.com"
                        />
                      </label>
                      <label className="hosting-invite-phone-field">
                        Phone number
                        <div className="hosting-invite-phone-input">
                          <CustomSelect value={tenant.phoneCountryCode} options={["+1", "+44", "+234", "+33", "+49", "+61"]} onChange={(value) => updateTenant("phoneCountryCode", value)} ariaLabel="Country calling code" />
                          <input type="tel" inputMode="tel" value={tenant.phone} onChange={(event) => updateTenant("phone", event.target.value)} placeholder="Phone number" />
                        </div>
                      </label>
                    </div>
                  )}
                  <button
                    type="button"
                    className="hosting-invite-primary"
                    disabled={
                      !tenant.name || (source === "new" && !tenant.email)
                    }
                    onClick={() => setStep(2)}
                  >
                    Continue to lease terms →
                  </button>
                </section>
              )}
              {step === 2 && (
                <section className="hosting-invite-section">
                  <h2>Set the lease terms</h2>
                  <p>
                    This creates a lease relationship without requiring a prior
                    rental application.
                  </p>
                  <div className="hosting-invite-form-grid">
                    <label>
                      Property and unit
                      <CustomSelect
                        value={lease.property}
                        options={[
                          "Daisy's Inn · Saskatoon, Canada",
                          "Sunlit loft near the river · Unit 4B",
                          "Garden home with a quiet patio · Unit 2",
                        ]}
                        onChange={(value) => updateLease("property", value)}
                        ariaLabel="Property and unit"
                      />
                    </label>
                    <label>
                      Lease start date
                      <TenantDatePicker
                        value={lease.startDate}
                        onChange={(value) => updateLease("startDate", value)}
                        ariaLabel="Lease start date"
                      />
                    </label>
                    <label>
                      Lease term
                      <CustomSelect
                        value={lease.term}
                        options={[
                          "Month to month",
                          "6 months",
                          "12 months",
                          "24 months",
                        ]}
                        onChange={(value) => updateLease("term", value)}
                        ariaLabel="Lease term"
                      />
                    </label>
                    <label>
                      Monthly rent
                      <input
                        inputMode="numeric"
                        value={formatMoney(lease.rent)}
                        onChange={(event) =>
                          updateLease("rent", rawMoney(event.target.value))
                        }
                        onFocus={(event) => updateLease("rent", rawMoney(event.target.value))}
                      />
                    </label>
                    <label>
                      Security deposit
                      <input
                        inputMode="numeric"
                        value={formatMoney(lease.deposit)}
                        onChange={(event) =>
                          updateLease("deposit", rawMoney(event.target.value))
                        }
                        onFocus={(event) => updateLease("deposit", rawMoney(event.target.value))}
                      />
                    </label>
                  </div>
                  <div className="hosting-invite-note">
                    <ShieldIcon />
                    <span>
                      The tenant will review the full lease, add household
                      members, and sign before the lease becomes active.
                    </span>
                  </div>
                  <div className="hosting-invite-actions">
                    <button type="button" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="hosting-invite-primary"
                      onClick={() => setStep(3)}
                    >
                      Review invitation →
                    </button>
                  </div>
                </section>
              )}
              {step === 3 && (
                <section className="hosting-invite-section">
                  <h2>Review before sending</h2>
                  <p>
                    Check the recipient and lease terms. Nothing is activated
                    until the tenant accepts and signs.
                  </p>
                  <div className="hosting-invite-review-card">
                    <div>
                      <span>Tenant</span>
                      <strong>{tenant.name}</strong>
                      <small>{tenant.email || "Existing Arcora tenant"}</small>
                    </div>
                    <div>
                      <span>Home</span>
                      <strong>{lease.property}</strong>
                      <small>
                        {lease.startDate} · {lease.term}
                      </small>
                    </div>
                    <div>
                      <span>Monthly rent</span>
                      <strong>
                        {formatMoney(lease.rent)}
                      </strong>
                    </div>
                    <div>
                      <span>Security deposit</span>
                      <strong>
                        {formatMoney(lease.deposit)}
                      </strong>
                    </div>
                  </div>
                  <div className="hosting-invite-actions">
                    <button type="button" onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="hosting-invite-primary"
                      onClick={sendInvitation}
                    >
                      Send lease invitation
                    </button>
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="hosting-invite-success">
              <span>✓</span>
              <p className="marketplace-eyebrow">Invitation sent</p>
              <h1>Lease invitation is on its way.</h1>
              <p>
                The tenant will receive a secure invitation to review the terms
                and complete their lease setup.
              </p>
              <div>
                <span>Recipient</span>
                <strong>{tenant.email || tenant.name}</strong>
                <span>Lease start</span>
                <strong>{lease.startDate}</strong>
                <span>Status</span>
                <strong>Pending acceptance</strong>
              </div>
              <button
                type="button"
                className="hosting-invite-primary"
                onClick={() => navigate("/hosting/applications")}
              >
                Back to applications
              </button>
            </section>
          )}
        </div>
        <aside className="hosting-invite-sidebar">
          <div className="hosting-invite-listing-card">
            <img src={selectedListingDetails.image} alt="" />
            <div>
              <p className="marketplace-eyebrow">Selected listing</p>
              <h3>{selectedListingDetails.title}</h3>
              <span>{selectedListingDetails.location}</span>
            </div>
          </div>
          <div className="hosting-invite-handoff-card">
            <p className="marketplace-eyebrow">A clear handoff</p>
            <h2>Keep the lease in one place.</h2>
            <p>
              Inviting directly works well for existing relationships, renewals,
              or tenants who found you elsewhere.
            </p>
            <div>
              <strong>Tenant reviews first</strong>
              <span>Terms, occupants, and signing happen before activation.</span>
            </div>
            <div>
              <strong>No application required</strong>
              <span>
                This path creates a lease invitation, not a rental application.
              </span>
            </div>
          </div>
        </aside>
      </section>
      <MarketplaceFooter />
    </main>
  );
}
