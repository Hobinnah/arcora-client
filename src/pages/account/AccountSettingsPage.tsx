import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../../components/CustomSelect";
import { useAccount } from "../../apis/useAccount";
import { CANADA_PROVINCES, getLandlordOrganization, saveLandlordOrganization } from "../../apis/useLandlordOrganization";
import { useVerificationCenter } from "../../apis/useVerificationCenter";
import { useAuth } from "../../hooks/useAuth";
import type { AccountProfile, AccountSettings as AccountSettingsData, ChangePasswordRequest } from "../../types/Account";
import type { Organization } from "../../types/Organization";
import { AccountSettingsHeader, AccountSettingsSidebar } from "./AccountSettingsNavigation";
import { settingsItems, type SettingsItemKey } from "./AccountSettingsItems";
import "../../marketplace/MarketplaceHome.css";
import "./AccountSettingsPage.css";

const defaultPreferences: AccountSettingsData = {
  emailNotifications: true,
  smsNotifications: false,
  language: "English",
  timezone: "America/Regina",
  currency: "CAD",
};

const currencyNames: Record<string, string> = {
  CAD: "Canadian dollar",
  USD: "United States dollar",
  EUR: "Euro",
  GBP: "British pound",
};

const currencyCodes = Object.fromEntries(
  Object.entries(currencyNames).map(([code, name]) => [name, code]),
);

