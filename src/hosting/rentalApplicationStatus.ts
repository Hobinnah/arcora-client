export type RentalApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "DECLINED"
  | "EXPIRED";

export const rentalApplicationStatuses: RentalApplicationStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "CHANGES_REQUESTED",
  "APPROVED",
  "DECLINED",
];

export const rentalApplicationStatusLabels: Record<RentalApplicationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Needs review",
  UNDER_REVIEW: "Under screening",
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Changes requested",
  DECLINED: "Declined",
  EXPIRED: "Expired",
};

// Backend may return any casing/legacy label; always route display through this.
export const normalizeRentalApplicationStatus = (value?: string): RentalApplicationStatus => {
  const upper = (value ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  return (Object.keys(rentalApplicationStatusLabels) as RentalApplicationStatus[]).includes(upper as RentalApplicationStatus)
    ? (upper as RentalApplicationStatus)
    : "SUBMITTED";
};

export const rentalApplicationStatusClass = (status: RentalApplicationStatus) =>
  rentalApplicationStatusLabels[status].toLowerCase().replaceAll(" ", "-");
