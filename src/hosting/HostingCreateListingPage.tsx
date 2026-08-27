import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  CheckIcon,
  ChevIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  ShieldIcon,
  StarIcon,
  TrashIcon,
  UserPlusIcon,
  WifiIcon,
  XIcon,
} from "../components/Icons";
import CustomSelect from "../components/CustomSelect";
import "../marketplace/MarketplaceHome.css";
import "./HostingCreateListingPage.css";

type UnitDraft = {
  id: number;
  name: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  rent: string;
  deposit: string;
  availableFrom: string;
  description: string;
  occupants: string;
  beds: string;
};

const createUnit = (id: number): UnitDraft => ({
  id,
  name: `Unit ${id}`,
  type: "Apartment",
  bedrooms: "1",
  bathrooms: "1",
  occupants: "2",
  beds: "1",
  squareFeet: "",
  rent: "",
  deposit: "",
  availableFrom: "",
  description: "",
});

const formatAmount = (value: string) => {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
};

const getTodayIso = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const MIN_UNIT_PHOTOS = 5;
const MAX_UNIT_PHOTOS = 20;

const steps = [
  { label: "Welcome", detail: "Start your listing" },
  { label: "Property", detail: "Address and basics" },
  { label: "Units", detail: "Add rentable spaces" },
  { label: "Stand out", detail: "Add photos and amenities" },
  { label: "Amenities", detail: "Tell guests what you offer" },
  { label: "Photos", detail: "Show each unit" },
  { label: "Review", detail: "Check before publishing" },
  { label: "Details", detail: "Describe each unit" },
  { label: "Finish up", detail: "Publish your listing" },
  { label: "Safety", detail: "Share safety details" },
  { label: "Publish", detail: "Review and go live" },
];

const addressSuggestions = [
  {
    address: "123 Daisy Lane",
    city: "Saskatoon",
    province: "Saskatchewan",
    postalCode: "S7V 1P4",
    country: "Canada",
    latitude: "52.1579",
    longitude: "-106.6702",
  },
  {
    address: "18 Willowbrook Crescent",
    city: "Saskatoon",
    province: "Saskatchewan",
    postalCode: "S7V 1P6",
    country: "Canada",
    latitude: "52.1462",
    longitude: "-106.6891",
  },
  {
    address: "240 River Landing Drive",
    city: "Saskatoon",
    province: "Saskatchewan",
    postalCode: "S7K 3J8",
    country: "Canada",
    latitude: "52.1305",
    longitude: "-106.6602",
  },
  {
    address: "88 Harbour Street",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M5V 2L7",
    country: "Canada",
    latitude: "43.6392",
    longitude: "-79.3817",
  },
  {
    address: "410 Cambie Street",
    city: "Vancouver",
    province: "British Columbia",
    postalCode: "V6B 2N3",
    country: "Canada",
    latitude: "49.2820",
    longitude: "-123.1105",
  },
];

const amenityGroups = [
  { title: "What about these guest favorites?", items: ["WiFi", "TV", "Kitchen", "Washer", "Free parking on premises", "Paid parking on premises", "Air conditioning", "Dedicated workspace"] },
  { title: "Do you have any standout amenities?", items: ["Pool", "Hot tub", "Patio", "BBQ grill", "Outdoor dining area", "Fire pit", "Pool table", "Indoor fireplace", "Piano", "Exercise equipment", "Lake access", "Beach access", "Ski-in/Ski-out", "Outdoor shower"] },
  { title: "Do you have any of these safety items?", items: ["Smoke alarm", "First aid kit", "Fire extinguisher", "Carbon monoxide alarm"] },
];

const safetyItems = [
  {
    key: "camera",
    label: "Exterior security camera present",
    modalTitle: "Tell guests about your exterior security cameras",
    modalHint: "Describe the area that each camera monitors, such as the backyard or pool.",
  },
  {
    key: "noise",
    label: "Noise decibel monitor present",
    modalTitle: "Tell guests about your noise decibel monitor",
    modalHint: "Describe where the monitor is located, such as the backyard or living room.",
  },
  {
    key: "weapons",
    label: "Weapon(s) on the property",
    modalTitle: "Tell guests about weapons on the property",
    modalHint: "Describe how weapons are stored securely, such as in a locked safe.",
  },
];

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

