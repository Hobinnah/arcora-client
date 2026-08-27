import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import faceImage from "../assets/face.jpg";
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ChevIcon,
  ClockIcon,
  CreditCardIcon,
  FileIcon,
  EyeIcon,
  GlobeIcon,
  HomeIcon,
  ImageIcon,
  KeyIcon,
  MailIcon,
  MessageSquareIcon,
  PadlockIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  StarIcon,
  UsersIcon,
  WifiIcon,
} from "../components/Icons";
import CustomSelect from "../components/CustomSelect";
import HostingHeader from "./HostingHeader";
import "../marketplace/MarketplaceHome.css";
import "./HostingPage.css";
import "./HostingListingEditorPage.css";
import "./HostingCreateListingPage.css";

type SectionKind = "photos" | "text" | "property-type" | "sleeping" | "list" | "map" | "host" | "link" | "pricing" | "discount" | "availability" | "guests" | "description" | "amenities";

type Section = {
  key: string;
  label: string;
  summary?: string;
  summary2?: string;
  kind: SectionKind;
  thumbnail?: string;
};

const hostFactItems = [
  { key: "travel", label: "Where I've always wanted to go", value: "France", prompt: "Where have you always wanted to travel?", icon: <GlobeIcon /> },
  { key: "work", label: "My work", value: "", prompt: "What do you do for work?", icon: <span className="hosting-editor-fact-icon">▣</span> },
  { key: "funFact", label: "My fun fact", value: "", prompt: "What's a fun fact about you?", icon: <span className="hosting-editor-fact-icon">♧</span> },
  { key: "home", label: "What makes my home unique", value: "Stylish comfort with private security.", prompt: "What makes your home unique?", icon: <span className="hosting-editor-fact-icon">✣</span> },
  { key: "pets", label: "Pets", value: "", prompt: "Tell guests about your pets", icon: <UsersIcon /> },
  { key: "decade", label: "Decade I was born", value: "", prompt: "What decade were you born in?", icon: <span className="hosting-editor-fact-icon">♧</span> },
  { key: "school", label: "Where I went to school", value: "", prompt: "Where did you go to school?", icon: <span className="hosting-editor-fact-icon">◇</span> },
];

const formatAmount = (value: string) => {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
};

