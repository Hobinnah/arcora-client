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
  return (
    <table className="hosting-listings-table">
      <thead>
        <tr>
          <th scope="col">Listing</th>
          <th scope="col">Type</th>
          <th scope="col">Location</th>
          <th scope="col">Status</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
