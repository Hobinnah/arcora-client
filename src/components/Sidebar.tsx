{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}


import React, { useState } from 'react';
import { Logo, DotIcon, ChevIcon, HomeIcon } from './Icons';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ collapsed, onToggleCollapse: _onToggleCollapse }: { collapsed: boolean; onToggleCollapse: () => void }) {

    const [openGroup, setOpenGroup] = useState<string>('DASHBOARDS');
    const toggle = (key: string) => setOpenGroup(prev => prev === key ? '' : key);

    return (
    <>
      <div className="brand"><Logo /><span className="brand-name">Arcora</span></div>
      <nav className="nav">
        <NavGroup title="DASHBOARDS" open={openGroup === 'DASHBOARDS'} onToggle={() => toggle('DASHBOARDS')} isCollapsed={collapsed}>
          <NavItemLink to="/overview" icon={HomeIcon} label="Overview" highlight active />
        </NavGroup>
        <NavGroup title="TABLES" open={openGroup === 'TABLES'} onToggle={() => toggle('TABLES')} isCollapsed={collapsed}>
          
                  <NavItemLink to="/addresses" icon={DotIcon} label="Addresses" />
  <NavItemLink to="/rentalunits" icon={DotIcon} label="RentalUnits" />
  <NavItemLink to="/organizations" icon={DotIcon} label="Organizations" />
  <NavItemLink to="/organizationmembers" icon={DotIcon} label="OrganizationMembers" />
  <NavItemLink to="/listings" icon={DotIcon} label="Listings" />
  <NavItemLink to="/listingtermprices" icon={DotIcon} label="ListingTermPrices" />
  <NavItemLink to="/listingaccessinstructions" icon={DotIcon} label="ListingAccessInstructions" />
  <NavItemLink to="/listingphotos" icon={DotIcon} label="ListingPhotos" />
  <NavItemLink to="/tenantinvitations" icon={DotIcon} label="TenantInvitations" />
  <NavItemLink to="/rentalapplications" icon={DotIcon} label="RentalApplications" />
  <NavItemLink to="/reservationholds" icon={DotIcon} label="ReservationHolds" />
  <NavItemLink to="/leaserenewals" icon={DotIcon} label="LeaseRenewals" />
  <NavItemLink to="/leasedocuments" icon={DotIcon} label="LeaseDocuments" />
  <NavItemLink to="/leasesignatories" icon={DotIcon} label="LeaseSignatories" />
  <NavItemLink to="/leaserecurringcharges" icon={DotIcon} label="LeaseRecurringCharges" />
  <NavItemLink to="/viewingappointments" icon={DotIcon} label="ViewingAppointments" />
  <NavItemLink to="/invoicedetails" icon={DotIcon} label="InvoiceDetails" />
  <NavItemLink to="/autopaymandates" icon={DotIcon} label="AutopayMandates" />
  <NavItemLink to="/autopayconsentaudits" icon={DotIcon} label="AutopayConsentAudits" />
  <NavItemLink to="/organizationstatements" icon={DotIcon} label="OrganizationStatements" />
  <NavItemLink to="/refunds" icon={DotIcon} label="Refunds" />
  <NavItemLink to="/orgpayoutaccounts" icon={DotIcon} label="OrgPayoutAccounts" />
  <NavItemLink to="/receiptmasters" icon={DotIcon} label="ReceiptMasters" />
  <NavItemLink to="/ledgertransactions" icon={DotIcon} label="LedgerTransactions" />
  <NavItemLink to="/ledgerentries" icon={DotIcon} label="LedgerEntries" />
  <NavItemLink to="/paymentallocations" icon={DotIcon} label="PaymentAllocations" />
  <NavItemLink to="/payouts" icon={DotIcon} label="Payouts" />
  <NavItemLink to="/payoutitems" icon={DotIcon} label="PayoutItems" />
  <NavItemLink to="/paymentreminders" icon={DotIcon} label="PaymentReminders" />
  <NavItemLink to="/contractors" icon={DotIcon} label="Contractors" />
  <NavItemLink to="/maintenancerequests" icon={DotIcon} label="MaintenanceRequests" />
  <NavItemLink to="/categories" icon={DotIcon} label="Categories" />
  <NavItemLink to="/workorders" icon={DotIcon} label="WorkOrders" />
  <NavItemLink to="/inspections" icon={DotIcon} label="Inspections" />
  <NavItemLink to="/inspectionitems" icon={DotIcon} label="InspectionItems" />
  <NavItemLink to="/attachments" icon={DotIcon} label="Attachments" />
  <NavItemLink to="/conversations" icon={DotIcon} label="Conversations" />
  <NavItemLink to="/conversationparticipants" icon={DotIcon} label="ConversationParticipants" />
  <NavItemLink to="/conversationmessages" icon={DotIcon} label="ConversationMessages" />
  <NavItemLink to="/ratings" icon={DotIcon} label="Ratings" />
  <NavItemLink to="/fraudcases" icon={DotIcon} label="FraudCases" />
  <NavItemLink to="/identityverifications" icon={DotIcon} label="IdentityVerifications" />
  <NavItemLink to="/disputes" icon={DotIcon} label="Disputes" />
  <NavItemLink to="/creditreportingenrollments" icon={DotIcon} label="CreditReportingEnrollments" />
  <NavItemLink to="/creditreportingconsentaudits" icon={DotIcon} label="CreditReportingConsentAudits" />
  <NavItemLink to="/creditreportings" icon={DotIcon} label="CreditReportings" />
  <NavItemLink to="/notifications" icon={DotIcon} label="Notifications" />
  <NavItemLink to="/subscriptionplans" icon={DotIcon} label="SubscriptionPlans" />
  <NavItemLink to="/orgsubscriptions" icon={DotIcon} label="OrgSubscriptions" />
  <NavItemLink to="/auditlogs" icon={DotIcon} label="AuditLogs" />
  <NavItemLink to="/leasedocextractedterms" icon={DotIcon} label="LeaseDocExtractedTerms" />
  <NavItemLink to="/amenitycatalogs" icon={DotIcon} label="AmenityCatalogs" />
  <NavItemLink to="/listingamenities" icon={DotIcon} label="ListingAmenities" />
  <NavItemLink to="/listingrules" icon={DotIcon} label="ListingRules" />
  <NavItemLink to="/listingpolicies" icon={DotIcon} label="ListingPolicies" />
  <NavItemLink to="/calendarevents" icon={DotIcon} label="CalendarEvents" />
</NavGroup>
              <NavGroup title="CUSTOM" isCollapsed={collapsed}>
          <NavItemLink to="/tenants" icon={DotIcon} label="Tenants" />
                  <NavItemLink to="/properties" icon={DotIcon} label="Properties" />
  <NavItemLink to="/leases" icon={DotIcon} label="Leases" />
  <NavItemLink to="/paymentmethods" icon={DotIcon} label="PaymentMethods" />
  <NavItemLink to="/tenantemployments" icon={DotIcon} label="TenantEmployments" />
  <NavItemLink to="/tenantguarantors" icon={DotIcon} label="TenantGuarantors" />
  <NavItemLink to="/tenantemergencycontacts" icon={DotIcon} label="TenantEmergencyContacts" />
  <NavItemLink to="/tenantscreeningchecks" icon={DotIcon} label="TenantScreeningChecks" />
  <NavItemLink to="/applicationoccupants" icon={DotIcon} label="ApplicationOccupants" />
  <NavItemLink to="/tenancytypes" icon={DotIcon} label="TenancyTypes" />
  <NavItemLink to="/securitydeposits" icon={DotIcon} label="SecurityDeposits" />
  <NavItemLink to="/securitydeposittransactions" icon={DotIcon} label="SecurityDepositTransactions" />
  <NavItemLink to="/leaseoccupants" icon={DotIcon} label="LeaseOccupants" />
  <NavItemLink to="/fees" icon={DotIcon} label="Fees" />
  <NavItemLink to="/feetypes" icon={DotIcon} label="FeeTypes" />
  <NavItemLink to="/invoicemasters" icon={DotIcon} label="InvoiceMasters" />
  <NavItemLink to="/taxrates" icon={DotIcon} label="TaxRates" />
  <NavItemLink to="/paymentintents" icon={DotIcon} label="PaymentIntents" />
  <NavItemLink to="/paymentattempts" icon={DotIcon} label="PaymentAttempts" />
  <NavItemLink to="/payments" icon={DotIcon} label="Payments" />
  <NavItemLink to="/chargebacks" icon={DotIcon} label="Chargebacks" />
  <NavItemLink to="/paymentproviderevents" icon={DotIcon} label="PaymentProviderEvents" />
  <NavItemLink to="/ledgeraccounts" icon={DotIcon} label="LedgerAccounts" />
  <NavItemLink to="/listingtypes" icon={DotIcon} label="ListingTypes" />
  <NavItemLink to="/unittypes" icon={DotIcon} label="UnitTypes" />
</NavGroup>
</nav>
    </>
  );
}

