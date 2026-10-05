import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { CalendarIcon, ChevIcon } from '../components/Icons';
import { fetchCalendarEvents } from '../apis/useCalendarEvent';
import { getLandlordOrganization } from '../apis/useLandlordOrganization';
import { fetchListings } from '../apis/useListing';
import type { CalendarEvent } from '../types/CalendarEvent';
import type { Listing } from '../types/Listing';
import HostingHeader from './HostingHeader';
import './HostingCalendarPage.css';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const eventBounds = (event: CalendarEvent) => {
  const start = new Date(event.startAt);
  const end = new Date(event.endAt || event.startAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return { start: startOfDay(start), end: startOfDay(end) };
};
const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: currency || 'CAD', maximumFractionDigits: 0 }).format(amount);
const formatDate = (date: Date) => new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date);
const formatShortDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};
const priceForListingDate = (listing: Listing, date: Date) => {
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const applicablePrices = (listing.listingTermPrices || []).filter((termPrice) => {
    if (!termPrice.isActive) return false;
    const from = termPrice.effectiveFrom ? termPrice.effectiveFrom.slice(0, 10) : '';
    const to = termPrice.effectiveTo ? termPrice.effectiveTo.slice(0, 10) : '';
    return (!from || from <= dateKey) && (!to || to >= dateKey);
  }).map((termPrice) => termPrice.monthlyRentAmount).filter((amount) => amount > 0);
  const amounts = applicablePrices.length
    ? applicablePrices
    : [listing.baseMonthlyRentAmount, listing.BaseMonthlyRentAmountMax || listing.baseMonthlyRentAmount].filter((amount) => amount > 0);
  if (!amounts.length) return 'Price unavailable';
  const lowest = Math.min(...amounts);
  const highest = Math.max(...amounts);
  const priceLabel = lowest === highest
    ? formatCurrency(lowest, listing.currency)
    : `${formatCurrency(lowest, listing.currency)}–${formatCurrency(highest, listing.currency)}`;
  return `${priceLabel} / mo`;
};

