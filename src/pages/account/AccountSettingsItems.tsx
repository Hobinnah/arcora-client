import type { ReactElement } from "react";
import { BarChartIcon, BellIcon, CreditCardIcon, GlobeIcon, HomeIcon, PadlockIcon, ShieldIcon, UsersIcon, UserIcon } from "../../components/Icons";

export type SettingsItemKey = "personal" | "security" | "privacy" | "notifications" | "taxes" | "payments" | "languages" | "organization" | "earnings" | "cohosts" | "host-verification" | "deposits";
type SettingsItem = { key: SettingsItemKey; label: string; icon: ReactElement; href?: string };

export const settingsItems: SettingsItem[] = [
  { key: "personal", label: "Personal information", icon: <UserIcon /> },
  { key: "security", label: "Login & security", icon: <PadlockIcon /> },
  { key: "privacy", label: "Privacy", icon: <ShieldIcon /> },
  { key: "notifications", label: "Notifications", icon: <BellIcon /> },
  { key: "taxes", label: "Taxes", icon: <CreditCardIcon /> },
  { key: "payments", label: "Payments", icon: <CreditCardIcon /> },
  { key: "languages", label: "Languages & currency", icon: <GlobeIcon /> },
  { key: "organization", label: "Organization", icon: <HomeIcon /> },
  { key: "earnings", label: "Earnings & payouts", icon: <BarChartIcon />, href: "/hosting/earnings" },
  { key: "cohosts", label: "Co-hosts & access", icon: <UsersIcon />, href: "/hosting/cohosts" },
  { key: "host-verification", label: "Host verification", icon: <ShieldIcon />, href: "/hosting/verification" },
  { key: "deposits", label: "Security deposits", icon: <CreditCardIcon />, href: "/hosting/deposits" },
];
