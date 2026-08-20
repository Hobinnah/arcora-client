{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}


import React from "react";
import { useNavigate } from "react-router-dom";

export interface CommandItem { key: string; label: string; action: () => void }
export interface CommandPaletteHandle { openPalette: () => void }
export interface CommandPaletteProps {
  items?: CommandItem[];
}

const defaultPagesConfig = [
  { key: "overview", label: "Overview", url: "/overview" },

  { key: "tenant", label: "Tenant", url: "/tenants" },

  { key: "property", label: "Property", url: "/properties" },

  { key: "lease", label: "Lease", url: "/leases" },

  { key: "paymentmethod", label: "PaymentMethod", url: "/paymentmethods" },

  { key: "address", label: "Address", url: "/addresses" },

  { key: "rentalunit", label: "RentalUnit", url: "/rentalunits" },

  { key: "organization", label: "Organization", url: "/organizations" },

  { key: "organizationmember", label: "OrganizationMember", url: "/organizationmembers" },

  { key: "listing", label: "Listing", url: "/listings" },

  { key: "listingtermprice", label: "ListingTermPrice", url: "/listingtermprices" },

  { key: "listingaccessinstruction", label: "ListingAccessInstruction", url: "/listingaccessinstructions" },

  { key: "listingphoto", label: "ListingPhoto", url: "/listingphotos" },

  { key: "tenantinvitation", label: "TenantInvitation", url: "/tenantinvitations" },

  { key: "tenantemployment", label: "TenantEmployment", url: "/tenantemployments" },

  { key: "tenantguarantor", label: "TenantGuarantor", url: "/tenantguarantors" },

  { key: "tenantemergencycontact", label: "TenantEmergencyContact", url: "/tenantemergencycontacts" },

  { key: "tenantscreeningcheck", label: "TenantScreeningCheck", url: "/tenantscreeningchecks" },

  { key: "applicationoccupant", label: "ApplicationOccupant", url: "/applicationoccupants" },

  { key: "tenancytype", label: "TenancyType", url: "/tenancytypes" },

  { key: "rentalapplication", label: "RentalApplication", url: "/rentalapplications" },

  { key: "reservationhold", label: "ReservationHold", url: "/reservationholds" },

  { key: "securitydeposit", label: "SecurityDeposit", url: "/securitydeposits" },

  { key: "securitydeposittransaction", label: "SecurityDepositTransaction", url: "/securitydeposittransactions" },

  { key: "leaseoccupants", label: "LeaseOccupants", url: "/leaseoccupants" },

  { key: "leaserenewals", label: "LeaseRenewals", url: "/leaserenewals" },

  { key: "leasedocuments", label: "LeaseDocuments", url: "/leasedocuments" },

  { key: "leasesignatories", label: "LeaseSignatories", url: "/leasesignatories" },

  { key: "leaserecurringcharges", label: "LeaseRecurringCharges", url: "/leaserecurringcharges" },

  { key: "viewingappointments", label: "ViewingAppointments", url: "/viewingappointments" },

  { key: "fee", label: "Fee", url: "/fees" },

  { key: "feetype", label: "FeeType", url: "/feetypes" },

  { key: "invoicemaster", label: "InvoiceMaster", url: "/invoicemasters" },

  { key: "taxrate", label: "TaxRate", url: "/taxrates" },

  { key: "invoicedetail", label: "InvoiceDetail", url: "/invoicedetails" },

  { key: "autopaymandate", label: "AutopayMandate", url: "/autopaymandates" },

  { key: "autopayconsentaudit", label: "AutopayConsentAudit", url: "/autopayconsentaudits" },

  { key: "organizationstatement", label: "OrganizationStatement", url: "/organizationstatements" },

  { key: "paymentintent", label: "PaymentIntent", url: "/paymentintents" },

  { key: "paymentattempt", label: "PaymentAttempt", url: "/paymentattempts" },

  { key: "payment", label: "Payment", url: "/payments" },

  { key: "chargeback", label: "Chargeback", url: "/chargebacks" },

  { key: "paymentproviderevent", label: "PaymentProviderEvent", url: "/paymentproviderevents" },

  { key: "refund", label: "Refund", url: "/refunds" },

  { key: "orgpayoutaccount", label: "OrgPayoutAccount", url: "/orgpayoutaccounts" },

  { key: "receiptmaster", label: "ReceiptMaster", url: "/receiptmasters" },

  { key: "ledgertransaction", label: "LedgerTransaction", url: "/ledgertransactions" },

  { key: "ledgerentry", label: "LedgerEntry", url: "/ledgerentries" },

  { key: "paymentallocation", label: "PaymentAllocation", url: "/paymentallocations" },

  { key: "payout", label: "Payout", url: "/payouts" },

  { key: "ledgeraccount", label: "LedgerAccount", url: "/ledgeraccounts" },

  { key: "payoutitem", label: "PayoutItem", url: "/payoutitems" },

  { key: "paymentreminder", label: "PaymentReminder", url: "/paymentreminders" },

  { key: "contractor", label: "Contractor", url: "/contractors" },

  { key: "maintenancerequest", label: "MaintenanceRequest", url: "/maintenancerequests" },

  { key: "category", label: "Category", url: "/categories" },

  { key: "workorder", label: "WorkOrder", url: "/workorders" },

  { key: "inspection", label: "Inspection", url: "/inspections" },

  { key: "inspectionitem", label: "InspectionItem", url: "/inspectionitems" },

  { key: "attachment", label: "Attachment", url: "/attachments" },

  { key: "conversation", label: "Conversation", url: "/conversations" },

  { key: "conversationparticipant", label: "ConversationParticipant", url: "/conversationparticipants" },

  { key: "conversationmessage", label: "ConversationMessage", url: "/conversationmessages" },

  { key: "rating", label: "Rating", url: "/ratings" },

  { key: "fraudcase", label: "FraudCase", url: "/fraudcases" },

  { key: "identityverification", label: "IdentityVerification", url: "/identityverifications" },

  { key: "dispute", label: "Dispute", url: "/disputes" },

  { key: "creditreportingenrollment", label: "CreditReportingEnrollment", url: "/creditreportingenrollments" },

  { key: "creditreportingconsentaudit", label: "CreditReportingConsentAudit", url: "/creditreportingconsentaudits" },

  { key: "creditreporting", label: "CreditReporting", url: "/creditreportings" },

  { key: "notification", label: "Notification", url: "/notifications" },

  { key: "subscriptionplan", label: "SubscriptionPlan", url: "/subscriptionplans" },

  { key: "orgsubscription", label: "OrgSubscription", url: "/orgsubscriptions" },

  { key: "auditlog", label: "AuditLog", url: "/auditlogs" },

  { key: "leasedocextractedterm", label: "LeaseDocExtractedTerm", url: "/leasedocextractedterms" },

  { key: "amenitycatalog", label: "AmenityCatalog", url: "/amenitycatalogs" },

  { key: "listingamenity", label: "ListingAmenity", url: "/listingamenities" },

  { key: "listingrule", label: "ListingRule", url: "/listingrules" },

  { key: "listingpolicy", label: "ListingPolicy", url: "/listingpolicies" },

  { key: "calendarevent", label: "CalendarEvent", url: "/calendarevents" },

  { key: "listingtype", label: "ListingType", url: "/listingtypes" },

  { key: "unittype", label: "UnitType", url: "/unittypes" },
];