const photoRooms = [
  { label: "Living room", count: 20, photo: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=80" },
  { label: "Bedroom", count: 7, photo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80" },
  { label: "Full bathroom", count: 6, photo: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=500&q=80" },
  { label: "Laundry area", count: 2, photo: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=500&q=80" },
  { label: "Exterior", count: 1, photo: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80" },
  { label: "Additional photos", count: 8, photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
];

const sleepingRooms = [
  { key: "living", label: "Living room" },
  { key: "bedroom", label: "Bedroom" },
];

const advanceNoticeOptions = ["Same day", "1 day", "2 days", "3 days", "4 days", "5 days", "6 days", "7 days"];

const descriptionItems: { key: string; label: string; hint?: string; maxLength?: number; isInput?: boolean }[] = [
  { key: "listing", label: "Listing description", maxLength: 500 },
  { key: "property", label: "Your property", hint: "Share a general description of your property's rooms and spaces so guests know what to expect." },
  { key: "access", label: "Guest access", isInput: true },
  { key: "interaction", label: "Interaction with guests" },
  { key: "notes", label: "Other details to note" },
];

const bedTypes = [
  "Single",
  "Double",
  "Queen",
  "King",
  "Small double",
  "Bunk bed",
  "Sofa bed",
  "Couch",
  "Floor mattress",
  "Air mattress",
  "Crib",
  "Toddler bed",
  "Hammock",
  "Water bed",
];

const bedIconPaths: Record<string, string> = {
  Single: "M3 18v-5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5M3 18v2m10-2v2M3 13V9a2 2 0 0 1 2-2h4v6",
  Double: "M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 18v2m18-2v2M3 13V9a2 2 0 0 1 2-2h16v6",
  Queen: "M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 18v2m18-2v2M3 13V9a2 2 0 0 1 2-2h6v6M11 13V7h6a2 2 0 0 1 2 2v4",
  King: "M2 18v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5M2 18v2m20-2v2M2 13V9a2 2 0 0 1 2-2h5v6M9 13V7h6v6M15 13V7h1a2 2 0 0 1 2 2v4",
  "Small double": "M4 18v-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5M4 18v2m16-2v2M4 13V9a2 2 0 0 1 2-2h12v6M8 18l8-5",
  "Bunk bed": "M3 21v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 13V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v9M3 8h18M6 13V9m0 8v4m12-12v4m0 8v-4",
  "Sofa bed": "M3 20v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M3 20v-2m18 2v-2M5 14v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M8 9V7m8 2V7",
  Couch: "M4 12V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 12h18v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5zM6 18v2m12-2v2",
  "Floor mattress": "M3 15h18a1 1 0 0 1 1 1v3H2v-3a1 1 0 0 1 1-1zM3 15v-1a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1",
  "Air mattress": "M3 16c1-2 2-2 3 0s2 2 3 0 2-2 3 0 2 2 3 0 2-2 3 0M3 16v3h18v-3",
  Crib: "M4 4v16m16-16v16M4 6h16M4 18h16M8 10v4m4-4v4m4-4v4",
  "Toddler bed": "M3 18v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M3 18v2m18-2v2M3 12V9h4v3M5 9V6h2v3M17 12h4",
  Hammock: "M3 6c4 2 14 2 18 0M4 6c1 6 4 10 8 10s7-4 8-10M9 16v2m6-2v2",
  "Water bed": "M3 18v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5M3 18v2m18-2v2M5 13c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0",
};

function BedTypeIcon({ type }: { type: string }) {
  const path = bedIconPaths[type] || bedIconPaths.Double;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GuestFigures() {
  return (
    <svg width="90" height="64" viewBox="0 0 90 64" fill="none" aria-hidden="true">
      <g>
        <circle cx="28" cy="14" r="7" fill="#2f3b3a" />
        <path d="M14 46c0-11 6-18 14-18s14 7 14 18v6H14v-6z" fill="#4d7c6f" />
        <path d="M22 30h12l3 22H19l3-22z" fill="#3a4a48" />
      </g>
      <g>
        <circle cx="62" cy="10" r="7" fill="#2f3b3a" />
        <path d="M48 44c0-12 6-20 14-20s14 8 14 20v8H48v-8z" fill="#a03a7a" />
        <path d="M56 26h12l3 26H53l3-26z" fill="#7c2d5e" />
      </g>
    </svg>
  );
}

const sections: Section[] = [
  { key: "photos", label: "Photo tour", summary: "1 bedroom · 1 bed · 1 bath", kind: "photos", thumbnail: photoRooms[0].photo },
  { key: "title", label: "Title", summary: "Daisy's Inn", kind: "text" },
  { key: "propertyType", label: "Property type", summary: "Entire place · Secondary unit", kind: "property-type" },
  { key: "sleeping", label: "Sleeping arrangements", summary: "1 queen bed", kind: "sleeping", thumbnail: photoRooms[1].photo },
  { key: "pricing", label: "Pricing", summary: "$70 – $75 CAD per night", kind: "pricing" },
  { key: "discounts", label: "Discounts", kind: "discount" },
  { key: "availability", label: "Availability", kind: "availability" },
  { key: "guests", label: "Number of guests", kind: "guests" },
  { key: "description", label: "Description", kind: "description" },
  { key: "amenities", label: "Amenities", kind: "amenities" },
  { key: "accessibility", label: "Accessibility features", summary: "Add details", kind: "text" },
  { key: "location", label: "Location", kind: "map" },
  { key: "host", label: "About the host", kind: "host" },
  { key: "cohosts", label: "Co-hosts", kind: "list" },
  { key: "booking", label: "Booking settings", summary: "Guests send reservation requests that you approve.", kind: "text" },
  { key: "rules", label: "House rules", kind: "list" },
  { key: "safety", label: "Guest safety", kind: "list" },
  { key: "cancellation", label: "Cancellation policy", summary: "Flexible for short-term stays", summary2: "Firm Long Term for long-term stays", kind: "text" },
  { key: "link", label: "Custom link", summary: "https://arcora.com/h/vacationatdaisysinn", kind: "link" },
];
const arrivalCards = [
  { key: "arrival-checkin", label: "Check-in method", summary: "Smart lock", icon: <KeyIcon /> },
  { key: "arrival-manual", label: "House manual", summary: "Welcome to Daisy’s Inn!", icon: <FileIcon /> },
  { key: "arrival-wifi", label: "WiFi details", summary: "Network and password", icon: <WifiIcon /> },
  { key: "arrival-checkout", label: "Checkout instruction", summary: "Add details", icon: <ClockIcon /> },
  { key: "arrival-requirements", label: "Guest requirements", summary: "Add details", icon: <UsersIcon /> },
  { key: "arrival-taxes", label: "Taxes", summary: "Add tax details", icon: <CreditCardIcon /> },
];
const timeOptions = ["12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"];

const listContent: Record<string, { icon: ReactElement; label: string; sub?: string; image?: string }[]> = {
  cohosts: [
    { icon: <UsersIcon />, label: "Obinna Eze (Obi)", sub: "Listing owner", image: faceImage },
    { icon: <UsersIcon />, label: "Chimuanya Eze", sub: "Full access" },
  ],
  rules: [
    { icon: <ClockIcon />, label: "Check-in after 3:00 PM" },
    { icon: <ClockIcon />, label: "Checkout before 11:00 AM" },
    { icon: <UsersIcon />, label: "2 guests maximum" },
  ],
  safety: [
    { icon: <ShieldIcon />, label: "Carbon monoxide alarm installed" },
    { icon: <ShieldIcon />, label: "Smoke alarm installed" },
    { icon: <CameraIcon />, label: "Exterior security camera present" },
  ],
};
const cohostImage = "https://randomuser.me/api/portraits/women/44.jpg";

const amenityCategories = [
  "All",
  "Basics",
  "Bathroom",
  "Bedroom and laundry",
  "Entertainment",
  "Family",
  "Heating and cooling",
  "Home safety",
  "Internet and office",
  "Kitchen and dining",
  "Location features",
  "Outdoor",
  "Parking and facilities",
  "Services",
];

type AmenityCatalogItem = { name: string; category: string; description?: string };

const amenityCatalog: AmenityCatalogItem[] = [
  { name: "Air conditioning", category: "Heating and cooling", description: "A system that cools and controls the humidity of an indoor space" },
  { name: "Baking sheet", category: "Kitchen and dining" },
  { name: "Bathtub", category: "Bathroom", description: "A tub for bathing that holds water" },
  { name: "Bed linens", category: "Bedroom and laundry" },
  { name: "Blender", category: "Kitchen and dining" },
  { name: "Body soap", category: "Bathroom" },
  { name: "Books and reading material", category: "Entertainment" },
  { name: "Carbon monoxide alarm", category: "Home safety", description: "A device that alerts if it detects unsafe levels of carbon monoxide (Check your local laws, which may require a working carbon monoxide detector in your listing)" },
  { name: "Cleaning products", category: "Services" },
  { name: "Clothing storage", category: "Bedroom and laundry" },
  { name: "Coffee", category: "Kitchen and dining" },
  { name: "Coffee maker", category: "Kitchen and dining" },
  { name: "Conditioner", category: "Bathroom" },
  { name: "Cooking basics", category: "Kitchen and dining", description: "Pots and pans, oil, salt and pepper" },
  { name: "Dining table", category: "Kitchen and dining" },
  { name: "Dishes and silverware", category: "Kitchen and dining", description: "Plates, bowls, cups, cutlery, and other utensils" },
  { name: "Dishwasher", category: "Kitchen and dining" },
  { name: "Dryer", category: "Bedroom and laundry", description: "A machine that dries wet clothes" },
  { name: "Essentials", category: "Basics", description: "Towels, bed sheets, soap, and toilet paper" },
  { name: "Extra pillows and blankets", category: "Basics" },
  { name: "Fire extinguisher", category: "Home safety" },
  { name: "First aid kit", category: "Home safety" },
  { name: "Free parking on premises", category: "Parking and facilities", description: "Parking on-site that's free of charge" },
  { name: "Free street parking", category: "Parking and facilities", description: "Parking on a nearby street that's free of charge" },
  { name: "Freezer", category: "Kitchen and dining" },
  { name: "Hair dryer", category: "Bathroom" },
  { name: "Hangers", category: "Basics" },
  { name: "Heating", category: "Heating and cooling", description: "Equipment used for warming a space" },
  { name: "Hot water", category: "Bathroom", description: "Water that's heated for the shower, bath, or sink" },
  { name: "Iron", category: "Basics" },
  { name: "Long term stays allowed", category: "Services" },
  { name: "Microwave", category: "Kitchen and dining" },
  { name: "Oven", category: "Kitchen and dining" },
  { name: "Refrigerator", category: "Kitchen and dining" },
  { name: "Shampoo", category: "Bathroom" },
  { name: "Shower gel", category: "Bathroom" },
  { name: "Smoke alarm", category: "Home safety" },
  { name: "TV", category: "Entertainment" },
  { name: "Washer", category: "Bedroom and laundry" },
  { name: "Wifi", category: "Internet and office" },
  { name: "Workspace", category: "Internet and office" },
  { name: "Lockbox", category: "Home safety" },
  { name: "Luggage dropoff allowed", category: "Services" },
  { name: "Pack 'n play/Travel crib", category: "Family" },
  { name: "High chair", category: "Family" },
  { name: "Board games", category: "Family" },
  { name: "Dedicated workspace", category: "Internet and office" },
  { name: "BBQ grill", category: "Outdoor" },
];

const catalogIconPaths: Record<string, string> = {
  "Air conditioning": "M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M2 12h20",
  "Baking sheet": "M3 8h18v10H3zM3 8V6h4v2M17 8V6h4v2",
  "Bathtub": "M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM4 12V9a2 2 0 0 1 2-2h1M20 19v2M4 19v2",
  "Bed linens": "M4 8h16v8H4zM4 8l4-4h8l4 4",
  "Blender": "M8 4h8l1 4H7l1-4zM7 8h10l-1 12H8L7 8zM9 12h6",
  "Body soap": "M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9z",
  "Books and reading material": "M12 4C9 4 6 5 4 6v13c2-1 5-2 8-2s6 1 8 2V6c-2-1-5-2-8-2zM12 4v15",
  "Carbon monoxide alarm": "M12 3a9 9 0 1 0 .01 0zM9 12h.01M12 12h.01M15 12h.01",
  "Cleaning products": "M9 3h3v3H9zM8 6h5l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l0-3z",
  "Clothing storage": "M4 4h16v16H4zM4 10h16M9 4v6m6-6v6",
  "Coffee": "M4 10h12v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-5zM16 11h2a2 2 0 0 1 0 4h-2M7 6c0-1 1-1 1-2m3 2c0-1 1-1 1-2",
  "Coffee maker": "M6 3h8v3H6zM5 6h10l-1 14H6L5 6zM9 10h2",
  "Conditioner": "M10 3h4v2h-4zM9 5h6v15a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z",
  "Cooking basics": "M4 14a6 6 0 0 1 12 0v1H4v-1zM16 12h4M14 5l2-2M18 5l2-2",
  "Dining table": "M3 10h18M6 10v10M18 10v10M3 7l3-3h12l3 3",
  "Dishes and silverware": "M4 12a5 5 0 1 0 10 0 5 5 0 0 0-10 0zM17 3v18m3-18v6a3 3 0 0 1-3 3",
  "Dishwasher": "M4 3h16v18H4zM4 8h16M9 14h6",
  "Dryer": "M4 3h16v18H4zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM7 5h.01M9 5h.01",
  "Essentials": "M4 6h16v4H4zM4 12h16v4H4zM4 18h10",
  "Extra pillows and blankets": "M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z",
  "Fire extinguisher": "M8 8h8v12H8zM10 8V5h4v3m-3-3V3h5m-1 2h3v4m-8 4H6v5",
  "First aid kit": "M3 6h18v14H3zM8 6V4h8v2m-4 4v6m-3-3h6",
  "Free parking on premises": "M5 19h14l-1-8H6l-1 8Zm2-8 1-4h8l1 4M8 19v2m8-2v2M8 15h.01m8 0h.01",
  "Free street parking": "M5 19h14l-1-8H6l-1 8Zm2-8 1-4h8l1 4M8 19v2m8-2v2M8 15h.01m8 0h.01",
  "Freezer": "M4 3h16v18H4zM4 11h16M9 3v8m6-8v8",
  "Hair dryer": "M4 8a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v2H4V8zM10 10v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-8",
  "Hangers": "M12 3a2 2 0 1 1 0 4M12 7l9 8H3l9-8z",
  "Heating": "M4 6h16v12H4zM4 10h16M4 14h16M7 6v12m10-12v12",
  "Hot water": "M6 4h4v4H6zM8 8v3M4 14a4 4 0 1 0 8 0 4 4 0 0 0-8 0z",
  "Iron": "M4 18h14l2-6-6-6H6a4 4 0 0 0-4 4v8zM4 18h16",
  "Long term stays allowed": "M3 4h18v18H3zM3 9h18M8 2v4m8-4v4",
  "Microwave": "M3 6h18v12H3zM15 9h3v6h-3zM6 12h6",
  "Oven": "M4 4h16v16H4zM4 10h16M8 15h2m2 0h2",
  "Refrigerator": "M6 2h12v20H6zM6 9h12M9 4v3m0 8v3",
  "Shampoo": "M10 3h4v2h-4zM9 5h6v15a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z",
  "Shower gel": "M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9z",
  "Smoke alarm": "M12 2a8 8 0 1 0 .01 0zM12 12a3 3 0 1 0 .01 0zM12 2v2m0 16v2M2 12h2m16 0h2",
  "TV": "M3 5h18v12H3zM8 21h8M12 17v4",
  "Washer": "M4 4h16v16H4zM8 8h8M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  "Workspace": "M4 20h16M7 20v-9h10v9M9 11V7h6v4M12 4v3",
  "Dedicated workspace": "M4 20h16M7 20v-9h10v9M9 11V7h6v4M12 4v3",
  "Luggage dropoff allowed": "M6 8h12v12H6zM9 8V5h6v3M6 12h12",
  "Pack 'n play/Travel crib": "M4 20h16M6 20V9l6-4 6 4v11M9 13h6",
  "High chair": "M8 3h8v6H8zM6 9h12v4H6zM7 13v8m10-8v8",
  "Board games": "M4 4h16v16H4zM8 8h.01M16 8h.01M8 16h.01M16 16h.01M12 12h.01",
  "BBQ grill": "M5 10h14l-2 6H7l-2-6Zm3 6v4m8-4v4M4 10h16M7 7h10",
};

function CatalogIcon({ name }: { name: string }) {
  if (name === "Wifi") return <WifiIcon />;
  if (name === "Lockbox") return <PadlockIcon />;
  const path = catalogIconPaths[name] || "M4 20h16M6 20V8h12v12M9 8V5h6v3M8 13h8";
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function HostingListingEditorPage() {
  const navigate = useNavigate();
  const { id = "daisys-inn" } = useParams();
  const [activeKey, setActiveKey] = useState("photos");
  const [editorTab, setEditorTab] = useState<"space" | "arrival">("space");
  const [checkinDetail, setCheckinDetail] = useState<"lock" | "instructions" | null>(null);
  const [requireProfilePhoto, setRequireProfilePhoto] = useState(true);
  const [houseManual, setHouseManual] = useState("Welcome to Daisy’s Inn!\n\nDoor Access:\nIf the door doesn’t open after entering the smart lock code, no worries — try these quick steps:\n\n1. Gently pull the door knob towards you once, leave it, then re-enter the code.\n2. If it still doesn’t open, please call or message me.\n3. If it’s at night and I haven’t responded, kindly press the doorbell at the main house entrance — I’ll be right with you!\n\nTo lock the door, pull the door handle once toward you, leave it, then press the Weiser button at the top of the smart lock pad.\n\nSecurity Light:\nThe external security light is sensor-activated and automatically turns on when it gets dark. Please make sure the switch is turned ON when you enter the suite.");
  const [doorCode, setDoorCode] = useState("1973");
  const [doorCodeDraft, setDoorCodeDraft] = useState("1973");
  const [photoCategory, setPhotoCategory] = useState<string | null>(null);
  const [title, setTitle] = useState("Daisy's Inn");
  const [placeType, setPlaceType] = useState("Secondary unit");
  const [propertyTypeValue, setPropertyTypeValue] = useState("Guest suite");
  const [listingType, setListingType] = useState("Entire place");
  const [sizeUnit, setSizeUnit] = useState("Unit");
  const [priceRange, setPriceRange] = useState({ min: "70", max: "75" });
  const [smartPricing, setSmartPricing] = useState(true);
  const [pricingView, setPricingView] = useState<"main" | "smart">("main");
  const [weeklyDiscount, setWeeklyDiscount] = useState("0");
  const [discountPercent, setDiscountPercent] = useState("3");
  const [availability, setAvailability] = useState({ min: "1", max: "365", advanceNotice: "Same day", sameDayTime: "12:00 AM" });
  const [allowSameDay, setAllowSameDay] = useState(true);
  const [availabilityView, setAvailabilityView] = useState<"main" | "min" | "max">("main");
  const [advanceNoticeOpen, setAdvanceNoticeOpen] = useState(false);
  const [guestsCount, setGuestsCount] = useState(2);
  const [descriptionView, setDescriptionView] = useState<string | null>(null);
  const [descriptionFields, setDescriptionFields] = useState<Record<string, string>>({
    listing:
      "Welcome to Daisy's Inn, your cozy home away from home in the heart of the peaceful Brighton community, Saskatoon East! This inviting one-bedroom suite comfortably sleeps up to 2 guests and is just a short walk from Save-On-Foods, Landmark Cinemas, popular restaurants, a bus station and more—offering the perfect blend of comfort and convenience for your stay.",
    property: "",
    access: "Side Door",
    interaction: "",
    notes: "",
  });
  const [sleepingRoom, setSleepingRoom] = useState<string | null>(null);
  const [roomPhotos, setRoomPhotos] = useState<Record<string, string>>({ living: photoRooms[0].photo, bedroom: photoRooms[1].photo });
  const [bedCounts, setBedCounts] = useState<Record<string, Record<string, number>>>({ living: {}, bedroom: { Queen: 1 } });
  const [amenitiesMode, setAmenitiesMode] = useState<"view" | "edit" | "add">("view");
  const [amenityCategory, setAmenityCategory] = useState("All");
  const [addedAmenities, setAddedAmenities] = useState<string[]>(amenityCatalog.map((item) => item.name));
  const [locationDetail, setLocationDetail] = useState<"address" | "features" | "neighborhood" | "gettingAround" | "scenicViews" | null>(null);
  const [locationFeatures, setLocationFeatures] = useState(["Private entrance"]);
  const [hostPhoto, setHostPhoto] = useState(faceImage);
  const [hostPhotoDraft, setHostPhotoDraft] = useState(faceImage);
  const [hostPhotoDialogOpen, setHostPhotoDialogOpen] = useState(false);
  const [hostFacts, setHostFacts] = useState<Record<string, string>>(Object.fromEntries(hostFactItems.map((item) => [item.key, item.value])));
  const [hostFactDialog, setHostFactDialog] = useState<string | null>(null);
  const [hostFactDraft, setHostFactDraft] = useState("");
  const [cohostView, setCohostView] = useState<"overview" | "detail" | "add">("overview");
  const [selectedCohost, setSelectedCohost] = useState("primary");
  const [inviteStep, setInviteStep] = useState<1 | 2 | 3>(1);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [invitePermission, setInvitePermission] = useState("Calendar and messaging access");
  const [houseRulesDetail, setHouseRulesDetail] = useState<"times" | "additional" | null>(null);
  const [quietHours, setQuietHours] = useState(false);
  const [commercialPhotography, setCommercialPhotography] = useState(false);
  const [houseRuleText, setHouseRuleText] = useState("Walls: Please take extra care when bringing luggage into the property. Kindly avoid letting luggage bump or scrape against the walls.\n\nSmoking: Smoking or vaping is not allowed anywhere on the premises. We appreciate your cooperation in keeping the space fresh and comfortable for everyone.\n\nDrugs: Drugs or drug use is not allowed. NO SMOKING OR DRUG USE IN OR ANYWHERE ON THE PROPERTY OR ITS VICINITY.\n\nQuiet Hours: Is from 10:00 PM to 7:00 AM\n\nFurniture: Please don't move the furniture from their positions. All forms of eating should be done using the dining set.\n\nSofa [Chair]: Kindly avoid eating or doing anything that might accidentally stain the sofa. Please keep it clean.\n\nSecurity: Always lock doors when leaving the property.\n\nWaste Disposal: Please separate recyclables and place garbage in designated bins.\n\nLaundry: It has come to our attention that some guests bring large quantities of clothes to wash. Please note, we aren't a laundry mart.");
  const [checkInStart, setCheckInStart] = useState("3:00 PM");
  const [checkInEnd, setCheckInEnd] = useState("11:00 PM");
  const [checkoutTime, setCheckoutTime] = useState("11:00 AM");
  const [quietStart, setQuietStart] = useState("10:00 PM");
  const [quietEnd, setQuietEnd] = useState("7:00 AM");
  const [safetyDetail, setSafetyDetail] = useState<"considerations" | "devices" | "property" | null>(null);
  const [safetyChoices, setSafetyChoices] = useState<Record<string, "yes" | "no">>({});
  const [cancellationDetail, setCancellationDetail] = useState<"lastMinute" | "longTerm" | null>(null);
  const [shortTermPolicy, setShortTermPolicy] = useState("Flexible");
  const [longTermPolicy, setLongTermPolicy] = useState("Firm Long Term");
  const [taxDetailOpen, setTaxDetailOpen] = useState(false);
  const [taxName, setTaxName] = useState("");
  const [taxType, setTaxType] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [instantBook, setInstantBook] = useState(false);
  const [trackRecord, setTrackRecord] = useState(false);
  const [preBookingMessage, setPreBookingMessage] = useState("Hi there! Kindly introduce yourself by stating your full name. I’d love to hear a bit about you and your expected check-in time whenever you get a chance. Looking forward to welcoming you!");
  const [bookingMessageOpen, setBookingMessageOpen] = useState(false);
  const instantBookRef = useRef<HTMLDivElement>(null);
  const approvalRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    (instantBook ? instantBookRef.current : approvalRef.current)?.focus();
  }, [instantBook]);
  const activeSection = useMemo(() => sections.find((section) => section.key === activeKey) ?? sections[0], [activeKey]);
  const activeArrivalCard = arrivalCards.find((card) => card.key === activeKey) ?? arrivalCards[0];
  const changeBedCount = (roomKey: string, bedType: string, delta: number) => {
    setBedCounts((current) => {
      const room = current[roomKey] || {};
      const next = Math.max(0, (room[bedType] || 0) + delta);
      return { ...current, [roomKey]: { ...room, [bedType]: next } };
    });
  };
  const changeRoomPhoto = (roomKey: string, files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setRoomPhotos((current) => ({ ...current, [roomKey]: URL.createObjectURL(file) }));
  };
  const toggleAmenity = (name: string) => {
    setAddedAmenities((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  };
  const setSafetyChoice = (item: string, choice: "yes" | "no") => {
    setSafetyChoices((current) => ({ ...current, [item]: choice }));
  };

  return (
    <main className="marketplace hosting-page hosting-editor-page">
      <HostingHeader />
      <div className="hosting-editor-layout">
        <aside className="hosting-editor-sidebar">
          <button type="button" className="hosting-editor-view-button" onClick={() => navigate(`/homes/${id}`)}><EyeIcon /> View</button>
          <div className="hosting-editor-sidebar-header">
            <button type="button" className="hosting-editor-back" aria-label="Back to listings" onClick={() => navigate(`/hosting/listings`)}><ArrowLeftIcon /></button>
            <h1>Listing editor</h1>
          </div>
          <div className="hosting-editor-tabs">
            <div className="hosting-editor-tab-group">
              <button type="button" className={editorTab === "space" ? "is-active" : ""} onClick={() => { setEditorTab("space"); setActiveKey("photos"); }}>Your space</button>
              <button type="button" className={editorTab === "arrival" ? "is-active" : ""} onClick={() => { setEditorTab("arrival"); setActiveKey("arrival-checkin"); }}>Arrival guide</button>
            </div>
            <button type="button" className="hosting-editor-settings" aria-label="Editor settings"><SettingsIcon /></button>
          </div>
          <div className="hosting-editor-sidebar-list">
            {(editorTab === "space" ? sections : arrivalCards).map((section) => (
              <button
                type="button"
                key={section.key}
                className={`hosting-editor-card ${section.key === activeKey ? "is-active" : ""} ${(("thumbnail" in section) && section.thumbnail) || section.key === "location" || section.key === "host" ? "has-thumbnail" : ""} ${section.key === "host" ? "host-card" : ""} ${editorTab === "arrival" ? "arrival-card" : ""}`}
                onClick={() => { setActiveKey(section.key); setPhotoCategory(null); setSleepingRoom(null); setPricingView("main"); setAvailabilityView("main"); setAdvanceNoticeOpen(false); setDescriptionView(null); setAmenitiesMode("view"); setLocationDetail(null); setHouseRulesDetail(null); setSafetyDetail(null); setCancellationDetail(null); setCheckinDetail(null); }}
              >
                {editorTab === "space" && "thumbnail" in section && section.thumbnail && (
                  <div className="hosting-editor-card-thumb">
                    <img src={section.thumbnail} alt="" />
                    {section.key === "photos" && <span>44 photos</span>}
                  </div>
                )}
                {editorTab === "space" && section.key === "location" && (
                  <div className="hosting-editor-location-thumb" aria-hidden="true">
                    <span className="hosting-editor-location-thumb-pin"><HomeIcon /></span>
                    <span className="hosting-editor-location-thumb-label">BRIGHTON</span>
                    <span className="hosting-editor-location-thumb-water" />
                    <small>Google</small>
                  </div>
                )}
                {editorTab === "arrival" && "icon" in section && section.key !== "arrival-checkin" && <span className="hosting-editor-arrival-card-icon">{section.icon}</span>}
                {editorTab === "arrival" && section.key === "arrival-checkin" && <><strong>Check-in method</strong><div className="hosting-editor-checkin-preview"><strong>Connect your lock for smooth check-ins</strong><span>Guests automatically get door codes</span><span className="hosting-editor-checkin-preview-arrow">›</span></div></>}
                {section.key === "cohosts" && <strong>{section.label}</strong>}
                {section.key === "host" && <strong>{section.label}</strong>}
                {section.key === "host" && (
                  <div className="hosting-editor-host-thumb">
                    <div className="hosting-editor-host-thumb-person">
                      <div className="hosting-editor-host-thumb-photo"><img src={hostPhoto} alt="Obi" /><span className="hosting-editor-host-thumb-badge"><ShieldIcon /></span></div>
                      <strong>Obi</strong>
                      <small><ShieldIcon /> Superhost</small>
                    </div>
                    <div className="hosting-editor-host-thumb-stats">
                      <div><strong>29</strong><small>Reviews</small></div>
                      <div><strong>4.93 <StarIcon /></strong><small>Rating</small></div>
                      <div><strong>1</strong><small>Year hosting</small></div>
                    </div>
                  </div>
                )}
                {section.key === "cohosts" && (
                  <div className="hosting-editor-cohost-preview">
                    <div><img src={faceImage} alt="Obinna Eze" /><span><strong>Obinna Eze (Obi)</strong><small>Listing owner</small></span></div>
                    <div><img src={cohostImage} alt="Chimuanya Eze" /><span><strong>Chimuanya Eze</strong><small>Full access</small></span></div>
                  </div>
                )}
                {section.key !== "host" && section.key !== "cohosts" && !(editorTab === "arrival" && section.key === "arrival-checkin") && <strong>{section.label}</strong>}
                {editorTab === "arrival" ? (
                  section.key === "arrival-taxes" ? <div className="hosting-editor-taxes-preview"><div><CheckIcon /><span>Goods and Services Tax (Saskatchewan)</span></div><div><CheckIcon /><span>Saskatchewan Provincial Sales Tax</span></div></div> : <small>{section.summary}</small>
                ) : section.key === "title" ? (
                  <small>{title}</small>
                ) : section.key === "discounts" ? (
                  <small>{discountPercent}% monthly discount</small>
                ) : section.key === "availability" ? (
                  <>
                    <small>{availability.min} – {availability.max} night stays</small>
                    <small>{availability.advanceNotice} advance notice</small>
                  </>
                ) : section.key === "guests" ? (
                  <small>{guestsCount} guest{guestsCount === 1 ? "" : "s"}</small>
                ) : section.key === "description" ? (
                  <small>{descriptionFields.listing}</small>
                ) : section.key === "amenities" ? (
                  <div className="hosting-editor-amenity-preview">
                    {addedAmenities.slice(0, 3).map((name) => (
                      <div className="hosting-editor-amenity-preview-row" key={name}>
                        <span className="hosting-editor-amenity-preview-icon"><CatalogIcon name={name} /></span>
                        <span>{name}</span>
                      </div>
                    ))}
                    {addedAmenities.length > 3 && <small>+{addedAmenities.length - 3} more</small>}
                  </div>
                ) : section.key === "location" ? (
                  <small>515 Schmeiser Ave, Saskatoon, SK S7V 1P4, Canada</small>
                ) : section.key === "host" ? (
                  <small>Obi · Superhost</small>
                ) : section.key === "rules" ? (
                  <div className="hosting-editor-rules-preview"><div><ClockIcon /><span>Check-in after 3:00 PM</span></div><div><ClockIcon /><span>Checkout before 11:00 AM</span></div><div><UsersIcon /><span>{guestsCount} guests maximum</span></div><small>+7 more</small></div>
                ) : section.key === "safety" ? (
                  <div className="hosting-editor-safety-preview"><div><ShieldIcon /><span>Carbon monoxide alarm installed</span></div><div><ShieldIcon /><span>Smoke alarm installed</span></div><div><CameraIcon /><span>Exterior security camera present</span></div><small>+7 more</small></div>
                ) : section.key === "cancellation" ? (
                  <><small>{shortTermPolicy} for short-term stays</small><small>{longTermPolicy} for long-term stays</small></>
                ) : section.key === "arrival-manual" ? (
                  <><small>{houseManual.split("\n")[0]}</small><small>Door Access: If the door doesn’t open after entering the...</small></>
                ) : (
                  section.summary && <small>{section.summary}</small>
                )}
              </button>
            ))}
          </div>
        </aside>
        <section className="hosting-editor-main">
          <div className="hosting-editor-main-scroll">
          {editorTab === "arrival" && (
            <div className="hosting-editor-arrival-main">
              <h2>{activeArrivalCard.label}</h2>
              <div className={`hosting-editor-arrival-detail ${activeArrivalCard.key === "arrival-checkout" ? "hosting-editor-checkout-detail" : ""}`}>
                <div className="hosting-editor-arrival-detail-icon">{activeArrivalCard.icon}</div>
                {activeArrivalCard.key !== "arrival-manual" && activeArrivalCard.key !== "arrival-taxes" && <h3>{activeArrivalCard.summary}</h3>}
                {activeArrivalCard.key === "arrival-checkin" && (checkinDetail ? <div className="hosting-editor-checkin-subpage"><h3>{checkinDetail === "lock" ? "Add smart lock details" : "Add check-in instructions"}</h3>{checkinDetail === "lock" ? <label className="hosting-editor-door-code-field"><span>Door code</span><input inputMode="numeric" maxLength={8} value={doorCodeDraft} onChange={(event) => setDoorCodeDraft(event.target.value.replace(/\D/g, ""))} placeholder="Enter door code" /></label> : <><p>This info will be shared with guests 24–48 hours before check-in.</p><textarea className="hosting-editor-arrival-textarea" placeholder="Add check-in instructions" /></>}</div> : <><div className="hosting-editor-lock-connect"><KeyIcon /><div><strong>Connect your lock for smooth check-ins</strong><p>Guests automatically get door codes based on the last four digits of their phone number. Codes are only active during the trip.</p><button type="button">Connect</button></div></div><button type="button" className="hosting-editor-arrival-callout" onClick={() => { setDoorCodeDraft(doorCode); setCheckinDetail("lock"); }}><KeyIcon /><span><strong>Smart lock</strong><small>Door code: {doorCode}</small></span><PencilIcon /></button><h3 className="hosting-editor-arrival-subtitle">Check-in instructions</h3><p>Help guests have a smooth arrival. Share tips for how to get inside.</p><button type="button" className="hosting-editor-add-instructions" onClick={() => setCheckinDetail("instructions")}><PlusIcon /> Add instructions</button></>) }
                {activeArrivalCard.key === "arrival-wifi" && <><label className="hosting-editor-field"><span>Network name</span><input defaultValue="Netvileplus" /></label><label className="hosting-editor-field"><span>Password</span><input defaultValue="DaisyInn123@" /></label></>}
                {activeArrivalCard.key === "arrival-checkout" && <><p>Tell guests what to do before they leave.</p><textarea className="hosting-editor-arrival-textarea" placeholder="Add checkout instructions" /></>}
                {activeArrivalCard.key === "arrival-requirements" && <div className="hosting-editor-requirements-page"><h3>Require a profile photo <button type="button" className={`hosting-editor-switch ${requireProfilePhoto ? "is-on" : ""}`} aria-label="Require a profile photo" aria-pressed={requireProfilePhoto} onClick={() => setRequireProfilePhoto((current) => !current)}><i /></button></h3><p>When turned on, guests who book your listing need a profile photo. You&apos;ll only see it after their booking is confirmed. <u>Learn more</u></p><div className="hosting-editor-requirements-list"><strong>All Airbnb guests are required to:</strong><span>• Provide a confirmed email address and phone number</span><span>• Provide payment information</span><span>• Agree to your house rules</span><button type="button">Learn more <ChevIcon /></button></div></div>}
                {activeArrivalCard.key === "arrival-taxes" && <>{taxDetailOpen ? <div className="hosting-editor-tax-detail"><h3>Add a tax</h3><p>You can add one or more taxes to apply to your listing. <u>Learn more</u></p><label className="hosting-editor-tax-field is-required"><span>Tax name</span><CustomSelect value={taxName || "Select"} options={["Goods and Services Tax (Saskatchewan)", "Saskatchewan Provincial Sales Tax", "City tax"]} onChange={setTaxName} ariaLabel="Tax name" /></label><label className="hosting-editor-tax-field"><span>Tax type</span><CustomSelect value={taxType || "Select"} options={["Percentage", "Fixed amount"]} onChange={setTaxType} ariaLabel="Tax type" /></label><label className="hosting-editor-tax-field"><span>Tax rate</span><input value={taxRate} onChange={(event) => setTaxRate(event.target.value)} placeholder="Enter tax rate" /></label><label className="hosting-editor-tax-field"><span>Partial-stay exemption</span><input placeholder="Optional" /></label><label className="hosting-editor-tax-field"><span>Full-stay exemption</span><input placeholder="Optional" /></label><label className="hosting-editor-tax-field"><span>Accommodations tax registration number</span><input placeholder="Tax registration number" /></label><label className="hosting-editor-tax-terms"><input type="checkbox" /> <span>I confirm the tax information is correct and will remit any tax collected.</span></label></div> : <div className="hosting-editor-tax-overview"><p>Airbnb automatically submits some taxes, and you can add other taxes you need to submit.</p><section><strong>Taxes Airbnb submits</strong><small>We&apos;ll collect these taxes from guests on your behalf and submit payment to the designated tax authority. <u>Learn more</u></small><span><CheckIcon /> Goods and Services Tax (Saskatchewan)</span><span><CheckIcon /> Saskatchewan Provincial Sales Tax</span></section><section><strong>Add taxes you&apos;ll submit</strong><small>We&apos;ll collect these taxes from guests on your behalf and pass the funds on to you. You must submit payment to the correct tax authority. <u>Learn more</u></small><button type="button" onClick={() => setTaxDetailOpen(true)}>Add a tax</button></section></div>}</>}
                {activeArrivalCard.key === "arrival-manual" && <><small className="hosting-editor-shared-note"><ClockIcon /> Shared 24–48 hours before check-in</small><label className="hosting-editor-field"><span>House manual</span><textarea className="hosting-editor-arrival-textarea hosting-editor-manual-textarea" value={houseManual} onChange={(event) => setHouseManual(event.target.value)} /></label></>}
              </div>
            </div>
          )}
          {editorTab === "space" && <>
          {activeSection.kind === "photos" && (
            <div className="hosting-editor-photos">
              <div className="hosting-editor-main-header">
                <div>
                  <h2>{photoCategory || "Photo tour"}</h2>
                  {!photoCategory && <p>Manage photos and add details. Guests will only see your tour if every room has a photo.</p>}
                </div>
                <div className="hosting-editor-main-header-actions">
                  <button type="button" className="hosting-editor-pill" onClick={() => setPhotoCategory(null)}><ImageIcon /> All photos</button>
                  <button type="button" className="hosting-editor-icon-button" aria-label="Add photos"><PlusIcon /></button>
                </div>
              </div>
              {photoCategory ? (
                <div className="hosting-editor-category-gallery">
                  <button type="button" className="hosting-editor-gallery-back" onClick={() => setPhotoCategory(null)}><ArrowLeftIcon /> All photos</button>
                  <h3>{photoCategory}</h3>
                  <div className="hosting-editor-photo-grid">{Array.from({ length: photoRooms.find((room) => room.label === photoCategory)?.count || 0 }, (_, index) => { const room = photoRooms.find((item) => item.label === photoCategory) || photoRooms[0]; return <div className="hosting-editor-gallery-photo" key={`${room.label}-${index}`}><img src={`${room.photo}&sig=${index}`} alt={`${room.label} photo ${index + 1}`} /><small>{index + 1} of {room.count}</small></div>; })}</div>
                </div>
              ) : <div className="hosting-editor-photo-grid">
                {photoRooms.map((room) => (
                  <button type="button" className="hosting-editor-photo-tile" key={room.label} onClick={() => setPhotoCategory(room.label)}>
                    <img src={room.photo} alt="" />
                    <strong>{room.label}</strong>
                    <span>{room.count} photo{room.count === 1 ? "" : "s"}</span>
                  </button>
                ))}
              </div>}
            </div>
          )}

          {activeSection.kind === "property-type" && (
            <div className="hosting-editor-form">
              <h2>Property type</h2>
              <label className="hosting-editor-field">
                <span>Which is most like your place?</span>
                <CustomSelect
                  value={placeType}
                  options={["Secondary unit", "Guest house", "Basement suite", "In-law suite"]}
                  onChange={setPlaceType}
                  ariaLabel="Which is most like your place?"
                />
              </label>
              <label className="hosting-editor-field">
                <span>Property type</span>
                <CustomSelect
                  value={propertyTypeValue}
                  options={["Guest suite", "Apartment", "House", "Condo", "Townhouse"]}
                  onChange={setPropertyTypeValue}
                  ariaLabel="Property type"
                />
                <small>A space with a private entrance inside of or attached to a larger structure.</small>
              </label>
              <label className="hosting-editor-field">
                <span>Listing type</span>
                <CustomSelect
                  value={listingType}
                  options={["Entire place", "Private room", "Shared room"]}
                  onChange={setListingType}
                  ariaLabel="Listing type"
                />
                <small>Guests have the whole place to themselves. This usually includes a bedroom, a bathroom, and a kitchen.</small>
              </label>
              <div className="hosting-editor-counter-row">
                <span>How many floors in the building?</span>
                <div className="hosting-editor-counter"><button type="button" aria-label="Decrease">−</button><strong>1</strong><button type="button" aria-label="Increase">+</button></div>
              </div>
              <div className="hosting-editor-counter-row">
                <span>Which floor is the listing on?</span>
                <div className="hosting-editor-counter"><button type="button" aria-label="Decrease">−</button><strong>1</strong><button type="button" aria-label="Increase">+</button></div>
              </div>
              <label className="hosting-editor-field">
                <span>Year built</span>
                <input className="hosting-editor-title-input" defaultValue="2023" />
              </label>
              <div className="hosting-editor-field-row">
                <label className="hosting-editor-field">
                  <span>Property size</span>
                  <input className="hosting-editor-title-input" placeholder="0" />
                </label>
                <label className="hosting-editor-field">
                  <span>&nbsp;</span>
                  <CustomSelect value={sizeUnit} options={["Unit", "sq ft", "sq m"]} onChange={setSizeUnit} ariaLabel="Property size unit" />
                </label>
              </div>
              <small className="hosting-editor-hint">The amount of indoor space that's available to guests.</small>
            </div>
          )}

          {activeSection.kind === "pricing" && pricingView === "main" && (
            <div className="hosting-editor-form">
              <h2>Pricing</h2>
              <p>These settings apply to all nights, unless you customize them by date. <a href="#">Learn more</a></p>
              <button type="button" className="hosting-editor-price-box" onClick={() => setPricingView("smart")}>
                <span>${priceRange.min} CAD – ${priceRange.max} CAD</span>
              </button>
              <div className="hosting-editor-toggle-row">
                <div>
                  <strong>Smart Pricing</strong>
                  <span>Your prices will be automatically adjusted based on guest demand.</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={smartPricing}
                  className={`hosting-editor-switch ${smartPricing ? "is-on" : ""}`}
                  onClick={() => setSmartPricing((current) => !current)}
                >
                  <span>{smartPricing && <CheckIcon />}</span>
                </button>
              </div>
              <button type="button" className="hosting-editor-callout-link">
                <ExternalLinkIcon /> Find more discounts and fees in the calendar
              </button>
            </div>
          )}

          {activeSection.kind === "pricing" && pricingView === "smart" && (
            <div className="hosting-editor-form">
              <h2>Smart Pricing</h2>
              <p>Smart Pricing automatically adjusts your price based on demand. You set the price range and can change your price any time. <a href="#">Learn more</a></p>
              <div className="hosting-editor-price-detail">
                <label className="hosting-editor-price-field">
                  <span>Minimum nightly price*</span>
                  <div>
                    <b>$</b>
                    <input
                      value={priceRange.min}
                      inputMode="numeric"
                      onChange={(event) => setPriceRange((current) => ({ ...current, min: formatAmount(event.target.value) }))}
                    />
                  </div>
                </label>
                <label className="hosting-editor-price-field">
                  <span>Maximum nightly price</span>
                  <div>
                    <b>$</b>
                    <input
                      value={priceRange.max}
                      inputMode="numeric"
                      onChange={(event) => setPriceRange((current) => ({ ...current, max: formatAmount(event.target.value) }))}
                    />
                  </div>
                </label>
              </div>
              <small className="hosting-editor-hint">*The price the guest sees could be lower than the minimum nightly price you set if you have discounts or promotions.</small>
            </div>
          )}

          {activeSection.kind === "discount" && (() => {
            const avgNightly = (Number(priceRange.min.replace(/,/g, "")) + Number(priceRange.max.replace(/,/g, ""))) / 2 || 0;
            const weeklyAverage = Math.round(avgNightly * 90 * (1 - Number(weeklyDiscount || 0) / 100)).toLocaleString("en-US");
            const monthlyAverage = Math.round(avgNightly * 180 * (1 - Number(discountPercent || 0) / 100)).toLocaleString("en-US");
            return (
              <div className="hosting-editor-form">
                <h2>Discounts</h2>
                <div className="hosting-editor-discount-card">
                  <div className="hosting-editor-discount-card-head">
                    <span>Quarterly</span> · For 90 nights or more
                  </div>
                  <div className="hosting-editor-discount-card-body">
                    <div className="hosting-editor-discount-value">
                      <input
                        value={weeklyDiscount}
                        inputMode="numeric"
                        maxLength={2}
                        onChange={(event) => setWeeklyDiscount(event.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                      />
                      <span>%</span>
                    </div>
                    <small>{"Quarterly average is $" + weeklyAverage + " CAD"}</small>
                  </div>
                </div>
                <div className="hosting-editor-discount-card">
                  <div className="hosting-editor-discount-card-head">
                    <span>Bi-Yearly</span> · For 180 nights or more
                  </div>
                  <div className="hosting-editor-discount-card-body">
                    <div className="hosting-editor-discount-value">
                      <input
                        value={discountPercent}
                        inputMode="numeric"
                        maxLength={2}
                        onChange={(event) => setDiscountPercent(event.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                      />
                      <span>%</span>
                    </div>
                    <small>{"Monthly average is $" + monthlyAverage + " CAD"}</small>
                  </div>
                </div>
                <button type="button" className="hosting-editor-callout-link">
                  <ExternalLinkIcon /> Find more discounts and fees in the calendar
                </button>
              </div>
            );
          })()}

          {activeSection.kind === "availability" && availabilityView === "main" && (
            <div className="hosting-editor-form">
              <h2>Availability</h2>
              <p>These settings apply to all nights, unless you customize them by date.</p>
              <button type="button" className="hosting-editor-avail-card" onClick={() => setAvailabilityView("min")}>
                <span>Minimum nights</span>
                <strong>{availability.min}</strong>
              </button>
              <button type="button" className="hosting-editor-avail-card" onClick={() => setAvailabilityView("max")}>
                <span>Maximum nights</span>
                <strong>{availability.max}</strong>
              </button>
              <div className="hosting-editor-avail-card-wrap">
                <button type="button" className="hosting-editor-avail-card" onClick={() => setAdvanceNoticeOpen((current) => !current)}>
                  <span>Advance notice</span>
                  <strong className="is-regular">{availability.advanceNotice}</strong>
                </button>
                {advanceNoticeOpen && (
                  <div className="hosting-editor-advance-panel">
                    <strong>Advance notice</strong>
                    <p>How much notice do you need between a guest&apos;s booking and their arrival?</p>
                    <ul className="hosting-editor-advance-list">
                      {advanceNoticeOptions.map((option) => (
                        <li key={option}>
                          <button
                            type="button"
                            className={option === availability.advanceNotice ? "is-selected" : ""}
                            onClick={() => setAvailability((current) => ({ ...current, advanceNotice: option }))}
                          >
                            <span>{option}</span>
                            {option === availability.advanceNotice && <CheckIcon />}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="hosting-editor-toggle-row">
                      <div>
                        <strong>Allow requests for the same day</strong>
                        <span>You&apos;ll review and approve each reservation request.</span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={allowSameDay}
                        className={`hosting-editor-switch ${allowSameDay ? "is-on" : ""}`}
                        onClick={() => setAllowSameDay((current) => !current)}
                      >
                        <span>{allowSameDay && <CheckIcon />}</span>
                      </button>
                    </div>
                    <button type="button" className="hosting-editor-save hosting-editor-advance-save" onClick={() => setAdvanceNoticeOpen(false)}>Save</button>
                  </div>
                )}
              </div>
              <div className="hosting-editor-avail-card is-static">
                <span>Same day advance notice</span>
                <strong className="is-regular">{availability.sameDayTime}</strong>
              </div>
              <button type="button" className="hosting-editor-callout-link">
                <ExternalLinkIcon /> Find more availability settings like these in the calendar
              </button>
            </div>
          )}

          {activeSection.kind === "availability" && availabilityView !== "main" && (
            <div className="hosting-editor-form">
              <h2>{availabilityView === "min" ? "Minimum nights" : "Maximum nights"}</h2>
              <p>Per stay</p>
              <div className="hosting-editor-avail-big">
                <input
                  value={availability[availabilityView]}
                  inputMode="numeric"
                  onChange={(event) => {
                    const digits = event.target.value.replace(/[^0-9]/g, "");
                    setAvailability((current) => ({ ...current, [availabilityView]: digits }));
                  }}
                />
              </div>
              <button type="button" className="hosting-editor-avail-customize">
                Customize by check-in day <ChevIcon />
              </button>
            </div>
          )}

          {activeSection.kind === "guests" && (
            <div className="hosting-editor-form hosting-editor-guests">
              <div className="hosting-editor-guests-illustration"><GuestFigures /></div>
              <p>How many guests can fit comfortably in your space?</p>
              <div className="hosting-editor-guests-counter">
                <button type="button" aria-label="Decrease guests" disabled={guestsCount <= 1} onClick={() => setGuestsCount((current) => Math.max(1, current - 1))}>−</button>
                <strong>{guestsCount}</strong>
                <button type="button" aria-label="Increase guests" onClick={() => setGuestsCount((current) => current + 1)}>+</button>
              </div>
            </div>
          )}

          {activeSection.kind === "description" && !descriptionView && (
            <div className="hosting-editor-form">
              <h2>Description</h2>
              <div className="hosting-editor-desc-list">
                {descriptionItems.map((item) => (
                  <button type="button" className="hosting-editor-desc-row" key={item.key} onClick={() => setDescriptionView(item.key)}>
                    <div>
                      <strong>{item.label}</strong>
                      <span>{descriptionFields[item.key] ? descriptionFields[item.key] : "Add details"}</span>
                    </div>
                    <ChevIcon />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection.kind === "description" && descriptionView && (() => {
            const item = descriptionItems.find((entry) => entry.key === descriptionView);
            if (!item) return null;
            const value = descriptionFields[descriptionView] || "";
            return (
              <div className="hosting-editor-form">
                <h2>{item.label}</h2>
                {item.hint && <p>{item.hint}</p>}
                {item.maxLength && <small className="hosting-editor-desc-count">{value.length}/{item.maxLength} available</small>}
                {item.isInput ? (
                  <input
                    className="hosting-editor-title-input"
                    value={value}
                    onChange={(event) => setDescriptionFields((current) => ({ ...current, [descriptionView]: event.target.value }))}
                  />
                ) : (
                  <textarea
                    className="hosting-editor-desc-textarea"
                    value={value}
                    maxLength={item.maxLength}
                    rows={7}
                    onChange={(event) => setDescriptionFields((current) => ({ ...current, [descriptionView]: event.target.value }))}
                  />
                )}
              </div>
            );
          })()}

          {activeSection.kind === "amenities" && amenitiesMode !== "add" && (
            <div className="hosting-editor-form hosting-editor-amenities-form">
              <div className="hosting-editor-main-header">
                <h2>Amenities</h2>
                <div className="hosting-editor-main-header-actions">
                  {amenitiesMode === "view" ? (
                    <>
                      <button type="button" className="hosting-editor-pill" onClick={() => setAmenitiesMode("edit")}>Edit</button>
                      <button type="button" className="hosting-editor-icon-button" aria-label="Add amenities" onClick={() => setAmenitiesMode("add")}><PlusIcon /></button>
                    </>
                  ) : (
                    <button type="button" className="hosting-editor-pill" onClick={() => setAmenitiesMode("view")}>Done</button>
                  )}
                </div>
              </div>
              {amenitiesMode === "view" && <p>You&apos;ve added these to your listing so far.</p>}
              <div className="hosting-editor-amenities-list">
                {addedAmenities.map((name) => {
                  const item = amenityCatalog.find((entry) => entry.name === name);
                  return (
                    <div className="hosting-editor-amenity-row" key={name}>
                      {amenitiesMode === "edit" ? (
                        <button type="button" className="hosting-editor-amenity-remove" aria-label={`Remove ${name}`} onClick={() => toggleAmenity(name)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                      ) : (
                        <span className="hosting-editor-amenity-icon"><CatalogIcon name={name} /></span>
                      )}
                      <div>
                        <strong>{name}</strong>
                        {item?.description && <span>{item.description}</span>}
                      </div>
                      {amenitiesMode === "edit" && item?.description && (
                        <button type="button" className="hosting-editor-amenity-edit" aria-label={`Edit ${name} description`}><PencilIcon /></button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection.kind === "amenities" && amenitiesMode === "add" && (
            <div className="hosting-editor-form hosting-editor-amenities-add">
              <div className="hosting-editor-main-header">
                <h2>Add amenities</h2>
                <button type="button" className="hosting-editor-icon-button" aria-label="Search amenities"><SearchIcon /></button>
              </div>
              <div className="hosting-editor-amenity-categories">
                {amenityCategories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    className={category === amenityCategory ? "is-active" : ""}
                    onClick={() => setAmenityCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="hosting-editor-amenities-list">
                {amenityCatalog
                  .filter((item) => amenityCategory === "All" || item.category === amenityCategory)
                  .map((item) => {
                    const added = addedAmenities.includes(item.name);
                    return (
                      <div className="hosting-editor-amenity-row" key={item.name}>
                        <span className="hosting-editor-amenity-icon"><CatalogIcon name={item.name} /></span>
                        <div>
                          <strong>{item.name}</strong>
                          {item.description && <span>{item.description}</span>}
                        </div>
                        <button
                          type="button"
                          className={`hosting-editor-amenity-toggle ${added ? "is-added" : ""}`}
                          aria-label={added ? `Remove ${item.name}` : `Add ${item.name}`}
                          onClick={() => toggleAmenity(item.name)}
                        >
                          {added ? <CheckIcon /> : <PlusIcon />}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {activeSection.kind === "sleeping" && !sleepingRoom && (
            <div className="hosting-editor-form">
              <h2>Add sleeping arrangements</h2>
              <p>Make it clear to guests which type of bed is in each room.</p>
              <div className="hosting-editor-sleeping-list">
                {sleepingRooms.map((room) => {
                  const counts = bedCounts[room.key] || {};
                  const summary = Object.entries(counts).filter(([, count]) => count > 0);
                  return (
                    <button type="button" className="hosting-editor-sleeping-card" key={room.key} onClick={() => setSleepingRoom(room.key)}>
                      <img src={roomPhotos[room.key]} alt="" />
                      <div>
                        <strong>{room.label}</strong>
                        <span>{summary.length === 0 ? "Add details" : summary.map(([bedType, count]) => `${count} ${bedType.toLowerCase()} bed${count > 1 ? "s" : ""}`).join(", ")}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection.kind === "sleeping" && sleepingRoom && (() => {
            const room = sleepingRooms.find((item) => item.key === sleepingRoom);
            if (!room) return null;
            const counts = bedCounts[room.key] || {};
            return (
              <div className="hosting-editor-form">
                <h2>{room.label}</h2>
                <div className="hosting-editor-room-photo">
                  <img src={roomPhotos[room.key]} alt="" />
                  <label className="hosting-editor-room-photo-edit" aria-label="Update photo">
                    <PencilIcon />
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { changeRoomPhoto(room.key, event.target.files); event.target.value = ""; }} />
                  </label>
                </div>
                <h3 className="hosting-editor-subheading">Choose bed types</h3>
                <div className="hosting-editor-bed-list">
                  {bedTypes.map((bedType) => (
                    <div className="hosting-editor-bed-row" key={bedType}>
                      <span className="hosting-editor-bed-icon"><BedTypeIcon type={bedType} /></span>
                      <span className="hosting-editor-bed-label">{bedType}</span>
                      <div className="hosting-editor-counter">
                        <button type="button" aria-label={`Decrease ${bedType}`} disabled={(counts[bedType] || 0) === 0} onClick={() => changeBedCount(room.key, bedType, -1)}>−</button>
                        <strong>{counts[bedType] || 0}</strong>
                        <button type="button" aria-label={`Increase ${bedType}`} onClick={() => changeBedCount(room.key, bedType, 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {activeSection.kind === "text" && activeSection.key === "title" && (
            <div className="hosting-editor-form">
              <h2>Title</h2>
              <label className="hosting-editor-field">
                <span>Listing title</span>
                <input className="hosting-editor-title-input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Daisy's Inn" maxLength={50} />
                <small>{title.length}/50</small>
              </label>
            </div>
          )}

          {activeSection.kind === "text" && activeSection.key === "booking" && (
            <div className="hosting-editor-booking-form">
              <h2>Booking settings</h2>
              <div ref={instantBookRef} className={`hosting-editor-booking-primary ${instantBook ? "is-on" : ""}`} role="button" tabIndex={0} onClick={() => setInstantBook(true)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setInstantBook(true); }}>
                <div className="hosting-editor-booking-primary-head"><div><strong>Use Instant Book</strong><p>Let guests book automatically, which can help you get more bookings.</p></div><span className="hosting-editor-booking-symbol">ϟ</span></div>
                <div className="hosting-editor-booking-option"><span><strong>Require a good track record</strong><small>Only allow guests who have stayed on Airbnb without issues. <u>Learn more</u></small></span><button type="button" className={`hosting-editor-switch ${trackRecord ? "is-on" : ""}`} aria-label="Require a good track record" aria-pressed={trackRecord} onClick={(event) => { event.stopPropagation(); setTrackRecord((current) => !current); }}><i /></button></div>
                <button type="button" className="hosting-editor-booking-message" onClick={() => setBookingMessageOpen((current) => !current)}><span><strong>Pre-booking message</strong><small>{preBookingMessage}</small></span><ChevIcon /></button>
                {bookingMessageOpen && <div className="hosting-editor-booking-message-editor"><textarea value={preBookingMessage} onChange={(event) => setPreBookingMessage(event.target.value)} maxLength={500} /><small>{preBookingMessage.length}/500 characters</small></div>}
              </div>
              <button ref={approvalRef} type="button" className={`hosting-editor-booking-approval ${!instantBook ? "is-active" : ""}`} onClick={() => setInstantBook(false)}><span><strong>Approve all bookings</strong><small>Always review reservation requests.</small></span><MessageSquareIcon /></button>
            </div>
          )}

          {activeSection.kind === "text" && activeSection.key !== "title" && activeSection.key !== "booking" && activeSection.key !== "cancellation" && (
            <div className="hosting-editor-form">
              <h2>{activeSection.label}</h2>
              <p>{activeSection.summary}</p>
              {activeSection.summary2 && <p>{activeSection.summary2}</p>}
            </div>
          )}

          {activeSection.kind === "list" && activeSection.key === "rules" && !houseRulesDetail && (
            <div className="hosting-editor-house-rules-form"><h2>House rules</h2>
              <div className="hosting-editor-rule-toggle-row"><span>Quiet hours</span><div><button type="button" className={`hosting-editor-rule-choice ${!quietHours ? "is-selected" : ""}`} onClick={() => setQuietHours(false)} aria-label="Quiet hours not allowed">×</button><button type="button" className={`hosting-editor-rule-choice is-yes ${quietHours ? "is-selected" : ""}`} onClick={() => setQuietHours(true)} aria-label="Quiet hours allowed">✓</button></div></div>
              {quietHours && <div className="hosting-editor-quiet-hours"><label>Start time<CustomSelect value={quietStart} options={timeOptions} onChange={setQuietStart} ariaLabel="Quiet hours start time" /></label><label>End time<CustomSelect value={quietEnd} options={timeOptions} onChange={setQuietEnd} ariaLabel="Quiet hours end time" /></label></div>}
              <div className="hosting-editor-rule-toggle-row"><span>Commercial photography and filming allowed</span><div><button type="button" className={`hosting-editor-rule-choice ${!commercialPhotography ? "is-selected" : ""}`} onClick={() => setCommercialPhotography(false)} aria-label="Commercial photography not allowed">×</button><button type="button" className={`hosting-editor-rule-choice is-yes ${commercialPhotography ? "is-selected" : ""}`} onClick={() => setCommercialPhotography(true)} aria-label="Commercial photography allowed">✓</button></div></div>
              <div className="hosting-editor-rule-counter"><span>Number of guests</span><div><button type="button" onClick={() => setGuestsCount((count) => Math.max(1, count - 1))} aria-label="Decrease guests">−</button><strong>{guestsCount}</strong><button type="button" onClick={() => setGuestsCount((count) => count + 1)} aria-label="Increase guests">+</button></div></div>
              <button type="button" className="hosting-editor-rule-detail-row" onClick={() => setHouseRulesDetail("times")}><span><strong>Check-in and checkout times</strong><small>Arrive between 3:00 PM - 11:00 PM<br />Leave before 11:00 AM</small></span><ChevIcon /></button>
              <button type="button" className="hosting-editor-rule-detail-row additional" onClick={() => setHouseRulesDetail("additional")}><span><strong>Additional rules</strong><small>{houseRuleText}</small></span><ChevIcon /></button>
            </div>
          )}

          {activeSection.kind === "list" && activeSection.key === "rules" && houseRulesDetail === "times" && (
            <div className="hosting-editor-house-rules-detail"><h2>Check-in and checkout times</h2><div className="hosting-editor-time-label">Check-in window<div className="hosting-editor-time-fields"><label>Start time<CustomSelect value={checkInStart} options={timeOptions} onChange={setCheckInStart} ariaLabel="Start time" /></label><label>End time<CustomSelect value={checkInEnd} options={timeOptions} onChange={setCheckInEnd} ariaLabel="End time" /></label></div></div><div className="hosting-editor-time-label">Checkout<CustomSelect value={checkoutTime} options={timeOptions} onChange={setCheckoutTime} ariaLabel="Checkout time" /></div></div>
          )}

          {activeSection.kind === "list" && activeSection.key === "rules" && houseRulesDetail === "additional" && (
            <div className="hosting-editor-house-rules-detail"><h2>Additional rules</h2><textarea className="hosting-editor-house-rules-textarea" value={houseRuleText} onChange={(event) => setHouseRuleText(event.target.value)} /><small>{houseRuleText.length}/5000 characters</small></div>
          )}

          {activeSection.key === "safety" && (
            <div className="hosting-editor-safety-layout"><div className="hosting-editor-safety-overview"><h2>Guest safety</h2><p>The safety details you share will appear on your listing, along with information like your House Rules.</p><button type="button" className={safetyDetail === "considerations" ? "is-active" : ""} onClick={() => setSafetyDetail("considerations")}><span><strong>Safety considerations</strong><small>Add details</small></span><ChevIcon /></button><button type="button" className={safetyDetail === "devices" ? "is-active" : ""} onClick={() => setSafetyDetail("devices")}><span><strong>Safety devices</strong><small>Exterior security camera present<br />Carbon monoxide alarm<br />Smoke alarm</small></span><ChevIcon /></button><button type="button" className={safetyDetail === "property" ? "is-active" : ""} onClick={() => setSafetyDetail("property")}><span><strong>Property info</strong><small>Add details</small></span><ChevIcon /></button></div>{safetyDetail && <div className="hosting-editor-safety-detail"><h2>{safetyDetail === "considerations" ? "Safety considerations" : safetyDetail === "devices" ? "Safety devices" : "Property info"}</h2>{(safetyDetail === "considerations" ? ["Not a good fit for children 2 – 12", "Not a good fit for infants under 2", "Pool or hot tub doesn’t have a gate or lock", "Nearby water, like a lake or river", "Climbing or play structure(s) on the property"] : safetyDetail === "devices" ? ["Exterior security camera present", "Noise decibel monitor present", "Carbon monoxide alarm", "Smoke alarm"] : ["Smoking allowed", "Pets allowed", "Parking available"]).map((item) => { const choice = safetyChoices[item] || "yes"; return <div className="hosting-editor-safety-option" key={item}><span><strong>{item}</strong><small>Guests should know about this feature or consideration before booking.</small></span><div><button type="button" className={choice === "no" ? "is-selected" : ""} aria-label={`Not ${item}`} onClick={() => setSafetyChoice(item, "no")}>×</button><button type="button" className={choice === "yes" ? "is-selected" : ""} aria-label={`Yes ${item}`} onClick={() => setSafetyChoice(item, "yes")}>✓</button></div></div>; })}</div>}</div>
          )}

          {activeSection.key === "cancellation" && !cancellationDetail && (
            <div className="hosting-editor-cancellation-form"><h2>Cancellation policy</h2><button type="button" className="hosting-editor-cancellation-card" onClick={() => setCancellationDetail("lastMinute")}><span><strong>Short-term stays</strong><small>For less than 28 nights</small><b>{shortTermPolicy}</b></span><span className="hosting-editor-cancellation-card-link">Add a policy for last-minute bookings <ChevIcon /></span></button><button type="button" className="hosting-editor-cancellation-card" onClick={() => setCancellationDetail("longTerm")}><span><strong>Long-term stays</strong><small>For 28 nights or more</small><b>{longTermPolicy}</b></span></button><p className="hosting-editor-cancellation-help">All standard stay policies include a 24-hour free cancellation period. Review the full policies in the <u>Help Center</u>.</p></div>
          )}

          {activeSection.key === "cancellation" && cancellationDetail && (
            <div className="hosting-editor-cancellation-detail"><h2>{cancellationDetail === "lastMinute" ? "Last-minute bookings" : "Long-term stays"}</h2><small>{cancellationDetail === "lastMinute" ? "0 – 14 days before arrival" : "For 28 nights or more"}</small><div className="hosting-editor-policy-options">{(cancellationDetail === "lastMinute" ? [["Flexible", "Full refund at least 1 day before check-in", "Partial refund within 1 day of check-in"], ["Moderate", "Full refund at least 5 days before check-in", "Partial refund within 5 days of check-in"], ["Limited", "Full refund at least 14 days before check-in", "Partial refund 7–14 days before check-in"]] : [["Firm Long Term", "Full refund up to 30 days before check-in", "After that, the first 30 days of the stay are non-refundable"], ["Strict Long Term", "Full refund if canceled within 48 hours of booking and at least 28 days before check-in", "After that, the first 30 days of the stay are non-refundable"]]).map(([name, line1, line2]) => <button type="button" key={name} className={(cancellationDetail === "lastMinute" ? shortTermPolicy : longTermPolicy) === name ? "is-selected" : ""} onClick={() => cancellationDetail === "lastMinute" ? setShortTermPolicy(name) : setLongTermPolicy(name)}><strong>{name}</strong><small>• {line1}<br />• {line2}</small></button>)}</div></div>
          )}

          {activeSection.kind === "list" && activeSection.key !== "cohosts" && activeSection.key !== "rules" && activeSection.key !== "safety" && (
            <div className="hosting-editor-form">
              <h2>{activeSection.label}</h2>
              <div className="hosting-editor-list">
                {(listContent[activeSection.key] || []).map((item) => (
                  <div className="hosting-editor-list-row" key={item.label}>
                    {item.image ? <img src={item.image} alt="" /> : <span className="hosting-editor-list-icon">{item.icon}</span>}
                    <div><strong>{item.label}</strong>{item.sub && <span>{item.sub}</span>}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection.key === "cohosts" && (
            <div className="hosting-editor-cohosts-layout">
              <div className="hosting-editor-cohosts-overview"><h2>Co-hosts</h2><div className="hosting-editor-cohost-cards">
                <button type="button" className={`hosting-editor-cohost-card ${selectedCohost === "primary" && cohostView === "detail" ? "is-active" : ""}`} onClick={() => { setSelectedCohost("primary"); setCohostView("detail"); }}><img src={faceImage} alt="Obinna Eze" /><small>Primary Host</small><strong>Obinna Eze (Obi)</strong><span>Listing owner</span></button>
                <button type="button" className={`hosting-editor-cohost-card ${selectedCohost === "chimuanya" && cohostView === "detail" ? "is-active" : ""}`} onClick={() => { setSelectedCohost("chimuanya"); setCohostView("detail"); }}><img src={cohostImage} alt="Chimuanya Eze" /><strong>Chimuanya Eze</strong><span>Full access</span></button>
                <button type="button" className={`hosting-editor-cohost-card hosting-editor-cohost-add-card ${cohostView === "add" ? "is-active" : ""}`} onClick={() => setCohostView("add")}><i><PlusIcon /></i><strong>Add a co-host</strong></button>
              </div><a href="#feedback">Give feedback</a></div>
              {cohostView === "detail" && <div className="hosting-editor-cohost-detail"><img src={selectedCohost === "primary" ? faceImage : cohostImage} alt="Selected co-host" /><small>Primary Host</small><h2>{selectedCohost === "primary" ? "Obinna Eze (Obi)" : "Chimuanya Eze"}</h2><u>{selectedCohost === "primary" ? "hobinnnah@yahoo.com · +1 306-280-0753" : "chimuanya@example.com"}</u><h3>Permissions</h3><div className="hosting-editor-cohost-detail-row"><strong>{selectedCohost === "primary" ? "Listing owner" : "Full access"}</strong><span>Access to all hosting tools and payouts setup.</span></div><h3>{selectedCohost === "primary" ? "Primary Host" : "Activity log"}</h3><div className="hosting-editor-cohost-detail-row"><strong>{selectedCohost === "primary" ? "Yes" : "Your activity"}</strong><span>View and manage this co-host&apos;s listing access.</span></div></div>}
              {cohostView === "add" && <div className="hosting-editor-cohost-detail"><h2>Add a co-host</h2><button type="button" className="hosting-editor-cohost-option" onClick={() => { setInviteStep(1); setInviteDialogOpen(true); }}><MailIcon /><strong>Invite someone you know</strong><span>Text or email them an invitation to help.</span></button><button type="button" className="hosting-editor-cohost-option"><SearchIcon /><strong>Find someone to help</strong><span>Hire a high-quality, local host.</span></button></div>}
            </div>
          )}

          {activeSection.kind === "map" && (
            <div className="hosting-editor-location-layout">
              <div className="hosting-editor-location-overview">
                <h2>Location</h2>
                <div className="hosting-editor-map">
                  <span className="hosting-editor-map-label label-brighton">BRIGHTON</span>
                  <span className="hosting-editor-map-label label-blvd">Brighton Blvd</span>
                  <span className="hosting-editor-map-label label-street">Taskamawa St</span>
                  <span className="hosting-editor-map-pin"><HomeIcon /></span>
                  <button type="button" className="hosting-editor-map-adjust">Adjust</button>
                  <div className="hosting-editor-map-zoom"><button type="button" aria-label="Zoom in">+</button><button type="button" aria-label="Zoom out">−</button></div>
                  <small>Google</small>
                </div>
                <button type="button" className="hosting-editor-location-verify"><span><strong>Verify your listing&apos;s location</strong><small>Take a few photos or short videos that guests won&apos;t see.</small></span><ChevIcon /></button>
                {[
                  ["address", "Address", "515 Schmeiser Ave, Saskatoon, SK S7V 1P4, Canada"],
                  ["features", "Location sharing", "Show listing's specific location"],
                  ["features", "Location features", locationFeatures.join(", ") || "Add details"],
                  ["neighborhood", "Neighborhood description", "Add details"],
                  ["gettingAround", "Getting around", "Add details"],
                  ["scenicViews", "Scenic views", "Add details"],
                ].map(([detail, label, summary]) => {
                  const detailKey = detail === "features" && label === "Location sharing" ? null : detail as typeof locationDetail;
                  return <button type="button" className={`hosting-editor-location-row ${locationDetail === detailKey && detailKey ? "is-active" : ""}`} key={label} onClick={() => detailKey && setLocationDetail(detailKey)}><span><strong>{label}</strong><small>{summary}</small></span><ChevIcon /></button>;
                })}
              </div>
              {locationDetail && (
                <div className="hosting-editor-location-detail">
                  {locationDetail === "address" && <><h2>Address</h2><div className="hosting-editor-address-fields"><label>Street address<input defaultValue="515 Schmeiser Avenue" /></label><label>Apt, suite, unit (if applicable)<input /></label><label>City / municipality<input defaultValue="Saskatoon" /></label><label>Province / territory<input defaultValue="SK" /></label><label>Postal code<input defaultValue="S7V 1P4" /></label></div></>}
                  {locationDetail === "features" && <><h2>Location features</h2><div className="hosting-editor-location-options">{["Beach access", "Lake access", "Laundromat nearby", "Private entrance", "Resort access", "Ski-in/Ski-out", "Waterfront"].map((item) => <label key={item}><span><strong>{item}</strong><small>{item === "Private entrance" ? "An entrance that's only available to guests" : `Guests can access ${item.toLowerCase()}`}</small></span><input type="checkbox" checked={locationFeatures.includes(item)} onChange={() => setLocationFeatures((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])} /><i /></label>)}</div></>}
                  {locationDetail === "neighborhood" && <><h2>Neighborhood description</h2><p>Share some highlights about the neighborhood.</p><textarea className="hosting-editor-location-textarea" placeholder="Tell guests about the neighborhood" /></>}
                  {locationDetail === "gettingAround" && <><h2>Getting around</h2><p>Let guests know how they can get around the neighborhood and what parking is like.</p><textarea className="hosting-editor-location-textarea" placeholder="Add details about getting around" /></>}
                  {locationDetail === "scenicViews" && <><h2>Scenic views</h2><div className="hosting-editor-location-checks">{["Bay view", "Beach view", "Canal view", "City skyline view", "Courtyard view", "Desert view", "Garden view", "Golf course view", "Harbor view", "Lake view", "Marina view", "Mountain view"].map((item) => <label key={item}>{item}<input type="checkbox" /><i /></label>)}</div></>}
                </div>
              )}
            </div>
          )}

          {activeSection.kind === "host" && (
            <div className="hosting-editor-form hosting-editor-host-form">
              <h2>About the host</h2>
              <div className="hosting-editor-host-profile">
                <div className="hosting-editor-host-profile-photo"><img src={hostPhoto} alt="Obi" /><button type="button" aria-label="Edit host photo" onClick={() => { setHostPhotoDraft(hostPhoto); setHostPhotoDialogOpen(true); }}><CameraIcon /> Edit</button></div>
                <p>Hosts and guests can see your profile and it may appear across Airbnb to help us build trust in our community. <u>Learn more</u></p>
                <div className="hosting-editor-host-facts">
                  {hostFactItems.map((item) => {
                    const value = hostFacts[item.key];
                    const text = value ? `${item.label}: ${value}` : item.label;
                    return <button type="button" key={item.key} onClick={() => { setHostFactDialog(item.key); setHostFactDraft(value); }}><span className="hosting-editor-fact-leading">{item.icon}</span><span>{text}</span><ChevIcon /></button>;
                  })}
                </div>
              </div>
            </div>
          )}

          {activeSection.kind === "link" && (
            <div className="hosting-editor-form">
              <h2>Custom link</h2>
              <input className="hosting-editor-title-input" defaultValue={activeSection.summary} />
            </div>
          )}

          {hostPhotoDialogOpen && (
            <div className="hosting-editor-photo-dialog-backdrop" role="presentation" onClick={() => setHostPhotoDialogOpen(false)}>
              <div className="hosting-editor-photo-dialog" role="dialog" aria-modal="true" aria-labelledby="host-photo-dialog-title" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="hosting-editor-photo-dialog-close" aria-label="Close photo dialog" onClick={() => setHostPhotoDialogOpen(false)}>×</button>
                <h2 id="host-photo-dialog-title">Choose your profile photo</h2>
                <p>Select a clear photo that helps guests know who they&apos;ll be communicating with.</p>
                <div className="hosting-editor-photo-dialog-preview"><img src={hostPhotoDraft} alt="Selected profile preview" /></div>
                <label className="hosting-editor-photo-dialog-upload"> <CameraIcon /> Choose a photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) setHostPhotoDraft(URL.createObjectURL(file)); event.target.value = ""; }} /></label>
                <div className="hosting-editor-photo-dialog-actions"><button type="button" className="hosting-editor-cancel" onClick={() => setHostPhotoDialogOpen(false)}>Cancel</button><button type="button" className="hosting-editor-save" onClick={() => { setHostPhoto(hostPhotoDraft); setHostPhotoDialogOpen(false); }}><CheckIcon /> Save</button></div>
              </div>
            </div>
          )}
          {hostFactDialog && (() => {
            const item = hostFactItems.find((entry) => entry.key === hostFactDialog);
            if (!item) return null;
            return <div className="hosting-editor-photo-dialog-backdrop" role="presentation" onClick={() => setHostFactDialog(null)}>
              <div className="hosting-editor-photo-dialog hosting-editor-fact-dialog" role="dialog" aria-modal="true" aria-labelledby="host-fact-dialog-title" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="hosting-editor-photo-dialog-close" aria-label="Close entry dialog" onClick={() => setHostFactDialog(null)}>×</button>
                <h2 id="host-fact-dialog-title">{item.prompt}</h2>
                <p>This helps guests get to know you before their stay.</p>
                <label className="hosting-editor-fact-input"><span>{item.label}:</span><input autoFocus value={hostFactDraft} onChange={(event) => setHostFactDraft(event.target.value)} maxLength={80} /><small>{80 - hostFactDraft.length} characters available</small></label>
                <div className="hosting-editor-photo-dialog-actions"><button type="button" className="hosting-editor-cancel" onClick={() => setHostFactDialog(null)}>Cancel</button><button type="button" className="hosting-editor-save" onClick={() => { setHostFacts((current) => ({ ...current, [item.key]: hostFactDraft })); setHostFactDialog(null); }}><CheckIcon /> Save</button></div>
              </div>
            </div>;
          })()}
          {inviteDialogOpen && <div className="hosting-editor-photo-dialog-backdrop" role="presentation" onClick={() => setInviteDialogOpen(false)}>
            <div className="hosting-editor-photo-dialog hosting-editor-invite-dialog" role="dialog" aria-modal="true" aria-labelledby="invite-dialog-title" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="hosting-editor-photo-dialog-close" aria-label="Close invite dialog" onClick={() => setInviteDialogOpen(false)}>×</button>
              {inviteStep === 1 && <><h2 id="invite-dialog-title">Add your co-host&apos;s info</h2><p>We&apos;ll text or email them the invite.</p><div className="hosting-editor-invite-fields"><label>Country code<select><option>Canada (+1)</option><option>United States (+1)</option><option>United Kingdom (+44)</option></select></label><label>Phone number<input value={invitePhone} onChange={(event) => setInvitePhone(event.target.value)} placeholder="Phone number" /></label></div><div className="hosting-editor-invite-or"><span>or</span></div><input className="hosting-editor-invite-email" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="Email" /></>}
              {inviteStep === 2 && <><h2 id="invite-dialog-title">Set your co-host&apos;s permissions</h2><p>You can always change this later. <u>Learn how permissions work</u></p><div className="hosting-editor-permission-options">{[["Full access", "Edit calendar, message guests, manage damage requests, listing, and co-hosts"], ["Calendar and messaging access", "View calendar and message guests"], ["Calendar access", "View calendar"]].map(([label, detail]) => <label key={label}><span><strong>{label}</strong><small>{detail}</small></span><input type="radio" name="invite-permission" checked={invitePermission === label} onChange={() => setInvitePermission(label)} /><i /></label>)}</div></>}
              {inviteStep === 3 && <><h2 id="invite-dialog-title">Review your invite</h2><img className="hosting-editor-invite-listing-photo" src={photoRooms[0].photo} alt="Daisy's Inn" /><div className="hosting-editor-invite-review"><strong>Daisy&apos;s Inn</strong><small>Saskatoon</small><strong>Co-host&apos;s email</strong><small>{inviteEmail || "No email provided"}</small><strong>Permissions</strong><small>{invitePermission}<br />View calendar and message guests</small></div><p className="hosting-editor-invite-terms">By selecting &quot;Send,&quot; you agree to the <u>Co-Host Terms</u>.</p></>}
              <div className="hosting-editor-photo-dialog-actions"><button type="button" className="hosting-editor-cancel" onClick={() => inviteStep === 1 ? setInviteDialogOpen(false) : setInviteStep((inviteStep - 1) as 1 | 2 | 3)}>{inviteStep === 1 ? "Cancel" : "Back"}</button><button type="button" className="hosting-editor-save" disabled={inviteStep === 1 && !inviteEmail && !invitePhone} onClick={() => inviteStep === 3 ? setInviteDialogOpen(false) : setInviteStep((inviteStep + 1) as 1 | 2 | 3)}>{inviteStep === 3 ? "Send" : "Next"}</button></div>
            </div>
          </div>}
          </>}
          </div>

          {activeSection.kind === "sleeping" && sleepingRoom && (
            <footer className="hosting-editor-footer is-split">
              <button type="button" className="hosting-editor-cancel" onClick={() => setSleepingRoom(null)}>Cancel</button>
              <button type="button" className="hosting-editor-save" onClick={() => setSleepingRoom(null)}><CheckIcon /> Done</button>
            </footer>
          )}

          {activeSection.kind === "pricing" && pricingView === "smart" && (
            <footer className="hosting-editor-footer is-split">
              <button type="button" className="hosting-editor-cancel" onClick={() => setPricingView("main")}>Cancel</button>
              <button type="button" className="hosting-editor-save" onClick={() => setPricingView("main")}><CheckIcon /> Save</button>
            </footer>
          )}

          {activeSection.kind === "availability" && availabilityView !== "main" && (
            <footer className="hosting-editor-footer is-split">
              <button type="button" className="hosting-editor-cancel" onClick={() => setAvailabilityView("main")}>Cancel</button>
              <button type="button" className="hosting-editor-save" onClick={() => setAvailabilityView("main")}><CheckIcon /> Save</button>
            </footer>
          )}

          {activeSection.kind === "description" && descriptionView && (
            <footer className="hosting-editor-footer is-split">
              <button type="button" className="hosting-editor-cancel" onClick={() => setDescriptionView(null)}>Cancel</button>
              <button type="button" className="hosting-editor-save" onClick={() => setDescriptionView(null)}><CheckIcon /> Save</button>
            </footer>
          )}

          {activeSection.kind === "amenities" && amenitiesMode === "add" && (
            <footer className="hosting-editor-footer">
              <button type="button" className="hosting-editor-save" onClick={() => setAmenitiesMode("view")}><CheckIcon /> Done</button>
            </footer>
          )}

          {activeSection.key === "rules" && houseRulesDetail && (
            <footer className="hosting-editor-footer is-split"><button type="button" className="hosting-editor-cancel" onClick={() => setHouseRulesDetail(null)}>Cancel</button><button type="button" className="hosting-editor-save" onClick={() => setHouseRulesDetail(null)}><CheckIcon /> Save</button></footer>
          )}

          {activeSection.key === "safety" && safetyDetail && (
            <footer className="hosting-editor-footer is-split"><button type="button" className="hosting-editor-cancel" onClick={() => setSafetyDetail(null)}>Cancel</button><button type="button" className="hosting-editor-save" onClick={() => setSafetyDetail(null)}><CheckIcon /> Save</button></footer>
          )}

          {activeSection.key === "cancellation" && cancellationDetail && (
            <footer className="hosting-editor-footer is-split"><button type="button" className="hosting-editor-cancel" onClick={() => setCancellationDetail(null)}>Cancel</button><button type="button" className="hosting-editor-save" onClick={() => setCancellationDetail(null)}><CheckIcon /> Save</button></footer>
          )}

          {activeSection.kind === "map" && locationDetail && (
            <footer className="hosting-editor-footer is-split">
              <button type="button" className="hosting-editor-cancel" onClick={() => setLocationDetail(null)}>Cancel</button>
              <button type="button" className="hosting-editor-save" onClick={() => setLocationDetail(null)}><CheckIcon /> Save</button>
            </footer>
          )}

          {editorTab === "arrival" && <footer className="hosting-editor-footer"><button type="button" className="hosting-editor-save" onClick={() => { if (checkinDetail === "lock") setDoorCode(doorCodeDraft); if (taxDetailOpen) setTaxDetailOpen(false); setCheckinDetail(null); }}><CheckIcon /> Save</button></footer>}

          {activeSection.kind !== "photos" && activeSection.kind !== "amenities" && activeSection.kind !== "map" && activeSection.key !== "rules" && activeSection.key !== "safety" && activeSection.key !== "cancellation" && !(activeSection.kind === "sleeping" && sleepingRoom) && !(activeSection.kind === "pricing" && pricingView === "smart") && !(activeSection.kind === "availability" && availabilityView !== "main") && !(activeSection.kind === "description" && descriptionView) && (
            <footer className="hosting-editor-footer">
              <button type="button" className="hosting-editor-save"><CheckIcon /> Save</button>
            </footer>
          )}
        </section>
      </div>
    </main>
  );
}
