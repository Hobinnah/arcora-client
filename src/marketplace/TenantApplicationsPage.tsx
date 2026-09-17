import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TenantHeader from "./TenantHeader";
import MarketplaceFooter from "./MarketplaceFooter";
import { fallbackListings, normalizeListing, type MarketplaceListing } from "./marketplaceData";
import { getTenantByUserID } from "../apis/useTenant";
import { fetchRentalApplications } from "../apis/useRentalApplication";
import { fetchLeases } from "../apis/useLease";
import { useAuth } from "../hooks/useAuth";
import "./TenantApplicationsPage.css";

type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "DECLINED"
  | "EXPIRED";
type TenantApplicationCard = {
  id: string;
  recordType: "application" | "lease";
  listing: MarketplaceListing;
  status: ApplicationStatus;
  capturedDate: string;
  moveIn: string;
  term: number;
  code: string;
  nextAction: string;
};

const statusLabels: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Changes requested",
  DECLINED: "Declined",
  EXPIRED: "Expired",
};
const formatDate = (value: string) => {
  if (!value) return "Not provided";
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default function TenantApplicationsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applicationsData, setApplicationsData] = useState<TenantApplicationCard[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatus>(
    "ALL",
  );
  const [query, setQuery] = useState("");
  useEffect(() => {
    const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
    if (!userID) return;
    let cancelled = false;
    const loadTenantRecords = async () => {
      try {
        const tenant = await getTenantByUserID(userID);
        if (!tenant?.tenantID) return;
        const [applicationResponse, leaseResponse] = await Promise.all([
          fetchRentalApplications({ pageSize: 200, pageNumber: 0, tenantID: tenant.tenantID }),
          fetchLeases({ pageSize: 200, pageNumber: 0, tenantID: tenant.tenantID }),
        ]);
        if (cancelled) return;
        const applicationCards = applicationResponse.data.map((application, index) => ({
          id: application.rentalApplicationID,
          recordType: "application" as const,
          listing: normalizeListing((application.listing ?? {}) as unknown as Record<string, any>, index) ?? fallbackListings[index % fallbackListings.length],
          status: (Object.keys(statusLabels).includes(application.status?.toUpperCase()) ? application.status.toUpperCase() : "UNDER_REVIEW") as ApplicationStatus,
          capturedDate: application.capturedDate || application.submittedAt || new Date().toISOString(),
          moveIn: application.desiredMoveInDate || new Date().toISOString(),
          term: application.requestedLeaseTermMonths || 0,
          code: application.applicationCode || application.rentalApplicationID,
          nextAction: application.status?.toUpperCase() === "APPROVED" ? "Review and sign lease" : application.status?.toUpperCase() === "CHANGES_REQUESTED" ? "Review changes" : "View application",
        }));
        const leaseCards = leaseResponse.data.map((lease, index) => ({
          id: lease.leaseID,
          recordType: "lease" as const,
          listing: normalizeListing((lease.listing ?? {}) as unknown as Record<string, any>, applicationCards.length + index) ?? fallbackListings[(applicationCards.length + index) % fallbackListings.length],
          status: "APPROVED" as ApplicationStatus,
          capturedDate: lease.capturedDate || lease.startDate || new Date().toISOString(),
          moveIn: lease.startDate || new Date().toISOString(),
          term: lease.leaseTermMonths || 0,
          code: lease.leaseCode || lease.leaseNumber || lease.leaseID,
          nextAction: "View lease",
        }));
        setApplicationsData([...applicationCards, ...leaseCards]);
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not load your rental records.");
      } finally {
        if (!cancelled) setIsLoadingApplications(false);
      }
    };
    void loadTenantRecords();
    return () => { cancelled = true; };
  }, [currentUser?.user?.id, currentUser?.user?.userId]);
  const applications = useMemo(
    () =>
      [...applicationsData]
        .sort((a, b) => b.capturedDate.localeCompare(a.capturedDate))
        .filter((application) => {
          const listing = application.listing;
          return (
            (statusFilter === "ALL" || application.status === statusFilter) &&
            `${listing.title} ${listing.location} ${application.code}`
              .toLowerCase()
              .includes(query.toLowerCase())
          );
        }),
    [applicationsData, query, statusFilter],
  );
  const countFor = (status: ApplicationStatus) =>
    applicationsData.filter((application) => application.status === status)
      .length;
  useEffect(() => {
    const nativeSelect = document.querySelector<HTMLSelectElement>(
      ".tenant-applications-sort select",
    );
    if (!nativeSelect || nativeSelect.dataset.enhanced) return;
    nativeSelect.dataset.enhanced = "true";
    nativeSelect.hidden = true;
    const wrapper = nativeSelect.parentElement;
    if (!wrapper) return;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "tenant-applications-sort-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML =
      '<span>Captured date: newest first</span><b aria-hidden="true">⌄</b>';
    const menu = document.createElement("div");
    menu.className = "tenant-applications-sort-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    ["Captured date: newest first", "Captured date: oldest first"].forEach(
      (label, index) => {
        const option = document.createElement("button");
        option.type = "button";
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", index === 0 ? "true" : "false");
        option.innerHTML = `<span>${label}</span>${index === 0 ? "<b>✓</b>" : ""}`;
        option.addEventListener("click", () => {
          trigger.firstElementChild!.textContent = label;
          menu
            .querySelectorAll("button")
            .forEach((item) =>
              item.setAttribute(
                "aria-selected",
                item === option ? "true" : "false",
              ),
            );
          menu.querySelectorAll("b").forEach((item) => item.remove());
          const check = document.createElement("b");
          check.textContent = "✓";
          option.append(check);
          menu.hidden = true;
          trigger.setAttribute("aria-expanded", "false");
        });
        menu.append(option);
      },
    );
    trigger.addEventListener("click", () => {
      menu.hidden = !menu.hidden;
      trigger.setAttribute("aria-expanded", String(!menu.hidden));
    });
    wrapper.append(trigger, menu);
    const close = (event: MouseEvent) => {
      if (!wrapper.contains(event.target as Node)) {
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      }
    };
    document.addEventListener("mousedown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      trigger.remove();
      menu.remove();
    };
  }, []);

  return (
    <main className="tenant-applications-page">
      <TenantHeader />
      <section className="tenant-applications-content">
        <div className="tenant-applications-heading">
          <div>
            <p className="marketplace-eyebrow">Your rental journey</p>
            <h1>Lease &amp; Rental applications</h1>
            <p>
              Keep track of the homes you’re considering and what happens next.
            </p>
          </div>
          <div className="tenant-applications-summary">
            <strong>{applicationsData.length}</strong>
            <span>records</span>
          </div>
        </div>
        <div className="tenant-applications-toolbar">
          <label className="tenant-applications-search">
            <span>Search applications</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Home, location, or application code"
            />
          </label>
          <label className="tenant-applications-sort">
            <span>Sort</span>
            <select defaultValue="newest">
              <option value="newest">Captured date: newest first</option>
            </select>
          </label>
        </div>
        <div
          className="tenant-applications-filters"
          role="tablist"
          aria-label="Filter applications"
        >
          <button
            type="button"
            className={statusFilter === "ALL" ? "is-active" : ""}
            onClick={() => setStatusFilter("ALL")}
          >
            All <small>{applicationsData.length}</small>
          </button>
          {(
            [
              "DRAFT",
              "SUBMITTED",
              "UNDER_REVIEW",
              "APPROVED",
              "CHANGES_REQUESTED",
              "DECLINED",
              "EXPIRED",
            ] as ApplicationStatus[]
          ).map((status) => (
            <button
              type="button"
              key={status}
              className={statusFilter === status ? "is-active" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {statusLabels[status]} <small>{countFor(status)}</small>
            </button>
          ))}
        </div>
        {applications.length > 0 ? (
          <div className="tenant-application-card-grid">
            {applications.map((application) => {
              const listing = application.listing;
              const recordPath = application.recordType === "lease"
                ? `/tenant/leases/${application.id}/review`
                : `/applications/${application.id}`;
              return (
                <article
                  className="tenant-application-card"
                  key={application.id}
                  tabIndex={0}
                  role="link"
                  onClick={() => navigate(recordPath)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      navigate(recordPath);
                  }}
                >
                  <div className="tenant-application-card-image">
                    <img src={listing.image} alt="" />
                    <span
                      className={`tenant-application-status tenant-application-status-${application.status.toLowerCase()}`}
                    >
                      {statusLabels[application.status]}
                    </span>
                  </div>
                  <div className="tenant-application-card-body">
                    <div className="tenant-application-card-title">
                      <div>
                        <h2>{listing.title}</h2>
                        <p>{listing.location}</p>
                      </div>
                      <span aria-hidden="true">›</span>
                    </div>
                    <div className="tenant-application-card-meta">
                      <span>
                        <small>Captured</small>
                        {formatDate(application.capturedDate)}
                      </span>
                      <span>
                        <small>Move-in</small>
                        {formatDate(application.moveIn)}
                      </span>
                      <span>
                        <small>Lease</small>
                        {application.term} months
                      </span>
                    </div>
                    <div className="tenant-application-card-footer">
                      <span>{application.code}</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(recordPath);
                        }}
                      >
                        {application.nextAction}{" "}
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="tenant-applications-empty">
            <h2>{isLoadingApplications ? "Loading your rental records..." : loadError || "No applications found"}</h2>
            <p>Try another status or search term.</p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setQuery("");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
      <MarketplaceFooter />
    </main>
  );
}
