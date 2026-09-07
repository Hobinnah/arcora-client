import { settingsItems, type SettingsItemKey } from "./AccountSettingsItems";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function AccountSettingsHeader() {
  return <header className="account-settings-header"><a className="marketplace-brand account-settings-logo" href="/" aria-label="Arcora home"><span className="marketplace-brand-mark"><span className="marketplace-brand-letter">a</span></span><span>arcora</span></a><button type="button" className="account-settings-done" onClick={() => window.history.back()}>Done</button></header>;
}

type AccountSettingsSidebarProps = {
  activeKey: SettingsItemKey;
  onSelect: (key: SettingsItemKey) => void;
};

export function AccountSettingsSidebar({ activeKey, onSelect }: AccountSettingsSidebarProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isLandlord = (currentUser?.user?.roles || []).some((role) => role.toLowerCase() === "landlord");
  const visibleItems = settingsItems.filter((item) => !["organization", "earnings", "cohosts", "host-verification", "deposits"].includes(item.key) || isLandlord);
  return <aside className="account-settings-sidebar"><h1>Account settings</h1><nav aria-label="Account settings navigation">{visibleItems.map((item) => <button type="button" key={item.key} className={item.key === activeKey ? "is-active" : ""} onClick={() => item.href ? navigate(item.href) : onSelect(item.key)}>{item.icon}<span>{item.label}</span></button>)}</nav></aside>;
}
