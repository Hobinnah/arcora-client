import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLease } from '../apis/useLease';
import { getListing } from '../apis/useListing';
import { CheckIcon, FileIcon, ShieldIcon, TrashIcon } from '../components/Icons';
import type { Lease } from '../types/Lease';
import type { Listing } from '../types/Listing';
import TenantHeader from './TenantHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './TenantLeaseExperience.css';

const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const CHECK_IN_DATABASE = 'arcora-tenant-check-ins';
const CHECK_IN_STORE = 'checkIns';

type OccupancyCondition = 'ready' | 'needs-attention' | 'not-sure';

type IssuePhoto = {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
};

type StoredCheckIn = {
  leaseId: string;
  submittedAt: string;
  arrived: true;
  occupancy: OccupancyCondition | '';
  notes: string;
  photos: Array<{
    name: string;
    mimeType: string;
    caption: string;
    file: Blob;
  }>;
};

function formatLeaseDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

function saveCheckIn(record: StoredCheckIn): Promise<void> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(CHECK_IN_DATABASE, 1);

    openRequest.onupgradeneeded = () => {
      const database = openRequest.result;
      if (!database.objectStoreNames.contains(CHECK_IN_STORE)) {
        database.createObjectStore(CHECK_IN_STORE, { keyPath: 'leaseId' });
      }
    };

    openRequest.onerror = () => reject(openRequest.error ?? new Error('Could not open local check-in storage.'));
    openRequest.onblocked = () => reject(new Error('Local check-in storage is blocked by another open tab. Close other Arcora tabs and try again.'));
    openRequest.onsuccess = () => {
      const database = openRequest.result;
      const transaction = database.transaction(CHECK_IN_STORE, 'readwrite');

      transaction.oncomplete = () => {
        database.close();
        resolve();
      };
      transaction.onerror = () => {
        database.close();
        reject(transaction.error ?? new Error('Could not save the check-in record.'));
      };
      transaction.onabort = () => {
        database.close();
        reject(transaction.error ?? new Error('Saving the check-in record was cancelled.'));
      };

      transaction.objectStore(CHECK_IN_STORE).put(record);
    };
  });
}

