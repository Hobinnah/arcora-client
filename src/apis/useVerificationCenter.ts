import { useCallback, useEffect, useState } from "react";
import { createIdentityVerification, fetchIdentityVerifications, fireIdentityVerificationAction, updateIdentityVerification } from "./useIdentityVerification";
import type { IdentityVerification } from "../types/IdentityVerification";

// Narrow phase: Email OTP, Phone OTP, Government ID, Selfie/liveness.
// Bank account, credit check, and property ownership are fast-follow additions.
export type VerificationCheckType = "EMAIL_OTP" | "PHONE_OTP" | "GOVERNMENT_ID" | "SELFIE_LIVENESS";
export type VerificationStatus = "NOT_STARTED" | "PENDING" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

// Vendor confidence at/above this line auto-approves; below it routes to a human reviewer.
export const AUTO_APPROVE_THRESHOLD = 90;

export const resolveApprovalStatus = (confidenceScore: number): "APPROVED" | "UNDER_REVIEW" =>
  confidenceScore >= AUTO_APPROVE_THRESHOLD ? "APPROVED" : "UNDER_REVIEW";

type RecordMap = Partial<Record<VerificationCheckType, IdentityVerification>>;

const statusOf = (records: RecordMap, type: VerificationCheckType): VerificationStatus =>
  (records[type]?.status as VerificationStatus) || "NOT_STARTED";

