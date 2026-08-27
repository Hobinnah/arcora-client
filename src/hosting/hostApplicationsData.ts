export type ApplicationStatus = 'Needs review' | 'Under screening' | 'Approved' | 'Changes requested' | 'Declined';
export type HostApplication = { id: string; code: string; applicant: string; initials: string; property: string; unit: string; moveIn: string; term: string; rent: number; occupants: number; status: ApplicationStatus; screening: string; submitted: string };

export const hostApplications: HostApplication[] = [
  { id: 'app-1024', code: 'ARC-1024', applicant: 'Obinna Eze', initials: 'OE', property: 'Sunlit loft near the river', unit: 'Unit 4B · Austin, Texas', moveIn: 'Sep 1, 2026', term: '6 months', rent: 1850, occupants: 1, status: 'Needs review', screening: 'Not started', submitted: 'Aug 18, 2026' },
  { id: 'app-1017', code: 'ARC-1017', applicant: 'Maya Chen', initials: 'MC', property: 'Garden home with a quiet patio', unit: 'Unit 2 · Portland, Oregon', moveIn: 'Oct 15, 2026', term: '12 months', rent: 2240, occupants: 2, status: 'Under screening', screening: 'In progress', submitted: 'Aug 16, 2026' },
  { id: 'app-0998', code: 'ARC-0998', applicant: 'Jordan Williams', initials: 'JW', property: 'Two-bedroom in the arts district', unit: 'Unit 8A · Chicago, Illinois', moveIn: 'Sep 10, 2026', term: '12 months', rent: 1980, occupants: 3, status: 'Changes requested', screening: 'Not started', submitted: 'Aug 12, 2026' },
];
