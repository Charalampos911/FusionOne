import React, { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/de";
import "dayjs/locale/el";
import { MdArrowCircleLeft } from "react-icons/md";
import { localeLoaders, toApiDate } from "../../../utils/DatesTimesPhasm";
import utc from "dayjs/plugin/utc";
import { PiCalendarBlankBold } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineSegment } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, ResetMsg } from "../../../Redux/features/ApiReducer";

dayjs.extend(utc);
dayjs.extend(localeData);

export default function OnlineDateSelect({
  ReturnVal,
  PreSelectedDate = null,
  DateRangeBreak,
  AllowPastDates = true,
  locale = "en",
  GoBack,
  department,
  service,
  division,
}) {
  const [activeLocale, setActiveLocale] = useState(null);
  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadLocale = async (targetLocale) => {
      try {
        if (localeLoaders[targetLocale]) {
          await localeLoaders[targetLocale]();
          dayjs.locale(targetLocale);
          setActiveLocale(targetLocale);
        }
      } catch (error) {
        console.error(`Could not load locale "${targetLocale}"`, error);
      }
    };

    loadLocale(locale);
  }, [locale]);

  var UserDefinedInitialDate =
    PreSelectedDate != null ? new Date(PreSelectedDate) : null;

  const [currentDate, setCurrentDate] = useState(
    UserDefinedInitialDate ? dayjs.utc(UserDefinedInitialDate) : dayjs()
  );
  const [selectedDate, setSelectedDate] = useState(
    UserDefinedInitialDate ? dayjs.utc(UserDefinedInitialDate) : dayjs()
  );
  const [interactions, setInteractions] = useState(0);

  const [isOpen, setIsOpen] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isOpenMonth, setIsOpenMonth] = useState(false);
  const [isOpenYears, setIsOpenYears] = useState(false);
  const [availability, setAvailability] = useState(null);

  const [userTime, setUserTime] = useState(null);

  const dropdownRefA = useRef(null);
  const dropdownRefB = useRef(null);
  const dropdownRefC = useRef(null);

  const today = useMemo(() => dayjs.utc().startOf("day"), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefA.current && !dropdownRefA.current.contains(event.target)) {
        setIsOpenMonth(false);
      }
      if (dropdownRefB.current && !dropdownRefB.current.contains(event.target)) {
        setIsOpenYears(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startOfMonth = useMemo(() => currentDate.startOf("month"), [currentDate]);
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

  // Find which week row contains the selected date
  const selectedWeekIndex = useMemo(() => {
    if (!selectedDate) return -1;
    const index = generateDays.findIndex(
      (d) => d && d.isSame(selectedDate, "day")
    );
    return index !== -1 ? Math.floor(index / 7) : -1;
  }, [generateDays, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, "month"));
    if (DateRangeBreak) DateRangeBreak();
    setAvailability(null);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, "month"));
    if (DateRangeBreak) DateRangeBreak();
    setAvailability(null);
  };

  const isTooFarInPast = (date) => {
    if (!date) return false;
    return date.isBefore(today, "day");
  };

  const handleSelect = (date) => {
    setAvailability(null);
    if (!date || (!AllowPastDates && isTooFarInPast(date))) {
      return;
    }
    
    setSelectedDate(date);
    setInteractions((prev) => prev + 1);
  };

  const years = useMemo(() => {
    const currentYear = dayjs.utc().year();
    return Array.from({ length: 100 }, (_, i) => currentYear + i);
  }, []);

  const months = dayjs.utc().localeData().months();
  const weekdays = dayjs.utc().localeData().weekdaysShort();

  useEffect(() => {
    if (service == null || selectedDate == null || interactions === 0) return;

    dispatch(
      apiRequest({
        name: "NewOrderService.jsx | GetDailyAvailableDivisions",
        url: "api/ServicesSU/GetDailyAvailabilitySU",
        method: "POST",
        body: {
          DepartmentId: department.Id,
          ServiceId: service?.Id,
          DivisionId: division.Id,
          StartDate: selectedDate.toISOString(),
        },
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    )
      .unwrap()
      .then((Response) => {
        setAvailability(Response.data);
      });
  }, [selectedDate]);

  const HTimeChange = (time) => {
    setUserTime(time);
    const StartDate = new Date(time);
console.log("return val == ",{
          Department: department,
          ServiceId: service?.Id,
          DivisionId: division.Id,
          StartDate: StartDate
        })

ReturnVal({
          Department: department,
          Service: service,
          Division: division,
          StartDate: StartDate
        })

  };

  return (
    <div id="OnlineDateSelect">
      <div className="head">
        <div
          className="online-back"
          onClick={() => (setAvailability(null), GoBack())}
        >
          <MdArrowCircleLeft />
        </div>
        <label>Pick a date</label>
      </div>

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
                      onClick={() => (
                        setAvailability(null),
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
                      onClick={() => (
                        setAvailability(null),
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

          <button>
            {selectedDate != null ? (
              selectedDate.date()
            ) : (
              <PiCalendarBlankBold />
            )}
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
  
  // Check for normal 7th-day end OR the final element of the array
  const isEndOfWeek = (i + 1) % 7 === 0 || i === generateDays.length - 1;
  const weekIndex = Math.floor(i / 7);
  const isSelectedWeek = weekIndex === selectedWeekIndex;

  return (
    <React.Fragment key={i}>
      <div
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

      {isEndOfWeek &&
        isSelectedWeek &&
        availability?.Combinations?.some((combo) => combo.TimeSlots?.length > 0) && (
          <div
            className={`availabilityBlock week-${weekIndex}`}
          >
            <div className="MultiTimes">
              {availability.Combinations.map((combo, comboIndex) =>
                combo.TimeSlots?.map((slot, slotIndex) => (
                  <div
                    key={`${comboIndex}-${slotIndex}`}
                    className={userTime === slot.Start ? "selected" : ""}
                    onClick={() => HTimeChange(slot.Start)}
                  >
                    <div>
                      {slot.Start.split("T")[1]
                        .split(":")
                        .slice(0, 2)
                        .join(":")}
                    </div>
                    <div>{`${slot.Capacity} slots`}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
    </React.Fragment>
  );
}
            
            
            )}
          </div>
        </div>
      </div>
    </div>
  );
}