const timezoneOptions = [
  "America/Regina",
  "America/Vancouver",
  "America/Toronto",
  "America/Halifax",
  "UTC",
];

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getProfile, getSettings, updateProfile, updateSettings, changePassword } = useAccount();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const isLandlord = [...(currentUser?.roles ?? []), ...(currentUser?.user?.roles ?? [])]
    .some((role) => role.toLowerCase() === "landlord");
  const verification = useVerificationCenter(userID);
  const { ensureEmailVerified } = verification;
  const [activeKey, setActiveKey] = useState<SettingsItemKey>("personal");
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [preferencesError, setPreferencesError] = useState("");
  const [preferencesMessage, setPreferencesMessage] = useState("");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationLoadedForUserID, setOrganizationLoadedForUserID] = useState<string | number | null>(null);
  const [organizationSaving, setOrganizationSaving] = useState(false);
  const [organizationError, setOrganizationError] = useState("");
  const [organizationMessage, setOrganizationMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const organizationLoading = activeKey === "organization" && isLandlord && Boolean(userID) && organizationLoadedForUserID !== userID;

  useEffect(() => {
    if (!userID) return;

    let cancelled = false;
    void ensureEmailVerified();
    getProfile()
      .then((response) => {
        if (cancelled || !response.data) return;
        const loadedProfile = response.data as AccountProfile;
        setProfile(loadedProfile);
        setFirstName(loadedProfile.firstName);
        setLastName(loadedProfile.lastName);
        setPhone(loadedProfile.phone ?? "");
      })
      .catch((error: unknown) => {
        if (!cancelled) setProfileError(error instanceof Error ? error.message : "We could not load your profile.");
      })
      .finally(() => { if (!cancelled) setProfileLoading(false); });

    getSettings()
      .then((response) => {
        if (!cancelled && response.data) setPreferences(response.data as AccountSettingsData);
      })
      .catch((error: unknown) => {
        if (!cancelled) setPreferencesError(error instanceof Error ? error.message : "We could not load your preferences.");
      })
      .finally(() => { if (!cancelled) setPreferencesLoading(false); });

    return () => { cancelled = true; };
  }, [ensureEmailVerified, getProfile, getSettings, userID]);

  useEffect(() => {
    if (activeKey !== "organization" || !isLandlord || !userID) return;
    let cancelled = false;
    getLandlordOrganization(userID)
      .then((result) => {
        if (!cancelled) {
          setOrganization(result);
          setOrganizationLoadedForUserID(userID);
          setOrganizationError(result ? "" : "No organization is linked to this account.");
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setOrganizationError(error instanceof Error ? error.message : "We could not load your organization.");
          setOrganizationLoadedForUserID(userID);
        }
      });
    return () => { cancelled = true; };
  }, [activeKey, isLandlord, userID]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileMessage("");
    try {
      const response = await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() });
      if (response.data) setProfile(response.data as AccountProfile);
      setProfileMessage("Profile changes saved.");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "We could not save your profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const savePreferences = async (patch: Partial<AccountSettingsData>) => {
    setPreferencesSaving(true);
    setPreferencesError("");
    setPreferencesMessage("");
    try {
      const response = await updateSettings({ ...preferences, ...patch });
      if (response.data) setPreferences(response.data as AccountSettingsData);
      setPreferencesMessage("Your preferences have been saved.");
    } catch (error) {
      setPreferencesError(error instanceof Error ? error.message : "We could not save your preferences.");
    } finally {
      setPreferencesSaving(false);
    }
  };

  const saveOrganization = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!organization) return;
    setOrganizationSaving(true);
    setOrganizationError("");
    setOrganizationMessage("");
    try {
      const saved = await saveLandlordOrganization(organization);
      setOrganization(saved);
      setOrganizationMessage("Organization details saved.");
    } catch (error) {
      setOrganizationError(error instanceof Error ? error.message : "We could not save organization details.");
    } finally {
      setOrganizationSaving(false);
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordMessage("");
    const request: ChangePasswordRequest = {
      userName: currentUser?.user?.userName ?? "",
      currentPassword,
      newPassword,
      confirmPassword,
    };
    try {
      await changePassword(request);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "We could not update your password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const activeItem = settingsItems.find((item) => item.key === activeKey) ?? settingsItems[0];
  const frame = (title: string, content: React.ReactNode) => (
    <main className="account-settings-page">
      <AccountSettingsHeader />
      <div className="account-settings-layout">
        <AccountSettingsSidebar activeKey={activeKey} onSelect={(key) => setActiveKey(key)} />
        <section className="account-settings-content">
          <h2>{title}</h2>
          {content}
        </section>
      </div>
    </main>
  );

  if (activeKey === "personal") {
    const personalContent = !userID ? <p className="account-settings-error" role="alert">Sign in to view and update account settings.</p> : profileLoading ? <p role="status">Loading your profile…</p> : !profile ? (
      <p className="account-settings-error" role="alert">{profileError || "Profile details are unavailable."}</p>
    ) : (
      <>
        {profileError && <p className="account-settings-error" role="alert">{profileError}</p>}
        {profileMessage && <p className="account-settings-success" role="status">{profileMessage}</p>}
        <form className="account-settings-profile-form" onSubmit={saveProfile}>
          <label>Legal first name<input required maxLength={100} value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
          <label>Legal last name<input required maxLength={100} value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
          <label>Email address<input value={profile.email} readOnly aria-describedby="email-settings-note" /></label>
          <small id="email-settings-note">Email changes require a verification flow that is not available yet.</small>
          <label>Phone number<input type="tel" maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} /><small>Include the international country calling code, for example +14155552671.</small></label>
          <button className="account-settings-primary-action" type="submit" disabled={profileSaving}>{profileSaving ? "Saving…" : "Save profile"}</button>
        </form>
        <div className="account-settings-verification-summary">
          <div><strong>Identity verification</strong><span>{verification.overallLabel}</span></div>
          <button type="button" onClick={() => navigate("/verify-identity")}>{verification.identityVerified ? "View status" : "Continue verification"}</button>
        </div>
        <p className="account-settings-disabled-note">Preferred name, addresses, and emergency contacts can’t be edited here until their account endpoints are available.</p>
      </>
    );
    return frame("Personal information", personalContent);
  }

  if (activeKey === "notifications") {
    const content = !userID ? <p className="account-settings-error" role="alert">Sign in to view and update account settings.</p> : preferencesLoading ? <p role="status">Loading notification preferences…</p> : (
      <div className="account-settings-preferences">
        <p>Choose how Arcora sends account notifications. Each change is saved to your account.</p>
        {preferencesError && <p className="account-settings-error" role="alert">{preferencesError}</p>}
        {preferencesMessage && <p className="account-settings-success" role="status">{preferencesMessage}</p>}
        {(["emailNotifications", "smsNotifications"] as const).map((key) => {
          const label = key === "emailNotifications" ? "Email notifications" : "SMS notifications";
          return <div className="account-settings-language-row" key={key}>
            <div><strong>{label}</strong><span>{key === "emailNotifications" ? "Important account updates by email." : "Important account updates by text message."}</span></div>
            <button type="button" role="switch" aria-checked={preferences[key]} aria-label={label} disabled={preferencesSaving} className={`account-settings-switch${preferences[key] ? " is-on" : ""}`} onClick={() => void savePreferences({ [key]: !preferences[key] })}><span /></button>
          </div>;
        })}
        {preferencesSaving && <p role="status">Saving preferences…</p>}
      </div>
    );
    return frame("Notifications", content);
  }

  if (activeKey === "languages") {
    const content = preferencesLoading ? <p role="status">Loading your preferences…</p> : (
      <div className="account-settings-preferences">
        {preferencesError && <p className="account-settings-error" role="alert">{preferencesError}</p>}
        {preferencesMessage && <p className="account-settings-success" role="status">{preferencesMessage}</p>}
        <div className="account-settings-language-row">
          <div><strong>Preferred language</strong><span>{preferences.language}</span></div>
          <div className="account-settings-preference-edit"><CustomSelect value={preferences.language} options={["English", "French", "Spanish"]} onChange={(language) => void savePreferences({ language })} ariaLabel="Preferred language" /></div>
        </div>
        <div className="account-settings-language-row">
          <div><strong>Preferred currency</strong><span>{currencyNames[preferences.currency] ?? preferences.currency}</span></div>
          <div className="account-settings-preference-edit"><CustomSelect value={currencyNames[preferences.currency] ?? preferences.currency} options={Object.values(currencyNames)} onChange={(currency) => void savePreferences({ currency: currencyCodes[currency] ?? currency })} ariaLabel="Preferred currency" /></div>
        </div>
        <div className="account-settings-language-row">
          <div><strong>Time zone</strong><span>{preferences.timezone}</span></div>
          <div className="account-settings-preference-edit"><CustomSelect value={preferences.timezone} options={[...new Set([...timezoneOptions, preferences.timezone])]} onChange={(timezone) => void savePreferences({ timezone })} ariaLabel="Time zone" /></div>
        </div>
        {preferencesSaving && <p role="status">Saving preferences…</p>}
      </div>
    );
    return frame("Languages & currency", content);
  }

  if (activeKey === "security") {
    const content = (
      <div className="account-settings-preferences">
        <section className="account-settings-security-section">
          <h3>Password</h3>
          {passwordError && <p className="account-settings-error" role="alert">{passwordError}</p>}
          {passwordMessage && <p className="account-settings-success" role="status">{passwordMessage}</p>}
          <form className="account-settings-password-form" onSubmit={savePassword}>
            <input type="password" autoComplete="current-password" aria-label="Current password" placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
            <input type="password" autoComplete="new-password" aria-label="New password" placeholder="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            <input type="password" autoComplete="new-password" aria-label="Confirm new password" placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            <button className="account-settings-primary-action" type="submit" disabled={passwordSaving}>{passwordSaving ? "Updating…" : "Update password"}</button>
          </form>
        </section>
        <section className="account-settings-security-section">
          <h3>Passkeys and active sessions</h3>
          <p className="account-settings-disabled-note">These controls are disabled until passkey and session-management endpoints are available. No mock devices or passkeys are shown.</p>
          <button type="button" disabled title="Passkey enrollment is not available yet.">Add a passkey</button>
          <button type="button" disabled title="Session management is not available yet.">Manage sessions</button>
        </section>
      </div>
    );
    return frame("Login & security", content);
  }

  if (activeKey === "organization" && isLandlord) {
    const content = organizationLoading ? <p role="status">Loading organization settings…</p> : !organization ? (
      <p className="account-settings-error" role="alert">{organizationError || "No organization is linked to this account."}</p>
    ) : (
      <form className="account-settings-organization" onSubmit={saveOrganization}>
        {organizationError && <p className="account-settings-error" role="alert">{organizationError}</p>}
        {organizationMessage && <p className="account-settings-success" role="status">{organizationMessage}</p>}
        <label className="account-settings-org-field">Legal name<input required maxLength={100} value={organization.legalName} onChange={(event) => setOrganization({ ...organization, legalName: event.target.value })} /></label>
        <label className="account-settings-org-field">Display name<input required maxLength={100} value={organization.displayName} onChange={(event) => setOrganization({ ...organization, displayName: event.target.value })} /></label>
        {!organization.isPersonal && <label className="account-settings-org-field">Business number<input value={organization.businessNumber} onChange={(event) => setOrganization({ ...organization, businessNumber: event.target.value })} /></label>}
        <label className="account-settings-org-field">Province<CustomSelect value={CANADA_PROVINCES.find((province) => province.code === organization.provinceCode)?.name ?? CANADA_PROVINCES[0].name} options={CANADA_PROVINCES.map((province) => province.name)} onChange={(value) => setOrganization({ ...organization, provinceCode: CANADA_PROVINCES.find((province) => province.name === value)?.code ?? organization.provinceCode })} ariaLabel="Province" /></label>
        <label className="account-settings-org-field">Default currency<CustomSelect value={organization.defaultCurrency || "CAD"} options={["CAD", "USD"]} onChange={(defaultCurrency) => setOrganization({ ...organization, defaultCurrency })} ariaLabel="Default currency" /></label>
        <label className="account-settings-org-field">Time zone<CustomSelect value={organization.timeZone || "America/Regina"} options={timezoneOptions} onChange={(timeZone) => setOrganization({ ...organization, timeZone })} ariaLabel="Organization time zone" /></label>
        <button className="account-settings-primary-action" type="submit" disabled={organizationSaving}>{organizationSaving ? "Saving…" : "Save organization"}</button>
      </form>
    );
    return frame("Organization", content);
  }

  const unavailableContent = (
    <section className="account-settings-unavailable">
      <h3>{activeItem.label} is not connected yet</h3>
      <p>This feature needs a supported backend endpoint. Its controls are disabled, and no local-only changes will be presented as saved.</p>
      <button type="button" disabled title="This feature is not connected to a backend endpoint.">Not available yet</button>
    </section>
  );
  return frame(activeItem.label, unavailableContent);
}
