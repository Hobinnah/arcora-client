import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { ShieldIcon } from "../components/Icons";
import CustomSelect from "../components/CustomSelect";
import TenantDatePicker from "../marketplace/TenantDatePicker";
import HostingHeader from "./HostingHeader";
import MarketplaceFooter from "../marketplace/MarketplaceFooter";
import {
  fetchAvailableListings,
  fetchListingAvailability,
  fetchListings,
  type AvailableListing,
  type ListingAvailabilityConflict,
} from "../apis/useListing";
import { getLandlordOrganization } from "../apis/useLandlordOrganization";
import { createTenantInvitation } from "../apis/useTenantInvitation";
import type { Listing } from "../types/Listing";
import "./HostingApplicationsPage.css";

const todayISO = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};
const addMonths = (dateValue: string, months: number) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  const targetMonth = month - 1 + months;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  const endDay = Math.min(day, lastDay);
  return `${targetYear}-${String(normalizedMonth + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;
};
const dayBefore = (dateValue: string) => {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day - 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
};
const formatMoney = (value: number, currency: string) => {
  const currencyCode = /^[A-Z]{3}$/.test(currency) ? currency : "USD";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(value || 0);
};
const formatDate = (value?: string) => {
  if (!value) return "Not set";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "Not set" : date.toLocaleDateString();
};

export default function HostingInviteTenantPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId") ?? "";
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const userID = Number(currentUser?.user?.id ?? currentUser?.user?.userId);
  const directOrganizationID = currentUser?.organization?.organizationID
    ?? currentUser?.memberOrganizations?.find((member) => member.organization)?.organization?.organizationID;
  const organizationQuery = useQuery({
    queryKey: ["hostingInviteOrganization", userID],
    queryFn: async () => {
      if (!Number.isFinite(userID)) throw new Error("Your user account could not be identified.");
      const organization = await getLandlordOrganization(userID);
      if (!organization?.organizationID) throw new Error("Your hosting organization could not be identified.");
      return organization.organizationID;
    },
    enabled: !directOrganizationID && Number.isFinite(userID),
  });
  const organizationID = directOrganizationID || organizationQuery.data || "";
  const [requestedListingId, setRequestedListingId] = useState(listingId);
  const [startDate, setStartDate] = useState(todayISO);
  const [leaseTermMonths, setLeaseTermMonths] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [step, setStep] = useState(1);
  const [source, setSource] = useState<"existing" | "new">("new");
  const [sent, setSent] = useState(false);
  const [tenant, setTenant] = useState({ name: "", email: "", phoneCountryCode: "+1", phone: "" });
  const inventoryQuery = useQuery({
    queryKey: ["hostingInviteListingInventory", organizationID],
    queryFn: () => fetchListings({ pageSize: 1000, pageNumber: 0, organizationID }),
    enabled: Boolean(organizationID),
  });
  const inventory: Listing[] = inventoryQuery.data?.data ?? [];
  const availableListingsQuery = useQuery({
    queryKey: ["hostingInviteAvailableListings", organizationID, startDate, leaseTermMonths],
    queryFn: () => fetchAvailableListings({ organizationId: organizationID, startDate, leaseTermMonths }),
    enabled: Boolean(organizationID && startDate),
  });
  const availableListings: AvailableListing[] = availableListingsQuery.data ?? [];
  const requestedListingIsAvailable = availableListings.some((listing) => listing.listingID === requestedListingId);
  const selectedListingId = requestedListingId && requestedListingIsAvailable
    ? requestedListingId
    : requestedListingId ? "" : availableListings[0]?.listingID ?? "";
  const selectedInventoryListing = inventory.find((listing) => listing.listingID === selectedListingId) ?? null;
  const availableListing = availableListings.find((listing) => listing.listingID === selectedListingId) ?? null;
  const selectedListing = selectedInventoryListing ?? availableListing;
  const availabilityQuery = useQuery({
    queryKey: ["hostingInviteListingAvailability", organizationID, selectedListingId, startDate, leaseTermMonths],
    queryFn: () => fetchListingAvailability(selectedListingId, {
      organizationId: organizationID,
      startDate,
      leaseTermMonths,
    }),
    enabled: Boolean(organizationID && selectedListingId && startDate),
  });
  const listingOptions = availableListings.map((listing) =>
    `${listing.title || "Listing"} · ${listing.listingID}`,
  );
  const selectedListingOption = selectedListing
    ? `${selectedListing.title || "Listing"} · ${selectedListing.listingID}`
    : availableListing?.title || "";
  const coverPhotoUrl = selectedInventoryListing?.listingPhotos?.find((photo) => photo.isCoverPhoto)?.url;
  const conflicts = availabilityQuery.data?.conflicts ?? [];
  const price = availableListing?.requestedMonthlyRentAmount ?? 0;
  const securityDeposit = availableListing?.requestedSecurityDepositAmount ?? 0;
  const currency = availableListing?.currency || "USD";
  const isLoadingAvailability = availableListingsQuery.isFetching || availabilityQuery.isFetching;
  const today = todayISO();
  const listingAvailableFrom = selectedInventoryListing?.availableFrom?.slice(0, 10);
  const calendarMinDate = listingAvailableFrom && listingAvailableFrom > today ? listingAvailableFrom : today;
  const calendarMaxDate = selectedInventoryListing?.availableTo?.slice(0, 10) || undefined;
  const organizationError = organizationQuery.error instanceof Error
    ? organizationQuery.error.message
    : !organizationID && !organizationQuery.isLoading
      ? "Your hosting organization could not be identified."
      : "";
  const availabilityError = availableListingsQuery.error instanceof Error
    ? availableListingsQuery.error.message
    : availabilityQuery.error instanceof Error
      ? availabilityQuery.error.message
      : "";
  const availabilityReady = Boolean(
    availableListing &&
    !isLoadingAvailability &&
    availabilityQuery.isSuccess &&
    availabilityQuery.data.isAvailable,
  );
  const hasDateConflict = (date: Date) => {
    const candidateStart = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const candidateEnd = addMonths(candidateStart, leaseTermMonths);
    return conflicts.some((conflict) => {
      const conflictStart = (conflict.startDate ?? conflict.startAt ?? conflict.dateRange?.startDate)?.slice(0, 10);
      const conflictEnd = (conflict.endDate ?? conflict.endAt ?? conflict.dateRange?.endDate)?.slice(0, 10);
      return Boolean(conflictStart && conflictEnd && candidateStart < conflictEnd && candidateEnd > conflictStart);
    });
  };
  const conflictMessage = (conflict: ListingAvailabilityConflict) =>
    conflict.reason
    || `${conflict.sourceType || "Availability"} conflict: ${formatDate(conflict.startDate ?? conflict.startAt ?? conflict.dateRange?.startDate)}–${formatDate(conflict.endDate ?? conflict.endAt ?? conflict.dateRange?.endDate)}`;
  const updateTenant = (field: keyof typeof tenant, value: string) =>
    setTenant((current) => ({ ...current, [field]: value }));

  const sendInvitation = async () => {
    if (!selectedListingId || !organizationID || !availabilityReady) return;
    setIsSending(true);
    setSendError("");
    try {
      const capturedBy = `${currentUser?.user?.firstName || ""} ${currentUser?.user?.lastName || ""}`.trim();
      await createTenantInvitation({
        organizationID,
        listingID: selectedListingId,
        startDate,
        leaseTermMonths,
        rentalApplicationID: null,
        name: tenant.name,
        invitationPurpose: "Direct lease invitation",
        email: tenant.email,
        phoneNumber: tenant.phone ? `${tenant.phoneCountryCode} ${tenant.phone}` : "",
        tokenHash: "",
        status: "PENDING",
        expiresAt: null,
        capturedBy,
        capturedDate: new Date().toISOString().split("T")[0],
      });
      setSent(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const payload = error.response.data as {
          message?: string;
          conflicts?: ListingAvailabilityConflict[];
          availability?: { conflicts?: ListingAvailabilityConflict[] };
        } | undefined;
        const writeConflicts = payload?.conflicts ?? payload?.availability?.conflicts ?? [];
        setSendError([
          payload?.message || "This listing is no longer available for the selected dates.",
          ...writeConflicts.map(conflictMessage),
        ].join(" "));
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["hostingInviteAvailableListings"] }),
          queryClient.invalidateQueries({ queryKey: ["hostingInviteListingAvailability"] }),
        ]);
      } else {
        setSendError(error instanceof Error ? error.message : "Unable to send the invitation.");
      }
    } finally {
      setIsSending(false);
    }
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
                <p className="marketplace-eyebrow">Lease invitation</p>
                <h1>Invite a tenant directly.</h1>
                <p>
                  Choose an available listing, lease start date, and term. Arcora
                  will check the entire date range before you send an invitation.
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
                      Tenant email address
                      <input
                        type="email"
                        placeholder="tenant@example.com"
                        value={tenant.name}
                        onChange={(event) => {
                          updateTenant("name", event.target.value);
                          updateTenant("email", event.target.value);
                        }}
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
                  {organizationError && <p role="alert">{organizationError}</p>}
                  <button
                    type="button"
                    className="hosting-invite-primary"
                    disabled={!tenant.name || !tenant.email}
                    onClick={() => setStep(2)}
                  >
                    Continue to lease terms →
                  </button>
                </section>
              )}
              {step === 2 && (
                <section className="hosting-invite-section">
                  <h2>Lease terms</h2>
                  <p>
                    Only listings available for the entire requested period are
                    shown.
                  </p>
                  {organizationError && <p role="alert">{organizationError}</p>}
                  {availabilityError && <p role="alert">{availabilityError}</p>}
                  {(organizationQuery.isLoading || inventoryQuery.isLoading || isLoadingAvailability) && (
                    <p>Checking listing availability…</p>
                  )}
                  {availableListingsQuery.isSuccess && availableListings.length === 0 && (
                    <p role="status">
                      No listings are available for {formatDate(startDate)} and a {leaseTermMonths}-month term. Try another date or term.
                    </p>
                  )}
                  <div className="hosting-invite-form-grid">
                    <label>
                      Available listing
                      <CustomSelect
                        value={selectedListingOption || "Select a listing"}
                        options={listingOptions}
                        onChange={(value) => {
                          const listing = availableListings.find((item) =>
                            `${item.title || "Listing"} · ${item.listingID}` === value,
                          );
                          if (listing) setRequestedListingId(listing.listingID);
                        }}
                        ariaLabel="Listing"
                      />
                    </label>
                    <label>
                      Lease start date
                      <TenantDatePicker
                        value={startDate}
                        onChange={setStartDate}
                        ariaLabel="Lease start date"
                        minDate={calendarMinDate}
                        maxDate={calendarMaxDate}
                        isDateDisabled={hasDateConflict}
                      />
                    </label>
                    <label>
                      Lease term
                      <CustomSelect
                        value={`${leaseTermMonths} ${leaseTermMonths === 1 ? "month" : "months"}`}
                        options={Array.from({ length: 12 }, (_, index) => `${index + 1} ${index === 0 ? "month" : "months"}`)}
                        onChange={(value) => setLeaseTermMonths(Number.parseInt(value, 10))}
                        ariaLabel="Lease term in months"
                      />
                    </label>
                    <label>
                      Monthly rent
                      <input readOnly value={availableListing ? formatMoney(price, currency) : "Set an available date range"} />
                    </label>
                    <label>
                      Security deposit
                      <input readOnly value={availableListing ? formatMoney(securityDeposit, currency) : "Set an available date range"} />
                    </label>
                  </div>
                  {availabilityQuery.data && (
                    <p role={availabilityReady ? "status" : "alert"}>
                      {availabilityReady
                        ? `Available for the full ${leaseTermMonths}-month lease: ${formatDate(startDate)}–${formatDate(dayBefore(addMonths(startDate, leaseTermMonths)))}.`
                        : `These dates are unavailable for the full ${leaseTermMonths}-month term.${conflicts.length ? ` ${conflicts.map(conflictMessage).join(" ")}` : ""}`}
                    </p>
                  )}
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
                      disabled={!availabilityReady || isLoadingAvailability}
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
                      <strong>{selectedListing?.title || "Listing"}</strong>
                      <small>
                        {formatDate(startDate)} · {leaseTermMonths} {leaseTermMonths === 1 ? "month" : "months"}
                      </small>
                    </div>
                    <div>
                      <span>Monthly rent</span>
                      <strong>
                        {availableListing ? formatMoney(price, currency) : "Not available"}
                      </strong>
                    </div>
                    <div>
                      <span>Security deposit</span>
                      <strong>
                        {availableListing ? formatMoney(securityDeposit, currency) : "Not available"}
                      </strong>
                    </div>
                  </div>
                  {sendError && <p role="alert">{sendError}</p>}
                  <div className="hosting-invite-actions">
                    <button type="button" onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button
                      type="button"
                      className="hosting-invite-primary"
                      onClick={sendInvitation}
                      disabled={isSending || isLoadingAvailability || !availabilityReady}
                    >
                      {isSending ? "Sending…" : "Send lease invitation"}
                    </button>
                  </div>
                </section>
              )}
            </>
          ) : (
            <section className="hosting-invite-success">
              <span>✓</span>
              <p className="marketplace-eyebrow">Invitation created</p>
              <h1>Your invitation is queued for delivery.</h1>
              <p>
                Email delivery is pending. The listing hold remains active until
                the invitation expires. Track delivery and responses in Tenant invitations.
              </p>
              <div>
                <span>Recipient</span>
                <strong>{tenant.email || tenant.name}</strong>
                <span>Lease start</span>
                <strong>{formatDate(startDate)}</strong>
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
            {coverPhotoUrl && <img src={coverPhotoUrl} alt="" />}
            <div>
              <p className="marketplace-eyebrow">Selected listing</p>
              <h3>{selectedListing?.title || (inventoryQuery.isLoading ? "Loading listings…" : "No available listing")}</h3>
              <span>{selectedInventoryListing?.rentalUnit?.property?.address?.line1 || ""}</span>
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
