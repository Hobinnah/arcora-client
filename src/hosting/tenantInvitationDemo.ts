export type DemoInvitation = {
  token: string;
  tenantName: string;
  email: string;
  phone: string;
  property: string;
  startDate: string;
  term: string;
  rent: string;
  deposit: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
  createdAt: string;
};

const invitationKey = 'arcora:demo-tenant-invitation';

export function saveDemoInvitation(invitation: DemoInvitation) {
  localStorage.setItem(invitationKey, JSON.stringify(invitation));
}

export function getDemoInvitation(token?: string) {
  const invitation = JSON.parse(localStorage.getItem(invitationKey) || 'null') as DemoInvitation | null;
  return invitation && (!token || invitation.token === token) ? invitation : null;
}

export function acceptDemoInvitation(token: string) {
  const invitation = getDemoInvitation(token);
  if (!invitation) return null;
  const accepted = { ...invitation, status: 'ACCEPTED' as const };
  saveDemoInvitation(accepted);
  return accepted;
}
