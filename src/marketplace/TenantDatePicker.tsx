import { useEffect, useRef, useState } from 'react';
import { CalendarIcon } from '../components/Icons';

type TenantDatePickerProps = { value: string; onChange: (value: string) => void; ariaLabel: string; placeholder?: string; startYear?: number; endYear?: number; minDate?: string; maxDate?: string };

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function TenantDatePicker({ value, onChange, ariaLabel, placeholder = 'Select a date', startYear, endYear, minDate, maxDate }: TenantDatePickerProps) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [month, setMonth] = useState(() => { const date = value ? new Date(`${value}T00:00:00`) : new Date(); return new Date(date.getFullYear(), date.getMonth(), 1); });
  const currentYear = new Date().getFullYear();
  const minDateObj = minDate ? new Date(`${minDate}T00:00:00`) : null;
  const maxDateObj = maxDate ? new Date(`${maxDate}T00:00:00`) : null;
  const minYear = startYear ?? (minDateObj ? minDateObj.getFullYear() : currentYear - 100);
  const maxYear = endYear ?? (maxDateObj ? maxDateObj.getFullYear() : currentYear + 10);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => maxYear - index);
  const days = Array.from({ length: 42 }, (_, index) => { const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay(); return new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1); });
  const isMonthOptionDisabled = (index: number) => (!!maxDateObj && month.getFullYear() === maxDateObj.getFullYear() && index > maxDateObj.getMonth()) || (!!minDateObj && month.getFullYear() === minDateObj.getFullYear() && index < minDateObj.getMonth());
  const isNextMonthDisabled = !!maxDateObj && month.getFullYear() === maxDateObj.getFullYear() && month.getMonth() === maxDateObj.getMonth();
  const isPrevMonthDisabled = !!minDateObj && month.getFullYear() === minDateObj.getFullYear() && month.getMonth() === minDateObj.getMonth();
  const isDateDisabled = (date: Date) => (!!maxDateObj && date > maxDateObj) || (!!minDateObj && date < minDateObj);
  const selectDate = (date: Date) => { onChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`); setOpen(false); };
  useEffect(() => { if (!open) return; const close = (event: MouseEvent) => { if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) setOpen(false); }; const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; document.addEventListener('mousedown', close); document.addEventListener('keydown', escape); return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape); }; }, [open]);
  return <div className="tenant-date-picker" ref={pickerRef}><button type="button" className="tenant-date-trigger" aria-label={ariaLabel} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((current) => !current)}><span>{value || placeholder}</span><CalendarIcon /></button>{open && <div className="tenant-date-popover" role="dialog" aria-label={ariaLabel}><div className="tenant-date-header"><button type="button" aria-label="Previous month" disabled={isPrevMonthDisabled} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><div className="tenant-date-header-selects"><select aria-label="Month" value={month.getMonth()} onChange={(event) => setMonth(new Date(month.getFullYear(), Number(event.target.value), 1))}>{monthNames.map((name, index) => <option key={name} value={index} disabled={isMonthOptionDisabled(index)}>{name}</option>)}</select><select aria-label="Year" value={month.getFullYear()} onChange={(event) => setMonth(new Date(Number(event.target.value), month.getMonth(), 1))}>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></div><button type="button" aria-label="Next month" disabled={isNextMonthDisabled} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></div><div className="tenant-date-weekdays">{['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}</div><div className="tenant-date-grid">{days.map((date, index) => { const currentMonth = date.getMonth() === month.getMonth(); const dateValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; const disabled = isDateDisabled(date); return <button type="button" key={`${dateValue}-${index}`} disabled={disabled} className={`${currentMonth ? '' : 'is-muted'} ${dateValue === value ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`} onClick={() => selectDate(date)}>{date.getDate()}</button>; })}</div><div className="tenant-date-actions"><button type="button" onClick={() => { onChange(''); setOpen(false); }}>Clear</button><button type="button" disabled={isDateDisabled(new Date())} onClick={() => selectDate(new Date())}>Today</button></div></div>}</div>;
}
