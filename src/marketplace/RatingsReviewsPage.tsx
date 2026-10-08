import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, HomeIcon, MessageSquareIcon, ShieldIcon, StarIcon, TagIcon, UsersIcon } from "../components/Icons";
import { fetchEligibleLeaseReviews, submitLeaseReview, type EligibleLeaseReview } from "../apis/useRating";
import "../pages/shared/TrustOperations.css";
import "./RatingsReviewsPage.css";

type ReviewMode = "stay" | "tenant";
type RatingKey = "overall" | "cleanliness" | "accuracy" | "communication" | "responsiveness" | "care" | "payment";
type ReviewCategory = { key: RatingKey; label: string; detail: string; Icon: typeof HomeIcon };

const categoriesByMode: Record<ReviewMode, ReviewCategory[]> = {
  stay: [
    { key: "overall", label: "Overall experience", detail: "How would you rate your stay overall?", Icon: StarIcon },
    { key: "cleanliness", label: "Cleanliness", detail: "How clean was the home when you arrived?", Icon: CheckIcon },
    { key: "accuracy", label: "Listing accuracy", detail: "How well did the home match its listing?", Icon: HomeIcon },
    { key: "communication", label: "Communication", detail: "How clear and responsive was your host?", Icon: MessageSquareIcon },
    { key: "responsiveness", label: "Host responsiveness", detail: "How promptly did your host address questions?", Icon: MessageSquareIcon },
  ],
  tenant: [
    { key: "overall", label: "Overall tenancy", detail: "How would you rate the tenancy overall?", Icon: StarIcon },
    { key: "communication", label: "Communication", detail: "How clear and responsive was the tenant?", Icon: MessageSquareIcon },
    { key: "care", label: "Property care", detail: "How well was the home looked after?", Icon: HomeIcon },
    { key: "payment", label: "Payment reliability", detail: "Were payments made as agreed?", Icon: TagIcon },
  ],
};

const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, {
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date(value));

