import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CheckIcon, FileIcon, PdfIcon, PencilIcon, ShieldIcon, TrashIcon } from "../components/Icons";
import { fallbackListings, normalizeListing, type MarketplaceListing } from "./marketplaceData";
import { getListing } from "../apis/useListing";
import { createTenant, getTenantByUserID, updateTenant } from "../apis/useTenant";
import { deleteLeaseDocuments, fetchLeaseDocuments, uploadLeaseDocument } from "../apis/useLeaseDocuments";
import type { LeaseDocuments } from "../types/LeaseDocuments";
import { useAuth } from "../hooks/useAuth";
import type { Tenant } from "../types/Tenant";
import type { TenantEmployment } from "../types/TenantEmployment";
import { createTenantEmployment, fetchTenantEmployments, updateTenantEmployment } from "../apis/useTenantEmployment";
import { createApplicationOccupant, fetchApplicationOccupants, updateApplicationOccupant } from "../apis/useApplicationOccupant";
import type { ApplicationOccupant } from "../types/ApplicationOccupant";
import { createTenantGuarantor, fetchTenantGuarantors, updateTenantGuarantor } from "../apis/useTenantGuarantor";
import type { TenantGuarantor } from "../types/TenantGuarantor";
import { fetchRentalApplications } from "../apis/useRentalApplication";
import TenantHeader from "./TenantHeader";
import MarketplaceFooter from "./MarketplaceFooter";
import TenantDatePicker from "./TenantDatePicker";
import CustomSelect from "../components/CustomSelect";
import { publishHostApplicationNotification } from "../hosting/hostApplicationNotifications";
import "./TenantApplicationDetailPage.css";

const getMaxAdultDateOfBirth = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const formatCurrency = (value: string | number) => {
  const amount = Number(typeof value === "string" ? value.replace(/,/g, "") : value);
  return Number.isFinite(amount) ? amount.toLocaleString("en-US") : "0";
};

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
type DocumentKey = "identity" | "income" | "rental" | "supporting";
type HouseholdOccupant = { applicationOccupantID?: string; firstName: string; lastName: string; dateOfBirth: string; email: string; phoneNumber: string; occupantType: string; isPrimaryTenant: boolean; isFinanciallyResponsible: boolean };
type ApplicationGuarantor = { tenantGuarantorID?: string; firstName: string; lastName: string; email: string; phoneNumber: string; relationship: string; annualIncome: string; status: string };
const sections: Section[] = [
  { key: "readiness", label: "Readiness check", detail: "Start here" },
  { key: "profile", label: "Your profile", detail: "Required" },
  { key: "employment", label: "Employment & income", detail: "Required" },
  { key: "household", label: "Adult households", detail: "Required" },
  { key: "guarantor", label: "Guarantors", detail: "Optional" },
  { key: "documents", label: "Documents & screening", detail: "Required" },
  { key: "rules", label: "Rules & contract", detail: "Required" },
  { key: "payment", label: "Payment method", detail: "Required" },
  { key: "review", label: "Review & submit", detail: "Locked" },
];

