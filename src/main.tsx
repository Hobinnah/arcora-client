{/*  ===================================THIS FILE WAS AUTO GENERATED=================================== */}

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './contexts/AuthProvider.tsx';
import NotFoundPage from './pages/general/NotFoundPage.tsx';
import AccessDeniedPage from './pages/general/AccessDeniedPage.tsx';
import TaskList from './pages/tasks/TaskList.tsx';
import TaskDetails from './pages/tasks/TaskDetails.tsx';
import LoginPage from './pages/general/LoginPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ChangePasswordPage from './pages/general/ChangePasswordPage.tsx';
import ForgotPasswordPage from './pages/general/ForgotPasswordPage.tsx';
import ResetPasswordPage from './pages/general/ResetPasswordPage.tsx';
import ConfirmEmailPage from './pages/general/ConfirmEmailPage.tsx';
import RegistrationPage from './pages/general/RegistrationPage.tsx';
import HooksErrorBoundary from './components/HooksErrorBoundary.tsx';
import LogoutPage from './pages/general/LogoutPage.tsx';
import TenantList from './pages/tenants/TenantList.tsx';
import TenantDetails from './pages/tenants/TenantDetails.tsx';
import PropertyList from './pages/properties/PropertyList.tsx';
import PropertyDetails from './pages/properties/PropertyDetails.tsx';
import LeaseList from './pages/leases/LeaseList.tsx';
import LeaseDetails from './pages/leases/LeaseDetails.tsx';
import PaymentMethodList from './pages/paymentmethods/PaymentMethodList.tsx';
import PaymentMethodDetails from './pages/paymentmethods/PaymentMethodDetails.tsx';
import AddressList from './pages/addresses/AddressList.tsx';
import AddressDetails from './pages/addresses/AddressDetails.tsx';
import RentalUnitList from './pages/rentalunits/RentalUnitList.tsx';
import RentalUnitDetails from './pages/rentalunits/RentalUnitDetails.tsx';
import OrganizationList from './pages/organizations/OrganizationList.tsx';
import OrganizationDetails from './pages/organizations/OrganizationDetails.tsx';
import OrganizationMemberList from './pages/organizationmembers/OrganizationMemberList.tsx';
import OrganizationMemberDetails from './pages/organizationmembers/OrganizationMemberDetails.tsx';
import ListingList from './pages/listings/ListingList.tsx';
import ListingDetails from './pages/listings/ListingDetails.tsx';
import ListingTermPriceList from './pages/listingtermprices/ListingTermPriceList.tsx';
import ListingTermPriceDetails from './pages/listingtermprices/ListingTermPriceDetails.tsx';
import ListingAccessInstructionList from './pages/listingaccessinstructions/ListingAccessInstructionList.tsx';
import ListingAccessInstructionDetails from './pages/listingaccessinstructions/ListingAccessInstructionDetails.tsx';
import ListingPhotoList from './pages/listingphotos/ListingPhotoList.tsx';
import ListingPhotoDetails from './pages/listingphotos/ListingPhotoDetails.tsx';
import TenantInvitationList from './pages/tenantinvitations/TenantInvitationList.tsx';
import TenantInvitationDetails from './pages/tenantinvitations/TenantInvitationDetails.tsx';
import TenantEmploymentList from './pages/tenantemployments/TenantEmploymentList.tsx';
import TenantEmploymentDetails from './pages/tenantemployments/TenantEmploymentDetails.tsx';
import TenantGuarantorList from './pages/tenantguarantors/TenantGuarantorList.tsx';
import TenantGuarantorDetails from './pages/tenantguarantors/TenantGuarantorDetails.tsx';
import TenantEmergencyContactList from './pages/tenantemergencycontacts/TenantEmergencyContactList.tsx';
import TenantEmergencyContactDetails from './pages/tenantemergencycontacts/TenantEmergencyContactDetails.tsx';
import TenantScreeningCheckList from './pages/tenantscreeningchecks/TenantScreeningCheckList.tsx';
import TenantScreeningCheckDetails from './pages/tenantscreeningchecks/TenantScreeningCheckDetails.tsx';
import ApplicationOccupantList from './pages/applicationoccupants/ApplicationOccupantList.tsx';
import ApplicationOccupantDetails from './pages/applicationoccupants/ApplicationOccupantDetails.tsx';
import TenancyTypeList from './pages/tenancytypes/TenancyTypeList.tsx';
import TenancyTypeDetails from './pages/tenancytypes/TenancyTypeDetails.tsx';
import RentalApplicationList from './pages/rentalapplications/RentalApplicationList.tsx';
import RentalApplicationDetails from './pages/rentalapplications/RentalApplicationDetails.tsx';
import ReservationHoldList from './pages/reservationholds/ReservationHoldList.tsx';
import ReservationHoldDetails from './pages/reservationholds/ReservationHoldDetails.tsx';
import SecurityDepositList from './pages/securitydeposits/SecurityDepositList.tsx';
import SecurityDepositDetails from './pages/securitydeposits/SecurityDepositDetails.tsx';
import SecurityDepositTransactionList from './pages/securitydeposittransactions/SecurityDepositTransactionList.tsx';
import SecurityDepositTransactionDetails from './pages/securitydeposittransactions/SecurityDepositTransactionDetails.tsx';
import LeaseOccupantsList from './pages/leaseoccupants/LeaseOccupantsList.tsx';
import LeaseOccupantsDetails from './pages/leaseoccupants/LeaseOccupantsDetails.tsx';
import LeaseRenewalsList from './pages/leaserenewals/LeaseRenewalsList.tsx';
import LeaseRenewalsDetails from './pages/leaserenewals/LeaseRenewalsDetails.tsx';
import LeaseDocumentsList from './pages/leasedocuments/LeaseDocumentsList.tsx';
import LeaseDocumentsDetails from './pages/leasedocuments/LeaseDocumentsDetails.tsx';
import LeaseSignatoriesList from './pages/leasesignatories/LeaseSignatoriesList.tsx';
import LeaseSignatoriesDetails from './pages/leasesignatories/LeaseSignatoriesDetails.tsx';
import LeaseRecurringChargesList from './pages/leaserecurringcharges/LeaseRecurringChargesList.tsx';
import LeaseRecurringChargesDetails from './pages/leaserecurringcharges/LeaseRecurringChargesDetails.tsx';
import ViewingAppointmentsList from './pages/viewingappointments/ViewingAppointmentsList.tsx';
import ViewingAppointmentsDetails from './pages/viewingappointments/ViewingAppointmentsDetails.tsx';
import FeeList from './pages/fees/FeeList.tsx';
import FeeDetails from './pages/fees/FeeDetails.tsx';
import FeeTypeList from './pages/feetypes/FeeTypeList.tsx';
import FeeTypeDetails from './pages/feetypes/FeeTypeDetails.tsx';
import InvoiceMasterList from './pages/invoicemasters/InvoiceMasterList.tsx';
import InvoiceMasterDetails from './pages/invoicemasters/InvoiceMasterDetails.tsx';
import TaxRateList from './pages/taxrates/TaxRateList.tsx';
import TaxRateDetails from './pages/taxrates/TaxRateDetails.tsx';
import InvoiceDetailList from './pages/invoicedetails/InvoiceDetailList.tsx';
import InvoiceDetailDetails from './pages/invoicedetails/InvoiceDetailDetails.tsx';
import AutopayMandateList from './pages/autopaymandates/AutopayMandateList.tsx';
import AutopayMandateDetails from './pages/autopaymandates/AutopayMandateDetails.tsx';
import AutopayConsentAuditList from './pages/autopayconsentaudits/AutopayConsentAuditList.tsx';
import AutopayConsentAuditDetails from './pages/autopayconsentaudits/AutopayConsentAuditDetails.tsx';
import OrganizationStatementList from './pages/organizationstatements/OrganizationStatementList.tsx';
import OrganizationStatementDetails from './pages/organizationstatements/OrganizationStatementDetails.tsx';
import PaymentIntentList from './pages/paymentintents/PaymentIntentList.tsx';
import PaymentIntentDetails from './pages/paymentintents/PaymentIntentDetails.tsx';
import PaymentAttemptList from './pages/paymentattempts/PaymentAttemptList.tsx';
import PaymentAttemptDetails from './pages/paymentattempts/PaymentAttemptDetails.tsx';
import PaymentList from './pages/payments/PaymentList.tsx';
import PaymentDetails from './pages/payments/PaymentDetails.tsx';
import ChargebackList from './pages/chargebacks/ChargebackList.tsx';
import ChargebackDetails from './pages/chargebacks/ChargebackDetails.tsx';
import PaymentProviderEventList from './pages/paymentproviderevents/PaymentProviderEventList.tsx';
import PaymentProviderEventDetails from './pages/paymentproviderevents/PaymentProviderEventDetails.tsx';
import RefundList from './pages/refunds/RefundList.tsx';
import RefundDetails from './pages/refunds/RefundDetails.tsx';
import OrgPayoutAccountList from './pages/orgpayoutaccounts/OrgPayoutAccountList.tsx';
import OrgPayoutAccountDetails from './pages/orgpayoutaccounts/OrgPayoutAccountDetails.tsx';
import ReceiptMasterList from './pages/receiptmasters/ReceiptMasterList.tsx';
import ReceiptMasterDetails from './pages/receiptmasters/ReceiptMasterDetails.tsx';
import LedgerTransactionList from './pages/ledgertransactions/LedgerTransactionList.tsx';
import LedgerTransactionDetails from './pages/ledgertransactions/LedgerTransactionDetails.tsx';
import LedgerEntryList from './pages/ledgerentries/LedgerEntryList.tsx';
import LedgerEntryDetails from './pages/ledgerentries/LedgerEntryDetails.tsx';
import PaymentAllocationList from './pages/paymentallocations/PaymentAllocationList.tsx';
import PaymentAllocationDetails from './pages/paymentallocations/PaymentAllocationDetails.tsx';
import PayoutList from './pages/payouts/PayoutList.tsx';
import PayoutDetails from './pages/payouts/PayoutDetails.tsx';
import LedgerAccountList from './pages/ledgeraccounts/LedgerAccountList.tsx';
import LedgerAccountDetails from './pages/ledgeraccounts/LedgerAccountDetails.tsx';
import PayoutItemList from './pages/payoutitems/PayoutItemList.tsx';
import PayoutItemDetails from './pages/payoutitems/PayoutItemDetails.tsx';
import PaymentReminderList from './pages/paymentreminders/PaymentReminderList.tsx';
import PaymentReminderDetails from './pages/paymentreminders/PaymentReminderDetails.tsx';
import ContractorList from './pages/contractors/ContractorList.tsx';
import ContractorDetails from './pages/contractors/ContractorDetails.tsx';
import MaintenanceRequestList from './pages/maintenancerequests/MaintenanceRequestList.tsx';
import MaintenanceRequestDetails from './pages/maintenancerequests/MaintenanceRequestDetails.tsx';
import CategoryList from './pages/categories/CategoryList.tsx';
import CategoryDetails from './pages/categories/CategoryDetails.tsx';
import WorkOrderList from './pages/workorders/WorkOrderList.tsx';
import WorkOrderDetails from './pages/workorders/WorkOrderDetails.tsx';
import InspectionList from './pages/inspections/InspectionList.tsx';
import InspectionDetails from './pages/inspections/InspectionDetails.tsx';
import InspectionItemList from './pages/inspectionitems/InspectionItemList.tsx';
import InspectionItemDetails from './pages/inspectionitems/InspectionItemDetails.tsx';
import AttachmentList from './pages/attachments/AttachmentList.tsx';
import AttachmentDetails from './pages/attachments/AttachmentDetails.tsx';
import ConversationList from './pages/conversations/ConversationList.tsx';
import ConversationDetails from './pages/conversations/ConversationDetails.tsx';
import ConversationParticipantList from './pages/conversationparticipants/ConversationParticipantList.tsx';
import ConversationParticipantDetails from './pages/conversationparticipants/ConversationParticipantDetails.tsx';
import ConversationMessageList from './pages/conversationmessages/ConversationMessageList.tsx';
import ConversationMessageDetails from './pages/conversationmessages/ConversationMessageDetails.tsx';
import RatingList from './pages/ratings/RatingList.tsx';
import RatingDetails from './pages/ratings/RatingDetails.tsx';
import FraudCaseList from './pages/fraudcases/FraudCaseList.tsx';
import FraudCaseDetails from './pages/fraudcases/FraudCaseDetails.tsx';
import IdentityVerificationList from './pages/identityverifications/IdentityVerificationList.tsx';
import IdentityVerificationDetails from './pages/identityverifications/IdentityVerificationDetails.tsx';
import DisputeList from './pages/disputes/DisputeList.tsx';
import DisputeDetails from './pages/disputes/DisputeDetails.tsx';
import CreditReportingEnrollmentList from './pages/creditreportingenrollments/CreditReportingEnrollmentList.tsx';
import CreditReportingEnrollmentDetails from './pages/creditreportingenrollments/CreditReportingEnrollmentDetails.tsx';
import CreditReportingConsentAuditList from './pages/creditreportingconsentaudits/CreditReportingConsentAuditList.tsx';
import CreditReportingConsentAuditDetails from './pages/creditreportingconsentaudits/CreditReportingConsentAuditDetails.tsx';
import CreditReportingList from './pages/creditreportings/CreditReportingList.tsx';
import CreditReportingDetails from './pages/creditreportings/CreditReportingDetails.tsx';
import NotificationList from './pages/notifications/NotificationList.tsx';
import NotificationDetails from './pages/notifications/NotificationDetails.tsx';
import SubscriptionPlanList from './pages/subscriptionplans/SubscriptionPlanList.tsx';
import SubscriptionPlanDetails from './pages/subscriptionplans/SubscriptionPlanDetails.tsx';
import OrgSubscriptionList from './pages/orgsubscriptions/OrgSubscriptionList.tsx';
import OrgSubscriptionDetails from './pages/orgsubscriptions/OrgSubscriptionDetails.tsx';
import AuditLogList from './pages/auditlogs/AuditLogList.tsx';
import LeaseDocExtractedTermList from './pages/leasedocextractedterms/LeaseDocExtractedTermList.tsx';
import LeaseDocExtractedTermDetails from './pages/leasedocextractedterms/LeaseDocExtractedTermDetails.tsx';
import AmenityCatalogList from './pages/amenitycatalogs/AmenityCatalogList.tsx';
import AmenityCatalogDetails from './pages/amenitycatalogs/AmenityCatalogDetails.tsx';
import ListingAmenityList from './pages/listingamenities/ListingAmenityList.tsx';
import ListingAmenityDetails from './pages/listingamenities/ListingAmenityDetails.tsx';
import ListingRuleList from './pages/listingrules/ListingRuleList.tsx';
import ListingRuleDetails from './pages/listingrules/ListingRuleDetails.tsx';
import ListingPolicyList from './pages/listingpolicies/ListingPolicyList.tsx';
import ListingPolicyDetails from './pages/listingpolicies/ListingPolicyDetails.tsx';
import CalendarEventList from './pages/calendarevents/CalendarEventList.tsx';
import CalendarEventDetails from './pages/calendarevents/CalendarEventDetails.tsx';
import ListingTypeList from './pages/listingtypes/ListingTypeList.tsx';
import ListingTypeDetails from './pages/listingtypes/ListingTypeDetails.tsx';
import UnitTypeList from './pages/unittypes/UnitTypeList.tsx';
import UnitTypeDetails from './pages/unittypes/UnitTypeDetails.tsx';



