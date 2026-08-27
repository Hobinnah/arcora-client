import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fallbackListings } from './marketplaceData';
import './ListingPhotos.css';

const fallbackPhotos = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
];

export default function ListingPhotos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listing = fallbackListings.find((l) => l.id === id) ?? fallbackListings[0];
  const photos = [listing.image, ...fallbackPhotos.filter((p) => p !== listing.image)];
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

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
        <div className="photos-grid">
          {photos.map((src, i) => (
            <div className={`photos-item ${i === 0 ? 'photos-item-hero' : ''}`} key={i} onClick={() => setLightbox(i)}>
              <img src={src} alt={`${listing.title} photo ${i + 1}`} />
            </div>
          ))}
        </div>
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
            <img className="lightbox-image" src={photos[lightbox]} alt={`${listing.title} photo ${lightbox + 1}`} />
            <button className="lightbox-next" type="button" onClick={next} aria-label="Next photo">›</button>
          </div>
        </div>
      )}
    </>
  );
}
