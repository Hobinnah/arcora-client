import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";
import { useAuth } from "../hooks/useAuth";
import { CANADA_PROVINCES, createLandlordOrganization } from "../apis/useLandlordOrganization";
import "./HostingOrganizationSetupPage.css";

const cities = [
  { name: "Toronto", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Vancouver", image: "https://images.unsplash.com/photo-1609825488888-3a766db05542?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Montreal", image: "https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Calgary", image: "https://images.unsplash.com/photo-1561134643-668f9057cce4?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Edmonton", image: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Ottawa", image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Halifax", image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Victoria", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Saskatoon", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&h=600&q=80" },
  { name: "Winnipeg", image: "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=500&h=600&q=80" },
];

export default function HostingOrganizationSetupPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const [accountType, setAccountType] = useState<"individual" | "business">("individual");
  const [legalName, setLegalName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [provinceCode, setProvinceCode] = useState(CANADA_PROVINCES[0].code);
  const [currency, setCurrency] = useState("CAD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const provinceOptions = CANADA_PROVINCES.map((province) => `${province.name} (${province.code})`);
  const provinceLabel = CANADA_PROVINCES.find((province) => province.code === provinceCode);

  const onSubmit = async () => {
    if (!userID) {
      setError("Your login session is still loading. Please refresh and try again.");
      return;
    }
    if (!legalName.trim() || !displayName.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createLandlordOrganization({ legalName: legalName.trim(), displayName: displayName.trim(), isPersonal: accountType === "individual", businessNumber: businessNumber.trim(), provinceCode, defaultCurrency: currency }, userID);
      navigate("/hosting", { replace: true });
    } catch {
      setError("We couldn't save your business details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="hosting-org-setup-page">
    <div className="hosting-org-setup-poster-bg" aria-hidden="true"><div className="hosting-org-setup-poster-grid">{cities.map((city, index) => <div className={`hosting-org-setup-poster-card ${index === 4 || index === 7 || index === 8 ? "hosting-org-setup-poster-card-bottom" : ""}`} key={city.name}><img src={city.image} alt="" /><span>{city.name}</span></div>)}</div></div>
    <section className="hosting-org-setup-card">
      <div className="hosting-org-setup-mark" aria-hidden="true"><span>a</span></div>
      <h1>Tell us about your business.</h1>
      <p className="hosting-org-setup-subtitle">This sets up your landlord account so you can list properties and collect rent.</p>
      {error && <div className="hosting-org-setup-error" role="alert">{error}</div>}
      <div className="hosting-org-setup-toggle" role="tablist" aria-label="Account type">
        <button type="button" role="tab" aria-selected={accountType === "individual"} className={accountType === "individual" ? "is-selected" : ""} onClick={() => setAccountType("individual")}><strong>Individual</strong><span>I'm renting out property as myself.</span></button>
        <button type="button" role="tab" aria-selected={accountType === "business"} className={accountType === "business" ? "is-selected" : ""} onClick={() => setAccountType("business")}><strong>Business</strong><span>I'm renting out property as a registered company.</span></button>
      </div>
      <label>Legal name<input value={legalName} onChange={(event) => setLegalName(event.target.value)} placeholder={accountType === "individual" ? "Full legal name" : "Registered business name"} /></label>
      <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Shown to tenants" /></label>
      {accountType === "business" && <label>Business number <span>(optional)</span><input value={businessNumber} onChange={(event) => setBusinessNumber(event.target.value)} placeholder="CRA business number" /></label>}
      <div className="hosting-org-setup-row">
        <label>Country<input value="Canada" readOnly disabled /></label>
        <label>Province<CustomSelect value={provinceLabel ? `${provinceLabel.name} (${provinceLabel.code})` : provinceOptions[0]} options={provinceOptions} onChange={(value) => setProvinceCode(value.slice(-3, -1))} ariaLabel="Province" /></label>
      </div>
      <label>Default currency<CustomSelect value={currency} options={["CAD", "USD"]} onChange={setCurrency} ariaLabel="Default currency" /></label>
      <button type="button" className="hosting-org-setup-submit" disabled={!legalName.trim() || !displayName.trim() || submitting} onClick={onSubmit}>{submitting ? "Saving..." : "Continue"}</button>
    </section>
  </main>;
}