function AmenityIcon({ name }: { name: string }) {
  if (name === "WiFi") return <WifiIcon />;
  if (name === "Smoke alarm") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" /></svg>;
  if (name === "First aid kit") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M8 6V4h8v2m-4 4v6m-3-3h6" /></svg>;
  if (name === "Fire extinguisher") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 8h8v12H8zM10 8V5h4v3m-3-3V3h5m-1 2h3v4m-8 4H6v5" /></svg>;
  if (name === "Carbon monoxide alarm") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="12" cy="12" r="4" /><path d="M10 12h4m-2-2v4" /></svg>;
  if (name.includes("alarm") || name.includes("kit") || name.includes("extinguisher")) return <ShieldIcon />;
  if (name.includes("access") || name.includes("parking")) return <MapPinIcon />;
  const paths: Record<string, string> = {
    "TV": "M3 5h18v12H3zM8 21h8M12 17v4",
    "Kitchen": "M4 4h16v16H4zM7 7h10v4H7zM7 14h3v3H7zM14 14h3v3h-3z",
    "Washer": "M4 4h16v16H4zM8 8h8M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    "Dedicated workspace": "M4 20h16M7 20v-9h10v9M9 11V7h6v4M12 4v3",
    "Free parking on premises": "M5 19h14l-1-8H6l-1 8Zm2-8 1-4h8l1 4M8 19v2m8-2v2M8 15h.01m8 0h.01",
    "Paid parking on premises": "M5 19h14l-1-8H6l-1 8Zm2-8 1-4h8l1 4M10 14h2a2 2 0 1 0 0-4H9v6",
    "Pool": "M3 17c3-3 5 3 8 0s5 3 8 0M3 21c3-3 5 3 8 0s5 3 8 0M7 13c0-4 2-7 5-7s5 3 5 7",
    "Hot tub": "M4 16h16M6 16v4m12-4v4M8 12c0-2 1-3 2-3m2 3c0-2 1-3 2-3m2 3c0-2 1-3 2-3M5 20h14",
    "Patio": "M4 20h16M6 20V9h12v11M4 9h16M8 5v4m8-4v4M8 5h8",
    "BBQ grill": "M5 10h14l-2 6H7l-2-6Zm3 6v4m8-4v4M4 10h16M7 7h10",
    "Outdoor dining area": "M4 10h16M12 10v10M7 10v10m10-10v10M6 6h12v4H6z",
    "Fire pit": "M12 21c4 0 6-2 6-5 0-3-2-4-3-6-1 2-2 3-3 1-1-2 0-5 0-5-5-2 2-5 5-5 9 0 3 2 6 5 6Z",
    "Pool table": "M4 5h16v14H4zM8 9h.01M16 15h.01M8 15h.01M16 9h.01",
    "Indoor fireplace": "M5 20h14M7 20V8h10v12M9 8V5h6v3M10 16c3-1 1-3 3-5 2 2 3 3 1 5",
    "Piano": "M5 6h14v14H5zM9 6v8m6-8v8M7 20h10",
    "Exercise equipment": "M4 8v8m3-10v12m10-12v12m3-10v8M7 12h10",
    "Outdoor shower": "M5 5h7a4 4 0 0 1 4 4v2m0-6v4m-5 7v4m-3-4h6M16 15l-2 3m2-3 2 3",
  };
  const path = paths[name] || "M4 20h16M6 20V8h12v12M9 8V5h6v3M8 13h8";
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>;
}

function UnitCounter({ label, value, minimum = 0, step = 1, onChange }: { label: string; value: string; minimum?: number; step?: number; onChange: (value: string) => void }) {
  const numericValue = Number(value) || 0;
  const changeValue = (amount: number) => onChange(String(Math.max(minimum, Number((numericValue + amount).toFixed(1)))));

  return (
    <div className="hosting-unit-counter">
      <span>{label}</span>
      <div className="hosting-unit-counter-controls">
        <button type="button" aria-label={`Decrease ${label}`} disabled={numericValue <= minimum} onClick={() => changeValue(-step)}>−</button>
        <strong>{value}</strong>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => changeValue(step)}>+</button>
      </div>
    </div>
  );
}

