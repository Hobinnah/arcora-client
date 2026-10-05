import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";
import { CheckIcon, HomeIcon, ShieldIcon, UsersIcon } from "../components/Icons";
import HostingHeader from "./HostingHeader";
import { useAuth } from "../hooks/useAuth";
import { getLandlordOrganization } from "../apis/useLandlordOrganization";
import { fetchOrganizationMembersByOrganization, getAllCohostInvitationsByOrganization, inviteCohost as sendCohostInvite, revokeCohostInvitation, type CohostAccess, type CohostInvitation } from "../apis/useOrganizationMember";
import type { OrganizationMember } from "../types/OrganizationMember";
import "../marketplace/MarketplaceHome.css";
import "../pages/shared/TrustOperations.css";
import "./HostingListingEditorPage.css";
import "./HostCohostsPage.css";

type AccessLevel = "Messages only" | "Listings and calendar" | "Full access";
type Cohost = { id: string; name: string; email: string; access: AccessLevel; status: "Active" | "Pending"; initials: string; color: string; invitationID?: string };
const accessNotes: Record<AccessLevel, string> = { "Messages only": "Can message guests and view reservation details.", "Listings and calendar": "Can manage listings, availability, and guest messages.", "Full access": "Can manage listings, messages, reservations, and team settings." };
const accessToApi: Record<AccessLevel, CohostAccess> = { "Messages only": "Calendar and message access", "Listings and calendar": "Calendar and message access", "Full access": "Full access" };
const nameForMember = (member: OrganizationMember) => [member.user?.firstName, member.user?.lastName].filter(Boolean).join(" ").trim() || member.user?.userName || "Organization member";
const initialsFor = (name: string) => name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CO";
const displayAccess = (value?: string): AccessLevel => value === "Full access" ? "Full access" : value === "Calendar access" ? "Listings and calendar" : "Messages only";

