import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import faceImage from "../assets/face.jpg";
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  ChevIcon,
  ClockIcon,
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
import { useAuth } from "../hooks/useAuth";
import { getListing, updateListing } from "../apis/useListing";
import { fetchListingTypes } from "../apis/useListingType";
import { createListingAmenity, deleteListingAmenity } from "../apis/useListingAmenity";
import { fetchAmenityCatalogs } from "../apis/useAmenityCatalog";
import { createAmenityCatalog } from "../apis/useAmenityCatalog";
import { updateProperty } from "../apis/useProperty";
import { updateRentalUnit } from "../apis/useRentalUnit";
import { uploadListingPhoto } from "../apis/useListingPhoto";
import { fetchOrganizationMembers, fetchOrganizationMembersByOrganization, getAllCohostInvitationsByOrganization, getCohostInvitationsByOrganization, getOrganizationMember, inviteCohost, reactivateRevokedCohost, revokeCohostInvitation, updateOrganizationMember, type CohostAccess, type CohostInvitation } from "../apis/useOrganizationMember";
import type { OrganizationMember } from "../types/OrganizationMember";
import type { Listing } from "../types/Listing";
import type { ListingPhoto } from "../types/ListingPhoto";
import type { ListingType } from "../types/ListingType";
import type { ListingAmenity } from "../types/ListingAmenity";
import type { AmenityCatalog } from "../types/AmenityCatalog";
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
  { key: "home", label: "What makes my home unique", value: "Stylish comfort with private security.", prompt: "What makes your home unique?", icon: <span className="hosting-editor-fact-icon">✣</span> },
  { key: "pets", label: "Pets", value: "", prompt: "Tell guests about your pets", icon: <UsersIcon /> },
  { key: "decade", label: "Decade I was born", value: "", prompt: "What decade were you born in?", icon: <span className="hosting-editor-fact-icon">♧</span> },
  { key: "school", label: "Where I went to school", value: "", prompt: "Where did you go to school?", icon: <span className="hosting-editor-fact-icon">◇</span> },
];

const formatAmount = (value: string) => {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
};

const formatCurrency = (value: string) => {
  const amount = Number(value.replace(/,/g, ""));
  return Number.isFinite(amount) ? amount.toLocaleString("en-US") : "0";
};

const getHostingDuration = (publishedAt?: string | null) => {
  if (!publishedAt) return { value: "New", label: "hosting" };
  const publishedTime = new Date(publishedAt).getTime();
  const elapsedDays = Math.max(0, Math.floor((Date.now() - publishedTime) / (1000 * 60 * 60 * 24)));
  if (elapsedDays >= 365) {
    const years = Math.floor(elapsedDays / 365);
    return { value: String(years), label: `${years === 1 ? "year" : "years"} hosting` };
  }
  if (elapsedDays >= 30) {
    const months = Math.floor(elapsedDays / 30);
    return { value: String(months), label: `${months === 1 ? "month" : "months"} hosting` };
  }
  return { value: String(elapsedDays), label: `${elapsedDays === 1 ? "day" : "days"} hosting` };
};