const CommandPalette = React.forwardRef<CommandPaletteHandle, CommandPaletteProps>(({ items }, ref) => {
  const navigate = useNavigate();
  // If no items are provided, use defaultPages with navigation actions
  const defaultPages: CommandItem[] = React.useMemo(() =>
    defaultPagesConfig.map(p => ({ ...p, action: () => navigate(p.url) })),
    [navigate]
  );
  const paletteItems = items || defaultPages;

  const [open, setOpen]   = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useImperativeHandle(ref, () => ({
    openPalette: () => { setOpen(true); setQuery(""); }
  }));

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); setQuery(""); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = paletteItems.filter(p => p.label.toLowerCase().includes(query.toLowerCase()));
  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div
        className="cmd"
        onClick={e => e.stopPropagation()}
        // layout only – all colors come from CSS variables/theme
        style={{ minWidth: 440, maxWidth: 520, width: "100%" }}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <input
          autoFocus
          className="cmd-input"
          placeholder="Type to search…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="cmd-list">
          {filtered.map(p => (
            <button
              key={p.key}
              className="cmd-item"
              onClick={() => { p.action(); setOpen(false); }}
              style={{
                background: 'var(--cmd-input-bg, var(--surface-2, #23232a))',
                color: 'var(--fg, #fff)',
                width: '100%',
                textAlign: 'left',
                padding: '18px 24px',
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 0,
                border: 'none',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border, #27272a)',
                transition: 'background 0.18s',
              }}
            >
              {p.label}
            </button>
          ))}
          {!filtered.length && <div className="cmd-empty">No results</div>}
        </div>
        <div className="cmd-help">Press Esc to close • Enter to select</div>
      </div>
    </div>
  );
});

CommandPalette.displayName = "CommandPalette";
export default CommandPalette;
