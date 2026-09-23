import React, { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";

import "dayjs/locale/el";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.locale("el");

export default function FormDateTimeCompact({ ReturnVal, PreSelectedDate = null }) {
  // Initialize from PreSelectedDate or Now
  const initial = useMemo(() => dayjs.utc(PreSelectedDate || new Date()), [PreSelectedDate]);

  const [Year, setYear] = useState(initial.year());
  const [Month, setMonth] = useState(initial.month()); // 0-indexed
  const [Day, setDay] = useState(initial.date());
  const [Hour, setHour] = useState(initial.hour());
  const [Minute, setMinute] = useState(initial.minute());

  // Dropdown visibility states
  const [openDropdown, setOpenDropdown] = useState(null); // 'Y', 'M', 'D', 'H', 'Min' or null

  // Calculate Years [-20, +20]
  const years = useMemo(() => {
    const currentYear = dayjs().utc().year();
    return Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);
  }, []);

  const months = dayjs.utc().localeData().months();
const shortMonths = dayjs.utc().localeData().monthsShort();
  // Calculate Days based on selected Year and Month
  const daysArray = useMemo(() => {
    const daysInMonth = dayjs().utc().year(Year).month(Month).daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [Year, Month]);

  // Ensure Day is valid if month changes (e.g. Feb 31 -> Feb 28)
  useEffect(() => {
    const maxDays = dayjs().utc().year(Year).month(Month).daysInMonth();
    if (Day > maxDays) setDay(maxDays);
  }, [Year, Month]);

  // Notify parent of changes
  useEffect(() => {
    const finalDate = dayjs.utc().year(Year).month(Month).date(Day).hour(Hour).minute(Minute).second(0);
    if (ReturnVal) ReturnVal(finalDate.toDate());
  }, [Year, Month, Day, Hour, Minute]);

  const Hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  console.log("Hours===",Hours)
  const Minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
console.log("Minutes===",Minutes)
  return (
    <div id="DateTimePicker" className="Compact">
      {/* Header with Click Events to open dropdowns */}
      <div className="Header" style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
        <div className={openDropdown=='Y'?"selected":null} onClick={() => setOpenDropdown('Y')}>{Year}</div>-
        <div className={openDropdown=='M'?"selected":null} onClick={() => setOpenDropdown('M')}>{shortMonths[Month]}</div>-
        <div className={openDropdown=='D'?"selected":null} onClick={() => setOpenDropdown('D')}>{Day}</div> |
        <div className={openDropdown=='H'?"selected":null} onClick={() => setOpenDropdown('H')}>{Hour.toString().padStart(2, '0')}</div>:
        <div className={openDropdown=='Min'?"selected":null} onClick={() => setOpenDropdown('Min')}>{Minute.toString().padStart(2, '0')}</div>
      </div>

      <div className="DropdownContainer">
        {openDropdown === 'Y' && (
          <div className="dropdown-list" >
            {years.map(y => <div key={y} onClick={() => { setYear(y); setOpenDropdown(null); }}>{y}</div>)}
          </div>
        )}

        {openDropdown === 'M' && (
          <div className="dropdown-list" >
            {months.map((m, i) => <div className={Month==i?'selected':null} key={m} onClick={() => { setMonth(i); setOpenDropdown(null); }}>{m}</div>)}
          </div>
        )}

        {openDropdown === 'D' && (
          <div className="dropdown-list" >
            {daysArray.map(d => <div className={Day==d?'selected':null} key={d} onClick={() => { setDay(d); setOpenDropdown(null); }}>{d}</div>)}
          </div>
        )}

        {openDropdown === 'H' && (
          <div className="dropdown-list" >
            {Hours.map(h => <div className={Hour==h?'selected':null} key={h} onClick={() => { setHour(h); setOpenDropdown(null); }}>{h}</div>)}
          </div>
        )}

        {openDropdown === 'Min' && (
          <div className="dropdown-list" >
            {Minutes.map(m => <div className={Minute==m?'selected':null} key={m} onClick={() => { setMinute(m); setOpenDropdown(null); }}>{m}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}