const photoRooms = [
  { label: "Living room", count: 20, photo: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=500&q=80" },
  { label: "Bedroom", count: 7, photo: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80" },
  { label: "Full bathroom", count: 6, photo: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=500&q=80" },
  { label: "Laundry area", count: 2, photo: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=500&q=80" },
  { label: "Exterior", count: 1, photo: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80" },
  { label: "Additional photos", count: 8, photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80" },
];

type EditorPhotoLocation = "LivingRoom" | "Bedroom" | "Bathroom" | "Laundry" | "Exterior" | "Additional";
type PendingEditorPhoto = { id: string; file: File; url: string; location: EditorPhotoLocation };
const photoLocationOptions: { value: EditorPhotoLocation; label: string }[] = [
  { value: "LivingRoom", label: "Living room" },
  { value: "Bedroom", label: "Bedroom" },
  { value: "Bathroom", label: "Full bathroom" },
  { value: "Laundry", label: "Laundry area" },
  { value: "Exterior", label: "Exterior" },
  { value: "Additional", label: "Additional photos" },
];

const photoLocationLabel = (location: string) => photoLocationOptions.find((option) => option.value === location)?.label || "Additional photos";
const photoLocationForCategory = (category: string | null): EditorPhotoLocation =>
  photoLocationOptions.find((option) => option.label === category)?.value || "Additional";

const sleepingRooms = [
  { key: "living", label: "Living room" },
  { key: "bedroom", label: "Bedroom" },
];

const advanceNoticeOptions = ["Same day", "2 days", "3 days", "4 days", "5 days", "6 days", "7 days"];
const cohostPermissionOptions: Array<[CohostAccess, string]> = [
  ["Full access", "Edit calendar, message guests, manage damage requests, listing, and co-hosts"],
  ["Calendar and message access", "View calendar and message guests"],
  ["Calendar access", "View calendar"],
];

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
  const { id } = useParams();
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const capturedBy = currentUser?.name?.trim() || [currentUser?.user?.firstName, currentUser?.user?.lastName].filter(Boolean).join(" ").trim() || "Unknown user";
  const [listing, setListing] = useState<Listing | null>(null);
  const [organizationMembers, setOrganizationMembers] = useState<OrganizationMember[]>([]);
  const [primaryOwner, setPrimaryOwner] = useState<OrganizationMember | null>(null);
  const [hostMember, setHostMember] = useState<OrganizationMember | null>(null);
  const [pendingCohostInvitations, setPendingCohostInvitations] = useState<CohostInvitation[]>([]);
  const [allCohostInvitations, setAllCohostInvitations] = useState<CohostInvitation[]>([]);
  const [cohostInvitationView, setCohostInvitationView] = useState<"pending" | "history">("history");
  const [cohostInvitationsLoading, setCohostInvitationsLoading] = useState(true);
  const [cohostInvitationsError, setCohostInvitationsError] = useState("");
  const [invitationReferenceTime] = useState(() => Date.now());
  const [revokingInvitationID, setRevokingInvitationID] = useState("");
  const [reactivatingInvitationID, setReactivatingInvitationID] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeKey, setActiveKey] = useState("photos");
  const [editorTab, setEditorTab] = useState<"space" | "arrival">("space");
  const [checkinDetail, setCheckinDetail] = useState<"lock" | "instructions" | null>(null);
  const [requireProfilePhoto, setRequireProfilePhoto] = useState(true);
  const [houseManual, setHouseManual] = useState("Welcome to Daisy’s Inn!\n\nDoor Access:\nIf the door doesn’t open after entering the smart lock code, no worries — try these quick steps:\n\n1. Gently pull the door knob towards you once, leave it, then re-enter the code.\n2. If it still doesn’t open, please call or message me.\n3. If it’s at night and I haven’t responded, kindly press the doorbell at the main house entrance — I’ll be right with you!\n\nTo lock the door, pull the door handle once toward you, leave it, then press the Weiser button at the top of the smart lock pad.\n\nSecurity Light:\nThe external security light is sensor-activated and automatically turns on when it gets dark. Please make sure the switch is turned ON when you enter the suite.");
  const [doorCode, setDoorCode] = useState("1973");
  const [doorCodeDraft, setDoorCodeDraft] = useState("1973");
  const [checkoutInstructions, setCheckoutInstructions] = useState("");
  const [guestRequirementDetails, setGuestRequirementDetails] = useState("");
  const [photoCategory, setPhotoCategory] = useState<string | null>(null);
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [pendingPhotoUploads, setPendingPhotoUploads] = useState<PendingEditorPhoto[]>([]);
  const [photoUploadError, setPhotoUploadError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [titleSaving, setTitleSaving] = useState(false);
  const [titleSaveError, setTitleSaveError] = useState("");
  const [propertyInfoSaving, setPropertyInfoSaving] = useState(false);
  const [propertyInfoSaveError, setPropertyInfoSaveError] = useState("");
  const [title, setTitle] = useState("Daisy's Inn");
  const [placeType, setPlaceType] = useState("Secondary unit");
  const [propertyName, setPropertyName] = useState("");
  const [unitName, setUnitName] = useState("");
  const [timeZone, setTimeZone] = useState("UTC");
  const [bedroomCount, setBedroomCount] = useState("1");
  const [bathroomCount, setBathroomCount] = useState("1");
  const [bedCount, setBedCount] = useState("1");
  const [buildingFloorCount, setBuildingFloorCount] = useState(1);
  const [listingFloorNumber, setListingFloorNumber] = useState(1);
  const [propertyTypeValue, setPropertyTypeValue] = useState("Guest suite");
  const [listingType, setListingType] = useState("Entire place");
  const [listingTypeOptions, setListingTypeOptions] = useState<ListingType[]>([]);
  const [amenityCatalogRecords, setAmenityCatalogRecords] = useState<AmenityCatalog[]>([]);
  const [sizeUnit, setSizeUnit] = useState("Unit");
  const [propertySize, setPropertySize] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [wifiNetwork, setWifiNetwork] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [addressFields, setAddressFields] = useState({ line1: "", city: "", provinceCode: "", postalCode: "" });
  const [priceRange, setPriceRange] = useState({ min: "70", max: "75" });
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [smartPricing, setSmartPricing] = useState(true);
  const [pricingView, setPricingView] = useState<"main" | "smart">("main");
  const [quarterlyDiscount, setQuarterlyDiscount] = useState("0");
  const [semiAnnualDiscount, setSemiAnnualDiscount] = useState("0");
  const [yearlyDiscount, setYearlyDiscount] = useState("0");
  const [availability, setAvailability] = useState({ min: "1", max: "365", advanceNotice: "3 days", sameDayTime: "No" });
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
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [invitePermission, setInvitePermission] = useState<CohostAccess>("Calendar and message access");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteError, setInviteError] = useState("");
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
  const [saveToast, setSaveToast] = useState("");
  const instantBookRef = useRef<HTMLDivElement>(null);
  const approvalRef = useRef<HTMLButtonElement>(null);
  const showSaveToast = (message: string) => {
    setSaveToast(message);
    window.setTimeout(() => setSaveToast(""), 3200);
  };
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    void Promise.all([
      getListing(id),
      fetchListingTypes({ pageSize: 100, pageNumber: 0 }),
      fetchAmenityCatalogs({ pageSize: 500, pageNumber: 0 }),
    ])
      .then(([loadedListing, listingTypeResult, amenityCatalogResult]) => {
        if (cancelled) return;
        setListingTypeOptions(listingTypeResult.data);
        setAmenityCatalogRecords(amenityCatalogResult.data);
        const rentalUnit = loadedListing.rentalUnit;
        const property = rentalUnit?.property;
        const address = property?.address;
        const photos = [...(loadedListing.listingPhotos ?? [])].sort((left, right) => left.displayOrder - right.displayOrder);
        const amenities = loadedListing.listingAmenities?.map((item) => {
          const amenity = item.amenityAmenityCatalog || (item as typeof item & { amenityCatalog?: { name?: string } }).amenityCatalog;
          return amenity?.name;
        }).filter((name): name is string => Boolean(name)) ?? [];
        const accessInstruction = loadedListing.listingAccessInstructions?.find((item) => item.isActive);
        // Map access-instruction records onto their matching UI fields using instructionType as the key.
        const findAccessInstruction = (instructionType: string) =>
          loadedListing.listingAccessInstructions?.find((item) => item.instructionType === instructionType && item.isActive)
          ?? loadedListing.listingAccessInstructions?.find((item) => item.instructionType === instructionType);
        const houseManualInstruction = findAccessInstruction("HOUSE_MANUAL");
        const checkoutInstruction = findAccessInstruction("CHECKOUT_INSTRUCTION");
        const guestRequirementInstruction = findAccessInstruction("GUEST_REQUIREMENT");
        const policy = loadedListing.listingPolicies?.[0];
        const location = [address?.line1, address?.city, address?.provinceCode, address?.postalCode, address?.countryCode].filter(Boolean).join(", ");
        // Map house-rule records onto their matching UI fields using ruleType as the key.
        const findRule = (ruleType: string) => loadedListing.listingRules?.find((rule) => rule.ruleType === ruleType);
        const quietStartRule = findRule("QUIET_HOURS_START");
        const quietEndRule = findRule("QUIET_HOURS_END");
        const checkInRule = findRule("CHECK_IN");
        const checkOutRule = findRule("CHECK_OUT");
        const additionalRule = findRule("ADDITIONAL");
        setListing(loadedListing);
        setHostPhoto(loadedListing.organization?.brandLogoUrl || faceImage);
        setTitle(loadedListing.title || rentalUnit?.name || "");
        setPlaceType(property?.propertyType || "Secondary unit");
        setPropertyName(property?.name || loadedListing.title || "");
        setUnitName(rentalUnit?.name || "");
        setTimeZone(property?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
        setBedroomCount(String(rentalUnit?.bedrooms ?? loadedListing.bedrooms ?? 1));
        setBathroomCount(String(rentalUnit?.bathrooms ?? loadedListing.bathrooms ?? 1));
        setBedCount(String(rentalUnit?.beds ?? 1));
        const loadedFloorNumber = Math.max(0, Number.parseInt(rentalUnit?.floorNumber || "1", 10) || 1);
        setListingFloorNumber(loadedFloorNumber);
        setBuildingFloorCount(Math.max(loadedFloorNumber, 1));
        setPropertyTypeValue(rentalUnit?.unitType?.name || property?.propertyType || "Guest suite");
        setListingType(loadedListing.listingType?.name || listingTypeResult.data.find((item) => item.listingTypeID === loadedListing.listingTypeID)?.name || listingTypeResult.data[0]?.name || "");
        setPropertySize(String(rentalUnit?.squareFeet ?? ""));
        setSizeUnit("sq ft");
        setYearBuilt(String(property?.yearBuilt ?? loadedListing.yearBuilt ?? ""));
        const listingWithWifi = loadedListing as Listing & {
          wifiNetwork?: string;
          wifiPassword?: string;
          wIFINetwork?: string;
          wIFIPassword?: string;
        };
        setWifiNetwork(listingWithWifi.wifiNetwork || listingWithWifi.wIFINetwork || "");
        setWifiPassword(listingWithWifi.wifiPassword || listingWithWifi.wIFIPassword || "");
        setAddressFields({
          line1: address?.line1 || "",
          city: address?.city || "",
          provinceCode: address?.provinceCode || "",
          postalCode: address?.postalCode || "",
        });
        setDescriptionFields((current) => ({
          ...current,
          listing: loadedListing.description || current.listing,
          property: property?.description || current.property,
          access: accessInstruction?.instructions || current.access,
        }));
        setPriceRange({
          min: formatAmount(String(loadedListing.baseMonthlyRentAmount ?? "")),
          max: formatAmount(String(loadedListing.BaseMonthlyRentAmountMax ?? loadedListing.baseMonthlyRentAmount ?? "")),
        });
        setSecurityDeposit(formatAmount(String(loadedListing.securityDepositAmount ?? "")));
        setQuarterlyDiscount(String(loadedListing.quarterlyDiscountRate ?? 0));
        setSemiAnnualDiscount(String(loadedListing.semiAnnualDiscountRate ?? 0));
        setYearlyDiscount(String(loadedListing.yearlyDiscountRate ?? 0));
        if (loadedListing.shortTermCancellationPolicy) setShortTermPolicy(loadedListing.shortTermCancellationPolicy);
        if (loadedListing.longTermCancellationPolicy) setLongTermPolicy(loadedListing.longTermCancellationPolicy);
        setAvailability({
          min: String(loadedListing.minimumLeaseMonths ?? ""),
          max: String(loadedListing.maximumLeaseMonths ?? ""),
          advanceNotice: loadedListing.advanceNotice || "3 days",
          sameDayTime: loadedListing.advanceNotice === "Same day" ? "Yes" : "No",
        });
        setGuestsCount(rentalUnit?.maximumOccupants ?? policy?.maximumOccupants ?? 0);
        setAddedAmenities(amenities);
        setLocationFeatures(address ? [location] : []);
        const loadedDoorCode = loadedListing.checkInDoorCode || accessInstruction?.secretReference || "";
        setDoorCode(loadedDoorCode);
        setDoorCodeDraft(loadedDoorCode);
        setHouseManual(houseManualInstruction?.instructions || "");
        setCheckoutInstructions(checkoutInstruction?.instructions || "");
        setGuestRequirementDetails(guestRequirementInstruction?.instructions || "");
        setRequireProfilePhoto(policy?.requiresBackgroundCheck ?? true);
        // Property info toggles: prefer the listing policy, fall back to the listing's own flags.
        const listingWithFlags = loadedListing as Listing & { isPetFriendly?: boolean };
        setSafetyChoices((current) => ({
          ...current,
          "Smoking allowed": policy ? (policy.allowsSmoking ? "yes" : "no") : current["Smoking allowed"],
          "Pets allowed": policy ? (policy.allowsPets ? "yes" : "no") : (listingWithFlags.isPetFriendly ? "yes" : "no"),
          "Parking available": policy ? (policy.parkingIncluded ? "yes" : "no") : current["Parking available"],
        }));
        setRoomPhotos({
          living: photos.find((photo) => photo.location === "LivingRoom")?.url || photoRooms[0].photo,
          bedroom: photos.find((photo) => photo.location === "Bedroom")?.url || photoRooms[1].photo,
        });
        setQuietHours(Boolean(quietStartRule || quietEndRule));
        if (quietStartRule?.ruleTitle) setQuietStart(quietStartRule.ruleTitle);
        if (quietEndRule?.ruleTitle) setQuietEnd(quietEndRule.ruleTitle);
        if (checkInRule?.ruleTitle) setCheckInStart(checkInRule.ruleTitle);
        if (checkOutRule?.ruleTitle) setCheckoutTime(checkOutRule.ruleTitle);
        if (additionalRule?.ruleTitle) setHouseRuleText(additionalRule.ruleTitle);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "We could not load this listing.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);
  useEffect(() => {
    const organizationID = listing?.organizationID;
    if (!organizationID) return;
    let cancelled = false;
    void fetchOrganizationMembersByOrganization(organizationID)
      .catch(async () => {
        const response = await fetchOrganizationMembers({ pageSize: 200, pageNumber: 0 });
        return response.data.filter((member) => String(member.organizationID) === String(organizationID));
      })
      .then((members) => {
        if (!cancelled) {
          const owner = members.find((member) => member.isPrimaryOwner) ?? members[0] ?? null;
          setOrganizationMembers(members);
          setPrimaryOwner(owner);
          if (owner) {
            void getOrganizationMember(owner.organizationMemberID)
              .then((member) => {
                if (cancelled) return;
                setHostMember(member);
                setHostPhoto(member.profilePhotoUrl || member.user?.imageUrl || listing?.organization?.brandLogoUrl || faceImage);
                setHostFacts({
                  travel: member.travelDestination || "",
                  work: member.workDescription || "",
                  home: member.homeUniqueDescription || "",
                  pets: member.petsDescription || "",
                  decade: member.birthDecade || "",
                  school: member.schoolDescription || "",
                });
              })
              .catch(() => { if (!cancelled) setHostMember(owner); });
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrganizationMembers([]);
          setPrimaryOwner(null);
          setHostMember(null);
        }
      });
    return () => { cancelled = true; };
  }, [listing?.organizationID, listing?.organization?.brandLogoUrl]);
  useEffect(() => {
    const organizationID = listing?.organizationID;
    if (!organizationID) return;
    let cancelled = false;
    void Promise.all([
      getCohostInvitationsByOrganization(organizationID),
      getAllCohostInvitationsByOrganization(organizationID),
    ])
      .then(([pendingInvitations, allInvitations]) => {
        if (!cancelled) {
          setPendingCohostInvitations(pendingInvitations);
          setAllCohostInvitations(allInvitations);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setCohostInvitationsError(error instanceof Error ? error.message : "We could not load co-host invitations.");
      })
      .finally(() => {
        if (!cancelled) setCohostInvitationsLoading(false);
      });
    return () => { cancelled = true; };
  }, [listing?.organizationID]);
  useEffect(() => {
    (instantBook ? instantBookRef.current : approvalRef.current)?.focus();
  }, [instantBook]);
  const editorSections = useMemo(() => sections.map((section) => {
    if (!listing) return section;
    if (section.key === "title") return { ...section, summary: title || "Add a title" };
    if (section.key === "photos") return { ...section, summary: `${listing.listingPhotos?.length ?? 0} photos`, thumbnail: listing.listingPhotos?.[0]?.url || section.thumbnail };
    if (section.key === "sleeping") return { ...section, thumbnail: listing.listingPhotos?.find((photo) => photo.location === "Bedroom")?.url || section.thumbnail };
    if (section.key === "location") return { ...section, summary: [listing.rentalUnit?.property?.address?.line1, listing.rentalUnit?.property?.address?.city, listing.rentalUnit?.property?.address?.provinceCode].filter(Boolean).join(", ") || "Add location" };
    return section;
  }), [listing, title]);
  const activeSection = useMemo(() => editorSections.find((section) => section.key === activeKey) ?? editorSections[0], [activeKey, editorSections]);
  const editorArrivalCards = useMemo(() => arrivalCards.map((card) => {
    if (card.key === "arrival-manual") return { ...card, summary: houseManual.split("\n")[0] || "Add details" };
    if (card.key === "arrival-checkout") return { ...card, summary: checkoutInstructions || "Add details" };
    if (card.key === "arrival-requirements") return { ...card, summary: guestRequirementDetails || "Add details" };
    if (card.key === "arrival-checkin") return { ...card, summary: doorCodeDraft.trim() || doorCode.trim() ? "Smart lock" : "Add details" };
    return card;
  }), [houseManual, checkoutInstructions, guestRequirementDetails, doorCode, doorCodeDraft]);
  const activeArrivalCard = editorArrivalCards.find((card) => card.key === activeKey) ?? editorArrivalCards[0];
  const editorPhotoRooms = useMemo(() => {
    const photos = [...(listing?.listingPhotos ?? [])].sort((left, right) => left.displayOrder - right.displayOrder);
    if (photos.length === 0) return photoRooms;
    const grouped = new Map<string, typeof photos>();
    photos.forEach((photo) => {
      const label = photo.isCoverPhoto || photo.location === "CoverPhoto" ? "Cover photo" : photoLocationLabel(photo.location);
      grouped.set(label, [...(grouped.get(label) ?? []), photo]);
    });
    return [...grouped.entries()].map(([label, items]) => ({ label, count: items.length, photo: items[0].url }));
  }, [listing]);
  // Guest safety only shows amenities the listing actually has in the Home safety category.
  const safetyAmenities = useMemo(
    () => addedAmenities.filter((name) => amenityCatalog.some((item) => item.name === name && item.category === "Home safety")),
    [addedAmenities],
  );
  const changeBedCount = (roomKey: string, bedType: string, delta: number) => {
    setBedCounts((current) => {
      const room = current[roomKey] || {};
      const next = Math.max(0, (room[bedType] || 0) + delta);
      return { ...current, [roomKey]: { ...room, [bedType]: next } };
    });
  };
  const changeRoomPhoto = async (roomKey: string, files: FileList | null) => {
    const file = files?.[0];
    if (!file || !listing || !id) return;
    const location = roomKey === "bedroom" ? "Bedroom" : "LivingRoom";
    const previewUrl = URL.createObjectURL(file);
    setRoomPhotos((current) => ({ ...current, [roomKey]: previewUrl }));
    try {
      const startingOrder = Math.max(-1, ...(listing.listingPhotos ?? []).map((photo) => photo.displayOrder)) + 1;
      const uploaded = await uploadListingPhoto(file, id, startingOrder, false, {
        location,
        altText: file.name,
        capturedBy,
        userID: typeof userID === "number" ? userID : undefined,
      });
      setListing((current) => current ? { ...current, listingPhotos: [...(current.listingPhotos ?? []), uploaded] } : current);
      setRoomPhotos((current) => ({ ...current, [roomKey]: uploaded.url }));
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };
  const queueEditorPhotos = (files: FileList | null) => {
    if (!files?.length) return;
    setPhotoUploadError("");
    const defaultLocation = photoLocationForCategory(photoCategory);
    const queued = Array.from(files).map((file) => ({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file, url: URL.createObjectURL(file), location: defaultLocation }));
    setPendingPhotoUploads((current) => [...current, ...queued]);
    setPhotoUploadOpen(true);
  };
  const removeQueuedEditorPhoto = (photoID: string) => {
    const photo = pendingPhotoUploads.find((item) => item.id === photoID);
    if (photo) URL.revokeObjectURL(photo.url);
    const remainingPhotos = pendingPhotoUploads.filter((item) => item.id !== photoID);
    setPendingPhotoUploads(remainingPhotos);
    if (remainingPhotos.length === 0) setPhotoUploadOpen(false);
  };
  const closeEditorPhotoUpload = () => {
    if (photoUploading) return;
    pendingPhotoUploads.forEach((item) => URL.revokeObjectURL(item.url));
    setPendingPhotoUploads([]);
    setPhotoUploadError("");
    setPhotoUploadOpen(false);
  };
  const uploadEditorPhotos = async () => {
    if (!id || !listing || pendingPhotoUploads.length === 0) return;
    setPhotoUploadError("");
    setPhotoUploading(true);
    try {
      const startingOrder = Math.max(-1, ...(listing.listingPhotos ?? []).map((photo) => photo.displayOrder)) + 1;
      const uploaded = await Promise.all(pendingPhotoUploads.map((item, index) => uploadListingPhoto(
        item.file,
        id,
        startingOrder + index,
        false,
        { location: item.location, altText: item.file.name, capturedBy, userID: typeof userID === "number" ? userID : undefined },
      )));
      setListing((current) => current ? { ...current, listingPhotos: [...(current.listingPhotos ?? []), ...uploaded as ListingPhoto[]] } : current);
      pendingPhotoUploads.forEach((item) => URL.revokeObjectURL(item.url));
      setPendingPhotoUploads([]);
      setPhotoUploadOpen(false);
    } catch (error) {
      setPhotoUploadError(error instanceof Error ? error.message : "We could not upload those photos. Please try again.");
    } finally {
      setPhotoUploading(false);
    }
  };
  const saveTitle = async () => {
    if (!listing || titleSaving) return;
    const nextTitle = title.trim();
    if (nextTitle === listing.title) {
      showSaveToast("No title changes to save");
      return;
    }
    setTitleSaveError("");
    setTitleSaving(true);
    try {
      const payload = { ...listing, title: nextTitle, notes: listing.notes?.trim() || "N/A" };
      if (import.meta.env.DEV) console.info("[ListingEditor] Update title payload", payload);
      const updatedListing = await updateListing(payload);
      setListing(updatedListing);
      setTitle(updatedListing.title || nextTitle);
      showSaveToast("Title saved successfully");
    } catch (error) {
      setTitleSaveError(error instanceof Error ? error.message : "We could not save the title. Please try again.");
    } finally {
      setTitleSaving(false);
    }
  };
  const savePricing = async () => {
    if (!listing || propertyInfoSaving) return;
    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      const baseMonthlyRentAmount = Number(priceRange.min.replace(/,/g, "")) || 0;
      const maximumRent = Number(priceRange.max.replace(/,/g, "")) || baseMonthlyRentAmount;
      const deposit = Number(securityDeposit.replace(/,/g, "")) || 0;
      const pricingPayload = {
        ...listing,
        baseMonthlyRentAmount,
        BaseMonthlyRentAmountMax: maximumRent,
        securityDepositAmount: deposit,
      };
      const pricingChanged = listing.baseMonthlyRentAmount !== baseMonthlyRentAmount
        || (listing.BaseMonthlyRentAmountMax ?? listing.baseMonthlyRentAmount) !== maximumRent
        || listing.securityDepositAmount !== deposit;
      if (!pricingChanged) {
        setPricingView("main");
        showSaveToast("No pricing changes to save");
        return;
      }
      if (import.meta.env.DEV) console.info("[ListingEditor] Updating pricing", pricingPayload);
      const updatedListing = await updateListing(pricingPayload);
      setListing((current) => current ? { ...current, ...pricingPayload, ...updatedListing, baseMonthlyRentAmount, BaseMonthlyRentAmountMax: maximumRent, securityDepositAmount: deposit } : current);
      setPriceRange({ min: formatAmount(String(baseMonthlyRentAmount)), max: formatAmount(String(maximumRent)) });
      setSecurityDeposit(formatAmount(String(deposit)));
      showSaveToast("Pricing saved successfully");
      setPricingView("main");
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not save the pricing details. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const saveDiscounts = async () => {
    if (!listing || propertyInfoSaving) return;
    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      const quarterlyDiscountRate = Number(quarterlyDiscount) || 0;
      const semiAnnualDiscountRate = Number(semiAnnualDiscount) || 0;
      const yearlyDiscountRate = Number(yearlyDiscount) || 0;
      const discountPayload = { ...listing, quarterlyDiscountRate, semiAnnualDiscountRate, yearlyDiscountRate };
      const discountsChanged = listing.quarterlyDiscountRate !== quarterlyDiscountRate
        || listing.semiAnnualDiscountRate !== semiAnnualDiscountRate
        || listing.yearlyDiscountRate !== yearlyDiscountRate;
      if (!discountsChanged) {
        showSaveToast("No discount changes to save");
        return;
      }
      if (import.meta.env.DEV) console.info("[ListingEditor] Updating discounts", discountPayload);
      const updatedListing = await updateListing(discountPayload);
      setListing((current) => current ? { ...current, ...discountPayload, ...updatedListing, quarterlyDiscountRate, semiAnnualDiscountRate, yearlyDiscountRate } : current);
      setQuarterlyDiscount(String(quarterlyDiscountRate));
      setSemiAnnualDiscount(String(semiAnnualDiscountRate));
      setYearlyDiscount(String(yearlyDiscountRate));
      showSaveToast("Discounts saved successfully");
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not save the discount details. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const saveAvailability = async () => {
    if (!listing || propertyInfoSaving) return;
    setAdvanceNoticeOpen(false);
    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      const minimumLeaseMonths = Number(availability.min) || 0;
      const maximumLeaseMonths = Number(availability.max) || minimumLeaseMonths;
      const advanceNotice = availability.advanceNotice;
      const allowSameDayRequests = advanceNotice === "Same day";
      const availabilityPayload = {
        ...listing,
        minimumLeaseMonths,
        maximumLeaseMonths,
        advanceNotice,
        allowSameDay: allowSameDayRequests,
      };
      const availabilityChanged = listing.minimumLeaseMonths !== minimumLeaseMonths
        || listing.maximumLeaseMonths !== maximumLeaseMonths
        || (listing.advanceNotice || "3 days") !== advanceNotice
        || Boolean(listing.allowSameDay) !== allowSameDayRequests;
      if (!availabilityChanged) {
        setAdvanceNoticeOpen(false);
        setAvailabilityView("main");
        showSaveToast("No availability changes to save");
        return;
      }
      if (import.meta.env.DEV) console.info("[ListingEditor] Updating availability", availabilityPayload);
      const updatedListing = await updateListing(availabilityPayload);
      setListing((current) => current ? { ...current, ...availabilityPayload, ...updatedListing, minimumLeaseMonths, maximumLeaseMonths, advanceNotice, allowSameDay: allowSameDayRequests } : current);
      setAvailability((current) => ({ ...current, min: String(minimumLeaseMonths), max: String(maximumLeaseMonths), sameDayTime: allowSameDayRequests ? "Yes" : "No" }));
      setAdvanceNoticeOpen(false);
      setAvailabilityView("main");
      showSaveToast("Availability saved successfully");
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not save the availability details. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const saveGuestCount = async () => {
    if (!listing || !listing.rentalUnit?.rentalUnitID || propertyInfoSaving) return;
    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      const maximumOccupants = Math.max(1, guestsCount);
      const rentalUnit = listing.rentalUnit;
      const rentalUnitPayload = {
        ...rentalUnit,
        rentalUnitID: rentalUnit.rentalUnitID,
        propertyID: rentalUnit.propertyID,
        unitTypeID: rentalUnit.unitTypeID,
        maximumOccupants,
      };
      if (rentalUnit.maximumOccupants === maximumOccupants) {
        showSaveToast("No guest capacity changes to save");
        return;
      }
      if (import.meta.env.DEV) console.info("[ListingEditor] Updating guest capacity", rentalUnitPayload);
      const updatedRentalUnit = await updateRentalUnit(rentalUnitPayload);
      setListing((current) => current ? {
        ...current,
        rentalUnit: { ...current.rentalUnit, ...rentalUnitPayload, ...updatedRentalUnit, maximumOccupants },
      } : current);
      setGuestsCount(maximumOccupants);
      showSaveToast("Guest capacity saved successfully");
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not save the guest capacity. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const saveDescription = async () => {
    if (!listing || !descriptionView || propertyInfoSaving) return;
    const description = descriptionFields[descriptionView] || "";
    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      if (descriptionView === "listing") {
        if (description === listing.description) {
          setDescriptionView(null);
          showSaveToast("No listing description changes to save");
          return;
        }
        const updatedListing = await updateListing({ ...listing, description });
        setListing((current) => current ? { ...current, ...updatedListing, description } : current);
      } else if (descriptionView === "property" && listing.rentalUnit?.property?.propertyID) {
        const property = listing.rentalUnit.property;
        if (description === property.description) {
          setDescriptionView(null);
          showSaveToast("No property description changes to save");
          return;
        }
        const updatedProperty = await updateProperty({
          propertyID: property.propertyID,
          organizationID: property.organizationID,
          addressID: property.addressID,
          name: property.name,
          propertyType: property.propertyType,
          yearBuilt: property.yearBuilt,
          timeZone: property.timeZone,
          description,
          status: property.status,
          capturedDate: property.capturedDate,
          capturedBy: property.capturedBy,
          updatedDate: property.updatedDate,
          updatedBy: property.updatedBy,
        } as typeof property);
        setListing((current) => current ? { ...current, rentalUnit: { ...current.rentalUnit, property: { ...current.rentalUnit.property, ...updatedProperty, description } } } : current);
      }
      setDescriptionView(null);
      showSaveToast(`${descriptionView === "property" ? "Property" : "Listing"} description saved successfully`);
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not save the description. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const savePropertyDetails = async () => {
    if (!listing || propertyInfoSaving) return;
    const property = listing.rentalUnit?.property;
    const rentalUnit = listing.rentalUnit;
    if (!property?.propertyID || !rentalUnit?.rentalUnitID) {
      setPropertyInfoSaveError("Property details are not available to save yet.");
      return;
    }

    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      const normalizedPropertyName = propertyName.trim() || title.trim() || property.name || "Property";
      const normalizedUnitName = unitName.trim() || rentalUnit.name || property.name || "Unit";
      const normalizedTimeZone = timeZone.trim() || property.timeZone || "UTC";
      const normalizedBedrooms = Number.parseInt(String(bedroomCount).trim(), 10) || 0;
      const normalizedBathrooms = Number.parseFloat(String(bathroomCount).trim()) || 0;
      const normalizedBeds = Number.parseInt(String(bedCount).trim(), 10) || 0;
      const normalizedYearBuilt = Number.parseInt(yearBuilt.trim(), 10) || property.yearBuilt || listing.yearBuilt || 0;
      const normalizedSquareFeet = Number.parseFloat(propertySize.trim()) || rentalUnit.squareFeet || listing.squareFeet || 0;
      const isPetFriendly = safetyChoices["Pets allowed"] === "yes";
      const furnishedLabel = listing.isFurnished ? "Furnished" : "Unfurnished";
      const petLabel = isPetFriendly ? "Pet-friendly" : "No pets";
      const generatedListingTitle = `${normalizedPropertyName} - ${normalizedUnitName}`.slice(0, 50);
      const generatedListingDescription = `${normalizedUnitName} at ${normalizedPropertyName}. ${normalizedBedrooms} bedroom${normalizedBedrooms === 1 ? "" : "s"}, ${normalizedBathrooms} bathroom${normalizedBathrooms === 1 ? "" : "s"}, ${furnishedLabel.toLowerCase()}, and ${petLabel.toLowerCase()}.`;

      const propertyPayload = {
        propertyID: property.propertyID,
        organizationID: property.organizationID,
        addressID: property.addressID,
        name: normalizedPropertyName,
        propertyType: propertyTypeValue || property.propertyType || "OTHER",
        yearBuilt: normalizedYearBuilt,
        timeZone: normalizedTimeZone,
        description: property.description || "",
        status: property.status || "ACTIVE",
        capturedDate: property.capturedDate,
        capturedBy: property.capturedBy,
        updatedDate: property.updatedDate,
        updatedBy: property.updatedBy,
      } as typeof property;

      const rentalUnitPayload = {
        ...rentalUnit,
        rentalUnitID: rentalUnit.rentalUnitID,
        propertyID: rentalUnit.propertyID,
        unitTypeID: rentalUnit.unitTypeID,
        name: normalizedUnitName,
        unitNumber: rentalUnit.unitNumber || "",
        floorNumber: String(listingFloorNumber),
        bedrooms: normalizedBedrooms,
        bathrooms: normalizedBathrooms,
        beds: normalizedBeds,
        squareFeet: normalizedSquareFeet,
        maximumOccupants: rentalUnit.maximumOccupants ?? 0,
        notes: rentalUnit.notes || "",
        status: rentalUnit.status || "ACTIVE",
      };

      const listingPayload = {
        ...listing,
        listingID: listing.listingID,
        rentalUnitID: listing.rentalUnitID || rentalUnit.rentalUnitID,
        listingTypeID: listingTypeOptions.find((item) => item.name === listingType)?.listingTypeID || listing.listingTypeID,
        title: generatedListingTitle,
        description: generatedListingDescription,
        bedrooms: normalizedBedrooms,
        bathrooms: normalizedBathrooms,
        beds: normalizedBeds,
        squareFeet: normalizedSquareFeet,
        yearBuilt: normalizedYearBuilt,
        isFurnished: listing.isFurnished,
        isPetFriendly,
        notes: listing.notes?.trim() || "N/A",
      };
      const propertyChanged = propertyPayload.name !== property.name
        || propertyPayload.propertyType !== property.propertyType
        || propertyPayload.yearBuilt !== property.yearBuilt
        || propertyPayload.timeZone !== property.timeZone;
      const rentalUnitChanged = rentalUnitPayload.name !== rentalUnit.name
        || rentalUnitPayload.floorNumber !== rentalUnit.floorNumber
        || rentalUnitPayload.bedrooms !== rentalUnit.bedrooms
        || rentalUnitPayload.bathrooms !== rentalUnit.bathrooms
        || rentalUnitPayload.beds !== rentalUnit.beds
        || rentalUnitPayload.squareFeet !== rentalUnit.squareFeet;
      const listingChanged = listingPayload.listingTypeID !== listing.listingTypeID
        || listingPayload.title !== listing.title
        || listingPayload.description !== listing.description
        || listingPayload.bedrooms !== listing.bedrooms
        || listingPayload.bathrooms !== listing.bathrooms
        || listingPayload.squareFeet !== listing.squareFeet
        || listingPayload.yearBuilt !== listing.yearBuilt
        || listingPayload.isPetFriendly !== (listing as Listing & { isPetFriendly?: boolean }).isPetFriendly;
      if (!propertyChanged && !rentalUnitChanged && !listingChanged) {
        showSaveToast("No property changes to save");
        return;
      }

      if (import.meta.env.DEV) {
        console.info("[ListingEditor] Updating property", propertyPayload);
        console.info("[ListingEditor] Updating rental unit", rentalUnitPayload);
        console.info("[ListingEditor] Updating listing", listingPayload);
      }

      const [updatedProperty, updatedRentalUnit, updatedListing] = await Promise.all([
        propertyChanged ? updateProperty(propertyPayload) : Promise.resolve(property),
        rentalUnitChanged ? updateRentalUnit(rentalUnitPayload) : Promise.resolve(rentalUnit),
        listingChanged ? updateListing(listingPayload) : Promise.resolve(listing),
      ]);

      const savedListing = {
        ...listingPayload,
        ...updatedListing,
        title: generatedListingTitle,
        description: generatedListingDescription,
        listingTypeID: listingPayload.listingTypeID,
        bedrooms: normalizedBedrooms,
        bathrooms: normalizedBathrooms,
        squareFeet: normalizedSquareFeet,
        yearBuilt: normalizedYearBuilt,
        isFurnished: listing.isFurnished,
        isPetFriendly,
        rentalUnit: {
          ...rentalUnit,
          ...rentalUnitPayload,
          ...updatedRentalUnit,
          name: normalizedUnitName,
          floorNumber: String(listingFloorNumber),
          bedrooms: normalizedBedrooms,
          bathrooms: normalizedBathrooms,
          beds: normalizedBeds,
          squareFeet: normalizedSquareFeet,
          property: {
            ...property,
            ...propertyPayload,
            ...updatedProperty,
            name: normalizedPropertyName,
            timeZone: normalizedTimeZone,
            yearBuilt: normalizedYearBuilt,
          },
        },
      };

      setListing((current) => current ? {
        ...current,
        ...savedListing,
      } : current);

      setPropertyName(updatedProperty.name || normalizedPropertyName);
      setUnitName(updatedRentalUnit.name || normalizedUnitName);
      setTimeZone(updatedProperty.timeZone || normalizedTimeZone);
      setTitle(generatedListingTitle);
      setDescriptionFields((current) => ({ ...current, listing: generatedListingDescription }));
      showSaveToast("Property details saved successfully");
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not save the property details. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const toggleAmenity = async (name: string) => {
    if (!listing || propertyInfoSaving) return;
    const isAdded = addedAmenities.includes(name);
    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      const existingAmenities = listing.listingAmenities ?? [];
      const getAmenityName = (item: ListingAmenity) => {
        const relation = item.amenityAmenityCatalog || (item as ListingAmenity & { amenityCatalog?: { name?: string } }).amenityCatalog;
        return relation?.name || amenityCatalogRecords.find((catalog) => catalog.amenityID === item.amenityID)?.name;
      };
      if (isAdded) {
        const linksToDelete = existingAmenities.filter((item) => getAmenityName(item) === name && item.listingAmenityID);
        await Promise.all(linksToDelete.map((item) => deleteListingAmenity(item.listingAmenityID)));
        const deletedIDs = new Set(linksToDelete.map((item) => item.listingAmenityID));
        setAddedAmenities((current) => current.filter((item) => item !== name));
        setListing((current) => current ? { ...current, listingAmenities: (current.listingAmenities ?? []).filter((item) => !deletedIDs.has(item.listingAmenityID)) } : current);
        showSaveToast(`${name} removed successfully`);
        return;
      }

      const catalog = amenityCatalogRecords.find((item) => item.name === name);
      const ensuredCatalog = catalog || await createAmenityCatalog({
        name,
        category: amenityCatalog.find((item) => item.name === name)?.category || amenityCategory,
        isActive: true,
        capturedBy,
      } as AmenityCatalog);
      if (!catalog) setAmenityCatalogRecords((current) => [...current, ensuredCatalog]);
      const createdAmenity = await createListingAmenity({
        listingID: listing.listingID,
        amenityID: ensuredCatalog.amenityID,
        notes: "",
        capturedBy,
      } as ListingAmenity);
      setAddedAmenities((current) => current.includes(name) ? current : [...current, name]);
      setListing((current) => current ? { ...current, listingAmenities: [...(current.listingAmenities ?? []), { ...createdAmenity, amenityAmenityCatalog: ensuredCatalog }] } : current);
      showSaveToast(`${name} added successfully`);
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not update that amenity. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const setSafetyChoice = (item: string, choice: "yes" | "no") => {
    setSafetyChoices((current) => ({ ...current, [item]: choice }));
  };

  if (isLoading) {
    return <main className="marketplace hosting-page"><HostingHeader /><p style={{ padding: "48px", textAlign: "center" }}>Loading listing...</p></main>;
  }

  if (!id || loadError || !listing) {
    return <main className="marketplace hosting-page"><HostingHeader /><p style={{ padding: "48px", textAlign: "center" }}>{loadError || "No listing ID was provided."}</p></main>;
  }

  const hostName = primaryOwner?.user?.firstName || listing.organization?.displayName || listing.organization?.legalName || listing.capturedBy || "Host";
  const hostingDuration = getHostingDuration(listing.publishedAt);
  const activeOrganizationMembers = organizationMembers.filter((member) => member.status?.toUpperCase() === "ACTIVE");
  const orderedOrganizationMembers = [
    ...activeOrganizationMembers.filter((member) => member.isPrimaryOwner),
    ...activeOrganizationMembers.filter((member) => !member.isPrimaryOwner),
  ];
  const selectedMember = orderedOrganizationMembers.find((member) => member.organizationMemberID === selectedCohost) ?? orderedOrganizationMembers.find((member) => member.isPrimaryOwner) ?? orderedOrganizationMembers[0];
  const memberName = (member: OrganizationMember) => `${member.user?.firstName || ""} ${member.user?.lastName || ""}`.trim() || `Member ${member.userID}`;
  const memberImage = (member: OrganizationMember) => member.user?.imageUrl || faceImage;
  const saveHostMember = async (patch: Partial<OrganizationMember>, message: string) => {
    if (!hostMember || propertyInfoSaving) return;
    setPropertyInfoSaveError("");
    setPropertyInfoSaving(true);
    try {
      const updatedMember = await updateOrganizationMember({ ...hostMember, ...patch });
      setHostMember(updatedMember);
      setOrganizationMembers((current) => current.map((member) => member.organizationMemberID === updatedMember.organizationMemberID ? { ...member, ...updatedMember } : member));
      showSaveToast(message);
    } catch (error) {
      setPropertyInfoSaveError(error instanceof Error ? error.message : "We could not save the host profile. Please try again.");
    } finally {
      setPropertyInfoSaving(false);
    }
  };
  const hostFactField = (key: string): keyof OrganizationMember | null => ({
    travel: "travelDestination",
    work: "workDescription",
    home: "homeUniqueDescription",
    pets: "petsDescription",
    decade: "birthDecade",
    school: "schoolDescription",
  }[key] as keyof OrganizationMember | undefined) || null;
  const sendCohostInvite = async () => {
    if (!listing?.organizationID || inviteSending || !inviteName.trim() || !inviteEmail.trim() || !invitePhone.trim()) return;
    setInviteError("");
    setInviteSending(true);
    try {
      const invitation = await inviteCohost({
        organizationID: listing.organizationID,
        email: inviteEmail.trim().toLowerCase(),
        cohostName: inviteName.trim(),
        phoneNumber: invitePhone.trim(),
        cohostAccess: invitePermission,
      });
      const invitationSummary: CohostInvitation = {
        cohostInvitationID: invitation.cohostInvitationID,
        organizationID: listing.organizationID,
        email: invitation.email,
        cohostName: invitation.cohostName || inviteName.trim(),
        phoneNumber: invitation.phoneNumber,
        cohostAccess: invitation.cohostAccess,
        status: invitation.status,
        expiresAtUtc: invitation.expiresAtUtc,
        capturedDateUtc: new Date().toISOString(),
        updatedDateUtc: new Date().toISOString(),
      };
      setPendingCohostInvitations((current) => [invitationSummary, ...current.filter((item) => item.cohostInvitationID !== invitationSummary.cohostInvitationID)]);
      setAllCohostInvitations((current) => [invitationSummary, ...current.filter((item) => item.cohostInvitationID !== invitationSummary.cohostInvitationID)]);
      setInviteDialogOpen(false);
      setInviteStep(1);
      setInviteName("");
      setInviteEmail("");
      setInvitePhone("");
      showSaveToast("Co-host invitation sent successfully");
    } catch (error) {
      const apiMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setInviteError(apiMessage || (error instanceof Error ? error.message : "We could not send the invitation. Please try again."));
    } finally {
      setInviteSending(false);
    }
  };
  const revokeInvitation = async (cohostInvitationID: string) => {
    if (!listing?.organizationID || revokingInvitationID) return;
    setCohostInvitationsError("");
    setRevokingInvitationID(cohostInvitationID);
    try {
      await revokeCohostInvitation(cohostInvitationID);
      const [pendingInvitations, allInvitations] = await Promise.all([
        getCohostInvitationsByOrganization(listing.organizationID),
        getAllCohostInvitationsByOrganization(listing.organizationID),
      ]);
      setPendingCohostInvitations(pendingInvitations);
      setAllCohostInvitations(allInvitations);
      showSaveToast("Co-host invitation revoked successfully");
    } catch (error) {
      const apiMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCohostInvitationsError(apiMessage || (error instanceof Error ? error.message : "We could not revoke the invitation."));
    } finally {
      setRevokingInvitationID("");
    }
  };
  const reactivateInvitation = async (cohostInvitationID: string) => {
    if (!listing?.organizationID || reactivatingInvitationID) return;
    setCohostInvitationsError("");
    setReactivatingInvitationID(cohostInvitationID);
    try {
      await reactivateRevokedCohost(cohostInvitationID);
      const [pendingInvitations, allInvitations] = await Promise.all([
        getCohostInvitationsByOrganization(listing.organizationID),
        getAllCohostInvitationsByOrganization(listing.organizationID),
      ]);
      setPendingCohostInvitations(pendingInvitations);
      setAllCohostInvitations(allInvitations);
      showSaveToast("Co-host reactivated successfully");
    } catch (error) {
      const apiMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCohostInvitationsError(apiMessage || (error instanceof Error ? error.message : "We could not reactivate the co-host."));
    } finally {
      setReactivatingInvitationID("");
    }
  };
  const invitationStatus = (invitation: CohostInvitation) => {
    const status = invitation.status.toUpperCase();
    return ["PENDING", "INVITED"].includes(status) && new Date(invitation.expiresAtUtc).getTime() <= invitationReferenceTime ? "EXPIRED" : status;
  };
  const formatInviteDate = (value?: string | null) => value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
    : "Not available";
  const displayedCohostInvitations = cohostInvitationView === "pending" ? pendingCohostInvitations : allCohostInvitations;
  const cohostInvitationPanel: ReactElement = (
    <section className="hosting-editor-cohost-invitations" aria-label="Co-host invitations">
      <div className="hosting-editor-cohost-invitations-head">
        <div><h3>Invitations</h3><p>{cohostInvitationView === "pending" ? "Invites waiting for a response." : "Complete invitation history for this organization."}</p></div>
        <span>{cohostInvitationView === "pending" ? pendingCohostInvitations.length : allCohostInvitations.length}</span>
      </div>
      <div className="hosting-editor-cohost-invitation-tabs" role="tablist" aria-label="Invitation views">
        <button type="button" role="tab" aria-selected={cohostInvitationView === "pending"} className={cohostInvitationView === "pending" ? "is-active" : ""} onClick={() => setCohostInvitationView("pending")}>Pending <span>{pendingCohostInvitations.length}</span></button>
        <button type="button" role="tab" aria-selected={cohostInvitationView === "history"} className={cohostInvitationView === "history" ? "is-active" : ""} onClick={() => setCohostInvitationView("history")}>History <span>{allCohostInvitations.length}</span></button>
      </div>
      {cohostInvitationsLoading ? <p className="hosting-editor-cohost-invitations-state">Loading invitations...</p>
        : cohostInvitationsError ? <p className="hosting-editor-cohost-invitations-state is-error">{cohostInvitationsError}</p>
        : displayedCohostInvitations.length === 0 ? <p className="hosting-editor-cohost-invitations-state">{cohostInvitationView === "pending" ? "No pending invitations." : "No invitation history yet."}</p>
        : <div className="hosting-editor-cohost-invitation-list">{[...displayedCohostInvitations].sort((left, right) => new Date(right.updatedDateUtc || right.capturedDateUtc).getTime() - new Date(left.updatedDateUtc || left.capturedDateUtc).getTime()).map((invitation) => {
          const status = invitationStatus(invitation);
          const statusDate = status === "ACCEPTED" ? invitation.acceptedAtUtc : status === "DECLINED" ? invitation.declinedAtUtc : invitation.expiresAtUtc;
          return <article className="hosting-editor-cohost-invitation-card" key={invitation.cohostInvitationID}>
            <div className="hosting-editor-cohost-invitation-card-head"><span className={`status-${status.toLowerCase()}`}>{status}</span><small>{status === "PENDING" || status === "EXPIRED" ? "Expires" : "Updated"} {formatInviteDate(statusDate)}</small></div>
            {invitation.cohostName && <span className="hosting-editor-cohost-invitation-identity">{invitation.cohostName}</span>}
            <span className="hosting-editor-cohost-invitation-identity">{invitation.email}</span>
            <span className="hosting-editor-cohost-invitation-identity">{invitation.phoneNumber || "No phone number"}</span>
            <footer><span>{invitation.cohostAccess}</span>{["PENDING", "INVITED", "ACCEPTED"].includes(status) && <button type="button" disabled={Boolean(revokingInvitationID || reactivatingInvitationID)} onClick={() => void revokeInvitation(invitation.cohostInvitationID)}>{revokingInvitationID === invitation.cohostInvitationID ? "Revoking..." : status === "ACCEPTED" ? "Revoke access" : "Revoke invite"}</button>}{status === "REVOKED" && <button type="button" className="is-reactivate" disabled={Boolean(revokingInvitationID || reactivatingInvitationID)} onClick={() => void reactivateInvitation(invitation.cohostInvitationID)}>{reactivatingInvitationID === invitation.cohostInvitationID ? "Reactivating..." : "Reactivate co-host"}</button>}</footer>
          </article>;
        })}</div>}
    </section>
  );

  return (
    <main className="marketplace hosting-page hosting-editor-page">
      <HostingHeader />
      {saveToast && <div className="hosting-editor-save-toast" role="status">{saveToast}</div>}
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
            {(editorTab === "space" ? editorSections.filter((section) => section.key !== "link") : editorArrivalCards).map((section) => (
              <button
                type="button"
                key={section.key}
                className={`hosting-editor-card ${section.key === activeKey ? "is-active" : ""} ${(("thumbnail" in section) && section.thumbnail) || section.key === "location" || section.key === "host" ? "has-thumbnail" : ""} ${section.key === "host" ? "host-card" : ""} ${editorTab === "arrival" ? "arrival-card" : ""}`}
                onClick={() => { setActiveKey(section.key); setPhotoCategory(null); setSleepingRoom(null); setPricingView("main"); setAvailabilityView("main"); setAdvanceNoticeOpen(false); setDescriptionView(null); setAmenitiesMode("view"); setLocationDetail(null); setHouseRulesDetail(null); setSafetyDetail(null); setCancellationDetail(null); setCheckinDetail(null); }}
              >
                {editorTab === "space" && "thumbnail" in section && section.thumbnail && (
                  <div className="hosting-editor-card-thumb">
                    <img src={section.thumbnail} alt="" />
                    {section.key === "photos" && <span>{listing.listingPhotos?.length ?? 0} photos</span>}
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
                      <div className="hosting-editor-host-thumb-photo"><img src={hostPhoto} alt={hostName} /><span className="hosting-editor-host-thumb-badge"><ShieldIcon /></span></div>
                      <strong>{hostName}</strong>
                      <small><ShieldIcon /> {listing.rating > 0 ? `${listing.rating.toFixed(2)} rating` : "Host"}</small>
                    </div>
                    <div className="hosting-editor-host-thumb-stats">
                      <div><strong>{listing.reviews ?? 0}</strong><small>Reviews</small></div>
                      <div><strong>{listing.rating > 0 ? listing.rating.toFixed(2) : "0"} <StarIcon /></strong><small>Rating</small></div>
                      <div><strong>{hostingDuration.value}</strong><small>{hostingDuration.label}</small></div>
                    </div>
                  </div>
                )}
                {section.key === "cohosts" && (
                  <div className="hosting-editor-cohost-preview">
                    {orderedOrganizationMembers.map((member) => <div key={member.organizationMemberID}><img src={memberImage(member)} alt={memberName(member)} /><span><strong>{memberName(member)}</strong><small>{member.isPrimaryOwner ? "Listing owner" : member.roleName || "Co-host"}</small></span></div>)}
                  </div>
                )}
                {section.key !== "host" && section.key !== "cohosts" && !(editorTab === "arrival" && section.key === "arrival-checkin") && <strong>{section.label}</strong>}
                {editorTab === "arrival" ? (
                  section.key === "arrival-taxes" ? <div className="hosting-editor-taxes-preview"><div><CheckIcon /><span>Goods and Services Tax (Saskatchewan)</span></div><div><CheckIcon /><span>Saskatchewan Provincial Sales Tax</span></div></div> : section.key === "arrival-wifi" ? (
                    <small>Network: {wifiNetwork || "_____"}<br />Password: {wifiPassword || "_____"}</small>
                  ) : <small>{section.summary}</small>
                ) : section.key === "title" ? (
                  <small>{title}</small>
                ) : section.key === "propertyType" ? (
                  <small>{listingType} · {placeType}</small>
                ) : section.key === "sleeping" ? (
                  <small>{listing.rentalUnit?.bedrooms ?? 0} bedroom{listing.rentalUnit?.bedrooms === 1 ? "" : "s"} · {listing.rentalUnit?.beds ?? 0} bed{listing.rentalUnit?.beds === 1 ? "" : "s"} · {listing.rentalUnit?.bathrooms ?? 0} bath{listing.rentalUnit?.bathrooms === 1 ? "" : "s"}</small>
                ) : section.key === "pricing" ? (
                  <small>${formatCurrency(priceRange.min || "0")} CAD per month</small>
                ) : section.key === "discounts" ? (
                  <small>{quarterlyDiscount}% quarterly discount</small>
                ) : section.key === "availability" ? (
                  <>
                    <small>{availability.min} – {availability.max} month stays</small>
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
                  <small>{section.summary || "Add location"}</small>
                ) : section.key === "host" ? (
                  <small>{hostName} · {listing.reviews ?? 0} reviews</small>
                ) : section.key === "rules" ? (
                  <div className="hosting-editor-rules-preview"><div><ClockIcon /><span>Check-in after {checkInStart}</span></div><div><ClockIcon /><span>Checkout before {checkoutTime}</span></div><div><UsersIcon /><span>{guestsCount} guests maximum</span></div><small>+7 more</small></div>
                ) : section.key === "safety" ? (
                  <div className="hosting-editor-safety-preview">
                    {safetyAmenities.slice(0, 3).map((name) => <div key={name}>{name.toLowerCase().includes("camera") ? <CameraIcon /> : <ShieldIcon />}<span>{name} installed</span></div>)}
                    {safetyAmenities.length > 3 && <small>+{safetyAmenities.length - 3} more</small>}
                    {safetyAmenities.length === 0 && <small>Add details</small>}
                  </div>
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
                {activeArrivalCard.key === "arrival-wifi" && <><label className="hosting-editor-field"><span>Network name</span><input value={wifiNetwork} onChange={(event) => setWifiNetwork(event.target.value)} /></label><label className="hosting-editor-field"><span>Password</span><input value={wifiPassword} onChange={(event) => setWifiPassword(event.target.value)} /></label></>}
                {activeArrivalCard.key === "arrival-checkout" && <><p>Tell guests what to do before they leave.</p><textarea className="hosting-editor-arrival-textarea" placeholder="Add checkout instructions" value={checkoutInstructions} onChange={(event) => setCheckoutInstructions(event.target.value)} /></>}
                {activeArrivalCard.key === "arrival-requirements" && <div className="hosting-editor-requirements-page"><h3>Require a profile photo <button type="button" className={`hosting-editor-switch ${requireProfilePhoto ? "is-on" : ""}`} aria-label="Require a profile photo" aria-pressed={requireProfilePhoto} onClick={() => setRequireProfilePhoto((current) => !current)}><i /></button></h3><p>When turned on, guests who book your listing need a profile photo. You&apos;ll only see it after their booking is confirmed. <u>Learn more</u></p>{guestRequirementDetails && <p>{guestRequirementDetails}</p>}<div className="hosting-editor-requirements-list"><strong>All Arcora guests are required to:</strong><span>• Provide a confirmed email address and phone number</span><span>• Provide payment information</span><span>• Agree to your house rules</span><button type="button">Learn more <ChevIcon /></button></div></div>}
                {activeArrivalCard.key === "arrival-taxes" && <>{taxDetailOpen ? <div className="hosting-editor-tax-detail"><h3>Add a tax</h3><p>You can add one or more taxes to apply to your listing. <u>Learn more</u></p><label className="hosting-editor-tax-field is-required"><span>Tax name</span><CustomSelect value={taxName || "Select"} options={["Goods and Services Tax (Saskatchewan)", "Saskatchewan Provincial Sales Tax", "City tax"]} onChange={setTaxName} ariaLabel="Tax name" /></label><label className="hosting-editor-tax-field"><span>Tax type</span><CustomSelect value={taxType || "Select"} options={["Percentage", "Fixed amount"]} onChange={setTaxType} ariaLabel="Tax type" /></label><label className="hosting-editor-tax-field"><span>Tax rate</span><input value={taxRate} onChange={(event) => setTaxRate(event.target.value)} placeholder="Enter tax rate" /></label><label className="hosting-editor-tax-field"><span>Partial-stay exemption</span><input placeholder="Optional" /></label><label className="hosting-editor-tax-field"><span>Full-stay exemption</span><input placeholder="Optional" /></label><label className="hosting-editor-tax-field"><span>Accommodations tax registration number</span><input placeholder="Tax registration number" /></label><label className="hosting-editor-tax-terms"><input type="checkbox" /> <span>I confirm the tax information is correct and will remit any tax collected.</span></label></div> : <div className="hosting-editor-tax-overview"><p>Arcora automatically submits some taxes, and you can add other taxes you need to submit.</p><section><strong>Taxes Arcora submits</strong><small>We&apos;ll collect these taxes from guests on your behalf and submit payment to the designated tax authority. <u>Learn more</u></small><span><CheckIcon /> Goods and Services Tax (Saskatchewan)</span><span><CheckIcon /> Saskatchewan Provincial Sales Tax</span></section><section><strong>Add taxes you&apos;ll submit</strong><small>We&apos;ll collect these taxes from guests on your behalf and pass the funds on to you. You must submit payment to the correct tax authority. <u>Learn more</u></small><button type="button" onClick={() => setTaxDetailOpen(true)}>Add a tax</button></section></div>}</>}
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
                  <label className="hosting-editor-icon-button" aria-label="Add photos" title="Add photos">
                    <PlusIcon />
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { queueEditorPhotos(event.target.files); event.target.value = ""; }} />
                  </label>
                </div>
              </div>
              {photoCategory ? (
                <div className="hosting-editor-category-gallery">
                  <button type="button" className="hosting-editor-gallery-back" onClick={() => setPhotoCategory(null)}><ArrowLeftIcon /> All photos</button>
                  <h3>{photoCategory}</h3>
                  <div className="hosting-editor-photo-grid">{(listing.listingPhotos ?? []).filter((photo) => photoCategory === "Cover photo" ? photo.isCoverPhoto || photo.location === "CoverPhoto" : photoLocationLabel(photo.location) === photoCategory).sort((left, right) => left.displayOrder - right.displayOrder).map((photo, index, photos) => <div className="hosting-editor-gallery-photo" key={photo.listingPhotoID}><img src={photo.url} alt={photo.altText || `${photoCategory} photo ${index + 1}`} /><small>{index + 1} of {photos.length}</small></div>)}</div>
                </div>
              ) : <div className="hosting-editor-photo-grid">
                {editorPhotoRooms.map((room) => (
                  <button type="button" className="hosting-editor-photo-tile" key={room.label} onClick={() => setPhotoCategory(room.label)}>
                    <img src={room.photo} alt="" />
                    <strong>{room.label}</strong>
                    <span>{room.count} photo{room.count === 1 ? "" : "s"}</span>
                  </button>
                ))}
              </div>}
              {photoUploadOpen && <div className="hosting-photo-upload-modal-backdrop" role="presentation" onClick={(event) => { event.stopPropagation(); closeEditorPhotoUpload(); }}>
                <div className="hosting-photo-upload-modal hosting-editor-photo-upload-modal" role="dialog" aria-modal="true" aria-label="Upload photos" onClick={(event) => event.stopPropagation()}>
                  <div className="hosting-photo-upload-modal-header">
                    <button type="button" aria-label="Close" disabled={photoUploading} onClick={closeEditorPhotoUpload}>×</button>
                    <div><strong>Upload photos</strong><span>{pendingPhotoUploads.length} item{pendingPhotoUploads.length === 1 ? "" : "s"} selected</span></div>
                    <label aria-label="Add more photos" className={photoUploading ? "is-disabled" : ""}><PlusIcon /><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={photoUploading} onChange={(event) => { queueEditorPhotos(event.target.files); event.target.value = ""; }} /></label>
                  </div>
                  <div className="hosting-photo-upload-modal-grid">
                    {pendingPhotoUploads.map((item) => <div className="hosting-photo-upload-modal-item hosting-editor-photo-upload-item" key={item.id}>
                      <img src={item.url} alt={item.file.name} />
                      <button type="button" aria-label={`Remove ${item.file.name}`} disabled={photoUploading} onClick={() => removeQueuedEditorPhoto(item.id)}>×</button>
                      <label className="hosting-editor-photo-location">Location<CustomSelect value={photoLocationLabel(item.location)} options={photoLocationOptions.map((option) => option.label)} onChange={(value) => setPendingPhotoUploads((current) => current.map((photo) => photo.id === item.id ? { ...photo, location: photoLocationOptions.find((option) => option.label === value)?.value || "Additional" } : photo))} ariaLabel="Photo location" /></label>
                    </div>)}
                  </div>
                  <div className="hosting-photo-upload-modal-footer">
                    <span className={`hosting-photo-upload-status ${photoUploadError ? "is-error" : ""} ${photoUploading ? "is-uploading" : ""}`} role={photoUploadError ? "alert" : "status"}>{photoUploadError || (photoUploading ? "Uploading photos..." : "Ready to upload")}</span>
                    <button type="button" disabled={photoUploading} onClick={closeEditorPhotoUpload}>Cancel</button>
                    <button type="button" className="is-primary" disabled={pendingPhotoUploads.length === 0 || photoUploading} onClick={() => void uploadEditorPhotos()}>{photoUploading ? "Uploading..." : "Upload"}</button>
                  </div>
                </div>
              </div>}
            </div>
          )}

          {activeSection.kind === "property-type" && (
            <div className="hosting-editor-form">
              <h2>Property type</h2>
              <div className="hosting-editor-property-overview-card">
                <div className="hosting-editor-property-overview-header">
                  <div>
                    <span className="hosting-editor-property-overview-kicker">Property overview</span>
                    <strong>{propertyName || title || "Untitled stay"}</strong>
                  </div>
                  <span className="hosting-editor-property-overview-pill">Live</span>
                </div>
                {propertyInfoSaveError && <small className="hosting-editor-save-error" role="alert">{propertyInfoSaveError}</small>}
                <div className="hosting-editor-property-grid">
                  <label className="hosting-editor-field hosting-editor-property-field">
                    <span>Time zone</span>
                    <input value={timeZone} onChange={(event) => setTimeZone(event.target.value)} />
                  </label>
                  <label className="hosting-editor-field hosting-editor-property-field">
                    <span>Property name</span>
                    <input value={propertyName} onChange={(event) => setPropertyName(event.target.value)} />
                  </label>
                  <label className="hosting-editor-field hosting-editor-property-field">
                    <span>Unit name</span>
                    <input value={unitName} onChange={(event) => setUnitName(event.target.value)} />
                  </label>
                  <label className="hosting-editor-field hosting-editor-property-field">
                    <span>Bedrooms</span>
                    <input type="number" min="0" value={bedroomCount} onChange={(event) => setBedroomCount(event.target.value)} />
                  </label>
                  <label className="hosting-editor-field hosting-editor-property-field">
                    <span>Bathrooms</span>
                    <input type="number" min="0" step="0.5" value={bathroomCount} onChange={(event) => setBathroomCount(event.target.value)} />
                  </label>
                  <label className="hosting-editor-field hosting-editor-property-field">
                    <span>Beds</span>
                    <input type="number" min="0" value={bedCount} onChange={(event) => setBedCount(event.target.value)} />
                  </label>
                </div>
              </div>
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
                  options={listingTypeOptions.map((item) => item.name)}
                  onChange={setListingType}
                  ariaLabel="Listing type"
                />
                <small>Guests have the whole place to themselves. This usually includes a bedroom, a bathroom, and a kitchen.</small>
              </label>
              <div className="hosting-editor-counter-row">
                <span>How many floors in the building?</span>
                <div className="hosting-editor-counter"><button type="button" aria-label="Decrease building floors" disabled={buildingFloorCount <= 1} onClick={() => { const nextCount = Math.max(1, buildingFloorCount - 1); setBuildingFloorCount(nextCount); setListingFloorNumber((current) => Math.min(current, nextCount)); }}>−</button><strong>{buildingFloorCount}</strong><button type="button" aria-label="Increase building floors" onClick={() => setBuildingFloorCount((current) => current + 1)}>+</button></div>
              </div>
              <div className="hosting-editor-counter-row">
                <span>Which floor is the listing on?</span>
                <div className="hosting-editor-counter"><button type="button" aria-label="Decrease listing floor" disabled={listingFloorNumber <= 0} onClick={() => setListingFloorNumber((current) => Math.max(0, current - 1))}>−</button><strong>{listingFloorNumber}</strong><button type="button" aria-label="Increase listing floor" disabled={listingFloorNumber >= buildingFloorCount} onClick={() => setListingFloorNumber((current) => Math.min(buildingFloorCount, current + 1))}>+</button></div>
              </div>
              <label className="hosting-editor-field">
                <span>Year built</span>
                <input className="hosting-editor-title-input" value={yearBuilt} onChange={(event) => setYearBuilt(event.target.value)} />
              </label>
              <div className="hosting-editor-field-row">
                <label className="hosting-editor-field">
                  <span>Property size</span>
                  <input className="hosting-editor-title-input" placeholder="0" value={propertySize} onChange={(event) => setPropertySize(event.target.value)} />
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
                <span>${formatCurrency(priceRange.min || "0")} CAD – ${formatCurrency(priceRange.max || "0")} CAD</span>
              </button>
              <div className="hosting-editor-security-deposit-summary">
                <span>Security deposit</span>
                <strong>${formatCurrency(securityDeposit || "0")} CAD</strong>
              </div>
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
              <label className="hosting-editor-price-field hosting-editor-security-deposit-field">
                <span>Security deposit</span>
                <div>
                  <b>$</b>
                  <input
                    value={securityDeposit}
                    inputMode="numeric"
                    onChange={(event) => setSecurityDeposit(formatAmount(event.target.value))}
                    placeholder="0"
                  />
                </div>
              </label>
              {propertyInfoSaveError && <small className="hosting-editor-save-error" role="alert">{propertyInfoSaveError}</small>}
            </div>
          )}

          {activeSection.kind === "discount" && (() => {
            const monthlyPrice = (Number(priceRange.min.replace(/,/g, "")) + Number(priceRange.max.replace(/,/g, ""))) / 2 || 0;
            const monthlyAverage = (months: number, rate: string) => Math.round((monthlyPrice * months * (1 - Number(rate || 0) / 100)) / months).toLocaleString("en-US");
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
                        value={quarterlyDiscount}
                        inputMode="numeric"
                        maxLength={2}
                        onChange={(event) => setQuarterlyDiscount(event.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                      />
                      <span>%</span>
                    </div>
                    <small>{"Quarterly average is $" + monthlyAverage(3, quarterlyDiscount) + " CAD"}</small>
                  </div>
                </div>
                <div className="hosting-editor-discount-card">
                  <div className="hosting-editor-discount-card-head">
                    <span>Semi-Yearly</span> · For 180 nights or more
                  </div>
                  <div className="hosting-editor-discount-card-body">
                    <div className="hosting-editor-discount-value">
                      <input
                        value={semiAnnualDiscount}
                        inputMode="numeric"
                        maxLength={2}
                        onChange={(event) => setSemiAnnualDiscount(event.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                      />
                      <span>%</span>
                    </div>
                    <small>{"Semi-Yearly average is $" + monthlyAverage(6, semiAnnualDiscount) + " CAD"}</small>
                  </div>
                </div>
                <div className="hosting-editor-discount-card">
                  <div className="hosting-editor-discount-card-head">
                    <span>Yearly</span> · For 365 nights
                  </div>
                  <div className="hosting-editor-discount-card-body">
                    <div className="hosting-editor-discount-value">
                      <input
                        value={yearlyDiscount}
                        inputMode="numeric"
                        maxLength={2}
                        onChange={(event) => setYearlyDiscount(event.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                      />
                      <span>%</span>
                    </div>
                    <small>{"Yearly average is $" + monthlyAverage(12, yearlyDiscount) + " CAD"}</small>
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
                <span>Minimum month(s)</span>
                <strong>{availability.min}</strong>
              </button>
              <button type="button" className="hosting-editor-avail-card" onClick={() => setAvailabilityView("max")}>
                <span>Maximum month(s)</span>
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
                    <div className="hosting-editor-toggle-row is-read-only">
                      <div>
                        <strong>Allow requests for the same day</strong>
                        <span>{availability.advanceNotice === "Same day" ? "Yes, same-day requests are allowed." : "No, same-day requests are not allowed."}</span>
                      </div>
                      <strong>{availability.advanceNotice === "Same day" ? "Yes" : "No"}</strong>
                    </div>
                    <button type="button" className="hosting-editor-save hosting-editor-advance-save" disabled={propertyInfoSaving} onClick={() => void saveAvailability()}>{propertyInfoSaving ? "Saving..." : "Save"}</button>
                  </div>
                )}
              </div>
              <div className="hosting-editor-avail-card is-static">
                <span>Same day advance notice</span>
                <strong className="is-regular">{availability.advanceNotice === "Same day" ? "Yes" : "No"}</strong>
              </div>
              {propertyInfoSaveError && <small className="hosting-editor-save-error" role="alert">{propertyInfoSaveError}</small>}
              <button type="button" className="hosting-editor-callout-link">
                <ExternalLinkIcon /> Find more availability settings like these in the calendar
              </button>
            </div>
          )}

          {activeSection.kind === "availability" && availabilityView !== "main" && (
            <div className="hosting-editor-form">
              <h2>{availabilityView === "min" ? "Minimum month(s)" : "Maximum month(s)"}</h2>
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
              {propertyInfoSaveError && <small className="hosting-editor-save-error" role="alert">{propertyInfoSaveError}</small>}
            </div>
          )}

          {activeSection.kind === "description" && !descriptionView && (
            <div className="hosting-editor-form">
              <h2>Description</h2>
              <div className="hosting-editor-desc-list">
                {descriptionItems.filter((item) => !["access", "interaction", "notes"].includes(item.key)).map((item) => (
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
                {propertyInfoSaveError && <small className="hosting-editor-save-error" role="alert">{propertyInfoSaveError}</small>}
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
              {propertyInfoSaveError && <small className="hosting-editor-save-error" role="alert">{propertyInfoSaveError}</small>}
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
              {propertyInfoSaveError && <small className="hosting-editor-save-error" role="alert">{propertyInfoSaveError}</small>}
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
                <input className="hosting-editor-title-input" value={title} onChange={(event) => { setTitle(event.target.value); setTitleSaveError(""); }} placeholder="e.g. Daisy's Inn" maxLength={50} />
                <small>{title.length}/50</small>
                {titleSaveError && <small className="hosting-editor-save-error" role="alert">{titleSaveError}</small>}
              </label>
            </div>
          )}

          {activeSection.kind === "text" && activeSection.key === "booking" && (
            <div className="hosting-editor-booking-form">
              <h2>Booking settings</h2>
              <div ref={instantBookRef} className={`hosting-editor-booking-primary ${instantBook ? "is-on" : ""}`} role="button" tabIndex={0} onClick={() => setInstantBook(true)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setInstantBook(true); }}>
                <div className="hosting-editor-booking-primary-head"><div><strong>Use Instant Book</strong><p>Let guests book automatically, which can help you get more bookings.</p></div><span className="hosting-editor-booking-symbol">ϟ</span></div>
                <div className="hosting-editor-booking-option"><span><strong>Require a good track record</strong><small>Only allow guests who have stayed on Arcora without issues. <u>Learn more</u></small></span><button type="button" className={`hosting-editor-switch ${trackRecord ? "is-on" : ""}`} aria-label="Require a good track record" aria-pressed={trackRecord} onClick={(event) => { event.stopPropagation(); setTrackRecord((current) => !current); }}><i /></button></div>
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
              <button type="button" className="hosting-editor-rule-detail-row" onClick={() => setHouseRulesDetail("times")}><span><strong>Check-in and checkout times</strong><small>Arrive between {checkInStart} - {checkInEnd}<br />Leave before {checkoutTime}</small></span><ChevIcon /></button>
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
            <div className="hosting-editor-safety-layout"><div className="hosting-editor-safety-overview"><h2>Guest safety</h2><p>The safety details you share will appear on your listing, along with information like your House Rules.</p><button type="button" className={safetyDetail === "considerations" ? "is-active" : ""} onClick={() => setSafetyDetail("considerations")}><span><strong>Safety considerations</strong><small>Add details</small></span><ChevIcon /></button><button type="button" className={safetyDetail === "devices" ? "is-active" : ""} onClick={() => setSafetyDetail("devices")}><span><strong>Safety devices</strong><small>{safetyAmenities.length > 0 ? safetyAmenities.slice(0, 3).join(" · ") : "Add details"}</small></span><ChevIcon /></button><button type="button" className={safetyDetail === "property" ? "is-active" : ""} onClick={() => setSafetyDetail("property")}><span><strong>Property info</strong><small>Add details</small></span><ChevIcon /></button></div>{safetyDetail && <div className="hosting-editor-safety-detail"><h2>{safetyDetail === "considerations" ? "Safety considerations" : safetyDetail === "devices" ? "Safety devices" : "Property info"}</h2>{(safetyDetail === "considerations" ? ["Not a good fit for children 2 – 12", "Not a good fit for infants under 2", "Pool or hot tub doesn’t have a gate or lock", "Nearby water, like a lake or river", "Climbing or play structure(s) on the property"] : safetyDetail === "devices" ? safetyAmenities : ["Smoking allowed", "Pets allowed", "Parking available"]).map((item) => { const choice = safetyChoices[item] || "yes"; return <div className="hosting-editor-safety-option" key={item}><span><strong>{item}</strong><small>Guests should know about this feature or consideration before booking.</small></span><div><button type="button" className={choice === "no" ? "is-selected" : ""} aria-label={`Not ${item}`} onClick={() => setSafetyChoice(item, "no")}>×</button><button type="button" className={choice === "yes" ? "is-selected" : ""} aria-label={`Yes ${item}`} onClick={() => setSafetyChoice(item, "yes")}>✓</button></div></div>; })}</div>}</div>
          )}

          {activeSection.key === "cancellation" && !cancellationDetail && (
            <div className="hosting-editor-cancellation-form"><h2>Cancellation policy</h2><button type="button" className="hosting-editor-cancellation-card" onClick={() => setCancellationDetail("lastMinute")}><span><strong>Short-term stays</strong><small>For less than 35 nights</small><b>{shortTermPolicy}</b></span><span className="hosting-editor-cancellation-card-link">Add a policy for last-minute bookings <ChevIcon /></span></button><button type="button" className="hosting-editor-cancellation-card" onClick={() => setCancellationDetail("longTerm")}><span><strong>Long-term stays</strong><small>For 35 nights or more</small><b>{longTermPolicy}</b></span></button><p className="hosting-editor-cancellation-help">All standard stay policies include a 24-hour free cancellation period. Review the full policies in the <u>Help Center</u>.</p></div>
          )}

          {activeSection.key === "cancellation" && cancellationDetail && (
            <div className="hosting-editor-cancellation-detail"><h2>{cancellationDetail === "lastMinute" ? "Last-minute bookings" : "Long-term stays"}</h2><small>{cancellationDetail === "lastMinute" ? "0 – 14 days before arrival" : "For 35 nights or more"}</small><div className="hosting-editor-policy-options">{(cancellationDetail === "lastMinute" ? [["Flexible", "Full refund at least 1 day before check-in", "Partial refund within 1 day of check-in"], ["Moderate", "Full refund at least 5 days before check-in", "Partial refund within 5 days of check-in"], ["Limited", "Full refund at least 14 days before check-in", "Partial refund 7–14 days before check-in"]] : [["Firm Long Term", "Full refund up to 30 days before check-in", "After that, the first 30 days of the stay are non-refundable"], ["Strict Long Term", "Full refund if canceled within 48 hours of booking and at least 28 days before check-in", "After that, the first 30 days of the stay are non-refundable"]]).map(([name, line1, line2]) => <button type="button" key={name} className={(cancellationDetail === "lastMinute" ? shortTermPolicy : longTermPolicy) === name ? "is-selected" : ""} onClick={() => cancellationDetail === "lastMinute" ? setShortTermPolicy(name) : setLongTermPolicy(name)}><strong>{name}</strong><small>• {line1}<br />• {line2}</small></button>)}</div></div>
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
                {orderedOrganizationMembers.map((member) => <button type="button" key={member.organizationMemberID} className={`hosting-editor-cohost-card ${selectedCohost === member.organizationMemberID && cohostView === "detail" ? "is-active" : ""}`} onClick={() => { setSelectedCohost(member.organizationMemberID); setCohostView("detail"); }}><img src={memberImage(member)} alt={memberName(member)} />{member.isPrimaryOwner && <small>Primary Host</small>}<strong>{memberName(member)}</strong><span>{member.isPrimaryOwner ? "Listing owner" : member.roleName || "Co-host"}</span></button>)}
                <button type="button" className={`hosting-editor-cohost-card hosting-editor-cohost-add-card ${cohostView === "add" ? "is-active" : ""}`} onClick={() => setCohostView("add")}><i><PlusIcon /></i><strong>Add a co-host</strong></button>
              </div><a href="#feedback">Give feedback</a></div>
              {cohostView === "overview" && <div className="hosting-editor-cohost-detail">{cohostInvitationPanel}</div>}
              {cohostView === "detail" && selectedMember && <div className="hosting-editor-cohost-detail"><img src={memberImage(selectedMember)} alt={memberName(selectedMember)} /><small>{selectedMember.isPrimaryOwner ? "Primary Host" : "Co-host"}</small><h2>{memberName(selectedMember)}</h2><u>{selectedMember.user?.email || "No email available"}{selectedMember.user?.phoneNumber ? ` · ${selectedMember.user.phoneNumber}` : ""}</u><h3>Permissions</h3><div className="hosting-editor-cohost-detail-row"><strong>{selectedMember.isPrimaryOwner ? "Listing owner" : selectedMember.roleName || "Co-host"}</strong><span>Access to the hosting tools assigned to this organization member.</span></div><h3>{selectedMember.isPrimaryOwner ? "Primary Host" : "Activity log"}</h3><div className="hosting-editor-cohost-detail-row"><strong>{selectedMember.isPrimaryOwner ? "Yes" : "Your activity"}</strong><span>View and manage this co-host&apos;s listing access.</span></div></div>}
              {cohostView === "add" && <div className="hosting-editor-cohost-detail"><h2>Add a co-host</h2><button type="button" className="hosting-editor-cohost-option" onClick={() => { setInviteStep(1); setInviteDialogOpen(true); }}><MailIcon /><strong>Invite someone you know</strong><span>Text or email them an invitation to help.</span></button>{cohostInvitationPanel}</div>}
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
                  ["address", "Address", [addressFields.line1, addressFields.city, addressFields.provinceCode, addressFields.postalCode].filter(Boolean).join(", ")],
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
                  {locationDetail === "address" && <><h2>Address</h2><div className="hosting-editor-address-fields"><label>Street address<input value={addressFields.line1} onChange={(event) => setAddressFields((current) => ({ ...current, line1: event.target.value }))} /></label><label>Apt, suite, unit (if applicable)<input value={listing.rentalUnit?.unitNumber || ""} readOnly /></label><label>City / municipality<input value={addressFields.city} onChange={(event) => setAddressFields((current) => ({ ...current, city: event.target.value }))} /></label><label>Province / territory<input value={addressFields.provinceCode} onChange={(event) => setAddressFields((current) => ({ ...current, provinceCode: event.target.value }))} /></label><label>Postal code<input value={addressFields.postalCode} onChange={(event) => setAddressFields((current) => ({ ...current, postalCode: event.target.value }))} /></label></div></>}
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
              <section className="hosting-editor-organization-card" aria-label="Organization information">
                <div className="hosting-editor-organization-mark"><HomeIcon /></div>
                <div className="hosting-editor-organization-content">
                  <div className="hosting-editor-organization-heading">
                    <div>
                      <span className="hosting-editor-organization-kicker">Organization</span>
                      <h3>{listing.organization?.displayName || listing.organization?.legalName || "Organization"}</h3>
                    </div>
                    <span className="hosting-editor-organization-badge">{listing.organization?.isPersonal ? "Personal" : "Business"}</span>
                  </div>
                  <div className="hosting-editor-organization-details">
                    <span><strong>Type</strong>{listing.organization?.isPersonal ? "Personal account" : "Business account"}</span>
                    {!listing.organization?.isPersonal && listing.organization?.businessNumber && <span><strong>Business number</strong>{listing.organization.businessNumber}</span>}
                  </div>
                </div>
              </section>
              <div className="hosting-editor-host-profile">
                <div className="hosting-editor-host-profile-photo"><img src={hostPhoto} alt={hostName} /><button type="button" aria-label="Edit host photo" onClick={() => { setHostPhotoDraft(hostPhoto); setHostPhotoDialogOpen(true); }}><CameraIcon /> Edit</button></div>
                <h3>{hostName}</h3>
                <p>{listing.reviews ?? 0} reviews · {listing.rating > 0 ? `${listing.rating.toFixed(2)} rating` : "0 rating"} · {listing.organization?.isPersonal ? "Personal host" : "Business host"}</p>
                <p>Hosts and guests can see your profile and it may appear across Arcora to help us build trust in our community. <u>Learn more</u></p>
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
                <div className="hosting-editor-photo-dialog-actions"><button type="button" className="hosting-editor-cancel" onClick={() => setHostPhotoDialogOpen(false)}>Cancel</button><button type="button" className="hosting-editor-save" disabled={propertyInfoSaving} onClick={() => { setHostPhoto(hostPhotoDraft); setHostPhotoDialogOpen(false); void saveHostMember({ profilePhotoUrl: hostPhotoDraft }, "Host photo saved successfully"); }}><CheckIcon /> {propertyInfoSaving ? "Saving..." : "Save"}</button></div>
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
                <div className="hosting-editor-photo-dialog-actions"><button type="button" className="hosting-editor-cancel" onClick={() => setHostFactDialog(null)}>Cancel</button><button type="button" className="hosting-editor-save" disabled={propertyInfoSaving} onClick={() => { const field = hostFactField(item.key); setHostFacts((current) => ({ ...current, [item.key]: hostFactDraft })); setHostFactDialog(null); if (field) void saveHostMember({ [field]: hostFactDraft }, `${item.label} saved successfully`); }}><CheckIcon /> {propertyInfoSaving ? "Saving..." : "Save"}</button></div>
              </div>
            </div>;
          })()}
          {inviteDialogOpen && <div className="hosting-editor-photo-dialog-backdrop" role="presentation" onClick={() => setInviteDialogOpen(false)}>
            <div className="hosting-editor-photo-dialog hosting-editor-invite-dialog" role="dialog" aria-modal="true" aria-labelledby="invite-dialog-title" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="hosting-editor-photo-dialog-close" aria-label="Close invite dialog" onClick={() => setInviteDialogOpen(false)}>×</button>
              {inviteStep === 1 && <><h2 id="invite-dialog-title">Add your co-host&apos;s info</h2><p>Enter their name and the contact details that should receive the invite.</p><div className="hosting-editor-invite-fields"><label>Country code<select><option>Canada (+1)</option><option>United States (+1)</option><option>United Kingdom (+44)</option></select></label><label>Phone number<input value={invitePhone} onChange={(event) => setInvitePhone(event.target.value)} placeholder="Phone number" /></label></div><input className="hosting-editor-invite-email" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="Email" /><input className="hosting-editor-invite-email hosting-editor-invite-name" value={inviteName} maxLength={150} onChange={(event) => setInviteName(event.target.value)} placeholder="Full name" /></>}
              {inviteStep === 2 && <><h2 id="invite-dialog-title">Set your co-host&apos;s permissions</h2><p>You can always change this later. <u>Learn how permissions work</u></p><div className="hosting-editor-permission-options">{cohostPermissionOptions.map(([label, detail]) => <label key={label}><span><strong>{label}</strong><small>{detail}</small></span><input type="radio" name="invite-permission" checked={invitePermission === label} onChange={() => setInvitePermission(label)} /><i /></label>)}</div></>}
              {inviteStep === 3 && <><h2 id="invite-dialog-title">Review your invite</h2><img className="hosting-editor-invite-listing-photo" src={photoRooms[0].photo} alt="Daisy's Inn" /><div className="hosting-editor-invite-review"><strong>Daisy&apos;s Inn</strong><small>Saskatoon</small><strong>Co-host&apos;s name</strong><small>{inviteName}</small><strong>Co-host&apos;s email</strong><small>{inviteEmail}</small><strong>Permissions</strong><small>{invitePermission}<br />View calendar and message guests</small></div><p className="hosting-editor-invite-terms">By selecting &quot;Send," you agree to the <u>Co-Host Terms</u>.</p></>}
              {inviteError && <small className="hosting-editor-save-error" role="alert">{inviteError}</small>}
              <div className="hosting-editor-photo-dialog-actions"><button type="button" className="hosting-editor-cancel" disabled={inviteSending} onClick={() => inviteStep === 1 ? setInviteDialogOpen(false) : setInviteStep((inviteStep - 1) as 1 | 2 | 3)}>{inviteStep === 1 ? "Cancel" : "Back"}</button><button type="button" className="hosting-editor-save" disabled={inviteSending || (inviteStep === 1 && (!inviteName.trim() || !inviteEmail.trim() || !invitePhone.trim()))} onClick={() => inviteStep === 3 ? void sendCohostInvite() : setInviteStep((inviteStep + 1) as 1 | 2 | 3)}>{inviteSending ? "Sending..." : inviteStep === 3 ? "Send" : "Next"}</button></div>
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
              <button type="button" className="hosting-editor-save" disabled={propertyInfoSaving} onClick={() => void savePricing()}><CheckIcon /> {propertyInfoSaving ? "Saving..." : "Save"}</button>
            </footer>
          )}

          {activeSection.kind === "availability" && availabilityView !== "main" && (
            <footer className="hosting-editor-footer is-split">
              <button type="button" className="hosting-editor-cancel" onClick={() => setAvailabilityView("main")}>Cancel</button>
              <button type="button" className="hosting-editor-save" disabled={propertyInfoSaving} onClick={() => void saveAvailability()}><CheckIcon /> {propertyInfoSaving ? "Saving..." : "Save"}</button>
            </footer>
          )}

          {activeSection.kind === "description" && descriptionView && (
            <footer className="hosting-editor-footer is-split">
              <button type="button" className="hosting-editor-cancel" onClick={() => setDescriptionView(null)}>Cancel</button>
              <button type="button" className="hosting-editor-save" disabled={propertyInfoSaving} onClick={() => void saveDescription()}><CheckIcon /> {propertyInfoSaving ? "Saving..." : "Save"}</button>
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
              <button
                type="button"
                className="hosting-editor-save"
                disabled={
                  (activeSection.key === "title" && (titleSaving || !title.trim())) ||
                  (activeSection.kind === "property-type" && propertyInfoSaving) ||
                  (activeSection.kind === "discount" && propertyInfoSaving) ||
                  (activeSection.kind === "availability" && propertyInfoSaving) ||
                  (activeSection.kind === "guests" && propertyInfoSaving)
                }
                onClick={
                  activeSection.key === "title"
                    ? () => void saveTitle()
                    : activeSection.kind === "property-type"
                      ? () => void savePropertyDetails()
                      : activeSection.kind === "discount"
                        ? () => void saveDiscounts()
                      : activeSection.kind === "availability"
                        ? () => void saveAvailability()
                      : activeSection.kind === "guests"
                        ? () => void saveGuestCount()
                      : undefined
                }
              >
                <CheckIcon />
                {activeSection.key === "title" && titleSaving
                  ? "Saving..."
                  : activeSection.kind === "property-type" && propertyInfoSaving
                    ? "Saving..."
                    : activeSection.kind === "discount" && propertyInfoSaving
                      ? "Saving..."
                    : activeSection.kind === "availability" && propertyInfoSaving
                      ? "Saving..."
                    : activeSection.kind === "guests" && propertyInfoSaving
                      ? "Saving..."
                    : "Save"}
              </button>
            </footer>
          )}
        </section>
      </div>
    </main>
  );
}