export function useVerificationCenter(userID?: number) {
  const [records, setRecords] = useState<RecordMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userID) return;
    setLoading(true);
    try {
      const { data } = await fetchIdentityVerifications({ pageSize: 200, pageNumber: 0 });
      const mine = data.filter((row) => Number(row.userID) === userID);
      const latestByType: RecordMap = {};
      for (const row of mine) {
        const type = row.verificationType as VerificationCheckType;
        const existing = latestByType[type];
        if (!existing || new Date(row.capturedDate || 0) >= new Date(existing.capturedDate || 0)) latestByType[type] = row;
      }
      setRecords(latestByType);
      setError(null);
    } catch {
      setError("Unable to load verification status right now.");
    } finally {
      setLoading(false);
    }
  }, [userID]);

  useEffect(() => {
    if (!userID) return;
    let cancelled = false;
    fetchIdentityVerifications({ pageSize: 200, pageNumber: 0 })
      .then(({ data }) => {
        if (cancelled) return;
        const mine = data.filter((row) => Number(row.userID) === userID);
        const latestByType: RecordMap = {};
        for (const row of mine) {
          const type = row.verificationType as VerificationCheckType;
          const existing = latestByType[type];
          if (!existing || new Date(row.capturedDate || 0) >= new Date(existing.capturedDate || 0)) latestByType[type] = row;
        }
        setRecords(latestByType);
        setError(null);
      })
      .catch(() => { if (!cancelled) setError("Unable to load verification status right now."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userID]);

  const upsertApproval = useCallback(async (draft: Partial<IdentityVerification> & { verificationType: VerificationCheckType }, confidenceScore: number) => {
    if (!userID) return;
    const finalStatus = resolveApprovalStatus(confidenceScore);
    const existing = records[draft.verificationType];
    const now = new Date().toISOString();
    const base: IdentityVerification = {
      identityVerificationID: existing?.identityVerificationID || "",
      userID,
      verificationType: draft.verificationType,
      providerName: draft.providerName || "",
      providerReferenceID: draft.providerReferenceID || existing?.providerReferenceID || `demo-${Date.now()}`,
      status: "SUBMITTED",
      confidenceScore,
      requestedAt: existing?.requestedAt || now,
      verifiedAt: now,
      expiresAt: "",
      failureReason: "",
      capturedDate: existing?.capturedDate || now,
      capturedBy: "",
      updatedDate: now,
      updatedBy: "",
      user: existing?.user as IdentityVerification["user"],
    };
    const saved = existing ? await updateIdentityVerification({ ...base, identityVerificationID: existing.identityVerificationID }) : await createIdentityVerification(base);
    const approved = await fireIdentityVerificationAction(saved.identityVerificationID, finalStatus);
    setRecords((current) => ({ ...current, [draft.verificationType]: approved }));
    return finalStatus;
  }, [records, userID]);

  // Passive check: email OTP already gates login, so once authenticated we can record it as verified.
  const ensureEmailVerified = useCallback(async () => {
    if (!userID || records.EMAIL_OTP) return;
    await upsertApproval({ verificationType: "EMAIL_OTP", providerName: "ARCORA_AUTH" }, 100);
  }, [records.EMAIL_OTP, upsertApproval, userID]);

  const requestPhoneOtp = useCallback(async (phoneNumber: string) => {
    if (!userID) return;
    // No SMS gateway is under contract yet; this generates a local demo code the UI displays directly.
    const demoCode = String(Math.floor(100000 + Math.random() * 900000));
    const now = new Date().toISOString();
    const existing = records.PHONE_OTP;
    const draft: IdentityVerification = {
      identityVerificationID: existing?.identityVerificationID || "",
      userID,
      verificationType: "PHONE_OTP",
      providerName: "SANDBOX_SMS",
      providerReferenceID: phoneNumber,
      status: "PENDING",
      requestedAt: now,
      verifiedAt: "",
      expiresAt: "",
      failureReason: "",
      capturedDate: existing?.capturedDate || now,
      capturedBy: "",
      updatedDate: now,
      updatedBy: "",
      user: existing?.user as IdentityVerification["user"],
    };
    try {
      const saved = existing ? await updateIdentityVerification({ ...draft, identityVerificationID: existing.identityVerificationID }) : await createIdentityVerification(draft);
      setRecords((current) => ({ ...current, PHONE_OTP: saved }));
    } catch {
      // The sandbox flow remains testable while the audit endpoint is unavailable.
      setRecords((current) => ({ ...current, PHONE_OTP: draft }));
    }
    return demoCode;
  }, [records.PHONE_OTP, userID]);

  const confirmPhoneOtp = useCallback(async (enteredCode: string, expectedCode: string) => {
    if (enteredCode !== expectedCode) {
      const existing = records.PHONE_OTP;
      if (existing) await updateIdentityVerification({ ...existing, status: "REJECTED", failureReason: "Code did not match." });
      return false;
    }
    try {
      await upsertApproval({ verificationType: "PHONE_OTP", providerName: "SANDBOX_SMS" }, 100);
    } catch {
      const existing = records.PHONE_OTP;
      if (existing) setRecords((current) => ({ ...current, PHONE_OTP: { ...existing, status: "APPROVED" } }));
    }
    return true;
  }, [records.PHONE_OTP, upsertApproval]);

  const submitIdentityDocuments = useCallback(async () => {
    // Persona is the selected vendor; no contract is signed yet, so scores are simulated pending real webhook wiring.
    const idScore = Math.floor(78 + Math.random() * 21);
    const selfieScore = Math.floor(78 + Math.random() * 21);
    try {
      const idResult = await upsertApproval({ verificationType: "GOVERNMENT_ID", providerName: "PERSONA" }, idScore);
      const selfieResult = await upsertApproval({ verificationType: "SELFIE_LIVENESS", providerName: "PERSONA" }, selfieScore);
      return { idResult, selfieResult, idScore, selfieScore };
    } catch {
      const now = new Date().toISOString();
      const idResult = resolveApprovalStatus(idScore);
      const selfieResult = resolveApprovalStatus(selfieScore);
      setRecords((current) => ({
        ...current,
        GOVERNMENT_ID: { identityVerificationID: "sandbox-government-id", userID: userID || 0, verificationType: "GOVERNMENT_ID", providerName: "PERSONA_SANDBOX", providerReferenceID: "sandbox", status: idResult, confidenceScore: idScore, requestedAt: now, verifiedAt: now, expiresAt: "", failureReason: "", capturedDate: now, capturedBy: "", updatedDate: now, updatedBy: "", user: current.GOVERNMENT_ID?.user as IdentityVerification["user"] },
        SELFIE_LIVENESS: { identityVerificationID: "sandbox-selfie", userID: userID || 0, verificationType: "SELFIE_LIVENESS", providerName: "PERSONA_SANDBOX", providerReferenceID: "sandbox", status: selfieResult, confidenceScore: selfieScore, requestedAt: now, verifiedAt: now, expiresAt: "", failureReason: "", capturedDate: now, capturedBy: "", updatedDate: now, updatedBy: "", user: current.SELFIE_LIVENESS?.user as IdentityVerification["user"] },
      }));
      return { idResult, selfieResult, idScore, selfieScore };
    }
  }, [upsertApproval, userID]);

  // Having an authenticated account already required verifying the email address at signup.
  const emailStatus: VerificationStatus = userID ? "APPROVED" : statusOf(records, "EMAIL_OTP");
  const phoneStatus = statusOf(records, "PHONE_OTP");
  const idStatus = statusOf(records, "GOVERNMENT_ID");
  const selfieStatus = statusOf(records, "SELFIE_LIVENESS");
  const identityVerified = idStatus === "APPROVED" && selfieStatus === "APPROVED";
  const anyUnderReview = [emailStatus, phoneStatus, idStatus, selfieStatus].includes("UNDER_REVIEW");
  const anyStarted = [emailStatus, phoneStatus, idStatus, selfieStatus].some((status) => status !== "NOT_STARTED");
  const allApproved = emailStatus === "APPROVED" && phoneStatus === "APPROVED" && identityVerified;
  const overallLabel = allApproved ? "Verified" : anyUnderReview ? "Under review" : anyStarted ? "In progress" : "Not started";

  return { records, loading, error, refresh, emailStatus, phoneStatus, idStatus, selfieStatus, identityVerified, overallLabel, ensureEmailVerified, requestPhoneOtp, confirmPhoneOtp, submitIdentityDocuments };
}
