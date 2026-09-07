export type MarketplaceListing = {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  unitTypeID?: string;
  isPetFriendly: boolean;
  isFurnished: boolean;
  image: string;
  details: string;
  rating: number;
  reviews: number;
  availableFrom: string;
  availableTo?: string;
  tag?: string;
};

export const normalizeListing = (listing: Record<string, any>, index: number): MarketplaceListing | null => {
  const title = String(listing.title ?? listing.name ?? '').trim();
  const price = Number(listing.baseMonthlyRentAmount ?? listing.monthlyRentAmount ?? 0);
  if (!title || !Number.isFinite(price) || price <= 0) return null;
  const listingPhotos = Array.isArray(listing.listingPhotos) ? listing.listingPhotos : [];
  const coverPhoto = listingPhotos.find((photo: Record<string, unknown>) => photo.isCoverPhoto === true)?.url;
  const rentalUnit = listing.rentalUnit ?? {};
  const unitTypeID = String(rentalUnit.unitTypeID ?? listing.unitTypeID ?? "");
  const property = rentalUnit.property ?? listing.property ?? {};
  const address = property.address ?? listing.address ?? {};
  const listingLocation = listing.location;
  const structuredListingLocation = typeof listingLocation === 'object' && listingLocation !== null ? listingLocation : {};
  const location = typeof listingLocation === 'string' && listingLocation.trim() ? listingLocation.trim() : [structuredListingLocation.city, structuredListingLocation.province ?? structuredListingLocation.state].filter(Boolean).join(', ') || [address.city, address.state ?? address.province ?? address.provinceCode].filter(Boolean).join(', ') || String(property.city ?? listing.city ?? 'Available location');
  const isFurnished = listing.isFurnished === true || listing.IsFurnished === true;
  const details = [listing.bedrooms ? `${listing.bedrooms} bed${listing.bedrooms === 1 ? '' : 's'}` : '', listing.bathrooms ? `${listing.bathrooms} bath${listing.bathrooms === 1 ? '' : 's'}` : '', isFurnished ? 'Furnished' : 'Monthly lease'].filter(Boolean).join(' · ');
  return { id: String(listing.listingID ?? listing.id ?? `live-${index}`), title, location, price, type: String(listing.listingType?.name ?? listing.listingType?.title ?? listing.type ?? 'Home'), unitTypeID: unitTypeID || undefined, isPetFriendly: listing.isPetFriendly === true, isFurnished, image: coverPhoto ?? listing.imageUrl ?? listing.coverImageUrl ?? listing.listingPhoto?.url ?? listing.listingPhoto?.imageUrl ?? fallbackListings[index % fallbackListings.length].image, details: details || 'Monthly lease', rating: Number(listing.rating ?? 0), reviews: Number(listing.reviews ?? 0), availableFrom: String(listing.availableFrom ?? new Date().toISOString().slice(0, 10)), availableTo: listing.availableTo ? String(listing.availableTo) : undefined, tag: typeof listing.displayTag === 'string' && listing.displayTag.trim() ? listing.displayTag.trim() : undefined };
};

export const fallbackListings: MarketplaceListing[] = [
  {
    id: 'demo-1', title: 'Sunlit loft near the river', location: 'Austin, Texas', price: 1850, type: 'Loft',
    details: '1 bed · 1 bath · Furnished', rating: 4.9, reviews: 18, availableFrom: '2026-09-01', isPetFriendly: false, isFurnished: true, tag: 'Move-in ready',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-2', title: 'Garden flat with a private patio', location: 'Portland, Oregon', price: 2140, type: 'Apartment',
    details: '2 beds · 1 bath · Pet friendly', rating: 4.8, reviews: 24, availableFrom: '2026-09-15', isPetFriendly: true, isFurnished: false,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-3', title: 'Quiet modern home in the hills', location: 'Denver, Colorado', price: 2675, type: 'House',
    details: '2 beds · 2 baths · Workspace', rating: 5, reviews: 9, availableFrom: '2026-10-01', isPetFriendly: false, isFurnished: false, tag: 'New this week',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-4', title: 'Warm city studio with skyline views', location: 'Chicago, Illinois', price: 1625, type: 'Studio',
    details: 'Studio · 1 bath · Doorman', rating: 4.7, reviews: 31, availableFrom: '2026-09-01', isPetFriendly: false, isFurnished: false,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-5', title: 'Light-filled bungalow with a garden', location: 'Nashville, Tennessee', price: 2390, type: 'Bungalow',
    details: '2 beds · 2 baths · Garden', rating: 4.9, reviews: 16, availableFrom: '2026-09-20', isPetFriendly: true, isFurnished: false, tag: 'Popular stay',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-6', title: 'Brick townhouse beside the park', location: 'Brooklyn, New York', price: 3120, type: 'Townhouse',
    details: '2 beds · 1.5 baths · Balcony', rating: 4.8, reviews: 22, availableFrom: '2026-10-01', isPetFriendly: false, isFurnished: false, tag: 'Great location',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-7', title: 'Minimal retreat with a work nook', location: 'Seattle, Washington', price: 2280, type: 'Apartment',
    details: '1 bed · 1 bath · Workspace', rating: 4.9, reviews: 14, availableFrom: '2026-09-10', isPetFriendly: false, isFurnished: false,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-8', title: 'Bright family home with a view', location: 'San Diego, California', price: 2890, type: 'House',
    details: '3 beds · 2 baths · Parking', rating: 4.7, reviews: 28, availableFrom: '2026-11-01', isPetFriendly: true, isFurnished: false, tag: 'New this week',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-9', title: 'Calm studio in the arts district', location: 'Philadelphia, Pennsylvania', price: 1490, type: 'Studio',
    details: 'Studio · 1 bath · Transit nearby', rating: 4.6, reviews: 37, availableFrom: '2026-09-05', isPetFriendly: false, isFurnished: false,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'demo-10', title: 'Coastal cottage with room to breathe', location: 'Santa Barbara, California', price: 2760, type: 'Cottage',
    details: '2 beds · 2 baths · Pet friendly', rating: 5, reviews: 11, availableFrom: '2026-10-15', isPetFriendly: true, isFurnished: false, tag: 'Pet friendly',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85',
  },
];