const router = createBrowserRouter([

  { path: "/", element: <LoginPage />, errorElement: <NotFoundPage /> },
  { path: "*", element: <NotFoundPage /> },
  { path: "/overview", element: ( <ProtectedRoute allowedRoles={['viewer', 'user', 'admin']}> <App />  </ProtectedRoute> ) },
  { path: "/login", element: <LoginPage />  },
  { path: "/logout", element: <LogoutPage />  },
  { path: "/register", element: <RegistrationPage />  },
  { path: "/forgot-password", element: <ForgotPasswordPage />  },
  { path: "/reset-password", element: <ResetPasswordPage />  },
  { path: "/confirm-email", element: <ConfirmEmailPage /> },
  { path: "/verify-email", element: <ConfirmEmailPage /> },
  { path: "/access-denied", element: <AccessDeniedPage />  },
  { path: "/change-password", element: ( <ProtectedRoute allowedRoles={['viewer', 'user', 'admin']}> <ChangePasswordPage />  </ProtectedRoute> ) },
  { path: "/tasks", element: ( <ProtectedRoute allowedRoles={['viewer', 'user', 'admin']}> <TaskList />  </ProtectedRoute> ) },
  { path: "/tasks/:id", element: ( <ProtectedRoute allowedRoles={['user', 'admin']}> <TaskDetails />  </ProtectedRoute> ) },

  { path: "/tenants", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TenantList />  </ProtectedRoute> ) },
  { path: "/tenants/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TenantDetails />  </ProtectedRoute> ) },
  { path: "/properties", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PropertyList />  </ProtectedRoute> ) },
  { path: "/properties/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PropertyDetails />  </ProtectedRoute> ) },
  { path: "/leases", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LeaseList />  </ProtectedRoute> ) },
  { path: "/leases/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LeaseDetails />  </ProtectedRoute> ) },
  { path: "/paymentmethods", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PaymentMethodList />  </ProtectedRoute> ) },
  { path: "/paymentmethods/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PaymentMethodDetails />  </ProtectedRoute> ) },
  { path: "/addresses", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <AddressList />  </ProtectedRoute> ) },
  { path: "/addresses/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <AddressDetails />  </ProtectedRoute> ) },
  { path: "/rentalunits", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <RentalUnitList />  </ProtectedRoute> ) },
  { path: "/rentalunits/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <RentalUnitDetails />  </ProtectedRoute> ) },
  { path: "/organizations", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <OrganizationList />  </ProtectedRoute> ) },
  { path: "/organizations/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <OrganizationDetails />  </ProtectedRoute> ) },
  { path: "/organizationmembers", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <OrganizationMemberList />  </ProtectedRoute> ) },
  { path: "/organizationmembers/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <OrganizationMemberDetails />  </ProtectedRoute> ) },
  { path: "/listings", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingList />  </ProtectedRoute> ) },
  { path: "/listings/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingDetails />  </ProtectedRoute> ) },
  { path: "/listingtermprices", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingTermPriceList />  </ProtectedRoute> ) },
  { path: "/listingtermprices/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingTermPriceDetails />  </ProtectedRoute> ) },
  { path: "/listingaccessinstructions", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingAccessInstructionList />  </ProtectedRoute> ) },
  { path: "/listingaccessinstructions/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingAccessInstructionDetails />  </ProtectedRoute> ) },
  { path: "/listingphotos", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingPhotoList />  </ProtectedRoute> ) },
  { path: "/listingphotos/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingPhotoDetails />  </ProtectedRoute> ) },
  { path: "/tenantinvitations", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TenantInvitationList />  </ProtectedRoute> ) },
  { path: "/tenantinvitations/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TenantInvitationDetails />  </ProtectedRoute> ) },
  { path: "/tenantemployments", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TenantEmploymentList />  </ProtectedRoute> ) },
  { path: "/tenantemployments/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TenantEmploymentDetails />  </ProtectedRoute> ) },
  { path: "/tenantguarantors", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TenantGuarantorList />  </ProtectedRoute> ) },
  { path: "/tenantguarantors/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TenantGuarantorDetails />  </ProtectedRoute> ) },
  { path: "/tenantemergencycontacts", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TenantEmergencyContactList />  </ProtectedRoute> ) },
  { path: "/tenantemergencycontacts/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TenantEmergencyContactDetails />  </ProtectedRoute> ) },
  { path: "/tenantscreeningchecks", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TenantScreeningCheckList />  </ProtectedRoute> ) },
  { path: "/tenantscreeningchecks/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TenantScreeningCheckDetails />  </ProtectedRoute> ) },
  { path: "/applicationoccupants", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ApplicationOccupantList />  </ProtectedRoute> ) },
  { path: "/applicationoccupants/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ApplicationOccupantDetails />  </ProtectedRoute> ) },
  { path: "/tenancytypes", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TenancyTypeList />  </ProtectedRoute> ) },
  { path: "/tenancytypes/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TenancyTypeDetails />  </ProtectedRoute> ) },
  { path: "/rentalapplications", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <RentalApplicationList />  </ProtectedRoute> ) },
  { path: "/rentalapplications/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <RentalApplicationDetails />  </ProtectedRoute> ) },
  { path: "/reservationholds", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ReservationHoldList />  </ProtectedRoute> ) },
  { path: "/reservationholds/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ReservationHoldDetails />  </ProtectedRoute> ) },
  { path: "/securitydeposits", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <SecurityDepositList />  </ProtectedRoute> ) },
  { path: "/securitydeposits/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <SecurityDepositDetails />  </ProtectedRoute> ) },
  { path: "/securitydeposittransactions", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <SecurityDepositTransactionList />  </ProtectedRoute> ) },
  { path: "/securitydeposittransactions/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <SecurityDepositTransactionDetails />  </ProtectedRoute> ) },
  { path: "/leaseoccupants", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LeaseOccupantsList />  </ProtectedRoute> ) },
  { path: "/leaseoccupants/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LeaseOccupantsDetails />  </ProtectedRoute> ) },
  { path: "/leaserenewals", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LeaseRenewalsList />  </ProtectedRoute> ) },
  { path: "/leaserenewals/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LeaseRenewalsDetails />  </ProtectedRoute> ) },
  { path: "/leasedocuments", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LeaseDocumentsList />  </ProtectedRoute> ) },
  { path: "/leasedocuments/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LeaseDocumentsDetails />  </ProtectedRoute> ) },
  { path: "/leasesignatories", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LeaseSignatoriesList />  </ProtectedRoute> ) },
  { path: "/leasesignatories/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LeaseSignatoriesDetails />  </ProtectedRoute> ) },
  { path: "/leaserecurringcharges", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LeaseRecurringChargesList />  </ProtectedRoute> ) },
  { path: "/leaserecurringcharges/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LeaseRecurringChargesDetails />  </ProtectedRoute> ) },
  { path: "/viewingappointments", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ViewingAppointmentsList />  </ProtectedRoute> ) },
  { path: "/viewingappointments/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ViewingAppointmentsDetails />  </ProtectedRoute> ) },
  { path: "/fees", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <FeeList />  </ProtectedRoute> ) },
  { path: "/fees/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <FeeDetails />  </ProtectedRoute> ) },
  { path: "/feetypes", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <FeeTypeList />  </ProtectedRoute> ) },
  { path: "/feetypes/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <FeeTypeDetails />  </ProtectedRoute> ) },
  { path: "/invoicemasters", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <InvoiceMasterList />  </ProtectedRoute> ) },
  { path: "/invoicemasters/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <InvoiceMasterDetails />  </ProtectedRoute> ) },
  { path: "/taxrates", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <TaxRateList />  </ProtectedRoute> ) },
  { path: "/taxrates/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <TaxRateDetails />  </ProtectedRoute> ) },
  { path: "/invoicedetails", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <InvoiceDetailList />  </ProtectedRoute> ) },
  { path: "/invoicedetails/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <InvoiceDetailDetails />  </ProtectedRoute> ) },
  { path: "/autopaymandates", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <AutopayMandateList />  </ProtectedRoute> ) },
  { path: "/autopaymandates/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <AutopayMandateDetails />  </ProtectedRoute> ) },
  { path: "/autopayconsentaudits", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <AutopayConsentAuditList />  </ProtectedRoute> ) },
  { path: "/autopayconsentaudits/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <AutopayConsentAuditDetails />  </ProtectedRoute> ) },
  { path: "/organizationstatements", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <OrganizationStatementList />  </ProtectedRoute> ) },
  { path: "/organizationstatements/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <OrganizationStatementDetails />  </ProtectedRoute> ) },
  { path: "/paymentintents", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PaymentIntentList />  </ProtectedRoute> ) },
  { path: "/paymentintents/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PaymentIntentDetails />  </ProtectedRoute> ) },
  { path: "/paymentattempts", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PaymentAttemptList />  </ProtectedRoute> ) },
  { path: "/paymentattempts/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PaymentAttemptDetails />  </ProtectedRoute> ) },
  { path: "/payments", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PaymentList />  </ProtectedRoute> ) },
  { path: "/payments/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PaymentDetails />  </ProtectedRoute> ) },
  { path: "/chargebacks", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ChargebackList />  </ProtectedRoute> ) },
  { path: "/chargebacks/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ChargebackDetails />  </ProtectedRoute> ) },
  { path: "/paymentproviderevents", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PaymentProviderEventList />  </ProtectedRoute> ) },
  { path: "/paymentproviderevents/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PaymentProviderEventDetails />  </ProtectedRoute> ) },
  { path: "/refunds", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <RefundList />  </ProtectedRoute> ) },
  { path: "/refunds/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <RefundDetails />  </ProtectedRoute> ) },
  { path: "/orgpayoutaccounts", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <OrgPayoutAccountList />  </ProtectedRoute> ) },
  { path: "/orgpayoutaccounts/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <OrgPayoutAccountDetails />  </ProtectedRoute> ) },
  { path: "/receiptmasters", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ReceiptMasterList />  </ProtectedRoute> ) },
  { path: "/receiptmasters/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ReceiptMasterDetails />  </ProtectedRoute> ) },
  { path: "/ledgertransactions", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LedgerTransactionList />  </ProtectedRoute> ) },
  { path: "/ledgertransactions/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LedgerTransactionDetails />  </ProtectedRoute> ) },
  { path: "/ledgerentries", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LedgerEntryList />  </ProtectedRoute> ) },
  { path: "/ledgerentries/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LedgerEntryDetails />  </ProtectedRoute> ) },
  { path: "/paymentallocations", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PaymentAllocationList />  </ProtectedRoute> ) },
  { path: "/paymentallocations/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PaymentAllocationDetails />  </ProtectedRoute> ) },
  { path: "/payouts", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PayoutList />  </ProtectedRoute> ) },
  { path: "/payouts/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PayoutDetails />  </ProtectedRoute> ) },
  { path: "/ledgeraccounts", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LedgerAccountList />  </ProtectedRoute> ) },
  { path: "/ledgeraccounts/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LedgerAccountDetails />  </ProtectedRoute> ) },
  { path: "/payoutitems", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PayoutItemList />  </ProtectedRoute> ) },
  { path: "/payoutitems/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PayoutItemDetails />  </ProtectedRoute> ) },
  { path: "/paymentreminders", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <PaymentReminderList />  </ProtectedRoute> ) },
  { path: "/paymentreminders/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <PaymentReminderDetails />  </ProtectedRoute> ) },
  { path: "/contractors", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ContractorList />  </ProtectedRoute> ) },
  { path: "/contractors/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ContractorDetails />  </ProtectedRoute> ) },
  { path: "/maintenancerequests", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <MaintenanceRequestList />  </ProtectedRoute> ) },
  { path: "/maintenancerequests/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <MaintenanceRequestDetails />  </ProtectedRoute> ) },
  { path: "/categories", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <CategoryList />  </ProtectedRoute> ) },
  { path: "/categories/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <CategoryDetails />  </ProtectedRoute> ) },
  { path: "/workorders", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <WorkOrderList />  </ProtectedRoute> ) },
  { path: "/workorders/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <WorkOrderDetails />  </ProtectedRoute> ) },
  { path: "/inspections", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <InspectionList />  </ProtectedRoute> ) },
  { path: "/inspections/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <InspectionDetails />  </ProtectedRoute> ) },
  { path: "/inspectionitems", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <InspectionItemList />  </ProtectedRoute> ) },
  { path: "/inspectionitems/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <InspectionItemDetails />  </ProtectedRoute> ) },
  { path: "/attachments", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <AttachmentList />  </ProtectedRoute> ) },
  { path: "/attachments/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <AttachmentDetails />  </ProtectedRoute> ) },
  { path: "/conversations", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ConversationList />  </ProtectedRoute> ) },
  { path: "/conversations/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ConversationDetails />  </ProtectedRoute> ) },
  { path: "/conversationparticipants", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ConversationParticipantList />  </ProtectedRoute> ) },
  { path: "/conversationparticipants/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ConversationParticipantDetails />  </ProtectedRoute> ) },
  { path: "/conversationmessages", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ConversationMessageList />  </ProtectedRoute> ) },
  { path: "/conversationmessages/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ConversationMessageDetails />  </ProtectedRoute> ) },
  { path: "/ratings", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <RatingList />  </ProtectedRoute> ) },
  { path: "/ratings/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <RatingDetails />  </ProtectedRoute> ) },
  { path: "/fraudcases", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <FraudCaseList />  </ProtectedRoute> ) },
  { path: "/fraudcases/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <FraudCaseDetails />  </ProtectedRoute> ) },
  { path: "/identityverifications", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <IdentityVerificationList />  </ProtectedRoute> ) },
  { path: "/identityverifications/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <IdentityVerificationDetails />  </ProtectedRoute> ) },
  { path: "/disputes", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <DisputeList />  </ProtectedRoute> ) },
  { path: "/disputes/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <DisputeDetails />  </ProtectedRoute> ) },
  { path: "/creditreportingenrollments", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <CreditReportingEnrollmentList />  </ProtectedRoute> ) },
  { path: "/creditreportingenrollments/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <CreditReportingEnrollmentDetails />  </ProtectedRoute> ) },
  { path: "/creditreportingconsentaudits", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <CreditReportingConsentAuditList />  </ProtectedRoute> ) },
  { path: "/creditreportingconsentaudits/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <CreditReportingConsentAuditDetails />  </ProtectedRoute> ) },
  { path: "/creditreportings", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <CreditReportingList />  </ProtectedRoute> ) },
  { path: "/creditreportings/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <CreditReportingDetails />  </ProtectedRoute> ) },
  { path: "/notifications", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <NotificationList />  </ProtectedRoute> ) },
  { path: "/notifications/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <NotificationDetails />  </ProtectedRoute> ) },
  { path: "/subscriptionplans", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <SubscriptionPlanList />  </ProtectedRoute> ) },
  { path: "/subscriptionplans/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <SubscriptionPlanDetails />  </ProtectedRoute> ) },
  { path: "/orgsubscriptions", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <OrgSubscriptionList />  </ProtectedRoute> ) },
  { path: "/orgsubscriptions/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <OrgSubscriptionDetails />  </ProtectedRoute> ) },
  { path: "/auditlogs", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <AuditLogList />  </ProtectedRoute> ) },
  { path: "/leasedocextractedterms", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <LeaseDocExtractedTermList />  </ProtectedRoute> ) },
  { path: "/leasedocextractedterms/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <LeaseDocExtractedTermDetails />  </ProtectedRoute> ) },
  { path: "/amenitycatalogs", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <AmenityCatalogList />  </ProtectedRoute> ) },
  { path: "/amenitycatalogs/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <AmenityCatalogDetails />  </ProtectedRoute> ) },
  { path: "/listingamenities", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingAmenityList />  </ProtectedRoute> ) },
  { path: "/listingamenities/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingAmenityDetails />  </ProtectedRoute> ) },
  { path: "/listingrules", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingRuleList />  </ProtectedRoute> ) },
  { path: "/listingrules/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingRuleDetails />  </ProtectedRoute> ) },
  { path: "/listingpolicies", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingPolicyList />  </ProtectedRoute> ) },
  { path: "/listingpolicies/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingPolicyDetails />  </ProtectedRoute> ) },
  { path: "/calendarevents", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <CalendarEventList />  </ProtectedRoute> ) },
  { path: "/calendarevents/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <CalendarEventDetails />  </ProtectedRoute> ) },
  { path: "/listingtypes", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <ListingTypeList />  </ProtectedRoute> ) },
  { path: "/listingtypes/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <ListingTypeDetails />  </ProtectedRoute> ) },
  { path: "/unittypes", element: ( <ProtectedRoute allowedRoles={['viewer','user','admin']}> <UnitTypeList />  </ProtectedRoute> ) },
  { path: "/unittypes/:id", element: ( <ProtectedRoute allowedRoles={['user','admin']}> <UnitTypeDetails />  </ProtectedRoute> ) },])

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <HooksErrorBoundary onError={(error, info) => {
    console.error('🚨 Main Error Boundary Caught Hooks Violation:', error);
    console.log('Component Stack:', info.componentStack);
  }}>
    <AuthProvider> 
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
         </QueryClientProvider>
    </AuthProvider> 
  </HooksErrorBoundary>
)
