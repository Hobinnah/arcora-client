import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLease } from '../apis/useLease';
import { getListing } from '../apis/useListing';
import {
  createCheckInDraft, deleteCheckInPhoto, getLeaseCheckIn, submitLeaseCheckIn, uploadCheckInPhoto,
  type CheckInAttachment, type CheckInDraft, type CheckInInspection, type LeaseCheckIn,
  type OccupancyReadiness, type SubmitCheckIn,
} from '../apis/useLeaseCheckIn';
import { CheckIcon, FileIcon, ShieldIcon, TrashIcon } from '../components/Icons';
import type { Lease } from '../types/Lease';
import type { Listing } from '../types/Listing';
import TenantHeader from './TenantHeader';
import MarketplaceFooter from './MarketplaceFooter';
import './TenantLeaseExperience.css';

const MAX_PHOTOS = 10;
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
type OccupancyCondition = OccupancyReadiness;

type IssuePhoto = {
  id: string;
  file?: File;
  previewUrl: string;
  caption: string;
  attachmentID?: string;
  name: string;
  ownsPreview: boolean;
};

function recordPhotos(record: CheckInInspection): IssuePhoto[] {
  const attachments = new Map<string, CheckInAttachment>();
  [...record.attachments, ...record.items.flatMap((item) => item.attachments)]
    .forEach((attachment) => attachments.set(attachment.attachmentID, attachment));
  return Array.from(attachments.values()).map((attachment) => ({
    id: attachment.attachmentID,
    attachmentID: attachment.attachmentID,
    previewUrl: attachment.downloadUrl ?? '',
    caption: attachment.description ?? '',
    name: attachment.fileName ?? 'Issue photo',
    ownsPreview: false,
  }));
}

function formatLeaseDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
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
  const [checkIn, setCheckIn] = useState<LeaseCheckIn | null>(null);
  const [draft, setDraft] = useState<CheckInDraft | null>(null);
  const [savedInspection, setSavedInspection] = useState<CheckInInspection | null>(null);
  const [savingMessage, setSavingMessage] = useState('');
  const [removingPhoto, setRemovingPhoto] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const submitAttempt = useRef<{ fingerprint: string; key: string } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);

  useEffect(() => {
    let cancelled = false;

    const loadLeaseDetails = async () => {
      try {
        if (!leaseId) throw new Error('A lease ID is required to load check-in details.');
        const [lease, currentCheckIn] = await Promise.all([
          getLease(leaseId),
          isMoveIn ? getLeaseCheckIn(leaseId) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setLeaseRecord(lease);
        setCheckIn(currentCheckIn);
        const inspection = currentCheckIn?.inspection;
        setSavedInspection(inspection ?? null);
        setComplete(Boolean(inspection?.submittedAt));
        setDraft(inspection && !inspection.submittedAt ? { inspectionID: inspection.inspectionID, version: inspection.version } : null);
        setNotes(inspection?.notes ?? '');
        setOccupancy(inspection?.occupancyReadiness ?? '');
        setConfirmed(Boolean(inspection?.arrivalConfirmedAt));
        photosRef.current.filter((photo) => photo.ownsPreview).forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
        setPhotos(inspection ? recordPhotos(inspection) : []);
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
  }, [leaseId, isMoveIn, refreshKey]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => () => {
    photosRef.current.filter((photo) => photo.ownsPreview).forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
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
      if (!IMAGE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: please choose a JPEG, PNG, or WebP image.`);
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
        name: file.name,
        ownsPreview: true,
      });
    });

    if (additions.length) setPhotos((current) => [...current, ...additions]);
    setPhotoError(errors.join(' '));
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, caption } : photo));
  };

  const removePhoto = async (id: string) => {
    const photo = photos.find((item) => item.id === id);
    if (!photo || isSaving || removingPhoto) return;
    setPhotoError('');
    setRemovingPhoto(id);
    try {
      if (photo.attachmentID) await deleteCheckInPhoto(leaseId, photo.attachmentID);
      if (photo.ownsPreview) URL.revokeObjectURL(photo.previewUrl);
      setPhotos((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Could not remove the photo. Please try again.');
    } finally {
      setRemovingPhoto(null);
    }
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
  const moveInDate = formatLeaseDate(checkIn?.eligibility.moveInDate ?? leaseRecord?.startDate);
  const listingPhotos = listing?.listingPhotos ?? [];
  const coverPhoto = listingPhotos.find((photo) => photo.isCoverPhoto && photo.url)
    ?? [...listingPhotos].filter((photo) => photo.url).sort((first, second) => first.displayOrder - second.displayOrder)[0];
  const isLoadingLease = loadedLeaseId !== leaseId;

  const submit = async () => {
    if (!confirmed || isSaving || removingPhoto || (isMoveIn && (!occupancy || !checkIn?.eligibility.canSubmit))) return;
    setSubmitError('');
    setIsSaving(true);

    try {
      if (isMoveIn) {
        if (!occupancy) throw new Error('Please choose the home’s condition.');
        setSavingMessage('Preparing check-in…');
        const currentDraft = draft ?? await createCheckInDraft(leaseId);
        setDraft(currentDraft);
        const uploaded: SubmitCheckIn['photos'] = [];
        for (const [index, photo] of photos.entries()) {
          let attachmentID = photo.attachmentID;
          if (!attachmentID) {
            if (!photo.file) throw new Error(`The file for ${photo.name} is missing. Please add it again.`);
            setSavingMessage(`Uploading photo ${index + 1} of ${photos.length}…`);
            const attachment = await uploadCheckInPhoto(leaseId, currentDraft.inspectionID, photo.file, photo.id, photo.caption);
            attachmentID = attachment.attachmentID;
            const uploadedID = attachmentID;
            setPhotos((current) => current.map((item) => item.id === photo.id ? { ...item, attachmentID: uploadedID } : item));
          }
          uploaded.push({ attachmentID, description: photo.caption });
        }
        const request: SubmitCheckIn = {
          ...currentDraft,
          arrivalConfirmed: true,
          occupancyReadiness: occupancy,
          notes,
          photos: uploaded,
          items: (savedInspection?.items ?? []).map((item) => ({
            clientItemID: item.inspectionItemID,
            area: item.area,
            itemName: item.itemName,
            condition: item.condition,
            notes: item.notes,
            attachmentIDs: item.attachments.map((attachment) => attachment.attachmentID).filter((id) => uploaded.some((photo) => photo.attachmentID === id)),
          })),
        };
        const fingerprint = JSON.stringify(request);
        if (submitAttempt.current?.fingerprint !== fingerprint) {
          submitAttempt.current = { fingerprint, key: crypto.randomUUID() };
        }
        setSavingMessage('Submitting check-in…');
        const inspection = await submitLeaseCheckIn(leaseId, request, submitAttempt.current.key);
        setSavedInspection(inspection);
      } else {
        localStorage.setItem(`arcora:${mode}:${leaseId}`, new Date().toISOString());
      }
      setComplete(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We could not save your check-in. Please try again.');
      if (isMoveIn) {
        try {
          const latest = await getLeaseCheckIn(leaseId);
          setCheckIn(latest);
          if (latest.inspection?.submittedAt) {
            setSavedInspection(latest.inspection);
            setComplete(true);
            setSubmitError('');
          } else if (latest.inspection) {
            setDraft({ inspectionID: latest.inspection.inspectionID, version: latest.inspection.version });
          }
        } catch (recoveryError) {
          setSubmitError((current) => `${current} Could not verify the saved status: ${recoveryError instanceof Error ? recoveryError.message : 'Please retry.'}`);
        }
      }
    } finally {
      setIsSaving(false);
      setSavingMessage('');
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
          <button type="button" className="tenant-lease-primary" onClick={() => setRefreshKey((value) => value + 1)}>Retry loading</button>
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
            ? 'Your arrival, condition notes, and photos are saved to your lease and shared with your landlord.'
            : 'We have recorded your move-out details. Your landlord will review the final condition and deposit next steps.'}</p>
          {isMoveIn && savedInspection && <div className="tenant-lease-submitted-record">
            <dl>
              <div><dt>Submitted</dt><dd>{savedInspection.submittedAt ? new Date(savedInspection.submittedAt).toLocaleString() : 'Recorded'}</dd></div>
              <div><dt>Home condition</dt><dd>{savedInspection.occupancyReadiness === 'READY' ? 'Ready for occupancy' : savedInspection.occupancyReadiness === 'NEEDS_ATTENTION' ? 'Needs attention' : 'Not sure yet'}</dd></div>
            </dl>
            {savedInspection.requiresFollowUp && <p>Your check-in is flagged for landlord follow-up.</p>}
            {savedInspection.notes && <p className="tenant-lease-record-notes">{savedInspection.notes}</p>}
            <div className="tenant-lease-photo-grid">
              {recordPhotos(savedInspection).map((photo) => <article className="tenant-lease-photo-item" key={photo.id}>
                {photo.previewUrl
                  ? <a href={photo.previewUrl} target="_blank" rel="noreferrer"><img className="tenant-lease-record-photo" src={photo.previewUrl} alt={photo.caption || photo.name} /></a>
                  : <p>Preview unavailable for {photo.name}.</p>}
                <p>{photo.caption || photo.name}</p>
              </article>)}
            </div>
            {savedInspection.reviews.map((review) => <article className="tenant-lease-record-review" key={review.inspectionReviewID}>
              <strong>Landlord review: {review.status}</strong>
              {review.comments && <p>{review.comments}</p>}
            </article>)}
          </div>}
          <button type="button" className="tenant-lease-primary" onClick={() => navigate('/applications')}>Go to my account</button>
        </section> : <>
          <p className="marketplace-eyebrow">{isMoveIn ? 'Move-in day' : 'Leaving your home'}</p>
          <h1>{isMoveIn ? 'Check in to your home.' : 'Check out of your home.'}</h1>
          <p className="tenant-lease-lead">
            {isMoveIn
              ? 'Confirm that you have arrived and tell us about the home’s condition. Add notes and photos of anything that needs attention.'
              : 'Record your departure and share any final notes with your landlord before you leave.'}
          </p>
          {isMoveIn && checkIn && !checkIn.eligibility.canSubmit && <p className="tenant-lease-signing-message" role="status">
            {checkIn.eligibility.message || 'Check-in is not currently available for this lease.'}
          </p>}

          <fieldset className="tenant-lease-check-card tenant-lease-check-form" disabled={isSaving || Boolean(removingPhoto) || (isMoveIn && !checkIn?.eligibility.canSubmit)}>
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
                <label className={occupancy === 'READY' ? 'is-selected' : ''}>
                  <input type="radio" name="home-condition" value="READY" checked={occupancy === 'READY'} onChange={() => setOccupancy('READY')} />
                  <span><strong>Ready for occupancy</strong><small>The home looks ready to live in.</small></span>
                </label>
                <label className={occupancy === 'NEEDS_ATTENTION' ? 'is-selected' : ''}>
                  <input type="radio" name="home-condition" value="NEEDS_ATTENTION" checked={occupancy === 'NEEDS_ATTENTION'} onChange={() => setOccupancy('NEEDS_ATTENTION')} />
                  <span><strong>Needs attention</strong><small>I found something to report.</small></span>
                </label>
                <label className={occupancy === 'NOT_SURE' ? 'is-selected' : ''}>
                  <input type="radio" name="home-condition" value="NOT_SURE" checked={occupancy === 'NOT_SURE'} onChange={() => setOccupancy('NOT_SURE')} />
                  <span><strong>Not sure yet</strong><small>I need more time to look around.</small></span>
                </label>
              </div>
            </fieldset>}

            <label className="tenant-lease-notes">
              {isMoveIn ? 'Notes about the home' : 'Notes for your landlord'}
              <textarea
                value={notes}
                maxLength={1000}
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
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) => addPhotos(event.target.files)}
                  aria-label="Add photos of issues in the unit"
                />
                <span className="tenant-lease-photo-picker-icon" aria-hidden="true">+</span>
                <strong>Add photos</strong>
                <small>JPEG, PNG, or WebP · up to 10 MB each</small>
              </label>
              {photoError && <p className="tenant-lease-photo-error" role="alert">{photoError}</p>}
              {photos.length > 0 && <div className="tenant-lease-photo-grid">
                {photos.map((photo, index) => <article className="tenant-lease-photo-item" key={photo.id}>
                  <div className="tenant-lease-photo-preview">
                    {photo.previewUrl ? <img src={photo.previewUrl} alt={`Issue photo ${index + 1}: ${photo.name}`} /> : <p>Preview unavailable. You can remove this photo or reload to refresh it.</p>}
                    <button type="button" onClick={() => void removePhoto(photo.id)} aria-label={`Remove ${photo.name}`}>
                      <TrashIcon />
                    </button>
                  </div>
                  <label>
                    <span>Where is this? <small>(optional)</small></span>
                    <input
                      value={photo.caption}
                      maxLength={1000}
                      onChange={(event) => updatePhotoCaption(photo.id, event.target.value)}
                      placeholder="e.g. Kitchen ceiling"
                    />
                  </label>
                </article>)}
              </div>}
            </section>}
          </fieldset>

          {submitError && <p className="tenant-lease-submit-error" role="alert">{submitError}</p>}
          {savingMessage && <p role="status" className="tenant-lease-signing-message">{savingMessage}</p>}
          {isMoveIn && !occupancy && <p className="tenant-lease-selection-hint">Confirm arrival and choose the home’s condition to complete check-in.</p>}
          <button type="button" className="tenant-lease-primary" disabled={!confirmed || isSaving || Boolean(removingPhoto) || (isMoveIn && (!occupancy || !checkIn?.eligibility.canSubmit))} onClick={submit}>
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
            ? 'Your submitted notes and photos become a shared record of the home’s starting condition. You can report issues without certifying that the home is ready.'
            : 'Your landlord will use this record to coordinate the final inspection and deposit review.'}</p>
        </div>
      </aside>
    </section>
    <MarketplaceFooter />
  </main>;
}
