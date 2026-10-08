export type MarketplaceListing = {
  id: string;
  organizationID?: string;
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
  const title = String(listing.title ?? listing.name ?? "").trim();
  const price = Number(listing.baseMonthlyRentAmount ?? listing.monthlyRentAmount ?? 0);
  if (!title || !Number.isFinite(price)) return null;

  const listingPhotos = Array.isArray(listing.listingPhotos) ? listing.listingPhotos : [];
  const coverPhoto = listingPhotos.find((photo: Record<string, unknown>) => photo.isCoverPhoto === true)?.url;
  const rentalUnit = listing.rentalUnit ?? {};
  const property = rentalUnit.property ?? listing.property ?? {};
  const address = property.address ?? listing.address ?? {};
  const listingLocation = listing.location;
  const structuredLocation = typeof listingLocation === "object" && listingLocation !== null ? listingLocation : {};
  const location = typeof listingLocation === "string" && listingLocation.trim()
    ? listingLocation.trim()
    : [
      structuredLocation.city,
      structuredLocation.province ?? structuredLocation.state,
      address.city,
      address.state ?? address.province ?? address.provinceCode,
    ].filter(Boolean).join(", ") || String(property.city ?? listing.city ?? "");
  const isFurnished = listing.isFurnished === true || listing.IsFurnished === true;
  const details = [
    listing.bedrooms ? `${listing.bedrooms} bed${listing.bedrooms === 1 ? "" : "s"}` : "",
    listing.bathrooms ? `${listing.bathrooms} bath${listing.bathrooms === 1 ? "" : "s"}` : "",
    isFurnished ? "Furnished" : "Monthly lease",
  ].filter(Boolean).join(" · ");

  return {
    id: String(listing.listingID ?? listing.id ?? `live-${index}`),
    organizationID: listing.organizationID ? String(listing.organizationID) : undefined,
    title,
    location,
    price,
    type: String(listing.listingType?.name ?? listing.listingType?.title ?? listing.type ?? "Home"),
    unitTypeID: String(rentalUnit.unitTypeID ?? listing.unitTypeID ?? "") || undefined,
    isPetFriendly: listing.isPetFriendly === true,
    isFurnished,
    image: coverPhoto ?? listing.imageUrl ?? listing.coverImageUrl ?? listing.listingPhoto?.url ?? listing.listingPhoto?.imageUrl ?? "",
    details,
    rating: Number(listing.rating ?? 0),
    reviews: Number(listing.reviews ?? 0),
    availableFrom: String(listing.availableFrom ?? ""),
    availableTo: listing.availableTo ? String(listing.availableTo) : undefined,
    tag: typeof listing.displayTag === "string" && listing.displayTag.trim() ? listing.displayTag.trim() : undefined,
  };
};