export default function HostingCalendarPage() {
  const { currentUser } = useAuth();
  const userID = currentUser?.user?.id ?? currentUser?.user?.userId;
  const directOrganizationID = currentUser?.organization?.organizationID ?? currentUser?.memberOrganizations?.find((member) => member.organization)?.organization?.organizationID;
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [organizationID, setOrganizationID] = useState<string>();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListingID, setSelectedListingID] = useState('');
  const [loadedOrganizationID, setLoadedOrganizationID] = useState<string>();
  const [loadedUserID, setLoadedUserID] = useState<number>();
  const [loadError, setLoadError] = useState('');
  const calendarScrollRef = useRef<HTMLDivElement>(null);
  const hasCurrentCalendarData = Boolean(organizationID && loadedOrganizationID === organizationID && loadedUserID === userID);
  const activeCalendarEvents = hasCurrentCalendarData ? calendarEvents : [];
  const activeListings = hasCurrentCalendarData ? listings : [];
  const isLoading = Boolean(organizationID && !hasCurrentCalendarData);

  useEffect(() => {
    let cancelled = false;
    const organizationRequest = directOrganizationID
      ? Promise.resolve({ organizationID: directOrganizationID })
      : userID !== undefined
        ? getLandlordOrganization(userID)
        : Promise.resolve(null);
    void organizationRequest.then((organization) => {
      if (cancelled) return;
      const resolvedOrganizationID = organization?.organizationID || undefined;
      setOrganizationID(resolvedOrganizationID);
      if (!resolvedOrganizationID) setLoadError('We could not identify your hosting organization.');
    }).catch((error: unknown) => {
      if (!cancelled) setLoadError(error instanceof Error ? error.message : 'We could not load your hosting organization.');
    });
    return () => { cancelled = true; };
  }, [directOrganizationID, userID]);

  useEffect(() => {
    if (!organizationID || userID === undefined) return;
    let cancelled = false;
    void (async () => {
      try {
        const [firstListingsPage, firstEventsPage] = await Promise.all([
          fetchListings({ pageSize: 200, pageNumber: 0, organizationID }),
          fetchCalendarEvents({ pageSize: 200, pageNumber: 0, userID }),
        ]);
        const organizationListings = [...firstListingsPage.data];
        for (let pageNumber = 1; organizationListings.length < firstListingsPage.totalCount; pageNumber += 1) {
          const nextPage = await fetchListings({ pageSize: 200, pageNumber, organizationID });
          if (!nextPage.data.length) break;
          organizationListings.push(...nextPage.data);
        }
        const loadedEvents = [...firstEventsPage.data];
        for (let pageNumber = 1; loadedEvents.length < firstEventsPage.totalCount; pageNumber += 1) {
          const nextPage = await fetchCalendarEvents({ pageSize: 200, pageNumber, userID });
          if (!nextPage.data.length) break;
          loadedEvents.push(...nextPage.data);
        }
        const organizationListingIDs = new Set(organizationListings.map((listing) => listing.listingID));
        const organizationEvents = loadedEvents.filter((event) => {
          const listingID = event.listingID || event.lease?.listingID || event.listing?.listingID;
          return Boolean(listingID && organizationListingIDs.has(listingID));
        });
        if (!cancelled) {
          setListings(organizationListings);
          setCalendarEvents(organizationEvents);
          setSelectedListingID((current) => organizationListings.some((listing) => listing.listingID === current) ? current : organizationListings[0]?.listingID || '');
          setLoadedOrganizationID(organizationID);
          setLoadedUserID(userID);
          setLoadError('');
        }
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'We could not load calendar data.');
      }
    })();
    return () => { cancelled = true; };
  }, [organizationID, userID]);

  const calendarMonths = useMemo(() => Array.from({ length: 25 }, (_, index) => new Date(today.getFullYear(), today.getMonth() + index - 12, 1)), [today]);
  const calendarDays = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
      const day = index - firstDay + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    });
  };
  const eventsOnDate = (date: Date) => activeCalendarEvents.filter((event) => {
    const eventListingID = event.listingID || event.lease?.listingID || event.listing?.listingID;
    if (selectedListingID && eventListingID !== selectedListingID) return false;
    if (['cancelled', 'canceled', 'deleted'].includes(event.status.toLowerCase())) return false;
    const bounds = eventBounds(event);
    const selectedDay = startOfDay(date).getTime();
    return bounds !== null && bounds.start.getTime() <= selectedDay && bounds.end.getTime() >= selectedDay;
  });
  const selectedEvents = eventsOnDate(selectedDate).sort((left, right) => left.startAt.localeCompare(right.startAt));
  const selectedListing = activeListings.find((listing) => listing.listingID === selectedListingID) || activeListings[0];
  const bookingSegments = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const monthStart = startOfDay(month);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return activeCalendarEvents.filter((event) => {
      const eventListingID = event.listingID || event.lease?.listingID || event.listing?.listingID;
      return (!selectedListingID || eventListingID === selectedListingID) && !['cancelled', 'canceled', 'deleted'].includes(event.status.toLowerCase());
    }).flatMap((event, eventIndex) => {
      const bounds = eventBounds(event);
      if (!bounds || bounds.end < monthStart || bounds.start > monthEnd) return [];
      const visibleStart = bounds.start < monthStart ? monthStart : bounds.start;
      const visibleEnd = bounds.end > monthEnd ? monthEnd : bounds.end;
      const segments: Array<{ event: CalendarEvent; row: number; column: number; span: number; tone: string }> = [];
      let currentDate = visibleStart.getDate();
      while (currentDate <= visibleEnd.getDate()) {
        const startIndex = firstDay + currentDate - 1;
        const row = Math.floor(startIndex / 7);
        const column = startIndex % 7;
        const span = Math.min(visibleEnd.getDate() - currentDate + 1, 7 - column);
        segments.push({ event, row, column, span, tone: ['coral', 'violet', 'teal', 'gold'][eventIndex % 4] });
        currentDate += span;
      }
      return segments;
    });
  };
  const discountDetails = selectedListing ? [
    selectedListing.quarterlyDiscountRate > 0 ? `Quarterly ${selectedListing.quarterlyDiscountRate}%` : '',
    selectedListing.semiAnnualDiscountRate > 0 ? `Semi-annual ${selectedListing.semiAnnualDiscountRate}%` : '',
    selectedListing.yearlyDiscountRate > 0 ? `Yearly ${selectedListing.yearlyDiscountRate}%` : '',
  ].filter(Boolean) : [];
  const availabilityDates = selectedListing
    ? `${formatShortDate(selectedListing.availableFrom) || 'Start date not set'} – ${formatShortDate(selectedListing.availableTo) || 'No end date'}`
    : 'Select a listing to view availability';
  const availabilityRules = selectedListing
    ? `${selectedListing.minimumLeaseMonths}–${selectedListing.maximumLeaseMonths} mo · ${selectedListing.allowSameDay ? 'Same-day allowed' : selectedListing.advanceNotice ? `${selectedListing.advanceNotice} advance notice` : 'Advance notice required'}`
    : '';

  const scrollToMonth = (monthIndex: number) => {
    const safeMonthIndex = Math.max(0, Math.min(calendarMonths.length - 1, monthIndex));
    const nextMonth = calendarMonths[safeMonthIndex];
    setCalendarMonth(nextMonth);
    const monthPanel = calendarScrollRef.current?.children[safeMonthIndex] as HTMLElement | undefined;
    if (monthPanel && calendarScrollRef.current) {
      calendarScrollRef.current.scrollTo({ top: monthPanel.offsetTop, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    const currentMonthIndex = calendarMonths.findIndex((month) => month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth());
    const currentMonthPanel = calendarScrollRef.current?.children[currentMonthIndex] as HTMLElement | undefined;
    if (currentMonthPanel && calendarScrollRef.current) {
      calendarScrollRef.current.scrollTo({ top: currentMonthPanel.offsetTop });
    }
  }, [calendarMonths, today]);
  const moveMonth = (offset: number) => scrollToMonth(calendarMonths.findIndex((month) => month.getFullYear() === calendarMonth.getFullYear() && month.getMonth() === calendarMonth.getMonth()) + offset);
  const jumpToToday = () => {
    setSelectedDate(startOfDay(today));
    scrollToMonth(calendarMonths.findIndex((month) => month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth()));
  };
  const monthLabel = `${monthNames[calendarMonth.getMonth()]} ${calendarMonth.getFullYear()}`;

  return (
    <main className="marketplace hosting-calendar-page">
      <HostingHeader />
      <div className="hosting-calendar-layout">
        <section className="hosting-calendar-main" aria-labelledby="calendar-title">
          <div className="hosting-calendar-toolbar">
            <div className="hosting-calendar-month-control">
              <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" disabled={calendarMonths[0].getTime() === calendarMonth.getTime()}><ChevIcon /></button>
              <h1 id="calendar-title">{monthLabel}</h1>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" disabled={calendarMonths[calendarMonths.length - 1].getTime() === calendarMonth.getTime()}><ChevIcon /></button>
            </div>
            <div className="hosting-calendar-tools">
              <button type="button" className="hosting-calendar-select">Month <ChevIcon /></button>
              <button type="button" className="hosting-calendar-icon-button" aria-label="Calendar view"><CalendarIcon /></button>
            </div>
          </div>
          <div className="hosting-calendar-weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
          <div className="hosting-calendar-month-scroll" ref={calendarScrollRef} onScroll={(event) => { const scrollTop = event.currentTarget.scrollTop; const panels = Array.from(event.currentTarget.children) as HTMLElement[]; const index = panels.reduce((closest, panel, panelIndex) => Math.abs(panel.offsetTop - scrollTop) < Math.abs(panels[closest].offsetTop - scrollTop) ? panelIndex : closest, 0); if (calendarMonths[index] && calendarMonths[index].getTime() !== calendarMonth.getTime()) setCalendarMonth(calendarMonths[index]); }}>
            {calendarMonths.map((month) => <div className="hosting-calendar-month-panel" key={`${month.getFullYear()}-${month.getMonth()}`} aria-label={`${monthNames[month.getMonth()]} calendar`}><div className="hosting-calendar-grid">
              {calendarDays(month).map((day, index) => {
                const gridPosition = { gridColumn: (index % 7) + 1, gridRow: Math.floor(index / 7) + 1 };
                if (day === null) return <div className="hosting-calendar-day is-empty" style={gridPosition} key={`${month.getFullYear()}-${month.getMonth()}-${index}`} aria-hidden="true" />;
                const date = new Date(month.getFullYear(), month.getMonth(), day);
                const dayEvents = eventsOnDate(date);
                const isPast = date < startOfDay(today);
                const isSelected = date.getTime() === startOfDay(selectedDate).getTime();
                return <button className={`hosting-calendar-day ${isSelected ? 'is-selected' : ''} ${isPast ? 'is-past' : ''} ${dayEvents.length ? 'has-events' : ''}`} style={gridPosition} type="button" key={`${month.getFullYear()}-${month.getMonth()}-${day}`} aria-label={`${formatDate(date)}${dayEvents.length ? `, ${dayEvents.length} calendar events` : ''}`} aria-pressed={isSelected} onClick={() => setSelectedDate(date)}><strong>{day}</strong>{selectedListing && <span className="hosting-calendar-day-price">{priceForListingDate(selectedListing, date)}</span>}{dayEvents.length > 0 && <span className="hosting-calendar-event-count">{dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}</span>}</button>;
              })}
              {bookingSegments(month).map(({ event, row, column, span, tone }, index) => {
                const label = event.title || event.occupantName || event.eventType || 'Calendar event';
                const avatar = (event.occupantName || event.title || event.eventType || 'E').slice(0, 1).toUpperCase();
                return <div className={`hosting-booking-bar ${tone}`} key={`${event.calendarEventID}-${row}-${column}-${index}`} style={{ gridColumn: `${column + 1} / span ${span}`, gridRow: row + 1 } as React.CSSProperties}><span className="hosting-booking-avatar">{avatar}</span><strong>{label}</strong></div>;
              })}
            </div></div>)}
          </div>
          <div className="hosting-calendar-floating-actions"><button type="button" aria-label="Jump to today" title="Jump to today" onClick={jumpToToday}>Today</button></div>
        </section>
        <aside className="hosting-calendar-sidebar" aria-label="Calendar details">
          <div className="hosting-calendar-sidebar-heading"><span className="hosting-calendar-kicker">Selected date</span><h2>{formatDate(selectedDate)}</h2></div>
          {isLoading && <p className="hosting-calendar-message" role="status">Loading your calendar...</p>}
          {loadError && <p className="hosting-calendar-error" role="alert">{loadError}</p>}
          {!isLoading && !loadError && selectedEvents.length === 0 && <p className="hosting-calendar-message">No calendar events are recorded for this date.</p>}
          {selectedEvents.length > 0 && <div className="hosting-calendar-event-list"><h3>Events ({selectedEvents.length})</h3>{selectedEvents.map((event) => {
            const listingID = event.listingID || event.lease?.listingID || event.listing?.listingID;
            const listing = activeListings.find((item) => item.listingID === listingID);
            const title = event.title || event.eventType || 'Calendar event';
            const occupant = event.occupantName || [event.lease?.tenant?.user?.firstName, event.lease?.tenant?.user?.lastName].filter(Boolean).join(' ') || '';
            const eventTime = event.isAllDay ? 'All day' : new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit' }).format(new Date(event.startAt));
            return <article className="hosting-calendar-event" key={event.calendarEventID}><span className="hosting-calendar-event-marker" /><div><strong>{title}</strong>{occupant && <span>{occupant}{event.occupantCount > 1 ? ` + ${event.occupantCount - 1}` : ''}</span>}<small>{eventTime}{listing?.title ? ` · ${listing.title}` : ''}</small></div></article>;
          })}</div>}
          <div className="hosting-calendar-detail-list">
            <div className="hosting-calendar-detail-row"><span><strong>Pricing</strong><small className="hosting-calendar-single-line" title={selectedListing ? `${priceForListingDate(selectedListing, selectedDate)} · Selected date` : 'Select a listing to view prices'}>{selectedListing ? `${priceForListingDate(selectedListing, selectedDate)} · Selected date` : 'Select a listing to view prices'}</small></span></div>
            <div className="hosting-calendar-detail-row"><span><strong>Discounts</strong>{discountDetails.length ? discountDetails.map((detail) => <small key={detail}>{detail}</small>) : <small>No term discounts listed</small>}</span></div>
            <div className="hosting-calendar-detail-row"><span><strong>Availability</strong><small className="hosting-calendar-single-line" title={availabilityDates}>{availabilityDates}</small>{selectedListing && <small className="hosting-calendar-single-line" title={availabilityRules}>{availabilityRules}</small>}</span></div>
            <div className="hosting-calendar-detail-row"><span><strong>Cancellations</strong>{selectedListing ? <><small>Short term: {selectedListing.shortTermCancellationPolicy || 'Not specified'}</small><small>Long term: {selectedListing.longTermCancellationPolicy || 'Not specified'}</small></> : <small>Select a listing to view cancellation policies</small>}</span></div>
          </div>
          <div className="hosting-calendar-listings"><div className="hosting-calendar-listings-heading"><h3>Your listings</h3><span>{activeListings.length}</span></div><div className="hosting-calendar-listing-scroll">{activeListings.length === 0 && !isLoading && !loadError && <p className="hosting-calendar-message">No listings found for this organization.</p>}{activeListings.map((listing) => <button className="hosting-calendar-listing" type="button" aria-pressed={listing.listingID === selectedListing?.listingID} key={listing.listingID} onClick={() => setSelectedListingID(listing.listingID)}><strong>{listing.title || 'Untitled listing'}</strong><span>{priceForListingDate(listing, selectedDate)}</span><small>{listing.minimumLeaseMonths}–{listing.maximumLeaseMonths} month stays</small></button>)}</div></div>
        </aside>
      </div>
    </main>
  );
}
