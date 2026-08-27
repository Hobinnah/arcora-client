import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "./Icons";

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

export default function CustomSelect({ value, options, onChange, ariaLabel }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnOutsideMouse = (event: MouseEvent) => {
      if (!selectRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideMouse);
    return () => document.removeEventListener("mousedown", closeOnOutsideMouse);
  }, [open]);
  return (
    <div className="hosting-select" ref={selectRef}>
      <button
        type="button"
        className="hosting-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{value}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <>
          <div className="hosting-select-backdrop" onMouseDown={() => setOpen(false)} />
          <ul className="hosting-select-menu" role="listbox" aria-label={ariaLabel}>
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  className={option === value ? "is-selected" : ""}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <span>{option}</span>
                  {option === value && <CheckIcon />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