export default function TenantLeaseLifecyclePage() {
  const { leaseId = '', mode } = useParams<{ leaseId: string; mode: 'check-in' | 'check-out' }>();
  const navigate = useNavigate();
  const isMoveIn = mode === 'check-in';
  const [confirmed, setConfirmed] = useState(false);
  const [occupancy, setOccupancy] = useState<OccupancyCondition | ''>('');
  const [complete, setComplete] = useState(false);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<IssuePhoto[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [leaseRecord, setLeaseRecord] = useState<Lease | null>(null);
  const [listingRecord, setListingRecord] = useState<Listing | null>(null);
  const [loadedLeaseId, setLoadedLeaseId] = useState('');
  const [leaseLoadError, setLeaseLoadError] = useState('');
  const [listingLoadError, setListingLoadError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);

  useEffect(() => {
    let cancelled = false;

    const loadLeaseDetails = async () => {
      try {
        if (!leaseId) throw new Error('A lease ID is required to load check-in details.');
        const lease = await getLease(leaseId);
        if (cancelled) return;
        setLeaseRecord(lease);
        setLeaseLoadError('');
        setListingLoadError('');

        if (lease.listingID) {
          try {
            const listing = await getListing(lease.listingID);
            if (!cancelled) setListingRecord(listing);
          } catch (error) {
            if (!cancelled) {
              setListingRecord(lease.listing ?? null);
              setListingLoadError(error instanceof Error ? error.message : 'Listing details could not be refreshed.');
            }
          }
        } else {
          setListingRecord(lease.listing ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          setLeaseRecord(null);
          setListingRecord(null);
          setLeaseLoadError(error instanceof Error ? error.message : 'We could not load this lease.');
        }
      } finally {
        if (!cancelled) setLoadedLeaseId(leaseId);
      }
    };

    void loadLeaseDetails();
    return () => { cancelled = true; };
  }, [leaseId]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => () => {
    photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
  }, []);

  const addPhotos = (files: FileList | null) => {
    if (!files?.length) return;

    const additions: IssuePhoto[] = [];
    const errors: string[] = [];
    const remainingSlots = MAX_PHOTOS - photos.length;

    Array.from(files).forEach((file) => {
      if (additions.length >= remainingSlots) {
        errors.push(`You can add up to ${MAX_PHOTOS} photos.`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image.`);
        return;
      }
      if (file.size > MAX_PHOTO_SIZE) {
        errors.push(`${file.name} is larger than 10 MB.`);
        return;
      }

      additions.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        caption: '',
      });
    });

    if (additions.length) setPhotos((current) => [...current, ...additions]);
    setPhotoError(errors.join(' '));
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, caption } : photo));
  };

  const removePhoto = (id: string) => {
    const photo = photos.find((item) => item.id === id);
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    setPhotos((current) => current.filter((item) => item.id !== id));
    setPhotoError('');
  };

  const listing = listingRecord ?? leaseRecord?.listing;
  const homeName = listing?.title?.trim()
    || leaseRecord?.rentalUnit?.property?.name?.trim()
    || leaseRecord?.rentalUnit?.name?.trim()
    || 'Rental home';
  const unitNumber = leaseRecord?.rentalUnit?.unitNumber?.trim();
  const unitName = leaseRecord?.rentalUnit?.name?.trim();
  const unitLabel = unitName || (unitNumber ? `Unit ${unitNumber}` : '');
  const heading = unitLabel && !homeName.toLowerCase().includes(unitLabel.toLowerCase())
    ? `${homeName} · ${unitLabel}`
    : homeName;
  const address = leaseRecord?.rentalUnit?.property?.address;
  const location = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.provinceCode,
    address?.postalCode,
  ].filter((part): part is string => Boolean(part?.trim())).join(', ');
  const moveInDate = formatLeaseDate(leaseRecord?.startDate);
  const listingPhotos = listing?.listingPhotos ?? [];
  const coverPhoto = listingPhotos.find((photo) => photo.isCoverPhoto && photo.url)
    ?? [...listingPhotos].filter((photo) => photo.url).sort((first, second) => first.displayOrder - second.displayOrder)[0];
  const isLoadingLease = loadedLeaseId !== leaseId;

  const submit = async () => {
    if (!confirmed || isSaving) return;
    setSubmitError('');
    setIsSaving(true);

    try {
      const submittedAt = new Date().toISOString();
      if (isMoveIn) {
        await saveCheckIn({
          leaseId,
          submittedAt,
          arrived: true,
          occupancy,
          notes,
          photos: photos.map(({ file, caption }) => ({
            name: file.name,
            mimeType: file.type,
            caption,
            file,
          })),
        });
      }

      localStorage.setItem(`arcora:${mode}:${leaseId}`, submittedAt);
      setComplete(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We could not save your check-in. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingLease) {
    return <main className="marketplace tenant-lease-page">
      <TenantHeader />
      <section className="tenant-lease-lifecycle tenant-lease-load-state" role="status">Loading lease and home details…</section>
      <MarketplaceFooter />
    </main>;
  }

  if (leaseLoadError || !leaseRecord) {
    return <main className="marketplace tenant-lease-page">
      <TenantHeader />
      <section className="tenant-lease-lifecycle tenant-lease-load-state">
        <div>
          <p className="marketplace-eyebrow">Lease details unavailable</p>
          <h1>We couldn’t load this home.</h1>
          <p role="alert">{leaseLoadError || 'No lease details were returned for this lease.'}</p>
          <button type="button" className="tenant-lease-secondary" onClick={() => navigate(`/tenant/leases/${leaseId}/review`)}>Back to lease details</button>
        </div>
      </section>
      <MarketplaceFooter />
    </main>;
  }

  return <main className="marketplace tenant-lease-page">
    <TenantHeader />
    <div className="tenant-lease-context">
      <button type="button" onClick={() => navigate(`/tenant/leases/${leaseId}/review`)}>← Lease details</button>
      <span>{isMoveIn ? 'Move-in check-in' : 'Move-out check-out'}</span>
    </div>
    <section className="tenant-lease-lifecycle">
      <div className="tenant-lease-lifecycle-main">
        {complete ? <section className="tenant-lease-success">
          <span className="tenant-lease-success-icon">✓</span>
          <p className="marketplace-eyebrow">{isMoveIn ? 'Check-in complete' : 'Check-out submitted'}</p>
          <h1>{isMoveIn ? 'Welcome to your new home.' : 'Your check-out is recorded.'}</h1>
          <p>{isMoveIn
            ? `Your move-in details and ${photos.length} ${photos.length === 1 ? 'photo have' : 'photos have'} been saved on this device.`
            : 'We have recorded your move-out details. Your landlord will review the final condition and deposit next steps.'}</p>
          <button type="button" className="tenant-lease-primary" onClick={() => navigate('/applications')}>Go to my account</button>
        </section> : <>
          <p className="marketplace-eyebrow">{isMoveIn ? 'Move-in day' : 'Leaving your home'}</p>
          <h1>{isMoveIn ? 'Check in to your home.' : 'Check out of your home.'}</h1>
          <p className="tenant-lease-lead">
            {isMoveIn
              ? 'Confirm that you have arrived and tell us about the home’s condition. Add notes and photos of anything that needs attention.'
              : 'Record your departure and share any final notes with your landlord before you leave.'}
          </p>

          <section className="tenant-lease-check-card">
            <div className="tenant-lease-check-heading">
              <div>
                <span className="marketplace-eyebrow">{isMoveIn ? 'Today' : 'Final step'}</span>
                <h2>{heading}</h2>
              </div>
              <span className="tenant-lease-document-status">Lease {leaseRecord.status || 'status unavailable'}</span>
            </div>

            <div className="tenant-lease-check-list">
              <label>
                <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
                <span>
                  <strong>{isMoveIn ? 'I have arrived at the home' : 'I have removed my belongings and returned possession'}</strong>
                  <small>{isMoveIn
                    ? moveInDate ? `Your move-in date is ${moveInDate}.` : 'Your move-in date is not listed on the lease.'
                    : 'Your landlord will receive this check-out confirmation.'}</small>
                </span>
              </label>
              {!isMoveIn && <label>
                <input type="checkbox" />
                <span>
                  <strong>I have reviewed the final condition</strong>
                  <small>Add a note below if anything needs attention.</small>
                </span>
              </label>}
            </div>

            {isMoveIn && <fieldset className="tenant-lease-condition">
              <legend>How is the home’s condition?</legend>
              <p>Choose what best describes the home. You can still complete check-in if something needs attention.</p>
              <div className="tenant-lease-condition-options">
                <label className={occupancy === 'ready' ? 'is-selected' : ''}>
                  <input type="radio" name="home-condition" value="ready" checked={occupancy === 'ready'} onChange={() => setOccupancy('ready')} />
                  <span><strong>Ready for occupancy</strong><small>The home looks ready to live in.</small></span>
                </label>
                <label className={occupancy === 'needs-attention' ? 'is-selected' : ''}>
                  <input type="radio" name="home-condition" value="needs-attention" checked={occupancy === 'needs-attention'} onChange={() => setOccupancy('needs-attention')} />
                  <span><strong>Needs attention</strong><small>I found something to report.</small></span>
                </label>
                <label className={occupancy === 'not-sure' ? 'is-selected' : ''}>
                  <input type="radio" name="home-condition" value="not-sure" checked={occupancy === 'not-sure'} onChange={() => setOccupancy('not-sure')} />
                  <span><strong>Not sure yet</strong><small>I need more time to look around.</small></span>
                </label>
              </div>
            </fieldset>}

            <label className="tenant-lease-notes">
              {isMoveIn ? 'Notes about the home' : 'Notes for your landlord'}
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={isMoveIn ? 'Describe anything you noticed, such as a leak, damage, or a missing item.' : 'Share any final notes'}
              />
            </label>

            {isMoveIn && <section className="tenant-lease-photos" aria-labelledby="tenant-lease-photos-title">
              <div className="tenant-lease-photos-heading">
                <div>
                  <h3 id="tenant-lease-photos-title">Photos of issues</h3>
                  <p>Please add photos of any places in the unit that need attention. You can select multiple images.</p>
                </div>
                <span>{photos.length}/{MAX_PHOTOS}</span>
              </div>
              <label className="tenant-lease-photo-picker">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => addPhotos(event.target.files)}
                  aria-label="Add photos of issues in the unit"
                />
                <span className="tenant-lease-photo-picker-icon" aria-hidden="true">+</span>
                <strong>Add photos</strong>
                <small>Choose multiple images · up to 10 MB each</small>
              </label>
              {photoError && <p className="tenant-lease-photo-error" role="alert">{photoError}</p>}
              {photos.length > 0 && <div className="tenant-lease-photo-grid">
                {photos.map((photo, index) => <article className="tenant-lease-photo-item" key={photo.id}>
                  <div className="tenant-lease-photo-preview">
                    <img src={photo.previewUrl} alt={`Issue photo ${index + 1}: ${photo.file.name}`} />
                    <button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Remove ${photo.file.name}`}>
                      <TrashIcon />
                    </button>
                  </div>
                  <label>
                    <span>Where is this? <small>(optional)</small></span>
                    <input
                      value={photo.caption}
                      onChange={(event) => updatePhotoCaption(photo.id, event.target.value)}
                      placeholder="e.g. Kitchen ceiling"
                    />
                  </label>
                </article>)}
              </div>}
            </section>}
          </section>

          {submitError && <p className="tenant-lease-submit-error" role="alert">{submitError}</p>}
          <button type="button" className="tenant-lease-primary" disabled={!confirmed || isSaving} onClick={submit}>
            <CheckIcon /> {isSaving ? 'Saving…' : isMoveIn ? 'Complete check-in' : 'Submit check-out'}
          </button>
        </>}
      </div>

      <aside className="tenant-lease-lifecycle-sidebar">
        <article className="tenant-lease-cover-card">
          {coverPhoto?.url
            ? <img className="tenant-lease-cover-image" src={coverPhoto.url} alt={coverPhoto.altText || `${homeName} cover`} />
            : <div className="tenant-lease-cover-placeholder"><FileIcon /><span>Cover photo unavailable</span></div>}
          <div className="tenant-lease-cover-copy">
            <span>YOUR HOME</span>
            <strong>{homeName}</strong>
            {unitLabel && unitLabel !== homeName && <small>{unitLabel}</small>}
            {location && <small>{location}</small>}
          </div>
        </article>
        {listingLoadError && !coverPhoto && <p className="tenant-lease-listing-message" role="status">We couldn’t refresh the listing photos. Showing the lease details we could load.</p>}
        <div className="tenant-lease-lifecycle-note">
          <ShieldIcon />
          <strong>{isMoveIn ? 'A clear starting record' : 'A clear handoff'}</strong>
          <p>{isMoveIn
            ? 'Your notes and photos are saved with your check-in on this device, so you can keep a record of the home’s starting condition.'
            : 'Your landlord will use this record to coordinate the final inspection and deposit review.'}</p>
        </div>
      </aside>
    </section>
    <MarketplaceFooter />
  </main>;
}
