import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";
import { CheckIcon, HomeIcon, ShieldIcon, UsersIcon } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import "../pages/shared/TrustOperations.css";
import "./HostCohostsPage.css";

type AccessLevel = "Messages only" | "Listings and calendar" | "Full access";
type Cohost = { name: string; email: string; access: AccessLevel; status: "Active" | "Pending"; initials: string; color: string };

const accessNotes: Record<AccessLevel, string> = {
  "Messages only": "Can message guests and view reservation details.",
  "Listings and calendar": "Can manage listings, availability, and guest messages.",
  "Full access": "Can manage listings, messages, reservations, and team settings.",
};

export default function HostCohostsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const profile = currentUser?.user;
  const hostName = `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || currentUser?.name || "Amara Cole";
  const [cohosts, setCohosts] = useState<Cohost[]>([
    { name: "Olivia Martin", email: "olivia@example.com", access: "Full access", status: "Active", initials: "OM", color: "coral" },
    { name: "Noah Lee", email: "noah@example.com", access: "Messages only", status: "Pending", initials: "NL", color: "teal" },
  ]);
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<AccessLevel>("Listings and calendar");
  const [sent, setSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"team" | "access">("team");
  const activeCount = cohosts.filter((cohost) => cohost.status === "Active").length;

  const inviteCohost = () => {
    if (!email.trim()) return;
    const initials = email.trim().split("@")[0].slice(0, 2).toUpperCase();
    setCohosts((current) => [...current, { name: email.trim().split("@")[0], email: email.trim(), access, status: "Pending", initials, color: "sand" }]);
    setEmail("");
    setSent(true);
  };

  return <main className="trust-ops-page host-cohosts-page">
    <header className="trust-ops-head host-cohosts-head"><div><span className="trust-ops-kicker">Your hosting team</span><h1>Co-hosts &amp; access</h1><p>Invite trusted people to help run your homes, while keeping every role and permission easy to understand.</p></div><button className="trust-ops-back" type="button" onClick={() => navigate("/hosting")}>Hosting dashboard</button></header>
    <section className="host-cohosts-hero"><div className="host-cohosts-host-avatar">{profile?.imageUrl ? <img src={profile.imageUrl} alt={`${hostName} profile`} /> : hostName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><span className="trust-ops-kicker">Primary host</span><h2>{hostName}</h2><p>{activeCount} active co-host{activeCount === 1 ? "" : "s"} · 2 listings covered</p><div className="host-cohosts-trust"><span><CheckIcon /> You control every permission</span><span><ShieldIcon /> Changes are auditable</span></div></div><div className="host-cohosts-coverage"><span>Team coverage</span><b>100%</b><small>All active listings have a host or co-host assigned.</small></div></section>
    <div className="host-cohosts-layout"><section className="trust-ops-panel host-cohosts-team"><div className="host-cohosts-tabs" role="tablist"><button type="button" role="tab" aria-selected={activeTab === "team"} className={activeTab === "team" ? "is-active" : ""} onClick={() => setActiveTab("team")}>Team members <span>{cohosts.length}</span></button><button type="button" role="tab" aria-selected={activeTab === "access"} className={activeTab === "access" ? "is-active" : ""} onClick={() => setActiveTab("access")}>Access guide</button></div>{activeTab === "team" ? <div className="host-cohosts-list">{cohosts.map((cohost) => <article className="host-cohosts-member" key={cohost.email}><span className={`host-cohosts-member-avatar ${cohost.color}`}>{cohost.initials}</span><div><strong>{cohost.name}</strong><small>{cohost.email}</small><span className="host-cohosts-role"><HomeIcon /> {cohost.access}</span></div><div className="host-cohosts-member-action"><b className={cohost.status === "Active" ? "is-active" : "is-pending"}>{cohost.status}</b><button type="button" onClick={() => setCohosts((current) => current.filter((item) => item.email !== cohost.email))}>{cohost.status === "Active" ? "Manage" : "Cancel invite"}</button></div></article>)}</div> : <div className="host-cohosts-access-guide">{(Object.keys(accessNotes) as AccessLevel[]).map((level, index) => <article key={level}><span>{index + 1}</span><div><strong>{level}</strong><small>{accessNotes[level]}</small></div></article>)}</div>}</section><aside className="trust-ops-panel host-cohosts-invite"><span className="host-cohosts-invite-icon"><UsersIcon /></span><span className="trust-ops-kicker">Invite someone</span><h2>Add a co-host</h2><p>They receive an email invitation and choose their own secure sign-in.</p><label className="trust-ops-field">Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label><label className="trust-ops-field">Access level<CustomSelect value={access} options={["Messages only", "Listings and calendar", "Full access"]} onChange={(value) => setAccess(value as AccessLevel)} ariaLabel="Co-host access level" /></label><div className="host-cohosts-access-note"><ShieldIcon /><span>{accessNotes[access]}</span></div><button className="trust-ops-action" type="button" disabled={!email.trim()} onClick={inviteCohost}>{sent ? "Send another invitation" : "Send invitation"}</button>{sent && <small className="host-cohosts-sent"><CheckIcon /> Invitation sent. You can change or remove access anytime.</small>}</aside></div>
  </main>;
}
