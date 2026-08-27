import type { ReactElement } from "react";
import { BellIcon, CreditCardIcon, GlobeIcon, PadlockIcon, ShieldIcon, UserIcon } from "../../components/Icons";

export type SettingsItemKey = "personal" | "security" | "privacy" | "notifications" | "taxes" | "payments" | "languages";
type SettingsItem = { key: SettingsItemKey; label: string; icon: ReactElement };

export const settingsItems: SettingsItem[] = [
  { key: "personal", label: "Personal information", icon: <UserIcon /> },
  { key: "security", label: "Login & security", icon: <PadlockIcon /> },
  { key: "privacy", label: "Privacy", icon: <ShieldIcon /> },
  { key: "notifications", label: "Notifications", icon: <BellIcon /> },
  { key: "taxes", label: "Taxes", icon: <CreditCardIcon /> },
  { key: "payments", label: "Payments", icon: <CreditCardIcon /> },
  { key: "languages", label: "Languages & currency", icon: <GlobeIcon /> },
];
