import React, { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";   // ← Required for months()
// import "dayjs/locale/de";
import "dayjs/locale/de";
import "dayjs/locale/el";
// import "dayjs/locale/ar-iq";

import { localeLoaders } from "../../utils/DatesTimesPhasm";
import utc from "dayjs/plugin/utc";
import { PiCalendarBlankBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineSegment } from "react-icons/md";

dayjs.extend(utc);
// Extend once (outside component)
dayjs.extend(localeData);
// dayjs.locale("de");
// dayjs.locale("el");

export default function FormDateSelect({
  ReturnVal,
  PreSelectedDate = null,
  DateRangeBreak,
  AllowPastDates = true, // Set to true if you want the "1 day in past" restriction enabled
  locale = "en"
}) {
  const [activeLocale, setActiveLocale] = useState(null);

useEffect(() => {
  const loadLocale = async (targetLocale) => {
    try {
      if (localeLoaders[targetLocale]) {
        await localeLoaders[targetLocale]();
        dayjs.locale(targetLocale);
        setActiveLocale(targetLocale); // trigger component re-render
      }
    } catch (error) {
      console.error(`Could not load locale "${targetLocale}"`, error);
    }
  };

  loadLocale(locale);
}, [locale]);

  var UserDefinedInitialDate = PreSelectedDate != null ? new Date(PreSelectedDate) : null;

  const [currentDate, setCurrentDate] = useState(
    UserDefinedInitialDate ? dayjs.utc(UserDefinedInitialDate) : dayjs()
  );
  const [selectedDate, setSelectedDate] = useState(
    UserDefinedInitialDate ? dayjs.utc(UserDefinedInitialDate) : dayjs()
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isOpenMonth, setIsOpenMonth] = useState(false);
  const [isOpenYears, setIsOpenYears] = useState(false);

  const dropdownRefA = useRef(null);
  const dropdownRefB = useRef(null);
  const dropdownRefC = useRef(null);

  // Define yesterday (start of day in UTC)
  // const yesterday = useMemo(() => dayjs.utc().subtract(1, "day").startOf("day"), []);
  const today = useMemo(() => dayjs.utc().startOf("day"), []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefA.current && !dropdownRefA.current.contains(event.target)) {
        setIsOpenMonth(false);
      }
      if (dropdownRefB.current && !dropdownRefB.current.contains(event.target)) {
        setIsOpenYears(false);
      }
      if (dropdownRefC.current && !dropdownRefC.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      ReturnVal(selectedDate.format().split('T')[0] + "T00:00:00Z");
     
    }
  }, [selectedDate]);

  const startOfMonth = useMemo(() => currentDate.startOf("month"), [currentDate]);
  const endOfMonth = useMemo(() => currentDate.endOf("month"), [currentDate]);

  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  const generateDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(currentDate.date(d));
    }
    return days;
  }, [currentDate, startDay, daysInMonth]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
    if (DateRangeBreak) DateRangeBreak();
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, "month"));
    if (DateRangeBreak) DateRangeBreak();
  };

  // Helper function: returns true if the date is EARLIER than yesterday
  const isTooFarInPast = (date) => {
    if (!date) return false;
    return date.isBefore(today, "day");
  };

  const handleSelect = (date) => {
    // Prevent selection if date is missing OR if restricted and earlier than yesterday
    if (!date || (!AllowPastDates && isTooFarInPast(date))) {
      return;
    }

    setSelectedDate(date);
    setIsOpen(false);
  };

  const years = useMemo(() => {
    const currentYear = dayjs.utc().year();
    return Array.from({ length: 100 }, (_, i) => currentYear + i);
  }, []);

  const months = dayjs.utc().localeData().months();
  const weekdays = dayjs.utc().localeData().weekdaysShort();

  return (
    <div className="datepicker-wrapper" ref={dropdownRefC}>
      <div className="datepicker-header">
        <button onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <MdOutlineSegment /> : <RxHamburgerMenu />}
        </button>

        {showMenu ? (
          <div className="menu">
            <div
              className="NewSelect"
              value={currentDate.month()}
              ref={dropdownRefA}
            >
              <span onClick={() => setIsOpenMonth(!isOpenMonth)}>
                {months[currentDate.month()]}
              </span>

              <div className={isOpenMonth ? "open" : "closed"}>
                {months.map((monthName, index) => (
                  <div
                    key={index}
                    value={index}
                    onClick={() => (
                      DateRangeBreak && DateRangeBreak(),
                      setCurrentDate(currentDate.month(parseInt(index))),
                      setIsOpenMonth(!isOpenMonth)
                    )}
                  >
                    {monthName}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="NewSelect"
              value={currentDate.year()}
              ref={dropdownRefB}
            >
              <span onClick={() => setIsOpenYears(!isOpenYears)}>
                {currentDate.year() || new Date().getFullYear()}
              </span>

              <div className={isOpenYears ? "open" : "closed"}>
                {years.map((y) => (
                  <div
                    key={y}
                    value={y}
                    onClick={() => (
                      DateRangeBreak && DateRangeBreak(),
                      setCurrentDate(currentDate.year(parseInt(y))),
                      setIsOpenYears(!isOpenYears)
                    )}
                  >
                    {y}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="nav">
            <button onClick={handlePrevMonth}>◀</button>
            <span>{currentDate.format("MMMM YYYY")}</span>
            <button onClick={handleNextMonth}>▶</button>
          </div>
        )}

        <button onClick={() => setIsOpen(!isOpen)}>
          {selectedDate != null ? selectedDate.date() : <PiCalendarBlankBold />}
        </button>
      </div>

      <div className={`calendar ${isOpen ? "open" : "closed"}`}>
        <div className="weekdays">
          {weekdays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="days">
          {generateDays.map((date, i) => {
            const isDisabled = !AllowPastDates && isTooFarInPast(date);
            const isSelected = date && selectedDate && date.isSame(selectedDate, "day");

            return (
              <div
                key={i}
                className={`day ${isSelected ? "selected" : ""} ${
                  isDisabled ? "disabled" : ""
                }`}
                onClick={() => handleSelect(date)}
                style={{
                  pointerEvents: isDisabled ? "none" : "auto",
                  opacity: isDisabled ? 0.4 : 1,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                {date ? date.date() : ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}