import { settingsItems, type SettingsItemKey } from "./AccountSettingsItems";

export function AccountSettingsHeader() {
  return <header className="account-settings-header"><a className="marketplace-brand account-settings-logo" href="/" aria-label="Arcora home"><span className="marketplace-brand-mark"><span className="marketplace-brand-letter">a</span></span><span>arcora</span></a><button type="button" className="account-settings-done" onClick={() => window.history.back()}>Done</button></header>;
}

type AccountSettingsSidebarProps = {
  activeKey: SettingsItemKey;
  onSelect: (key: SettingsItemKey) => void;
};

export function AccountSettingsSidebar({ activeKey, onSelect }: AccountSettingsSidebarProps) {
  return <aside className="account-settings-sidebar"><h1>Account settings</h1><nav aria-label="Account settings navigation">{settingsItems.map((item) => <button type="button" key={item.key} className={item.key === activeKey ? "is-active" : ""} onClick={() => onSelect(item.key)}>{item.icon}<span>{item.label}</span></button>)}</nav></aside>;
}