export default function HostCohostsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const hostName = `${currentUser?.user?.firstName || ""} ${currentUser?.user?.lastName || ""}`.trim() || currentUser?.name || "Host";
  const [organizationID, setOrganizationID] = useState<string>();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<CohostInvitation[]>([]);
  const [access, setAccess] = useState<AccessLevel>("Listings and calendar");
  const [activeTab, setActiveTab] = useState<"team" | "access">("team");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteStep, setInviteStep] = useState<1 | 2 | 3>(1);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteCountryCode, setInviteCountryCode] = useState("+1");
  const [invitePermission, setInvitePermission] = useState<CohostAccess>("Calendar and message access");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadTeam = async () => {
    if (!organizationID) return;
    try {
      const [loadedMembers, loadedInvitations] = await Promise.all([fetchOrganizationMembersByOrganization(organizationID), getAllCohostInvitationsByOrganization(organizationID)]);
      setMembers(loadedMembers);
      setInvitations(loadedInvitations);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "We could not load your co-hosts."); } finally { setLoading(false); }
  };

  useEffect(() => {
    const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
    const directOrganizationID = currentUser?.organization?.organizationID ?? currentUser?.memberOrganizations?.find((member) => member.organization)?.organization?.organizationID;
    if (!userID && !directOrganizationID) return;
    let cancelled = false;
    void (async () => {
      try { const organization = directOrganizationID ? null : await getLandlordOrganization(userID!); if (!cancelled) setOrganizationID(directOrganizationID || organization?.organizationID || undefined); }
      catch (loadError) { if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We could not identify your organization."); }
    })();
    return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => {
    if (!organizationID) return;
    let cancelled = false;
    void Promise.all([fetchOrganizationMembersByOrganization(organizationID), getAllCohostInvitationsByOrganization(organizationID)]).then(([loadedMembers, loadedInvitations]) => { if (!cancelled) { setMembers(loadedMembers); setInvitations(loadedInvitations); } }).catch((loadError: unknown) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : "We could not load your co-hosts."); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [organizationID]);

  const cohosts = useMemo<Cohost[]>(() => [
    ...members.filter((member) => !member.isPrimaryOwner).map((member, index) => { const name = nameForMember(member); const status: Cohost["status"] = member.status?.toUpperCase() === "ACTIVE" ? "Active" : "Pending"; return { id: member.organizationMemberID, name, email: member.user?.email || "No email available", access: displayAccess(member.roleName), status, initials: initialsFor(name), color: index % 2 ? "teal" : "coral" }; }),
    ...invitations.filter((invitation) => !["ACCEPTED", "DECLINED", "REVOKED"].includes(invitation.status.toUpperCase())).map((invitation, index) => ({ id: invitation.cohostInvitationID, name: invitation.cohostName || invitation.email.split("@")[0], email: invitation.email, access: displayAccess(invitation.cohostAccess), status: "Pending" as const, initials: initialsFor(invitation.cohostName || invitation.email), color: index % 2 ? "teal" : "sand", invitationID: invitation.cohostInvitationID })),
  ], [members, invitations]);
  const activeCount = cohosts.filter((cohost) => cohost.status === "Active").length;

  const inviteCohost = async () => {
    if (!organizationID || sending || !inviteName.trim() || !inviteEmail.trim() || !invitePhone.trim()) return;
    setSending(true); setError("");
    try { await sendCohostInvite({ organizationID, email: inviteEmail.trim().toLowerCase(), cohostName: inviteName.trim(), phoneNumber: `${inviteCountryCode} ${invitePhone.trim()}`, cohostAccess: invitePermission }); setInviteOpen(false); setInviteStep(1); setInviteName(""); setInviteEmail(""); setInvitePhone(""); setInviteCountryCode("+1"); setSent(true); await loadTeam(); }
    catch (inviteError) { setError(inviteError instanceof Error ? inviteError.message : "We could not send the co-host invitation."); }
    finally { setSending(false); }
  };
  const cancelInvite = async (invitationID?: string) => { if (!invitationID) return; try { await revokeCohostInvitation(invitationID); await loadTeam(); } catch (revokeError) { setError(revokeError instanceof Error ? revokeError.message : "We could not cancel the invitation."); } };

  return <main className="marketplace trust-ops-page host-cohosts-page"><HostingHeader /><div className="host-cohosts-content"><header className="trust-ops-head host-cohosts-head"><div><span className="trust-ops-kicker">Your hosting team</span><h1>Co-hosts &amp; access</h1><p>Invite trusted people to help run your homes, while keeping every role and permission easy to understand.</p></div><button className="trust-ops-back" type="button" onClick={() => navigate("/hosting")}>Hosting dashboard</button></header><section className="host-cohosts-hero"><div className="host-cohosts-host-avatar">{initialsFor(hostName)}</div><div><span className="trust-ops-kicker">Primary host</span><h2>{hostName}</h2><p>{activeCount} active co-host{activeCount === 1 ? "" : "s"} · Organization team</p><div className="host-cohosts-trust"><span><CheckIcon /> You control every permission</span><span><ShieldIcon /> Changes are auditable</span></div></div><div className="host-cohosts-coverage"><span>Team coverage</span><b>{loading ? "Loading" : cohosts.length ? "Active" : "Add a co-host"}</b><small>{cohosts.length} team record{cohosts.length === 1 ? "" : "s"} loaded from Arcora</small></div></section>{error && <p className="hosting-editor-save-error" role="alert">{error}</p>}<div className="host-cohosts-layout"><section className="trust-ops-panel host-cohosts-team"><div className="host-cohosts-tabs" role="tablist"><button type="button" role="tab" aria-selected={activeTab === "team"} className={activeTab === "team" ? "is-active" : ""} onClick={() => setActiveTab("team")}>Team members <span>{cohosts.length}</span></button><button type="button" role="tab" aria-selected={activeTab === "access"} className={activeTab === "access" ? "is-active" : ""} onClick={() => setActiveTab("access")}>Access guide</button></div>{activeTab === "team" ? <div className="host-cohosts-list">{cohosts.map((cohost) => <article className="host-cohosts-member" key={cohost.id}><span className={`host-cohosts-member-avatar ${cohost.color}`}>{cohost.initials}</span><div><strong>{cohost.name}</strong><small>{cohost.email}</small><span className="host-cohosts-role"><HomeIcon /> {cohost.access}</span></div><div className="host-cohosts-member-action"><b className={cohost.status === "Active" ? "is-active" : "is-pending"}>{cohost.status}</b><button type="button" disabled={!cohost.invitationID} onClick={() => void cancelInvite(cohost.invitationID)}>{cohost.status === "Active" ? "Manage" : "Cancel invite"}</button></div></article>)}</div> : <div className="host-cohosts-access-guide">{(Object.keys(accessNotes) as AccessLevel[]).map((level, index) => <article key={level}><span>{index + 1}</span><div><strong>{level}</strong><small>{accessNotes[level]}</small></div></article>)}</div>}</section><aside className="trust-ops-panel host-cohosts-invite"><span className="host-cohosts-invite-icon"><UsersIcon /></span><span className="trust-ops-kicker">Invite someone</span><h2>Add a co-host</h2><p>They receive an email invitation and choose their own secure sign-in.</p><label className="trust-ops-field">Access level<CustomSelect value={access} options={Object.keys(accessNotes)} onChange={(value) => setAccess(value as AccessLevel)} ariaLabel="Access level" /></label><div className="host-cohosts-permission-note"><ShieldIcon /><span>{accessNotes[access]}</span></div><button className="trust-ops-action" type="button" disabled={!organizationID || sending} onClick={() => { setInvitePermission(accessToApi[access]); setInviteOpen(true); }}>{sent ? "Send another invitation" : "Invite someone you know"}</button></aside></div></div>{inviteOpen && <div className="hosting-editor-photo-dialog-backdrop" role="presentation" onClick={() => setInviteOpen(false)}><div className="hosting-editor-photo-dialog hosting-editor-invite-dialog" role="dialog" aria-modal="true" aria-labelledby="invite-dialog-title" onClick={(event) => event.stopPropagation()}><button type="button" className="hosting-editor-photo-dialog-close" aria-label="Close invite dialog" onClick={() => setInviteOpen(false)}>×</button>{inviteStep === 1 && <><h2 id="invite-dialog-title">Add your co-host&apos;s info</h2><p>Enter their name and the contact details that should receive the invite.</p><div className="hosting-editor-invite-fields"><label>Country code<select value={inviteCountryCode} onChange={(event) => setInviteCountryCode(event.target.value)}><option value="+1">Canada (+1)</option><option value="+1">United States (+1)</option><option value="+44">United Kingdom (+44)</option></select></label><label>Phone number<input value={invitePhone} onChange={(event) => setInvitePhone(event.target.value)} placeholder="Phone number" /></label></div><input className="hosting-editor-invite-email" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="Email" /><input className="hosting-editor-invite-email hosting-editor-invite-name" value={inviteName} maxLength={150} onChange={(event) => setInviteName(event.target.value)} placeholder="Full name" /></>}{inviteStep === 2 && <><h2 id="invite-dialog-title">Set your co-host&apos;s permissions</h2><p>You can always change this later.</p><div className="hosting-editor-permission-options">{(["Full access", "Calendar and message access", "Calendar access"] as CohostAccess[]).map((permission) => <label key={permission}><span><strong>{permission}</strong><small>Manage the hosting tools assigned to this co-host.</small></span><input type="radio" name="invite-permission" checked={invitePermission === permission} onChange={() => setInvitePermission(permission)} /><i /></label>)}</div></>}{inviteStep === 3 && <><h2 id="invite-dialog-title">Review your invite</h2><div className="hosting-editor-invite-review"><strong>Co-host&apos;s name</strong><small>{inviteName}</small><strong>Co-host&apos;s email</strong><small>{inviteEmail}</small><strong>Phone</strong><small>{inviteCountryCode} {invitePhone}</small><strong>Permissions</strong><small>{invitePermission}</small></div></>}{error && <small className="hosting-editor-save-error" role="alert">{error}</small>}<div className="hosting-editor-photo-dialog-actions"><button type="button" className="hosting-editor-cancel" disabled={sending} onClick={() => inviteStep === 1 ? setInviteOpen(false) : setInviteStep((inviteStep - 1) as 1 | 2 | 3)}>{inviteStep === 1 ? "Cancel" : "Back"}</button><button type="button" className="hosting-editor-save" disabled={sending || (inviteStep === 1 && (!inviteName.trim() || !inviteEmail.trim() || !invitePhone.trim()))} onClick={() => inviteStep === 3 ? void inviteCohost() : setInviteStep((inviteStep + 1) as 1 | 2 | 3)}>{sending ? "Sending..." : inviteStep === 3 ? "Send" : "Next"}</button></div></div></div>}</main>;
}