export default function RatingsReviewsPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ReviewMode>("stay");
  const [eligibleLeases, setEligibleLeases] = useState<EligibleLeaseReview[]>([]);
  const [selectedLeaseID, setSelectedLeaseID] = useState("");
  const [ratings, setRatings] = useState<Partial<Record<RatingKey, number>>>({});
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchEligibleLeaseReviews()
      .then((records) => {
        if (!cancelled) setEligibleLeases(records);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We could not load eligible leases.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const modeLeases = useMemo(
    () => eligibleLeases.filter((lease) => lease.reviewMode === mode && !lease.hasSubmitted),
    [eligibleLeases, mode],
  );
  const selectedLease = modeLeases.find((lease) => lease.leaseID === selectedLeaseID) ?? modeLeases[0];
  const categories = categoriesByMode[mode];
  const complete = categories.every((category) => Boolean(ratings[category.key]));
  const average = complete
    ? categories.reduce((total, category) => total + (ratings[category.key] ?? 0), 0) / categories.length
    : 0;

  const changeMode = (nextMode: ReviewMode) => {
    setMode(nextMode);
    setSelectedLeaseID("");
    setRatings({});
    setReview("");
    setSubmitted(false);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedLease || !complete || !review.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await submitLeaseReview({
        leaseID: selectedLease.leaseID,
        overallRating: ratings.overall!,
        cleanlinessRating: ratings.cleanliness,
        accuracyRating: ratings.accuracy,
        communicationRating: ratings.communication,
        responsivenessRating: ratings.responsiveness,
        propertyCareRating: ratings.care,
        paymentRating: ratings.payment,
        reviewBody: review.trim(),
      });
      setEligibleLeases((current) => current.map((lease) =>
        lease.leaseID === selectedLease.leaseID ? { ...lease, hasSubmitted: true } : lease,
      ));
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="trust-ops-page reviews-page">
      <header className="trust-ops-head reviews-page-head">
        <div>
          <span className="trust-ops-kicker">Post-stay review</span>
          <h1>Share your experience</h1>
          <p>Reviews are private until both sides submit or 14 days pass from the first submission.</p>
        </div>
        <button className="trust-ops-back" type="button" onClick={() => navigate("/")}>Back home</button>
      </header>

      <div className="reviews-mode-toggle" role="tablist" aria-label="Review type">
        <button type="button" role="tab" aria-selected={mode === "stay"} className={mode === "stay" ? "is-active" : ""} onClick={() => changeMode("stay")}>
          <HomeIcon /> Review your stay
        </button>
        <button type="button" role="tab" aria-selected={mode === "tenant"} className={mode === "tenant" ? "is-active" : ""} onClick={() => changeMode("tenant")}>
          <UsersIcon /> Review a tenant
        </button>
      </div>

      {loading ? (
        <section className="reviews-success" aria-busy="true"><p>Loading completed leases…</p></section>
      ) : error && !selectedLease ? (
        <section className="reviews-success" role="alert"><p>{error}</p></section>
      ) : submitted ? (
        <section className="reviews-success">
          <span><CheckIcon /></span>
          <div>
            <span className="trust-ops-kicker">Review submitted</span>
            <h2>Thanks for sharing a fair review.</h2>
            <p>Your review stays private until the other party submits or the 14-day privacy period ends.</p>
            <button className="trust-ops-action" type="button" onClick={() => navigate("/")}>Return home</button>
          </div>
        </section>
      ) : !selectedLease ? (
        <section className="reviews-success">
          <span><ShieldIcon /></span>
          <div>
            <span className="trust-ops-kicker">No review available</span>
            <h2>{mode === "stay" ? "No completed stays are ready for a review." : "No completed tenancies are ready for a review."}</h2>
            <p>Reviews become available for 14 days after a lease ends. Each lease can be reviewed once.</p>
          </div>
        </section>
      ) : (
        <div className="reviews-layout">
          <aside className="reviews-stay-card">
            <label className="trust-ops-field">
              <span className="trust-ops-kicker">Completed lease</span>
              <select
                value={selectedLease.leaseID}
                onChange={(event) => {
                  setSelectedLeaseID(event.target.value);
                  setRatings({});
                  setReview("");
                  setError("");
                }}
              >
                {modeLeases.map((lease) => (
                  <option key={lease.leaseID} value={lease.leaseID}>{lease.listingTitle} · {formatDate(lease.leaseEndedAt)}</option>
                ))}
              </select>
            </label>
            <div>
              <span className="trust-ops-kicker">{mode === "stay" ? "Your host" : "Your tenant"}</span>
              <h2>{selectedLease.subjectName}</h2>
              <p>{selectedLease.listingTitle} · Lease ended {formatDate(selectedLease.leaseEndedAt)}</p>
              <div className="reviews-stay-card-note"><ShieldIcon /><span>Reviews are held privately until mutual submission or the 14-day release date.</span></div>
            </div>
          </aside>

          <section className="reviews-form">
            <div className="reviews-form-heading">
              <div><span className="trust-ops-kicker">Review details</span><h2>{mode === "stay" ? "Rate your stay" : "Rate this tenant"}</h2></div>
              {complete && <span className="reviews-average"><StarIcon /> {average.toFixed(1)}</span>}
            </div>
            <p className="reviews-lead">Select a rating for each area, then share a concise, helpful review.</p>
            <div className="reviews-categories">
              {categories.map((category) => (
                <div className={`reviews-category${category.key === "overall" ? " is-overall" : ""}`} key={category.key}>
                  <span className="reviews-category-icon"><category.Icon /></span>
                  <div><strong>{category.label}</strong><small>{category.detail}</small></div>
                  <div className="reviews-stars" role="radiogroup" aria-label={category.label}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        role="radio"
                        aria-checked={ratings[category.key] === star}
                        aria-label={`${star} of 5 for ${category.label}`}
                        className={star <= (ratings[category.key] ?? 0) ? "is-on" : ""}
                        onClick={() => setRatings((current) => ({ ...current, [category.key]: star }))}
                      >★</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <label className="trust-ops-field reviews-textarea">
              <span className="trust-ops-kicker">Your review</span>
              <textarea maxLength={256} value={review} onChange={(event) => setReview(event.target.value)} placeholder={mode === "stay" ? "What would help future tenants know what to expect?" : "What would help future hosts understand this tenant?"} />
              <small>{review.length}/256 characters</small>
            </label>
            {error && <p className="reviews-error" role="alert">{error}</p>}
            <div className="reviews-submit">
              <span><MessageSquareIcon /> Your review is private until the release conditions are met.</span>
              <button className="trust-ops-action" type="button" disabled={!complete || !review.trim() || submitting} onClick={() => void handleSubmit()}>
                {submitting ? "Submitting…" : "Submit review"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