export function NavGroup({ title, children, open, onToggle, isCollapsed = false }: React.PropsWithChildren<{ title: string; open?: boolean; onToggle?: () => void; isCollapsed?: boolean }>) {

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const handleToggle = onToggle || (() => setInternalOpen(prev => !prev));
  const show = isCollapsed || isOpen;
  return (
    <div className={`nav-group ${isOpen ? 'open' : 'closed'}`}>
        <button type="button" className="nav-group-header" aria-expanded={isOpen} onClick={handleToggle}>
        <span className="section-title" style={{padding:0}}>{title}</span>
        <span className="chev"><ChevIcon /></span>
      </button>
      <div className="nav-group-body" style={{display: show ? 'grid' : 'none'}}>{children}</div>
    </div>
  );
}

export function NavItemLink({ to, label, icon: Icon = DotIcon, active, highlight }: { to: string; label: string; icon?: React.FC<any>; active?: boolean; highlight?: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-btn${isActive || active ? ' active' : ''}${highlight ? ' highlight' : ''}`}
      title={label}
      aria-current={active ? "page" : undefined}
      >
    
      <span className="nav-left">{Icon && <Icon />}<span className="nav-label">{label}</span></span>
      <span className="nav-arrow"><ChevIcon/></span>
    </NavLink>
  );
}