function AvailabilityDatePicker({ value, minimum, onChange }: { value: string; minimum: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const initialMonth = value ? new Date(`${value}T00:00:00`) : new Date();
  const [month, setMonth] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));
  const minimumDate = new Date(`${minimum}T00:00:00`);
  const days = Array.from({ length: 42 }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 1));
  const toIso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return (
    <div className="hosting-date-picker">
      <button type="button" className="hosting-date-trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="dialog"><span>{value || 'Select a date'}</span><span className="hosting-date-trigger-icon"><CalendarIcon /></span></button>
      {open && <div className="hosting-date-popover" role="dialog" aria-label="Choose availability date"><div className="hosting-date-popover-header"><button type="button" aria-label="Previous month" disabled={month <= new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><strong>{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong><button type="button" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></div><div className="hosting-date-weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}</div><div className="hosting-date-grid">{days.map((date) => { const iso = toIso(date); const muted = date.getMonth() !== month.getMonth(); const disabled = iso < minimum; return <button type="button" key={iso} className={`${muted ? 'is-muted' : ''} ${value === iso ? 'is-selected' : ''}`} disabled={disabled} onClick={() => { onChange(iso); setOpen(false); }}>{date.getDate()}</button>; })}</div><div className="hosting-date-actions"><button type="button" onClick={() => { onChange(''); setOpen(false); }}>Clear</button><button type="button" onClick={() => { onChange(minimum); setMonth(new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1)); setOpen(false); }}>Today</button></div></div>}
    </div>
  );
}

export default function HostingCreateListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [addressSearched, setAddressSearched] = useState(false);
  const [addressSuggestionsOpen, setAddressSuggestionsOpen] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");
  const today = getTodayIso();
  const [property, setProperty] = useState({
    name: "",
    type: "Apartment building",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    latitude: "",
    longitude: "",
  });
  const [units, setUnits] = useState<UnitDraft[]>([createUnit(1)]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [safetyDetails, setSafetyDetails] = useState<Record<string, string>>({});
  const [activeSafetyItem, setActiveSafetyItem] = useState<string | null>(null);
  const [safetyDraft, setSafetyDraft] = useState("");
  const [unitPhotos, setUnitPhotos] = useState<Record<number, string[]>>({});
  const [draggedPhoto, setDraggedPhoto] = useState<{ unitId: number; index: number } | null>(null);
  const [dragOverPhoto, setDragOverPhoto] = useState<{ unitId: number; index: number } | null>(null);
  const [activePhotoUnitId, setActivePhotoUnitId] = useState<number | null>(null);
  const [openTileMenu, setOpenTileMenu] = useState<{ unitId: number; index: number } | null>(null);
  const [showArrangeTip, setShowArrangeTip] = useState(true);
  const [pendingUpload, setPendingUpload] = useState<{ unitId: number; items: { file: File; url: string }[] } | null>(null);

  const updateProperty = (field: keyof typeof property, value: string) =>
    setProperty((current) => ({ ...current, [field]: value }));
  const matchingAddresses =
    property.postalCode.trim().length >= 2
      ? addressSuggestions
          .filter((item) =>
            `${item.postalCode} ${item.city}`
              .toLowerCase()
              .includes(property.postalCode.trim().toLowerCase()),
          )
          .slice(0, 4)
      : [];
  const selectAddress = (address: (typeof addressSuggestions)[number]) => {
    setProperty((current) => ({ ...current, ...address }));
    setAddressSearched(true);
    setAddressSuggestionsOpen(false);
    setAddressMessage("Address selected. Add a property name to continue.");
  };
  const updateUnit = (id: number, field: keyof UnitDraft, value: string) =>
    setUnits((current) =>
      current.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              [field]:
                field === "rent" || field === "deposit"
                  ? formatAmount(value)
                  : value,
            }
          : unit,
      ),
    );
  const toggleAmenity = (amenity: string) => setSelectedAmenities((current) => current.includes(amenity) ? current.filter((item) => item !== amenity) : [...current, amenity]);
  const toggleSafetyItem = (key: string) => {
    if (key in safetyDetails) {
      setSafetyDetails((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
      return;
    }
    setSafetyDraft("");
    setActiveSafetyItem(key);
  };
  const editSafetyItem = (key: string) => {
    setSafetyDraft(safetyDetails[key] || "");
    setActiveSafetyItem(key);
  };
  const closeSafetyModal = () => {
    setActiveSafetyItem(null);
    setSafetyDraft("");
  };
  const confirmSafetyModal = () => {
    if (!activeSafetyItem || !safetyDraft.trim()) return;
    setSafetyDetails((current) => ({ ...current, [activeSafetyItem]: safetyDraft.trim() }));
    closeSafetyModal();
  };
  const addUnitPhotos = (unitId: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    // capture files synchronously: callers reset the input value right after calling this,
    // which clears the live FileList before a deferred setState updater could read it.
    const incoming = Array.from(files);
    setUnitPhotos((current) => {
      const existing = current[unitId] || [];
      const remainingSlots = Math.max(0, MAX_UNIT_PHOTOS - existing.length);
      if (remainingSlots === 0) return current;
      const previews = incoming.slice(0, remainingSlots).map((file) => URL.createObjectURL(file));
      return { ...current, [unitId]: [...existing, ...previews] };
    });
  };
  const removeUnitPhoto = (unitId: number, photo: string) => {
    URL.revokeObjectURL(photo);
    setUnitPhotos((current) => ({ ...current, [unitId]: (current[unitId] || []).filter((item) => item !== photo) }));
  };
  const reorderUnitPhotos = (unitId: number, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setUnitPhotos((current) => {
      const photos = [...(current[unitId] || [])];
      const [moved] = photos.splice(fromIndex, 1);
      photos.splice(toIndex, 0, moved);
      return { ...current, [unitId]: photos };
    });
  };
  const queuePendingUpload = (unitId: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const alreadyQueued = pendingUpload?.unitId === unitId ? pendingUpload.items.length : 0;
    const remainingSlots = Math.max(0, MAX_UNIT_PHOTOS - (unitPhotos[unitId]?.length || 0) - alreadyQueued);
    if (remainingSlots === 0) return;
    const newItems = Array.from(files)
      .slice(0, remainingSlots)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPendingUpload((current) =>
      current && current.unitId === unitId ? { unitId, items: [...current.items, ...newItems] } : { unitId, items: newItems },
    );
  };
  const removePendingUploadItem = (url: string) => {
    URL.revokeObjectURL(url);
    setPendingUpload((current) => (current ? { ...current, items: current.items.filter((item) => item.url !== url) } : current));
  };
  const cancelPendingUpload = () => {
    pendingUpload?.items.forEach((item) => URL.revokeObjectURL(item.url));
    setPendingUpload(null);
  };
  const confirmPendingUpload = () => {
    if (!pendingUpload || pendingUpload.items.length === 0) {
      setPendingUpload(null);
      return;
    }
    const { unitId, items } = pendingUpload;
    setUnitPhotos((current) => ({ ...current, [unitId]: [...(current[unitId] || []), ...items.map((item) => item.url)] }));
    setPendingUpload(null);
  };
  const addUnit = () =>
    setUnits((current) => [...current, createUnit(current.length + 1)]);
  const removeUnit = (id: number) =>
    setUnits((current) =>
      current.length === 1 ? current : current.filter((unit) => unit.id !== id),
    );
  const canContinue =
    step === 0 || step === 3 || step === 4 || step === 7 || step === 8 || step === 9 || step === 10
      ? true
      : step === 1
        ? Boolean(
            property.name &&
            property.address &&
            property.city &&
            property.province &&
            property.postalCode &&
            property.country,
          )
        : step === 5 ? units.every((unit) => (unitPhotos[unit.id] || []).length >= MIN_UNIT_PHOTOS) : units.length > 0;
  const next = () => {
    if (canContinue)
      setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  return (
    <main className="marketplace hosting-page hosting-create-page">
      <header className="hosting-create-header">
        <a className="marketplace-brand" href="/" aria-label="Arcora home">
          <span className="marketplace-brand-mark">
            <span className="marketplace-brand-letter">a</span>
          </span>
          <span>arcora</span>
        </a>
        <button
          type="button"
          className="hosting-create-save-exit"
          onClick={() => navigate("/hosting/listings")}
        >
          Save &amp; exit
        </button>
      </header>
      <section
        className="hosting-create-content"
        aria-labelledby="create-listing-title"
      >
        <div className="hosting-create-layout">
          {step > 2 && step !== 8 && step !== 9 && step !== 10 && (
            <div className="hosting-create-intro">
              <p className="marketplace-eyebrow">Create a listing</p>
              <h1 id="create-listing-title">Bring your property to life.</h1>
              <p>
                Start with the building, then add every unit you want to rent.
                Shared details stay with the property; each unit gets its own
                listing.
              </p>
            </div>
          )}
          <div className="hosting-create-panel">
            {step === 0 && (
              <div className="hosting-create-welcome">
                <div className="hosting-create-welcome-copy">
                  <span className="hosting-create-welcome-step">Step 1</span>
                  <h2>Tell us about your place</h2>
                  <p>
                    In this step, we’ll ask you which type of property you have
                    and where it’s located. Then you can add every unit you want
                    to rent.
                  </p>
                </div>
                <div className="hosting-create-welcome-image">
                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"
                    alt="Bright modern home interior"
                  />
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="hosting-create-form">
                <div className="hosting-create-section-heading">
                  <span className="hosting-create-icon">
                    <HomeIcon />
                  </span>
                  <div>
                    <h2>Where is your property?</h2>
                    <p>
                      Start typing a postal code and choose your address from
                      the matching results.
                    </p>
                  </div>
                </div>
                <div className="hosting-create-postal-search">
                  <label className="hosting-create-field">
                    <span>Postal code</span>
                    <input
                      value={property.postalCode}
                      onFocus={() => setAddressSuggestionsOpen(true)}
                      onChange={(event) => {
                        updateProperty("postalCode", event.target.value);
                        setAddressSearched(false);
                        setAddressMessage("");
                        setAddressSuggestionsOpen(true);
                      }}
                      placeholder="e.g. S7V 1P4"
                    />
                  </label>
                  {addressSuggestionsOpen && matchingAddresses.length > 0 && (
                    <div
                      className="hosting-create-address-suggestions"
                      role="listbox"
                      aria-label="Matching addresses"
                    >
                      {matchingAddresses.map((address) => (
                        <button
                          type="button"
                          role="option"
                          key={address.postalCode + address.address}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selectAddress(address)}
                        >
                          <span className="hosting-create-suggestion-pin">
                            <HomeIcon />
                          </span>
                          <span>
                            <strong>{address.address}</strong>
                            <small>
                              {address.postalCode} · {address.city},{" "}
                              {address.province}
                            </small>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {addressMessage && (
                  <p
                    className={`hosting-create-address-message ${addressSearched && property.city ? "is-found" : ""}`}
                  >
                    {addressMessage}
                  </p>
                )}
                <div className="hosting-create-fields hosting-create-address-fields">
                  <label className="hosting-create-field hosting-create-field-wide">
                    <span>Street address</span>
                    <input
                      value={property.address}
                      onChange={(event) =>
                        updateProperty("address", event.target.value)
                      }
                      placeholder="Select an address above"
                    />
                  </label>
                  <label className="hosting-create-field">
                    <span>Country</span>
                    <input
                      value={property.country}
                      onChange={(event) =>
                        updateProperty("country", event.target.value)
                      }
                      placeholder="Country"
                      readOnly={Boolean(property.country)}
                    />
                  </label>
                  <label className="hosting-create-field">
                    <span>Province / territory</span>
                    <input
                      value={property.province}
                      onChange={(event) =>
                        updateProperty("province", event.target.value)
                      }
                      placeholder="Province or territory"
                      readOnly={Boolean(property.province)}
                    />
                  </label>
                  <label className="hosting-create-field">
                    <span>City / municipality</span>
                    <input
                      value={property.city}
                      onChange={(event) =>
                        updateProperty("city", event.target.value)
                      }
                      placeholder="City"
                      readOnly={Boolean(property.city)}
                    />
                  </label>
                  <label className="hosting-create-field">
                    <span>Latitude</span>
                    <input
                      value={property.latitude}
                      onChange={(event) =>
                        updateProperty("latitude", event.target.value)
                      }
                      placeholder="e.g. 52.1579"
                      readOnly={Boolean(property.latitude)}
                    />
                  </label>
                  <label className="hosting-create-field">
                    <span>Longitude</span>
                    <input
                      value={property.longitude}
                      onChange={(event) =>
                        updateProperty("longitude", event.target.value)
                      }
                      placeholder="e.g. -106.6702"
                      readOnly={Boolean(property.longitude)}
                    />
                  </label>
                  <label className="hosting-create-field">
                    <span>Property name</span>
                    <input
                      value={property.name}
                      onChange={(event) =>
                        updateProperty("name", event.target.value)
                      }
                      placeholder="e.g. Daisy's Inn"
                    />
                  </label>
                  <label className="hosting-create-field">
                    <span>Property type</span>
                    <CustomSelect
                      value={property.type}
                      options={["Apartment building", "House", "Condo", "Townhouse", "Duplex"]}
                      onChange={(value) => updateProperty("type", value)}
                      ariaLabel="Property type"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="hosting-create-welcome hosting-create-next-step">
                <div className="hosting-create-welcome-copy">
                  <span className="hosting-create-welcome-step">Step 2</span>
                  <h2>Make your place stand out</h2>
                  <p>In this step, you’ll add some of the amenities your place offers, plus 5 or more photos. Then, you’ll create a title and description.</p>
                </div>
                <div className="hosting-create-welcome-image">
                  <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85" alt="Bright modern home interior" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="hosting-create-form">
                <div className="hosting-create-section-heading">
                  <span className="hosting-create-icon">
                    <HomeIcon />
                  </span>
                  <div>
                    <h2>How many units are you listing?</h2>
                    <p>
                      Add every separate space a renter can lease at{" "}
                      {property.name || "this property"}.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="hosting-create-secondary"
                    onClick={addUnit}
                  >
                    <PlusIcon /> Add unit
                  </button>
                </div>
                <div className="hosting-unit-list">
                  {units.map((unit, index) => (
                    <article className="hosting-unit-card" key={unit.id}>
                      <div className="hosting-unit-card-top">
                        <div>
                          <span className="hosting-unit-number">
                            Unit {index + 1}
                          </span>
                          <h3>{unit.name}</h3>
                          <p>
                            {unit.type} · {unit.bedrooms || "0"} bedroom
                            {unit.bedrooms === "1" ? "" : "s"} ·{" "}
                            {unit.bathrooms || "0"} bath · {unit.occupants} guests
                          </p>
                        </div>
                        {units.length > 1 && (
                          <button
                            type="button"
                            className="hosting-icon-button"
                            aria-label={`Remove ${unit.name}`}
                            onClick={() => removeUnit(unit.id)}
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                      <div className="hosting-create-fields hosting-unit-identification-fields">
                        <label className="hosting-create-field">
                          <span>Unit name or number</span>
                          <input
                            value={unit.name}
                            onChange={(event) =>
                              updateUnit(unit.id, "name", event.target.value)
                            }
                            placeholder="Unit 101"
                          />
                        </label>
                        <label className="hosting-create-field">
                          <span>Unit type</span>
                          <CustomSelect
                            value={unit.type}
                            options={["Apartment", "Suite", "House", "Room", "Studio"]}
                            onChange={(value) => updateUnit(unit.id, "type", value)}
                            ariaLabel="Unit type"
                          />
                        </label>
                      </div>
                      <div className="hosting-unit-counters" aria-label={`${unit.name} basics`}>
                        <UnitCounter label="Guests" value={unit.occupants} minimum={1} onChange={(value) => updateUnit(unit.id, "occupants", value)} />
                        <UnitCounter label="Bedrooms" value={unit.bedrooms} onChange={(value) => updateUnit(unit.id, "bedrooms", value)} />
                        <UnitCounter label="Beds" value={unit.beds} onChange={(value) => updateUnit(unit.id, "beds", value)} />
                        <UnitCounter label="Bathrooms" value={unit.bathrooms} step={0.5} onChange={(value) => updateUnit(unit.id, "bathrooms", value)} />
                      </div>
                    </article>
                  ))}
                </div>
                <button
                  type="button"
                  className="hosting-add-unit"
                  onClick={addUnit}
                >
                  <PlusIcon />
                  <span>
                    <strong>Add another unit</strong>
                    <small>This property has more spaces to rent</small>
                  </span>
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="hosting-create-amenities">
                <div className="hosting-create-amenities-heading"><h2>Tell guests what your place has to offer</h2><p>You can add more amenities after you publish your listing.</p></div>
                {amenityGroups.map((group) => <section className="hosting-amenity-group" key={group.title}><h3>{group.title}</h3><div className="hosting-amenity-grid">{group.items.map((amenity) => <button type="button" className={`hosting-amenity-card ${selectedAmenities.includes(amenity) ? "is-selected" : ""}`} key={amenity} aria-pressed={selectedAmenities.includes(amenity)} onClick={() => toggleAmenity(amenity)}><span className="hosting-amenity-icon"><AmenityIcon name={amenity} /></span><span>{amenity}</span>{selectedAmenities.includes(amenity) && <CheckIcon />}</button>)}</div></section>)}
              </div>
            )}

            {step === 5 && (
              <div className="hosting-create-form hosting-create-photos-form">
                <div className="hosting-create-section-heading"><span className="hosting-create-icon"><ImageIcon /></span><div><h2>Add some photos of your units</h2><p>Each unit needs at least {MIN_UNIT_PHOTOS} photos to get started, and you can add up to {MAX_UNIT_PHOTOS}.</p></div></div>
                <div className="hosting-unit-photo-list">{units.map((unit, index) => {
                  const photos = unitPhotos[unit.id] || [];
                  return (
                    <article className="hosting-unit-photo-card" key={unit.id}>
                      <div className="hosting-unit-detail-heading">
                        <div><span className="hosting-unit-number">Unit {index + 1}</span><h3>{unit.name}</h3></div>
                        <span className={`hosting-unit-ready ${photos.length >= MIN_UNIT_PHOTOS ? "is-ready" : ""}`}>{photos.length}/{MAX_UNIT_PHOTOS} photos</span>
                      </div>
                      {photos.length === 0 ? (
                        <label className="hosting-photo-upload">
                          <ImageIcon />
                          <span><strong>Add photos</strong><small>Upload JPG, PNG, or WEBP images</small></span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={(event) => {
                              addUnitPhotos(unit.id, event.target.files);
                              event.target.value = "";
                              setActivePhotoUnitId(unit.id);
                            }}
                          />
                        </label>
                      ) : (
                        <div className="hosting-unit-photo-summary">
                          <div className="hosting-unit-photo-summary-preview">
                            {photos.slice(0, 5).map((photo, photoIndex) => (
                              <div className={`hosting-unit-photo-summary-item ${photoIndex === 0 ? "is-cover" : ""}`} key={photo}>
                                <img src={photo} alt={`${unit.name} preview ${photoIndex + 1}`} />
                                {photoIndex === 0 && <span>Cover</span>}
                              </div>
                            ))}
                          </div>
                          <button type="button" className="hosting-unit-photo-manage" onClick={() => setActivePhotoUnitId(unit.id)}>
                            Manage photos
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}</div>
                <p className="hosting-photo-requirement">{units.filter((unit) => (unitPhotos[unit.id] || []).length < MIN_UNIT_PHOTOS).length > 0 ? `Add at least ${MIN_UNIT_PHOTOS} photos for every unit to continue.` : `Every unit has the minimum number of photos. You can add up to ${MAX_UNIT_PHOTOS} per unit.`}</p>
              </div>
            )}

            {step === 7 && (
              <div className="hosting-create-form">
                <div className="hosting-create-section-heading">
                  <span className="hosting-create-icon">
                    <ImageIcon />
                  </span>
                  <div>
                    <h2>Give each unit its own story</h2>
                    <p>
                      These details appear on the renter-facing listing. Select
                      a unit to complete it.
                    </p>
                  </div>
                </div>
                <div className="hosting-unit-detail-list">
                  {units.map((unit, index) => (
                    <article className="hosting-unit-detail-card" key={unit.id}>
                      <div className="hosting-unit-detail-heading">
                        <div>
                          <span className="hosting-unit-number">
                            Unit {index + 1}
                          </span>
                          <h3>{unit.name}</h3>
                        </div>
                        <span className="hosting-unit-ready">
                          {unit.rent ? "Details added" : "Needs details"}
                        </span>
                      </div>
                      <div className="hosting-create-fields">
                        <label className="hosting-create-field">
                          <span>Monthly rent</span>
                          <div className="hosting-input-prefix">
                            <b>$</b>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={unit.rent}
                              onChange={(event) =>
                                updateUnit(
                                  unit.id,
                                  "rent",
                                  formatAmount(event.target.value),
                                )
                              }
                              placeholder="1,850"
                            />
                          </div>
                        </label>
                        <label className="hosting-create-field">
                          <span>Security deposit</span>
                          <div className="hosting-input-prefix">
                            <b>$</b>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={unit.deposit}
                              onChange={(event) =>
                                updateUnit(
                                  unit.id,
                                  "deposit",
                                  formatAmount(event.target.value),
                                )
                              }
                              placeholder="1,850"
                            />
                          </div>
                        </label>
                        <label className="hosting-create-field">
                          <span>Square feet</span>
                          <input
                            type="number"
                            min="0"
                            value={unit.squareFeet}
                            onChange={(event) =>
                              updateUnit(
                                unit.id,
                                "squareFeet",
                                event.target.value,
                              )
                            }
                            placeholder="750"
                          />
                        </label>
                        <label className="hosting-create-field">
                          <span>Available from</span>
                          <AvailabilityDatePicker value={unit.availableFrom} minimum={today} onChange={(value) => updateUnit(unit.id, "availableFrom", value)} />
                        </label>
                        <label className="hosting-create-field hosting-create-field-wide">
                          <span>Listing description</span>
                          <textarea
                            value={unit.description}
                            onChange={(event) =>
                              updateUnit(
                                unit.id,
                                "description",
                                event.target.value,
                              )
                            }
                            placeholder="What makes this unit a great place to live?"
                            rows={3}
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="hosting-create-form">
                <div className="hosting-create-section-heading">
                  <span className="hosting-create-icon">
                    <CheckIcon />
                  </span>
                  <div>
                    <h2>Ready to review your listings?</h2>
                    <p>
                      One property, {units.length} rentable{" "}
                      {units.length === 1 ? "unit" : "units"}. You can edit
                      everything later.
                    </p>
                  </div>
                </div>
                <div className="hosting-review-summary">
                  <div>
                    <span>Property</span>
                    <strong>{property.name}</strong>
                    <p>
                      {property.address}, {property.city}, {property.province}{" "}
                      {property.postalCode}
                    </p>
                  </div>
                  <button type="button" onClick={() => setStep(1)}>
                    Edit
                  </button>
                </div>
                {units.map((unit, index) => (
                  <div className="hosting-review-unit" key={unit.id}>
                    <div>
                      <span className="hosting-unit-number">
                        Unit {index + 1}
                      </span>
                      <strong>{unit.name}</strong>
                      <p>
                        {unit.type} · {unit.bedrooms} bedroom
                        {unit.bedrooms === "1" ? "" : "s"} · {unit.bathrooms}{" "}
                        bath{unit.rent ? ` · $${unit.rent}/month` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(6);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
                <div className="hosting-review-note">
                  <strong>Publishing checklist</strong>
                  <p>
                    Add photos, amenities, and lease terms after saving. Your
                    listings will remain private until you publish them.
                  </p>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="hosting-create-welcome">
                <div className="hosting-create-welcome-copy">
                  <span className="hosting-create-welcome-step">Step 3</span>
                  <h2>Finish up and publish</h2>
                  <p>You'll set your nightly price. Then answer a few quick questions and publish your listing when you're ready.</p>
                </div>
                <div className="hosting-create-welcome-image">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85"
                    alt="Illustration of a modern home"
                  />
                </div>
              </div>
            )}

            {step === 9 && (
              <div className="hosting-safety-page">
                <h2>Share safety details</h2>
                <div className="hosting-safety-question">
                  <span>Does your place have any of these? <InfoIcon /></span>
                  {safetyItems.map((item) => {
                    const checked = item.key in safetyDetails;
                    return (
                      <div className="hosting-safety-item" key={item.key}>
                        <div className="hosting-safety-item-row">
                          <span>{item.label}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSafetyItem(item.key)}
                            aria-label={item.label}
                          />
                        </div>
                        {checked && (
                          <div className="hosting-safety-item-note">
                            <p>&quot;{safetyDetails[item.key]}&quot;</p>
                            <button type="button" onClick={() => editSafetyItem(item.key)}>Edit</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="hosting-safety-callout">
                  <strong>Important things to know</strong>
                  <p>
                    Security cameras that monitor indoor spaces are not allowed even if
                    they&apos;re turned off. All exterior security cameras must be disclosed.
                  </p>
                  <p>
                    Be sure to comply with your <a href="#">local laws</a> and review
                    Arcora&apos;s <a href="#">anti-discrimination policy</a> and{" "}
                    <a href="#">guest and Host fees</a>.
                  </p>
                </div>
              </div>
            )}

            {step === 10 && (() => {
              const coverPhoto = units.map((unit) => (unitPhotos[unit.id] || [])[0]).find(Boolean);
              return (
                <div className="hosting-publish-page">
                  <h2>Yay! It&apos;s time to publish.</h2>
                  <p>Here&apos;s what we&apos;ll show to guests. Before you publish, make sure to review the details.</p>
                  <div className="hosting-publish-body">
                    <div className="hosting-publish-card">
                      <div className="hosting-publish-card-photo">
                        {coverPhoto ? <img src={coverPhoto} alt="Listing cover" /> : <ImageIcon />}
                        <span>Show preview</span>
                      </div>
                      <div className="hosting-publish-card-details">
                        <strong>{property.name || "Your listing"}</strong>
                        <span className="hosting-publish-card-rating">New <StarIcon /></span>
                        <p><s>$68</s> <b>$54</b> night</p>
                      </div>
                    </div>
                    <div className="hosting-publish-next">
                      <h3>What&apos;s next?</h3>
                      <div className="hosting-publish-next-item">
                        <CalendarIcon />
                        <div>
                          <strong>Set up your calendar</strong>
                          <p>Choose which dates are available. Guests can start booking 24 hours after you publish.</p>
                        </div>
                      </div>
                      <div className="hosting-publish-next-item">
                        <PencilIcon />
                        <div>
                          <strong>Adjust your settings</strong>
                          <p>Set house rules, select a cancellation policy, choose how guests can book, and more.</p>
                        </div>
                      </div>
                      <div className="hosting-publish-next-item">
                        <UserPlusIcon />
                        <div>
                          <strong>Prepare for your first guest</strong>
                          <p>Find tips in our Resource Center and access customer support.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="hosting-create-actions">
            <button
              type="button"
              className="hosting-create-cancel"
              onClick={() => navigate("/hosting/listings")}
            >
              Cancel
            </button>
            <span>
              {saved
                ? "Draft saved locally"
                : "Your progress is saved as you go"}
            </span>
            {step > 0 && (
              <button
                type="button"
                className="hosting-create-secondary"
                onClick={() => setStep((current) => current - 1)}
              >
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                type="button"
                className="hosting-create-primary"
                disabled={!canContinue}
                onClick={next}
              >
                {step === 0 || step === 3 || step === 4 || step === 5 || step === 8 || step === 9 ? "Next" : "Continue"} <ChevIcon />
              </button>
            ) : (
              <button
                type="button"
                className="hosting-create-primary hosting-create-publish"
                onClick={() => {
                  setSaved(true);
                  navigate("/hosting/listings");
                }}
              >
                <CheckIcon /> Publish
              </button>
            )}
          </div>
          <aside
            className={`hosting-create-side-image ${step === 0 || step === 3 || step === 4 || step === 8 ? "is-welcome" : ""}`}
            aria-label="Property preview"
          >
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85"
              alt="Bright modern home interior"
            />
          </aside>
        </div>
      </section>
      {activeSafetyItem && (() => {
        const item = safetyItems.find((entry) => entry.key === activeSafetyItem);
        if (!item) return null;
        return (
          <div className="hosting-safety-modal-backdrop" onClick={closeSafetyModal}>
            <div className="hosting-safety-modal" role="dialog" aria-label={item.modalTitle} onClick={(event) => event.stopPropagation()}>
              <button type="button" className="hosting-safety-modal-close" aria-label="Close" onClick={closeSafetyModal}><XIcon /></button>
              <h3>{item.modalTitle}</h3>
              <p>
                {item.modalHint} <a href="#">Learn more</a>
              </p>
              <div className="hosting-safety-modal-textarea">
                <textarea
                  value={safetyDraft}
                  maxLength={300}
                  onChange={(event) => setSafetyDraft(event.target.value)}
                  autoFocus
                />
              </div>
              <span className="hosting-safety-modal-count">{300 - safetyDraft.length} characters available</span>
              <div className="hosting-safety-modal-footer">
                <button type="button" className="is-primary" disabled={!safetyDraft.trim()} onClick={confirmSafetyModal}>Continue</button>
              </div>
            </div>
          </div>
        );
      })()}
      {activePhotoUnitId !== null && (() => {
        const unit = units.find((item) => item.id === activePhotoUnitId);
        if (!unit) return null;
        const photos = unitPhotos[unit.id] || [];
        const canAddMore = photos.length < MAX_UNIT_PHOTOS;
        const openFilePicker = (files: FileList | null) => { queuePendingUpload(unit.id, files); };
        return (
          <div className="hosting-photo-takeover" role="dialog" aria-modal="true" aria-label={`Manage photos for ${unit.name}`} onClick={() => setOpenTileMenu(null)}>
            <header className="hosting-photo-takeover-header">
              <a className="marketplace-brand" href="/" aria-label="Arcora home">
                <span className="marketplace-brand-mark"><span className="marketplace-brand-letter">a</span></span>
                <span>arcora</span>
              </a>
              <div className="hosting-photo-takeover-header-actions">
                <button type="button" className="hosting-photo-takeover-link">Questions?</button>
                <button type="button" className="hosting-create-save-exit" onClick={() => navigate("/hosting/listings")}>Save &amp; exit</button>
              </div>
            </header>
            <div className="hosting-photo-takeover-body">
              <div className="hosting-photo-gallery-header">
                <div>
                  <h2>Choose at least {MIN_UNIT_PHOTOS} photos</h2>
                  <p>Drag to reorder</p>
                </div>
                {canAddMore && (
                  <label className="hosting-photo-gallery-add" aria-label="Add photos">
                    <PlusIcon />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(event) => { openFilePicker(event.target.files); event.target.value = ""; }}
                    />
                  </label>
                )}
              </div>
              <div className="hosting-photo-gallery-grid">
                {photos.map((photo, photoIndex) => (
                  <div
                    className={`hosting-photo-gallery-tile ${photoIndex === 0 ? "is-cover" : ""} ${dragOverPhoto?.unitId === unit.id && dragOverPhoto.index === photoIndex ? "is-drag-over" : ""}`}
                    key={photo}
                    draggable
                    onDragStart={() => setDraggedPhoto({ unitId: unit.id, index: photoIndex })}
                    onDragOver={(event) => { event.preventDefault(); if (draggedPhoto?.unitId === unit.id) setDragOverPhoto({ unitId: unit.id, index: photoIndex }); }}
                    onDragLeave={() => setDragOverPhoto((current) => (current?.unitId === unit.id && current.index === photoIndex ? null : current))}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (draggedPhoto?.unitId === unit.id) reorderUnitPhotos(unit.id, draggedPhoto.index, photoIndex);
                      setDraggedPhoto(null);
                      setDragOverPhoto(null);
                    }}
                    onDragEnd={() => { setDraggedPhoto(null); setDragOverPhoto(null); }}
                  >
                    <img src={photo} alt={`${unit.name} property photo ${photoIndex + 1}`} />
                    {photoIndex === 0 && <span className="hosting-photo-gallery-cover-badge">Cover Photo</span>}
                    <button
                      type="button"
                      className="hosting-photo-gallery-menu-trigger"
                      aria-label={`Options for photo ${photoIndex + 1}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenTileMenu((current) => (current?.unitId === unit.id && current.index === photoIndex ? null : { unitId: unit.id, index: photoIndex }));
                      }}
                    >
                      <MoreIcon />
                    </button>
                    {openTileMenu?.unitId === unit.id && openTileMenu.index === photoIndex && (
                      <div className="hosting-photo-gallery-menu" role="menu" onClick={(event) => event.stopPropagation()}>
                        {photoIndex !== 0 && (
                          <button type="button" role="menuitem" onClick={() => { reorderUnitPhotos(unit.id, photoIndex, 0); setOpenTileMenu(null); }}>
                            Make cover photo
                          </button>
                        )}
                        <button type="button" role="menuitem" onClick={() => { removeUnitPhoto(unit.id, photo); setOpenTileMenu(null); }}>
                          Remove photo
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, MIN_UNIT_PHOTOS - photos.length - (canAddMore ? 1 : 0)) }).map((_, placeholderIndex) => (
                  <label className="hosting-photo-gallery-placeholder" key={`placeholder-${unit.id}-${placeholderIndex}`} aria-label="Add a photo">
                    <ImageIcon />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(event) => { openFilePicker(event.target.files); event.target.value = ""; }}
                    />
                  </label>
                ))}
                {canAddMore && (
                  <label className="hosting-photo-gallery-add-tile">
                    <PlusIcon />
                    <span>Add more</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(event) => { openFilePicker(event.target.files); event.target.value = ""; }}
                    />
                  </label>
                )}
              </div>
              {showArrangeTip && photos.length >= 3 && (
                <div className="hosting-photo-tip" onClick={(event) => event.stopPropagation()}>
                  <button type="button" className="hosting-photo-tip-close" aria-label="Dismiss tip" onClick={() => setShowArrangeTip(false)}><XIcon /></button>
                  <strong>Lead with your best photos</strong>
                  <p>Instantly sort your photos so the best ones show up first.</p>
                  <button type="button" className="hosting-photo-tip-action" onClick={() => setShowArrangeTip(false)}>Arrange photos</button>
                </div>
              )}
            </div>
            <footer className="hosting-photo-takeover-footer">
              <button type="button" className="hosting-create-back" onClick={() => setActivePhotoUnitId(null)}>Back</button>
              <button
                type="button"
                className="hosting-create-primary"
                disabled={photos.length < MIN_UNIT_PHOTOS}
                onClick={() => setActivePhotoUnitId(null)}
              >
                Next <ChevIcon />
              </button>
            </footer>
            {pendingUpload && pendingUpload.unitId === unit.id && (
              <div className="hosting-photo-upload-modal-backdrop" onClick={(event) => { event.stopPropagation(); cancelPendingUpload(); }}>
                <div className="hosting-photo-upload-modal" role="dialog" aria-label="Upload photos" onClick={(event) => event.stopPropagation()}>
                  <div className="hosting-photo-upload-modal-header">
                    <button type="button" aria-label="Close" onClick={cancelPendingUpload}><XIcon /></button>
                    <div>
                      <strong>Upload photos</strong>
                      <span>{pendingUpload.items.length} item{pendingUpload.items.length === 1 ? "" : "s"} selected</span>
                    </div>
                    <label aria-label="Add more files">
                      <PlusIcon />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={(event) => { queuePendingUpload(unit.id, event.target.files); event.target.value = ""; }}
                      />
                    </label>
                  </div>
                  <div className="hosting-photo-upload-modal-grid">
                    {pendingUpload.items.map((item) => (
                      <div className="hosting-photo-upload-modal-item" key={item.url}>
                        <img src={item.url} alt={item.file.name} />
                        <button type="button" aria-label={`Remove ${item.file.name}`} onClick={() => removePendingUploadItem(item.url)}><TrashIcon /></button>
                      </div>
                    ))}
                  </div>
                  <div className="hosting-photo-upload-modal-footer">
                    <button type="button" onClick={cancelPendingUpload}>Cancel</button>
                    <button type="button" className="is-primary" disabled={pendingUpload.items.length === 0} onClick={confirmPendingUpload}>Upload</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </main>
  );
}