export default function TenantApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const fallbackListing =
    fallbackListings[
      id === "app-1017" ? 2 : id === "app-0998" ? 1 : id === "app-0942" ? 3 : 0
    ];
  const [listing, setListing] = useState<MarketplaceListing>(fallbackListing);
  const [depositAmount, setDepositAmount] = useState<number>(fallbackListing.price);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenantLookupComplete, setTenantLookupComplete] = useState(false);
  const [tenantDescription, setTenantDescription] = useState<string | undefined>();
  const [nextError, setNextError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingEmployment, setIsSavingEmployment] = useState(false);
  const [isSavingHousehold, setIsSavingHousehold] = useState(false);
  const [isSavingGuarantors, setIsSavingGuarantors] = useState(false);
  const [employmentDocumentName, setEmploymentDocumentName] = useState("");
  const [employmentDocumentError, setEmploymentDocumentError] = useState("");
  const [isUploadingEmploymentDocument, setIsUploadingEmploymentDocument] = useState(false);
  const employmentDocumentInputRef = useRef<HTMLInputElement>(null);
  const [employment, setEmployment] = useState({ employmentType: "Employed", employerName: "", jobTitle: "", employerEmail: "", employerPhoneCountryCode: "+1", employerPhoneNumber: "", annualIncome: "", currency: "CAD", startedAt: "", endedAt: "", isCurrent: true });
  const [savedEmployment, setSavedEmployment] = useState<TenantEmployment | null>(null);
  const [occupants, setOccupants] = useState<HouseholdOccupant[]>([]);
  const [savedOccupants, setSavedOccupants] = useState<Record<string, ApplicationOccupant>>({});
  const [occupantForm, setOccupantForm] = useState({ firstName: "", lastName: "", dateOfBirth: "", email: "", phoneCountryCode: "+1", phoneNumber: "", occupantType: "ADULT", isPrimaryTenant: false, isFinanciallyResponsible: false });
  const [editingOccupantIndex, setEditingOccupantIndex] = useState<number | null>(null);
  const [guarantors, setGuarantors] = useState<ApplicationGuarantor[]>([]);
  const [savedGuarantors, setSavedGuarantors] = useState<Record<string, TenantGuarantor>>({});
  const [guarantorForm, setGuarantorForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", relationship: "Parent", annualIncome: "" });
  const [editingGuarantorIndex, setEditingGuarantorIndex] = useState<number | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Partial<Record<Exclude<DocumentKey, "supporting">, string>>>({});
  const [supportingDocuments, setSupportingDocuments] = useState<string[]>([]);
  const [uploadedLeaseDocuments, setUploadedLeaseDocuments] = useState<Partial<Record<Exclude<DocumentKey, "identity" | "supporting">, LeaseDocuments>>>({});
  const [supportingLeaseDocuments, setSupportingLeaseDocuments] = useState<LeaseDocuments[]>([]);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [persistedCompletedSteps, setPersistedCompletedSteps] = useState<SectionKey[] | null>(null);
  const [hasAppliedPersistedSteps, setHasAppliedPersistedSteps] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getListing(id)
      .then((data) => {
        if (cancelled || !data) return;
        const listingData = data as unknown as Record<string, unknown>;
        const normalized = normalizeListing(listingData, 0);
        if (normalized) {
          setListing(normalized);
        }
        const deposit = listingData.securityDepositAmount ?? normalized?.price;
        if (typeof deposit === "number") {
          setDepositAmount(deposit);
        }
      })
      .catch(() => {
        // Fallback listing remains as default if fetching fails or ID is a mock app ID
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  useEffect(() => {
    if (!userID) {
      return;
    }
    let cancelled = false;
    getTenantByUserID(userID)
      .then((result) => {
        if (!cancelled) setTenant(result);
      })
      .catch(() => {
        if (!cancelled) setTenant(null);
      })
      .finally(() => {
        if (!cancelled) setTenantLookupComplete(true);
      });
    return () => {
      cancelled = true;
    };
  }, [userID]);

  useEffect(() => {
    if (!tenant?.tenantID) return;
    let cancelled = false;
    const loadPersistedApplicationData = async () => {
      try {
        const [employmentResponse, documentResponse, occupantResponse, guarantorResponse, applicationResponse] = await Promise.all([
          fetchTenantEmployments({ pageSize: 200, pageNumber: 0 }),
          fetchLeaseDocuments({ pageSize: 200, pageNumber: 0 }),
          fetchApplicationOccupants({ pageSize: 200, pageNumber: 0 }),
          fetchTenantGuarantors({ pageSize: 200, pageNumber: 0 }),
          fetchRentalApplications({ pageSize: 200, pageNumber: 0, tenantID: tenant.tenantID, listingID: listing.id }),
        ]);
        if (cancelled) return;
        const savedEmployment = employmentResponse.data
          .filter((record) => record.tenantID === tenant.tenantID)
          .sort((left, right) => right.capturedDate.localeCompare(left.capturedDate))[0];
        if (savedEmployment) {
          const [countryCode = "+1", ...phoneParts] = savedEmployment.employerPhoneNumber.split(" ");
          setSavedEmployment(savedEmployment);
          setEmployment({
            employmentType: savedEmployment.employmentType,
            employerName: savedEmployment.employerName,
            jobTitle: savedEmployment.jobTitle,
            employerEmail: savedEmployment.employerEmail,
            employerPhoneCountryCode: countryCode,
            employerPhoneNumber: phoneParts.join(" "),
            annualIncome: savedEmployment.annualIncome.toLocaleString("en-US"),
            currency: savedEmployment.currency,
            startedAt: savedEmployment.startedAt,
            endedAt: savedEmployment.endedAt || "",
            isCurrent: savedEmployment.isCurrent,
          });
        }
        const savedIncomeDocument = documentResponse.data
          .filter((document) => document.tenantID === tenant.tenantID && document.listingID === listing.id && document.documentType === "PROOF_OF_INCOME")
          .sort((left, right) => right.capturedDate.localeCompare(left.capturedDate))[0];
        if (savedIncomeDocument) {
          setEmploymentDocumentName(savedIncomeDocument.originalFilename);
          setUploadedDocuments((current) => ({ ...current, income: savedIncomeDocument.originalFilename }));
          setUploadedLeaseDocuments((current) => ({ ...current, income: savedIncomeDocument }));
        }
        const savedRentalReference = documentResponse.data
          .filter((document) => document.tenantID === tenant.tenantID && document.listingID === listing.id && document.documentType === "RENTAL_REFERENCE")
          .sort((left, right) => right.capturedDate.localeCompare(left.capturedDate))[0];
        if (savedRentalReference) {
          setUploadedDocuments((current) => ({ ...current, rental: savedRentalReference.originalFilename }));
          setUploadedLeaseDocuments((current) => ({ ...current, rental: savedRentalReference }));
        }
        const savedSupportingDocuments = documentResponse.data
          .filter((document) => document.tenantID === tenant.tenantID && document.listingID === listing.id && document.documentType === "SUPPORTING_DOCUMENT")
          .sort((left, right) => right.capturedDate.localeCompare(left.capturedDate))
          .slice(0, 2);
        if (savedSupportingDocuments.length) {
          setSupportingDocuments(savedSupportingDocuments.map((document) => document.originalFilename));
          setSupportingLeaseDocuments(savedSupportingDocuments);
        }
        const savedHousehold = occupantResponse.data.filter((occupant) => occupant.tenantID === tenant.tenantID && !occupant.isPrimaryApplicant);
        setSavedOccupants(Object.fromEntries(savedHousehold.map((occupant) => [occupant.applicationOccupantID, occupant])));
        setOccupants(savedHousehold.map((occupant) => ({ applicationOccupantID: occupant.applicationOccupantID, firstName: occupant.firstName, lastName: occupant.lastName, dateOfBirth: occupant.dateOfBirth || "", email: occupant.email, phoneNumber: occupant.phoneNumber, occupantType: occupant.occupantType, isPrimaryTenant: false, isFinanciallyResponsible: false })));
        const savedTenantGuarantors = guarantorResponse.data.filter((guarantor) => guarantor.tenantID === tenant.tenantID);
        setSavedGuarantors(Object.fromEntries(savedTenantGuarantors.map((guarantor) => [guarantor.tenantGuarantorID, guarantor])));
        setGuarantors(savedTenantGuarantors.map((guarantor) => ({ tenantGuarantorID: guarantor.tenantGuarantorID, firstName: guarantor.firstName, lastName: guarantor.lastName, email: guarantor.email, phoneNumber: guarantor.phoneNumber, relationship: guarantor.relationship, annualIncome: guarantor.annualIncome.toLocaleString("en-US"), status: guarantor.status })));
        const savedApplication = applicationResponse.data[0] ?? null;
        setPersistedCompletedSteps([
          ...(tenant.code && tenant.description ? ["profile" as const] : []),
          ...(savedEmployment ? ["employment" as const] : []),
          ...(savedHousehold.length ? ["household" as const] : []),
          ...(savedTenantGuarantors.length ? ["guarantor" as const] : []),
          ...(tenant.verificationAuthorization || savedApplication?.verificationAuthorization ? ["documents" as const] : []),
          ...(tenant.leaseContractReviewed || savedApplication?.leaseContractReviewed ? ["rules" as const] : []),
        ]);
      } catch (error) {
        console.error("Failed to load saved application data:", error);
      }
    };
    void loadPersistedApplicationData();
    return () => {
      cancelled = true;
    };
  }, [listing.id, tenant?.code, tenant?.description, tenant?.leaseContractReviewed, tenant?.tenantID, tenant?.verificationAuthorization]);

  const tenantStatus = !userID
    ? "unavailable"
    : !tenantLookupComplete
      ? "loading"
      : tenant
        ? "existing"
        : "new";
  const hasTenantDescription = Boolean(
    (tenantDescription ?? tenant?.description ?? "").trim(),
  );

  const paramMoveIn = searchParams.get("moveIn");
  const paramStayLength = searchParams.get("stayLengthMonths");
  const moveInDateDisplay = paramMoveIn
    ? new Date(`${paramMoveIn}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Sep 1, 2026";
  const leaseTermDisplay = paramStayLength
    ? `${paramStayLength} month${paramStayLength === "1" ? "" : "s"}`
    : "6 months";

  const [activeSection, setActiveSection] = useState<SectionKey>("readiness");
  const [completed, setCompleted] = useState<SectionKey[]>([]);
  const [rulesAcknowledged, setRulesAcknowledged] = useState(false);
  const [paymentAuthorized, setPaymentAuthorized] = useState(false);
  const [verificationAuthorized, setVerificationAuthorized] = useState(false);
  const [contractPreviewOpen, setContractPreviewOpen] = useState(false);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  if (persistedCompletedSteps && !hasAppliedPersistedSteps) {
    const requiredResumeSteps: SectionKey[] = ["profile", "employment", "household", "documents", "rules", "payment"];
    const resumeSection = requiredResumeSteps.find((section) => !persistedCompletedSteps.includes(section)) ?? "review";
    setCompleted(persistedCompletedSteps);
    setActiveSection(resumeSection);
    setHasAppliedPersistedSteps(true);
  }
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
  const validateCurrentSection = () => {
    switch (activeSection) {
      case "profile":
        return hasTenantDescription ? "" : "Tell us about yourself before continuing.";
      case "employment":
        return employment.employerName && employment.jobTitle && employment.annualIncome && employment.startedAt
          ? ""
          : "Complete your employer, role, annual income, and employment start date before continuing.";
      case "documents":
        return verificationAuthorized ? "" : "Authorize verification before continuing.";
      case "rules":
        return rulesAcknowledged ? "" : "Confirm that you reviewed the lease summary and house rules before continuing.";
      case "payment":
        return paymentAuthorized ? "" : "Authorize the payment method before continuing.";
      default:
        return "";
    }
  };
  const saveTenantProfile = async () => {
    if (!userID) throw new Error("Your authenticated user profile is unavailable.");
    const now = new Date().toISOString();
    const currentUserProfile = currentUser?.user;
    const tenantPayload = {
      tenantID: tenant?.tenantID ?? null,
      code: tenant?.code || `TEN-${userID}`,
      userID,
      description: (tenantDescription ?? tenant?.description ?? "").trim(),
      phoneNumber: currentUserProfile?.phoneNumber ?? tenant?.phoneNumber ?? "",
      photoUrl: currentUserProfile?.imageUrl ?? tenant?.photoUrl ?? "",
      dateOfBirth: currentUserProfile?.dateOfBirth || tenant?.dateOfBirth || null,
      profileStatus: "COMPLETE",
      isActive: true,
      capturedBy: tenant?.capturedBy ?? `${currentUserProfile?.firstName ?? ""} ${currentUserProfile?.lastName ?? ""}`.trim(),
      capturedDate: tenant?.capturedDate ?? now,
      updatedBy: `${currentUserProfile?.firstName ?? ""} ${currentUserProfile?.lastName ?? ""}`.trim(),
      updatedDate: now,
    } as Tenant;
    if (!tenant?.tenantID) {
      console.log("Creating tenant profile:", tenantPayload);
      setTenant(await createTenant(tenantPayload));
      return;
    }

    const hasChanges = tenant.code !== tenantPayload.code
      || tenant.description !== tenantPayload.description
      || tenant.phoneNumber !== tenantPayload.phoneNumber
      || tenant.photoUrl !== tenantPayload.photoUrl
      || (tenant.dateOfBirth || null) !== tenantPayload.dateOfBirth
      || tenant.profileStatus !== tenantPayload.profileStatus
      || tenant.isActive !== tenantPayload.isActive;
    if (!hasChanges) return;

    console.log("Updating tenant profile:", tenantPayload);
    setTenant(await updateTenant(tenantPayload));
  };
  const saveTenantEmployment = async () => {
    if (!tenant?.tenantID) throw new Error("Complete and save your profile before continuing.");
    const now = new Date().toISOString();
    const currentUserProfile = currentUser?.user;
    const capturedBy = `${currentUserProfile?.firstName ?? ""} ${currentUserProfile?.lastName ?? ""}`.trim();
    const employmentPayload = {
      tenantEmploymentID: savedEmployment?.tenantEmploymentID ?? null,
      tenantID: tenant.tenantID,
      rentalApplicationID: savedEmployment?.rentalApplicationID ?? null,
      employerName: employment.employerName.trim(),
      jobTitle: employment.jobTitle.trim(),
      employmentType: employment.employmentType,
      employerEmail: employment.employerEmail.trim(),
      employerPhoneNumber: `${employment.employerPhoneCountryCode} ${employment.employerPhoneNumber}`.trim(),
      annualIncome: Number(employment.annualIncome.replace(/,/g, "")),
      currency: employment.currency,
      startedAt: employment.startedAt,
      endedAt: employment.endedAt || null,
      isCurrent: employment.isCurrent,
      verificationStatus: savedEmployment?.verificationStatus ?? "PENDING",
      capturedDate: savedEmployment?.capturedDate ?? now,
      capturedBy: savedEmployment?.capturedBy ?? capturedBy,
      updatedDate: now,
      updatedBy: capturedBy,
    } as TenantEmployment;
    if (!savedEmployment?.tenantEmploymentID) {
      console.log("Creating tenant employment:", employmentPayload);
      setSavedEmployment(await createTenantEmployment(employmentPayload));
      return;
    }
    const hasChanges = savedEmployment.tenantID !== employmentPayload.tenantID
      || savedEmployment.employerName !== employmentPayload.employerName
      || savedEmployment.jobTitle !== employmentPayload.jobTitle
      || savedEmployment.employmentType !== employmentPayload.employmentType
      || savedEmployment.employerEmail !== employmentPayload.employerEmail
      || savedEmployment.employerPhoneNumber !== employmentPayload.employerPhoneNumber
      || savedEmployment.annualIncome !== employmentPayload.annualIncome
      || savedEmployment.currency !== employmentPayload.currency
      || savedEmployment.startedAt !== employmentPayload.startedAt
      || (savedEmployment.endedAt || null) !== employmentPayload.endedAt
      || savedEmployment.isCurrent !== employmentPayload.isCurrent;
    if (!hasChanges) return;

    console.log("Updating tenant employment:", employmentPayload);
    setSavedEmployment(await updateTenantEmployment(employmentPayload));
  };
  const saveHousehold = async () => {
    if (!tenant?.tenantID) throw new Error("Complete and save your profile before continuing.");
    const currentUserProfile = currentUser?.user;
    const capturedBy = `${currentUserProfile?.firstName ?? ""} ${currentUserProfile?.lastName ?? ""}`.trim();
    const now = new Date().toISOString();
    await Promise.all(occupants.map(async (occupant) => {
      const savedOccupant = occupant.applicationOccupantID ? savedOccupants[occupant.applicationOccupantID] : undefined;
      const occupantPayload = {
        applicationOccupantID: savedOccupant?.applicationOccupantID ?? null,
        rentalApplicationID: savedOccupant?.rentalApplicationID ?? null,
        tenantID: tenant.tenantID,
        userID: savedOccupant?.userID ?? userID ?? 0,
        firstName: occupant.firstName.trim(),
        lastName: occupant.lastName.trim(),
        dateOfBirth: occupant.dateOfBirth || null,
        email: occupant.email.trim(),
        phoneNumber: occupant.phoneNumber,
        occupantType: occupant.occupantType,
        isPrimaryApplicant: false,
        status: savedOccupant?.status ?? "PENDING",
        capturedDate: savedOccupant?.capturedDate ?? now,
        capturedBy: savedOccupant?.capturedBy ?? capturedBy,
        updatedDate: now,
        updatedBy: capturedBy,
      } as ApplicationOccupant;
      if (!savedOccupant) {
        console.log("Creating application occupant:", occupantPayload);
        const createdOccupant = await createApplicationOccupant(occupantPayload);
        setSavedOccupants((current) => ({ ...current, [createdOccupant.applicationOccupantID]: createdOccupant }));
        setOccupants((current) => current.map((currentOccupant) => currentOccupant === occupant ? { ...currentOccupant, applicationOccupantID: createdOccupant.applicationOccupantID } : currentOccupant));
        return;
      }
      const hasChanges = savedOccupant.firstName !== occupantPayload.firstName
        || savedOccupant.lastName !== occupantPayload.lastName
        || (savedOccupant.dateOfBirth || null) !== occupantPayload.dateOfBirth
        || savedOccupant.email !== occupantPayload.email
        || savedOccupant.phoneNumber !== occupantPayload.phoneNumber
        || savedOccupant.occupantType !== occupantPayload.occupantType;
      if (!hasChanges) return;

      console.log("Updating application occupant:", occupantPayload);
      const updatedOccupant = await updateApplicationOccupant(occupantPayload);
      setSavedOccupants((current) => ({ ...current, [savedOccupant.applicationOccupantID]: updatedOccupant }));
    }));
  };
  const saveGuarantors = async () => {
    if (!tenant?.tenantID) throw new Error("Complete and save your profile before continuing.");
    const currentUserProfile = currentUser?.user;
    const capturedBy = `${currentUserProfile?.firstName ?? ""} ${currentUserProfile?.lastName ?? ""}`.trim();
    const now = new Date().toISOString();
    await Promise.all(guarantors.map(async (guarantor) => {
      const savedGuarantor = guarantor.tenantGuarantorID ? savedGuarantors[guarantor.tenantGuarantorID] : undefined;
      const guarantorPayload = {
        tenantGuarantorID: savedGuarantor?.tenantGuarantorID ?? null,
        tenantID: tenant.tenantID,
        rentalApplicationID: savedGuarantor?.rentalApplicationID ?? null,
        userID: savedGuarantor?.userID ?? userID ?? 0,
        firstName: guarantor.firstName.trim(),
        lastName: guarantor.lastName.trim(),
        email: guarantor.email.trim(),
        phoneNumber: guarantor.phoneNumber.trim(),
        relationship: guarantor.relationship,
        annualIncome: Number(guarantor.annualIncome.replace(/,/g, "")),
        status: savedGuarantor?.status ?? "PENDING",
        invitedAt: savedGuarantor?.invitedAt ?? null,
        acceptedAt: savedGuarantor?.acceptedAt ?? null,
        capturedDate: savedGuarantor?.capturedDate ?? now,
        capturedBy: savedGuarantor?.capturedBy ?? capturedBy,
        updatedDate: now,
        updatedBy: capturedBy,
      } as TenantGuarantor;
      if (!savedGuarantor) {
        console.log("Creating tenant guarantor:", guarantorPayload);
        const createdGuarantor = await createTenantGuarantor(guarantorPayload);
        setSavedGuarantors((current) => ({ ...current, [createdGuarantor.tenantGuarantorID]: createdGuarantor }));
        setGuarantors((current) => current.map((currentGuarantor) => currentGuarantor === guarantor ? { ...currentGuarantor, tenantGuarantorID: createdGuarantor.tenantGuarantorID } : currentGuarantor));
        return;
      }
      const hasChanges = savedGuarantor.firstName !== guarantorPayload.firstName
        || savedGuarantor.lastName !== guarantorPayload.lastName
        || savedGuarantor.email !== guarantorPayload.email
        || savedGuarantor.phoneNumber !== guarantorPayload.phoneNumber
        || savedGuarantor.relationship !== guarantorPayload.relationship
        || savedGuarantor.annualIncome !== guarantorPayload.annualIncome;
      if (!hasChanges) return;

      console.log("Updating tenant guarantor:", guarantorPayload);
      const updatedGuarantor = await updateTenantGuarantor(guarantorPayload);
      setSavedGuarantors((current) => ({ ...current, [updatedGuarantor.tenantGuarantorID]: updatedGuarantor }));
    }));
  };
  const updateTenantAcknowledgements = async (acknowledgements: Pick<Tenant, "verificationAuthorization" | "leaseContractReviewed">) => {
    if (!tenant?.tenantID) throw new Error("Complete and save your profile before continuing.");
    const currentUserProfile = currentUser?.user;
    const updatedTenant = await updateTenant({
      ...tenant,
      ...acknowledgements,
      updatedBy: `${currentUserProfile?.firstName ?? ""} ${currentUserProfile?.lastName ?? ""}`.trim(),
      updatedDate: new Date().toISOString(),
    });
    setTenant(updatedTenant);
  };
  const goNext = async () => {
    const validationError = validateCurrentSection();
    if (validationError) {
      setNextError(validationError);
      return;
    }
    setNextError("");
    if (activeSection === "profile") {
      try {
        setIsSavingProfile(true);
        await saveTenantProfile();
      } catch (error) {
        setNextError(error instanceof Error ? error.message : "We could not save your profile. Please try again.");
        return;
      } finally {
        setIsSavingProfile(false);
      }
    }
    if (activeSection === "employment") {
      try {
        setIsSavingEmployment(true);
        await saveTenantEmployment();
      } catch (error) {
        setNextError(error instanceof Error ? error.message : "We could not save your employment details. Please try again.");
        return;
      } finally {
        setIsSavingEmployment(false);
      }
    }
    if (activeSection === "household") {
      try {
        setIsSavingHousehold(true);
        await saveHousehold();
      } catch (error) {
        setNextError(error instanceof Error ? error.message : "We could not save your household details. Please try again.");
        return;
      } finally {
        setIsSavingHousehold(false);
      }
    }
    if (activeSection === "guarantor") {
      try {
        setIsSavingGuarantors(true);
        await saveGuarantors();
      } catch (error) {
        setNextError(error instanceof Error ? error.message : "We could not save your guarantor details. Please try again.");
        return;
      } finally {
        setIsSavingGuarantors(false);
      }
    }
    if (activeSection === "documents" && !tenant?.verificationAuthorization) {
      try {
        await updateTenantAcknowledgements({ verificationAuthorization: true });
        setVerificationAuthorized(true);
      } catch (error) {
        setNextError(error instanceof Error ? error.message : "We could not save your verification authorization. Please try again.");
        return;
      }
    }
    if (activeSection === "rules" && !tenant?.leaseContractReviewed) {
      try {
        await updateTenantAcknowledgements({ leaseContractReviewed: true });
      } catch (error) {
        setNextError(error instanceof Error ? error.message : "We could not save your lease contract review. Please try again.");
        return;
      }
    }
    if (["profile", "employment", "household", "guarantor", "documents", "rules", "payment"].includes(activeSection)) {
      setCompleted((current) =>
        current.includes(activeSection) ? current : [...current, activeSection],
      );
    }
    const next = sections[currentIndex + 1];
    if (next) setActiveSection(next.key);
  };
  const detailPlaceholder = sections.find(
    (section) => section.key === activeSection,
  );
  const updateEmployment = (field: keyof typeof employment, value: string | boolean) => setEmployment((current) => ({ ...current, [field]: value }));
  const updateGuarantor = (field: keyof typeof guarantorForm, value: string) => setGuarantorForm((current) => ({ ...current, [field]: value }));
  const resetGuarantorForm = () => setGuarantorForm({ firstName: "", lastName: "", email: "", phoneNumber: "", relationship: "Parent", annualIncome: "" });
  const addGuarantor = () => {
    if (!guarantorForm.firstName || !guarantorForm.lastName || !guarantorForm.email || !guarantorForm.phoneNumber || !guarantorForm.annualIncome) return;
    const guarantor = { ...guarantorForm, status: "PENDING" };
    setGuarantors((current) => editingGuarantorIndex === null
      ? [...current, guarantor]
      : current.map((currentGuarantor, index) => index === editingGuarantorIndex ? { ...guarantor, tenantGuarantorID: currentGuarantor.tenantGuarantorID, status: currentGuarantor.status } : currentGuarantor));
    setEditingGuarantorIndex(null);
    resetGuarantorForm();
  };
  const editGuarantor = (index: number) => {
    const guarantor = guarantors[index];
    if (!guarantor) return;
    setGuarantorForm({ firstName: guarantor.firstName, lastName: guarantor.lastName, email: guarantor.email, phoneNumber: guarantor.phoneNumber, relationship: guarantor.relationship, annualIncome: guarantor.annualIncome });
    setEditingGuarantorIndex(index);
  };
  const removeGuarantor = (index: number) => {
    setGuarantors((current) => current.filter((_, currentIndex) => currentIndex !== index));
    if (editingGuarantorIndex === index) {
      setEditingGuarantorIndex(null);
      resetGuarantorForm();
    }
  };
  const updateOccupant = (field: keyof typeof occupantForm, value: string | boolean) => setOccupantForm((current) => ({ ...current, [field]: value }));
  const resetOccupantForm = () => setOccupantForm({ firstName: "", lastName: "", dateOfBirth: "", email: "", phoneCountryCode: "+1", phoneNumber: "", occupantType: "ADULT", isPrimaryTenant: false, isFinanciallyResponsible: false });
  const addOccupant = () => {
    if (!occupantForm.firstName || !occupantForm.lastName || !occupantForm.dateOfBirth || !occupantForm.email || !occupantForm.phoneNumber) return;
    const occupant = { ...occupantForm, phoneNumber: occupantForm.phoneNumber ? `${occupantForm.phoneCountryCode} ${occupantForm.phoneNumber}` : "" };
    setOccupants((current) => editingOccupantIndex === null
      ? [...current, occupant]
      : current.map((currentOccupant, index) => index === editingOccupantIndex ? occupant : currentOccupant));
    setEditingOccupantIndex(null);
    resetOccupantForm();
  };
  const editOccupant = (index: number) => {
    const occupant = occupants[index];
    if (!occupant) return;
    const [phoneCountryCode = "+1", ...phoneParts] = occupant.phoneNumber.split(" ");
    setOccupantForm({ ...occupant, phoneCountryCode, phoneNumber: phoneParts.join(" ") });
    setEditingOccupantIndex(index);
  };
  const removeOccupant = (index: number) => {
    setOccupants((current) => current.filter((_, currentIndex) => currentIndex !== index));
    if (editingOccupantIndex === index) {
      setEditingOccupantIndex(null);
      resetOccupantForm();
    }
  };
  const uploadDocument = async (documentKey: Exclude<DocumentKey, "identity">, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (!tenant?.tenantID) {
      setNextError("Complete and save your profile before uploading a document.");
      return;
    }
    if (documentKey === "supporting" && supportingDocuments.length + files.length > 2) {
      setNextError("You can upload at most two supporting documents.");
      return;
    }
    if (files.some((file) => (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) || file.size > 3 * 1024 * 1024)) {
      setNextError("Choose PDF documents that are 3 MB or smaller.");
      return;
    }
    try {
      setNextError("");
      setIsUploadingDocument(true);
      const capturedBy = `${currentUser?.user?.firstName ?? ""} ${currentUser?.user?.lastName ?? ""}`.trim();
      const documentType = documentKey === "rental" ? "RENTAL_REFERENCE" : documentKey === "supporting" ? "SUPPORTING_DOCUMENT" : "PROOF_OF_INCOME";
      const uploaded = await Promise.all(files.map((file) => uploadLeaseDocument({ file, listingID: listing.id, tenantID: tenant.tenantID, capturedBy, documentType, documentStatus: "UPLOADED", isPrimary: documentKey !== "supporting" })));
      if (documentKey === "supporting") {
        setSupportingDocuments((current) => [...current, ...uploaded.map((document) => document.originalFilename)]);
        setSupportingLeaseDocuments((current) => [...current, ...uploaded]);
      } else {
        setUploadedDocuments((current) => ({ ...current, [documentKey]: uploaded[0].originalFilename }));
        setUploadedLeaseDocuments((current) => ({ ...current, [documentKey]: uploaded[0] }));
      }
    } catch (error) {
      setNextError(error instanceof Error ? error.message : "We could not upload your document. Please try again.");
    } finally {
      setIsUploadingDocument(false);
    }
  };
  const uploadEmploymentDocument = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setEmploymentDocumentError("Choose a PDF document.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setEmploymentDocumentError("The PDF must be 3 MB or smaller.");
      return;
    }
    if (!tenant?.tenantID) {
      setEmploymentDocumentError("Complete and save your profile before uploading a document.");
      return;
    }
    try {
      setEmploymentDocumentError("");
      setIsUploadingEmploymentDocument(true);
      const capturedBy = `${currentUser?.user?.firstName ?? ""} ${currentUser?.user?.lastName ?? ""}`.trim();
      const uploaded = await uploadLeaseDocument({ file, listingID: listing.id, tenantID: tenant.tenantID, capturedBy, documentType: "PROOF_OF_INCOME", documentStatus: "UPLOADED", isPrimary: true });
      setEmploymentDocumentName(uploaded.originalFilename);
      setUploadedDocuments((current) => ({ ...current, income: uploaded.originalFilename }));
      setUploadedLeaseDocuments((current) => ({ ...current, income: uploaded }));
    } catch (error) {
      setEmploymentDocumentError(error instanceof Error ? error.message : "We could not upload your document. Please try again.");
    } finally {
      setIsUploadingEmploymentDocument(false);
    }
  };
  const documentFiles = (documentKey: DocumentKey) => documentKey === "supporting" ? supportingDocuments : uploadedDocuments[documentKey] ? [uploadedDocuments[documentKey]] : [];
  const removeDocument = async (documentKey: Exclude<DocumentKey, "identity">, fileName?: string) => {
    const document = documentKey === "supporting"
      ? supportingLeaseDocuments.find((item) => item.originalFilename === fileName)
      : uploadedLeaseDocuments[documentKey];
    if (!document?.leaseDocumentID) {
      setNextError("The document ID is unavailable. Refresh the page and try again.");
      return;
    }
    try {
      setNextError("");
      setIsUploadingDocument(true);
      await deleteLeaseDocuments(document.leaseDocumentID);
      if (documentKey === "supporting" && fileName) {
        setSupportingDocuments((current) => current.filter((file) => file !== fileName));
        setSupportingLeaseDocuments((current) => current.filter((item) => item.leaseDocumentID !== document.leaseDocumentID));
      } else {
        setUploadedDocuments((current) => { const next = { ...current }; delete next[documentKey]; return next; });
        setUploadedLeaseDocuments((current) => { const next = { ...current }; delete next[documentKey]; return next; });
        if (documentKey === "income") setEmploymentDocumentName("");
      }
    } catch (error) {
      setNextError(error instanceof Error ? error.message : "We could not delete your document. Please try again.");
    } finally {
      setIsUploadingDocument(false);
    }
  };
  const requiredSections: SectionKey[] = ["profile", "employment", "household", "documents", "rules", "payment"];
  const missingSections = requiredSections.filter((section) => !isComplete(section));
  const submitApplication = () => { if (missingSections.length === 0 && reviewConfirmed) { publishHostApplicationNotification({ applicationId: id || "app-1024", applicationCode: id || "ARC-1024", applicantName: "Obinna Eze", listingName: listing.title, createdAt: new Date().toISOString() }); setApplicationSubmitted(true); } };

  return (
    <main className="marketplace tenant-application-detail-page" data-active-section={activeSection} data-tenant-status={tenantStatus}>
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
              <div className="tenant-application-profile-fields">
                <label>
                  Tenant Code
                  <output>{tenant?.code || "Not created yet"}</output>
                </label>
                <label>
                  Tell us about yourself
                  <textarea
                    value={tenantDescription ?? tenant?.description ?? ""}
                    onChange={(event) => setTenantDescription(event.target.value)}
                    placeholder="Share a brief introduction for your application"
                    rows={4}
                  />
                </label>
              </div>
            </section>
          )}
          {activeSection === "household" && (
            <section className="tenant-application-panel tenant-application-household-panel">
              <p className="marketplace-eyebrow">Adult households details</p>
              <h3>Who will live in this home?</h3>
              <p className="tenant-application-panel-lead">Add the adults who will live with you. Your authenticated profile is already included as the primary tenant.</p>
              <article className="tenant-application-occupant-card tenant-application-primary-occupant"><div className="tenant-application-guarantor-card-header"><span className="tenant-application-avatar">O</span><div><strong>Obinna Eze</strong><small>Primary tenant</small></div><span className="tenant-application-occupant-status">Financially responsible</span></div><div className="tenant-application-occupant-meta"><span>hobinnah@yahoo.com</span><span>+1 ***-***-0753</span></div></article>
              {occupants.length > 0 && <div className="tenant-application-occupant-grid">{occupants.map((occupant, index) => <article className="tenant-application-occupant-card" key={`${occupant.email}-${occupant.firstName}`}><div className="tenant-application-guarantor-card-header"><span className="tenant-application-avatar">{occupant.firstName[0]}</span><div><strong>{occupant.firstName} {occupant.lastName}</strong><small>{occupant.occupantType === "ADULT" ? "Adult" : occupant.occupantType}</small></div><span className="tenant-application-occupant-status">{occupant.isFinanciallyResponsible ? "Financially responsible" : "Not financially responsible"}</span><span className="tenant-application-occupant-actions"><button type="button" aria-label={`Edit ${occupant.firstName} ${occupant.lastName}`} title="Edit occupant" onClick={() => editOccupant(index)}><PencilIcon /></button><button type="button" aria-label={`Remove ${occupant.firstName} ${occupant.lastName}`} title="Remove occupant" onClick={() => removeOccupant(index)}><TrashIcon /></button></span></div><div className="tenant-application-occupant-meta"><span>{occupant.email || "No email provided"}</span><span>{occupant.phoneNumber || "No phone provided"}</span></div></article>)}</div>}
              <div className="tenant-application-occupant-form"><div className="tenant-application-form-grid"><label>First name<input required value={occupantForm.firstName} onChange={(event) => updateOccupant("firstName", event.target.value)} /></label><label>Last name<input required value={occupantForm.lastName} onChange={(event) => updateOccupant("lastName", event.target.value)} /></label><label>Date of birth<TenantDatePicker value={occupantForm.dateOfBirth} onChange={(value) => updateOccupant("dateOfBirth", value)} ariaLabel="Occupant date of birth" maxDate={getMaxAdultDateOfBirth()} /></label><label>Email<input required type="email" value={occupantForm.email} onChange={(event) => updateOccupant("email", event.target.value)} /></label><label className="tenant-application-phone-field">Phone number<div className="tenant-application-phone-input"><CustomSelect value={occupantForm.phoneCountryCode} options={["+1", "+44", "+234", "+33", "+49", "+61"]} onChange={(value) => updateOccupant("phoneCountryCode", value)} ariaLabel="Country calling code" /><input required type="tel" inputMode="tel" value={occupantForm.phoneNumber} onChange={(event) => updateOccupant("phoneNumber", event.target.value)} placeholder="Phone number" /></div></label></div><label className="tenant-application-current-toggle"><input type="checkbox" checked={occupantForm.isFinanciallyResponsible} onChange={(event) => updateOccupant("isFinanciallyResponsible", event.target.checked)} /><span><strong>Financially responsible</strong><small>This adult will be responsible for rent or other lease obligations.</small></span></label><button type="button" className="tenant-application-complete-button" disabled={!occupantForm.firstName || !occupantForm.lastName || !occupantForm.dateOfBirth || !occupantForm.email || !occupantForm.phoneNumber} onClick={addOccupant}>{editingOccupantIndex === null ? "Add adult occupant" : "Update adult occupant"}</button>{editingOccupantIndex !== null && <button type="button" className="tenant-application-occupant-cancel" onClick={() => { setEditingOccupantIndex(null); resetOccupantForm(); }}>Cancel edit</button>}<small className="tenant-application-guarantor-count">{occupants.length} additional adult{occupants.length === 1 ? "" : "s"} added</small></div>
              <div className="tenant-application-household-note"><ShieldIcon /><span>Only adults can be added here. The primary tenant remains the authenticated applicant.</span></div>
            </section>
          )}
          {activeSection === "guarantor" && (
            <section className="tenant-application-panel tenant-application-guarantor-panel">
              <p className="marketplace-eyebrow">Optional support</p>
              <h3>Add a guarantor</h3>
              <p className="tenant-application-panel-lead">You can add up to two guarantors. We&apos;ll email each person a secure link to accept or decline their invitation.</p>
              {guarantors.length > 0 && <div className="tenant-application-guarantor-grid">{guarantors.map((guarantor, index) => <article className="tenant-application-guarantor-card" key={guarantor.email}><div className="tenant-application-guarantor-card-header"><span className="tenant-application-avatar">{guarantor.firstName[0]}</span><div><strong>{guarantor.firstName} {guarantor.lastName}</strong><small>{guarantor.relationship}</small></div><span className={`tenant-application-guarantor-status is-${guarantor.status.toLowerCase()}`}>{guarantor.status === "PENDING" ? "Invitation pending" : guarantor.status}</span><span className="tenant-application-occupant-actions"><button type="button" aria-label={`Edit ${guarantor.firstName} ${guarantor.lastName}`} title="Edit guarantor" onClick={() => editGuarantor(index)}><PencilIcon /></button><button type="button" aria-label={`Remove ${guarantor.firstName} ${guarantor.lastName}`} title="Remove guarantor" onClick={() => removeGuarantor(index)}><TrashIcon /></button></span></div><dl><div><dt>Email</dt><dd>{guarantor.email}</dd></div><div><dt>Annual income</dt><dd>${formatCurrency(guarantor.annualIncome)} CAD</dd></div></dl></article>)}</div>}
              {(guarantors.length < 2 || editingGuarantorIndex !== null) && <div className="tenant-application-guarantor-form"><div className="tenant-application-form-grid"><label>First name<input value={guarantorForm.firstName} onChange={(event) => updateGuarantor("firstName", event.target.value)} /></label><label>Last name<input value={guarantorForm.lastName} onChange={(event) => updateGuarantor("lastName", event.target.value)} /></label><label>Email<input type="email" value={guarantorForm.email} onChange={(event) => updateGuarantor("email", event.target.value)} /></label><label>Phone number<input type="tel" value={guarantorForm.phoneNumber} onChange={(event) => updateGuarantor("phoneNumber", event.target.value)} /></label><label>Relationship<CustomSelect value={guarantorForm.relationship} options={["Parent", "Partner", "Family member", "Friend", "Other"]} onChange={(value) => updateGuarantor("relationship", value)} ariaLabel="Guarantor relationship" /></label><label>Annual income<input inputMode="numeric" value={guarantorForm.annualIncome} onChange={(event) => updateGuarantor("annualIncome", event.target.value.replace(/[^0-9]/g, ""))} onBlur={() => updateGuarantor("annualIncome", guarantorForm.annualIncome ? Number(guarantorForm.annualIncome.replace(/,/g, "")).toLocaleString("en-US") : "")} placeholder="0" /></label></div><button type="button" className="tenant-application-complete-button" disabled={!guarantorForm.firstName || !guarantorForm.lastName || !guarantorForm.email || !guarantorForm.phoneNumber || !guarantorForm.annualIncome} onClick={addGuarantor}>{editingGuarantorIndex === null ? "Send guarantor invitation" : "Update guarantor"}</button>{editingGuarantorIndex !== null && <button type="button" className="tenant-application-occupant-cancel" onClick={() => { setEditingGuarantorIndex(null); resetGuarantorForm(); }}>Cancel edit</button>}<small className="tenant-application-guarantor-count">{guarantors.length} of 2 guarantors added</small></div>}
              {guarantors.length === 2 && <div className="tenant-application-callout"><ShieldIcon /><div><strong>Two guarantors added</strong><p>Both invitations are pending. You&apos;ll see their response here.</p></div></div>}
            </section>
          )}
          {activeSection === "documents" && (
            <section className="tenant-application-panel tenant-application-documents-panel">
              <p className="marketplace-eyebrow">Secure review</p>
              <h3>Documents &amp; screening</h3>
              <p className="tenant-application-panel-lead">We only request what helps the landlord make a fair, informed decision. You will see the reason for each request before sharing anything.</p>
              <div className="tenant-application-document-list">
                {([['identity', 'Identity verification', 'Verified', 'Your identity was verified during signup.', 'Identity verification is complete.'], ['income', 'Proof of income', 'Required', 'Help the landlord understand whether the monthly rent fits your income.', 'Pay stubs, an employment letter, or tax documents may be accepted.'], ['rental', 'Rental reference', 'If requested', 'Confirm your previous rental history when the landlord needs more context.', 'A reference contact or tenancy record may be requested later.'], ['supporting', 'Supporting documents', 'Optional', 'Add context that may help explain your application, such as an offer letter.', 'Only share documents relevant to this home.']] as const).map(([documentKey, title, status, reason, example]) => { const files = documentFiles(documentKey); const hasFiles = files.length > 0; return <article className="tenant-application-document-row" key={documentKey}><span className="tenant-application-document-icon"><FileIcon /></span><div><div className="tenant-application-document-heading"><strong>{title}</strong><span className={`tenant-application-document-status ${status === 'Required' ? 'is-required' : status === 'Optional' ? 'is-optional' : status === 'Verified' ? 'is-optional' : 'is-conditional'}`}>{status}</span></div><p>{reason}</p>{hasFiles ? <div className="tenant-application-document-file-list">{files.map((file) => <div key={file}><span>{file}</span>{documentKey === 'supporting' && <button type="button" onClick={() => removeDocument(documentKey, file)}>Remove</button>}</div>)}</div> : <small>{example}</small>}{documentKey !== 'identity' && <div className="tenant-application-document-actions">{hasFiles && <span className="tenant-application-document-uploaded">{documentKey === 'supporting' ? `${files.length} file${files.length === 1 ? '' : 's'} uploaded` : 'Uploaded'}</span>}<label className="tenant-application-document-upload-button">{hasFiles && documentKey !== 'supporting' ? 'Replace file' : hasFiles ? 'Add another' : 'Add document'}<input type="file" accept=".pdf,.png,.jpg,.jpeg,.docx" multiple={documentKey === 'supporting'} onChange={(event) => uploadDocument(documentKey, event)} /></label>{hasFiles && documentKey !== 'supporting' && <button type="button" onClick={() => removeDocument(documentKey)}>Remove</button>}</div>}</div></article>; })}
              </div>
              <div className="tenant-application-document-callout"><ShieldIcon /><div><strong>Private by design</strong><p>Documents are shared only for this application, accessed by authorized reviewers, and handled according to applicable privacy law.</p></div></div>
              <label className="tenant-application-consent-row">
                <input
                  type="checkbox"
                  checked={verificationAuthorized}
                  onChange={(event) =>
                    setVerificationAuthorized(event.target.checked)
                  }
                />
                <span>I authorize Arcora and the landlord to verify the information I provide, including employment, income, credit history, background screening, and supporting documents, in accordance with applicable law.</span>
              </label>
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
                  <strong>{leaseTermDisplay}</strong>
                </div>
                <div>
                  <span>Monthly rent</span>
                  <strong>${listing.price.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Security deposit</span>
                  <strong>${depositAmount.toLocaleString()}</strong>
                </div>
                <div className="tenant-application-rules-total">
                  <span>Total before move-in date</span>
                  <strong>${(listing.price + depositAmount).toLocaleString()}</strong>
                </div>
              </div>
              <div className="tenant-application-contract-preview">
                <PdfIcon />
                <div>
                  <strong>Residential lease preview</strong>
                  <small>Non-signable contract preview</small>
                </div>
                <p>
                  Quiet hours are 10:00 PM to 8:00 AM. No smoking or parties are
                  permitted.
                </p>
                <button type="button" onClick={() => setContractPreviewOpen(true)}>Open full preview &gt;</button>
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
            </section>
          )}
          {contractPreviewOpen && <div className="tenant-application-preview-overlay" onClick={() => setContractPreviewOpen(false)}><section className="tenant-application-preview-modal" role="dialog" aria-modal="true" aria-labelledby="tenant-application-preview-title" onClick={(event) => event.stopPropagation()}><button type="button" className="tenant-application-preview-close" aria-label="Close contract preview" onClick={() => setContractPreviewOpen(false)}>×</button><p className="marketplace-eyebrow">Application preview</p><h3 id="tenant-application-preview-title">Rental contract &amp; house rules</h3><p className="tenant-application-panel-lead">Review the key terms before you authorize payment. This preview is informational and is not a signature step.</p><div className="tenant-application-preview-summary"><div><span>Lease term</span><strong>6 months</strong></div><div><span>Monthly rent</span><strong>${listing.price.toLocaleString()}</strong></div><div><span>Security deposit</span><strong>${listing.price.toLocaleString()}</strong></div><div><span>Move-in date</span><strong>Sep 1, 2026</strong></div></div><div className="tenant-application-preview-section"><h4>House rules</h4><ul><li>Quiet hours are 10:00 PM to 8:00 AM.</li><li>No smoking or parties are permitted.</li><li>All occupants must be listed on the application.</li><li>Keep shared areas clean and respect neighbours.</li></ul></div><div className="tenant-application-preview-section"><h4>Rental contract</h4><p>The final residential lease will confirm the parties, rent, deposit, term, maintenance responsibilities, and applicable local requirements. It will be available for signature after the application is approved.</p></div><button type="button" className="tenant-application-complete-button" onClick={() => setContractPreviewOpen(false)}>Close preview</button></section></div>}
          {activeSection === "review" && (
            <section className="tenant-application-panel tenant-application-review-panel">
              {!applicationSubmitted ? <><p className="marketplace-eyebrow">Final check</p><h3>Review your application</h3><p className="tenant-application-panel-lead">Everything looks right? Review the details below, then submit your application to the landlord.</p><div className={`tenant-application-review-status ${missingSections.length === 0 ? "is-ready" : "is-incomplete"}`}><span>{missingSections.length === 0 ? "✓" : "!"}</span><div><strong>{missingSections.length === 0 ? "Ready to submit" : `${missingSections.length} required section${missingSections.length === 1 ? "" : "s"} remaining`}</strong><small>{missingSections.length === 0 ? "Your required information and authorizations are complete." : "Complete the remaining sections before submitting."}</small></div></div><div className="tenant-application-review-list">{requiredSections.map((sectionKey) => { const section = sections.find((item) => item.key === sectionKey); return <button type="button" className="tenant-application-review-row" key={sectionKey} onClick={() => setActiveSection(sectionKey)}><span className={isComplete(sectionKey) ? "is-complete" : ""}>{isComplete(sectionKey) ? "✓" : "!"}</span><div><strong>{section?.label}</strong><small>{isComplete(sectionKey) ? "Complete and ready" : "Needs your attention"}</small></div><b>Review</b></button>; })}<button type="button" className="tenant-application-review-row" onClick={() => setActiveSection("guarantor")}><span className="is-optional">i</span><div><strong>Guarantors</strong><small>{guarantors.length ? `${guarantors.length} invitation${guarantors.length === 1 ? "" : "s"} pending` : "None added"}</small></div><b>Review</b></button></div><div className="tenant-application-review-summary"><div><span>Monthly rent</span><strong>${listing.price.toLocaleString()}</strong></div><div><span>Security deposit</span><strong>${listing.price.toLocaleString()}</strong></div><div><span>Move-in date</span><strong>Sep 1, 2026</strong></div><div><span>Payment</span><strong>No charge today</strong></div></div><label className="tenant-application-consent-row"><input type="checkbox" checked={reviewConfirmed} onChange={(event) => setReviewConfirmed(event.target.checked)} /><span>I confirm that my application information is accurate and I understand that submitting is not signing the lease or charging my payment method.</span></label><button type="button" className="tenant-application-complete-button tenant-application-submit-button" disabled={missingSections.length > 0 || !reviewConfirmed} onClick={submitApplication}>Submit application</button></> : <div className="tenant-application-submitted"><span className="tenant-application-submitted-icon">✓</span><p className="marketplace-eyebrow">Application submitted</p><h3>You&apos;re all set.</h3><p className="tenant-application-panel-lead">Your application has been sent to the landlord for review. We&apos;ll let you know when there&apos;s an update.</p><div className="tenant-application-submitted-details"><span>Application ID</span><strong>{id || "app-1024"}</strong><span>Status</span><strong>Under review</strong><span>Submitted</span><strong>Just now</strong></div><button type="button" className="tenant-application-complete-button" onClick={() => navigate("/applications")}>View my applications</button></div>}
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
                <span>Total before move-in date</span>
                <strong>${(listing.price + depositAmount).toLocaleString()}</strong>
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
                <h4>Using a credit card</h4>
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
                <CustomSelect value={employment.employmentType} options={["Employed", "Self-employed", "Student", "Retired", "Unemployed", "Other"]} onChange={(value) => updateEmployment("employmentType", value)} ariaLabel="Employment status" />
              </label>
              <label>
                Employer or business name
                <input value={employment.employerName} onChange={(event) => updateEmployment("employerName", event.target.value)} placeholder="Company or business name" />
              </label>
              <label>
                Employer email
                <input type="email" value={employment.employerEmail} onChange={(event) => updateEmployment("employerEmail", event.target.value)} placeholder="employer@example.com" />
              </label>
              <label>
                Employer phone number
                <div className="tenant-application-phone-input"><CustomSelect value={employment.employerPhoneCountryCode} options={["+1", "+44", "+234", "+33", "+49", "+61"]} onChange={(value) => updateEmployment("employerPhoneCountryCode", value)} ariaLabel="Employer phone country code" /><input type="tel" value={employment.employerPhoneNumber} onChange={(event) => updateEmployment("employerPhoneNumber", event.target.value)} placeholder="Employer phone number" /></div>
              </label>
              <label>
                Job title or role
                <input value={employment.jobTitle} onChange={(event) => updateEmployment("jobTitle", event.target.value)} placeholder="Your role" />
              </label>
              <label>
                Annual income
                <input inputMode="numeric" value={employment.annualIncome} onChange={(event) => updateEmployment("annualIncome", event.target.value.replace(/[^0-9]/g, ""))} onBlur={() => updateEmployment("annualIncome", employment.annualIncome ? Number(employment.annualIncome.replace(/,/g, "")).toLocaleString("en-US") : "")} placeholder="0" />
              </label>
              <label>
                Income currency
                <CustomSelect value={employment.currency} options={["CAD", "USD", "GBP", "EUR"]} onChange={(value) => updateEmployment("currency", value)} ariaLabel="Income currency" />
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
                <small>You can upload your most recent pay stub, employment letter, or tax document.</small>
                <small className="tenant-application-upload-limit">PDF only, up to 3 MB.</small>
                {employmentDocumentName && <small className="tenant-application-upload-success">Uploaded: {employmentDocumentName}</small>}
                {employmentDocumentError && <small className="tenant-application-upload-error" role="alert">{employmentDocumentError}</small>}
              </div>
              <input ref={employmentDocumentInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={uploadEmploymentDocument} />
              <button type="button" onClick={() => employmentDocumentInputRef.current?.click()} disabled={isUploadingEmploymentDocument}>{isUploadingEmploymentDocument ? "Uploading..." : "Add document"}</button>
            </div>
            <div className="tenant-application-callout">
              <ShieldIcon />
              <div>
                <strong>Verification happens with your permission</strong>
                <p>Your landlord can verify these details only after you authorize screening.</p>
              </div>
            </div>
          </section>
          )}
          {!['readiness', 'profile', 'rules', 'payment', 'employment', 'household', 'guarantor', 'documents', 'review'].includes(activeSection) && (
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
          <p className="tenant-application-summary-location">{listing.location}</p>
          <div>
            <span>Monthly rent</span>
            <strong>${listing.price.toLocaleString()}</strong>
          </div>
          <div>
            <span>Security deposit</span>
            <strong>${depositAmount.toLocaleString()}</strong>
          </div>
          <div className="tenant-application-summary-total">
            <strong>Total amount before move-in date</strong>
            <strong>${(listing.price + depositAmount).toLocaleString()}</strong>
          </div>
          <div>
            <span>Move-in</span>
            <strong>{moveInDateDisplay}</strong>
          </div>
          <div>
            <span>Lease term</span>
            <strong>{leaseTermDisplay}</strong>
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
        {isUploadingDocument && <p className="tenant-application-upload-progress" role="status">Uploading document...</p>}
        {nextError && <p className="tenant-application-next-error" role="alert">{nextError}</p>}
        <button type="button" onClick={goBack}>
          Back
        </button>
        <button
          type="button"
          className="tenant-application-next-button"
          onClick={goNext}
          disabled={currentIndex === sections.length - 1 || isSavingProfile || isSavingEmployment || isSavingHousehold || isSavingGuarantors || isUploadingDocument}
        >
          {isSavingProfile || isSavingEmployment || isSavingHousehold || isSavingGuarantors ? "Saving..." : <>Next <span aria-hidden="true">&gt;</span></>}
        </button>
      </div>
      <MarketplaceFooter />
    </main>
  );
}
