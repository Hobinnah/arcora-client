import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarIcon, ChevIcon } from '../components/Icons';
import HostingHeader from './HostingHeader';
import './HostingCalendarPage.css';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const bookingPatterns = [
  { month: 7, start: 5, end: 8, name: 'Zachius + 1', tone: 'coral' },
  { month: 7, start: 9, end: 11, name: 'Marina + 1', tone: 'violet' },
  { month: 7, start: 13, end: 17, name: 'Derek', tone: 'teal' },
  { month: 7, start: 18, end: 19, name: 'Tanya', tone: 'gold' },
  { month: 7, start: 20, end: 24, name: 'Cody', tone: 'coral' },
  { month: 7, start: 25, end: 27, name: 'Nancy + 1', tone: 'violet' },
  { month: 7, start: 28, end: 30, name: 'Andi', tone: 'teal' },
  { month: 7, start: 31, end: 31, name: 'Imane + 1', tone: 'gold' },
  { month: 8, start: 3, end: 7, name: 'Rick', tone: 'coral' },
  { month: 8, start: 12, end: 16, name: 'Maya', tone: 'teal' },
] as const;

export default function HostingCalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [showTips, setShowTips] = useState(true);
  const calendarScrollRef = useRef<HTMLDivElement>(null);

  const calendarMonths = useMemo(() => Array.from({ length: 25 }, (_, index) => new Date(today.getFullYear(), today.getMonth() + index - 12, 1)), [today]);
  const calendarDays = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
      const day = index - firstDay + 1;
      return day > 0 && day <= daysInMonth ? day : null;
    });
  };
  const bookingSegments = (month: Date) => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    return bookingPatterns.filter((booking) => booking.month === month.getMonth()).flatMap((booking) => {
      const segments: Array<typeof booking & { row: number; column: number; span: number }> = [];
      let currentDay = booking.start;
      while (currentDay <= booking.end) {
        const startIndex = firstDay + currentDay - 1;
        const row = Math.floor(startIndex / 7);
        const column = startIndex % 7;
        const span = Math.min(booking.end - currentDay + 1, 7 - column);
        segments.push({ ...booking, row, column, span });
        currentDay += span;
      }
      return segments;
    });
  };

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
          <div className="hosting-calendar-month-scroll" ref={calendarScrollRef} onScroll={(event) => { const scrollTop = event.currentTarget.scrollTop; const panels = Array.from(event.currentTarget.children) as HTMLElement[]; const index = panels.reduce((closest, panel, panelIndex) => Math.abs(panel.offsetTop - scrollTop) < Math.abs(panels[closest].offsetTop - scrollTop) ? panelIndex : closest, 0); if (calendarMonths[index] && calendarMonths[index].getMonth() !== calendarMonth.getMonth()) setCalendarMonth(calendarMonths[index]); }}>
            {calendarMonths.map((month) => <div className="hosting-calendar-month-panel" key={`${month.getFullYear()}-${month.getMonth()}`} aria-label={`${monthNames[month.getMonth()]} calendar`}><div className="hosting-calendar-grid">
              {calendarDays(month).map((day, index) => { const isPast = day !== null && new Date(month.getFullYear(), month.getMonth(), day) < new Date(today.getFullYear(), today.getMonth(), today.getDate()); const isSelected = day === selectedDate.getDate() && month.getFullYear() === selectedDate.getFullYear() && month.getMonth() === selectedDate.getMonth(); return <button className={`hosting-calendar-day ${isSelected ? 'is-selected' : ''} ${day === null ? 'is-empty' : ''} ${isPast ? 'is-past' : ''}`} style={{ gridColumn: (index % 7) + 1, gridRow: Math.floor(index / 7) + 1 }} type="button" key={`${month.getMonth()}-${index}`} disabled={day === null} onClick={() => day && setSelectedDate(new Date(month.getFullYear(), month.getMonth(), day))}>{day && <><strong>{day}</strong><span>$2,100 CAD / month</span></>}</button>; })}
              {bookingSegments(month).map((booking, index) => <div className={`hosting-booking-bar ${booking.tone}`} key={`${booking.name}-${booking.row}-${booking.column}-${index}`} style={{ gridColumn: `${booking.column + 1} / span ${booking.span}`, gridRow: booking.row + 1 } as React.CSSProperties}><span className="hosting-booking-avatar">{booking.name[0]}</span><strong>{booking.name}</strong></div>)}
            </div></div>)}
          </div>
          <div className="hosting-calendar-floating-actions"><button type="button" aria-label="Jump to today">↑</button><button type="button" aria-label="Currency">CAD</button></div>
        </section>
        <aside className="hosting-calendar-sidebar" aria-label="Calendar details">
          <button className="hosting-tips-toggle" type="button" onClick={() => setShowTips((visible) => !visible)}>Show tips <span className={showTips ? 'is-visible' : ''}>{showTips ? '1' : '0'}</span></button>
          {showTips && <div className="hosting-calendar-tip"><strong>Keep your pricing competitive</strong><p>Homes with flexible pricing often get more interest from renters.</p></div>}
          <div className="hosting-calendar-detail-list">
            <button type="button"><span><strong>Pricing</strong><small>$2,100 – $2,300 CAD per month</small></span><ChevIcon /></button>
            <button type="button"><span><strong>Discounts</strong><small>3% monthly discount</small></span><ChevIcon /></button>
            <button type="button"><span><strong>Availability</strong><small>1 – 12 month stays<br />Same day advance notice</small></span><ChevIcon /></button>
            <button type="button"><span><strong>Cancellations</strong><small>Flexible for short-term stays<br />Firm Long Term for long-term stays</small></span><ChevIcon /></button>
          </div>
        </aside>
      </div>
    </main>
  );
}
