import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HostingListingsTable.css';

export interface HostingListing {
  id: string;
  title: string;
  image: string;
  type: string;
  location: string;
  status: 'Listed' | 'Unlisted' | 'In progress';
}

interface HostingListingsTableProps {
  listings: HostingListing[];
  onSelect?: (listing: HostingListing) => void;
}

export default function HostingListingsTable({ listings, onSelect }: HostingListingsTableProps) {
  const navigate = useNavigate();
  const [openListingId, setOpenListingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!openListingId) return;
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpenListingId(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenListingId(null);
    };
    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openListingId]);
  return (
    <table className="hosting-listings-table">
      <thead>
        <tr>
          <th scope="col">Listing</th>
          <th scope="col">Type</th>
          <th scope="col">Location</th>
          <th scope="col">Status</th>
          <th scope="col" className="hosting-listings-actions-heading"><span className="hosting-visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {listings.map((listing) => (
          <tr key={listing.id} onClick={() => onSelect?.(listing)} tabIndex={onSelect ? 0 : undefined}>
            <td>
              <div className="hosting-listing-cell">
                <img src={listing.image} alt="" />
                <span>{listing.title}</span>
              </div>
            </td>
            <td>{listing.type}</td>
            <td>{listing.location}</td>
            <td>
              <span className={`hosting-listing-status is-${listing.status.toLowerCase().replace(' ', '-')}`}>
                <span className="hosting-listing-status-dot" aria-hidden="true" />
                {listing.status}
              </span>
            </td>
            <td className="hosting-listings-actions-cell">
              <div className="hosting-listing-menu" ref={openListingId === listing.id ? menuRef : undefined}>
                <button type="button" className="hosting-listing-menu-trigger" aria-label={`Open actions for ${listing.title}`} aria-haspopup="menu" aria-expanded={openListingId === listing.id} onClick={(event) => { event.stopPropagation(); setOpenListingId((current) => current === listing.id ? null : listing.id); }}>⋮</button>
                {openListingId === listing.id && <div className="hosting-listing-menu-popover" role="menu"><button type="button" role="menuitem" onClick={(event) => { event.stopPropagation(); navigate(`/hosting/invitations/new?listingId=${encodeURIComponent(listing.id)}`); setOpenListingId(null); }}>Invite tenant</button></div>}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
