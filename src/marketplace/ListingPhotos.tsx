import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getListing } from '../apis/useListing';
import './ListingPhotos.css';

type ListingPhotoResponse = {
  data?: {
    title?: string;
    listingPhotos?: Array<{ displayOrder?: number; url?: string; imageUrl?: string; image?: string }>;
  };
  title?: string;
  listingPhotos?: Array<{ displayOrder?: number; url?: string; imageUrl?: string; image?: string }>;
};

type ListingPhotosRouteState = {
  title?: string;
  photos?: string[];
};

export default function ListingPhotos() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state as ListingPhotosRouteState | null;
  const [listingTitle, setListingTitle] = useState(routeState?.title || 'Listing photos');
  const [photos, setPhotos] = useState<string[]>(routeState?.photos || []);
  const [loading, setLoading] = useState(routeState?.photos?.length === 0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    if (photos.length > 0) {
      return () => { cancelled = true; };
    }
    getListing(id).then((response) => {
      const responseData = response as unknown as ListingPhotoResponse;
      const detail = responseData.data ?? responseData;
      const apiPhotos = Array.isArray(detail.listingPhotos) ? [...detail.listingPhotos]
        .sort((first, second) => Number(first.displayOrder ?? 0) - Number(second.displayOrder ?? 0))
        .map((photo) => photo.url ?? photo.imageUrl ?? photo.image)
        .filter((url): url is string => Boolean(url)) : [];
      if (!cancelled) {
        setListingTitle(detail.title || 'Listing photos');
        setPhotos(apiPhotos);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id, photos.length]);

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : 0));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % photos.length : 0));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setLightbox(null);
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  return (
    <>
      <div className="photos-page" onKeyDown={handleKeyDown} tabIndex={0}>
        <header className="photos-header">
          <button className="photos-back" type="button" onClick={() => navigate(`/homes/${id}`)}>← Back</button>
          <div className="photos-header-actions">
            <button type="button">↗ Share</button>
            <button type="button" className={saved ? 'is-saved' : ''} onClick={() => setSaved(!saved)}>{saved ? '♥' : '♡'} Save</button>
          </div>
        </header>
        {loading && <p className="photos-empty">Loading photos...</p>}
        {!loading && photos.length === 0 && <p className="photos-empty">No photos are available for this listing.</p>}
        {!loading && photos.length > 0 && <div className="photos-grid">
          {photos.map((src, i) => (
            <div className={`photos-item ${i === 0 ? 'photos-item-hero' : ''}`} key={i} onClick={() => setLightbox(i)}>
              <img src={src} alt={`${listingTitle} photo ${i + 1}`} />
            </div>
          ))}
        </div>}
      </div>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-label="Photo viewer" onKeyDown={handleKeyDown} tabIndex={0}>
          <header className="lightbox-header">
            <button className="lightbox-close" type="button" onClick={() => setLightbox(null)}>✕ Close</button>
            <span className="lightbox-counter">{lightbox + 1} / {photos.length}</span>
            <div className="lightbox-actions">
              <button type="button">↗</button>
              <button type="button" className={saved ? 'is-saved' : ''} onClick={() => setSaved(!saved)}>{saved ? '♥' : '♡'}</button>
            </div>
          </header>
          <div className="lightbox-body">
            <button className="lightbox-prev" type="button" onClick={prev} aria-label="Previous photo">‹</button>
            <img className="lightbox-image" src={photos[lightbox]} alt={`${listingTitle} photo ${lightbox + 1}`} />
            <button className="lightbox-next" type="button" onClick={next} aria-label="Next photo">›</button>
          </div>
        </div>
      )}
    </>
  );
}
