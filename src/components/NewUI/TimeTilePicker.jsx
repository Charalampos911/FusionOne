import React, { useState, useEffect , useRef } from 'react';

import { MdOutlineClear } from "react-icons/md";
import { RiSortAlphabetAsc } from "react-icons/ri";

    // <TimeTilePicker 
    // title={title}
    // ElValue={value} 
    // ReturnVal={(val) => handleInputChange(key, val)}

    // IsDynamic={true}
    // Clear={Clear}
    // Sorting={(val) => (HQuery("443",{ [`F${key}`]: val }))}
    
    // 
    // //optional
    // dateStart={dateStart} // Limits
    // dateEnd={dateEnd} // Limits
    // onTimeSelect={onTimeSelect} // preselected time
    // 
    // />


const TimeTilePicker = ({ title, ElValue, Clear, ReturnVal,Sorting, dateStart, dateEnd, onTimeSelect, IsDynamic }) => {
  const [selectedHour, setSelectedHour] = useState('12'); 
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [ShowCont, setShowCont] = useState(false);
  const [ShowHours, setShowHours] = useState(true);
  const [ShowMinutes, setShowMinutes] = useState(false);
   const [IsSorting, setIsSorting] = useState(true);
   const dropdownRef = useRef(null);
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
    console.log("TimeTilePicker.ElValue===",ElValue)
 console.log("TimeTilePicker.title===",title)
  console.log("TimeTilePicker.ElValue===",ElValue)
   console.log("TimeTilePicker.ElValue===",ElValue)

  // Helper to check if a specific hour/minute combo is valid
  const isTimeDisabled = (h, m) => {
    if (!dateStart || !dateEnd) return false;

    // Create temporary dates to compare against the range
    const checkTime = new Date(dateStart);
    checkTime.setHours(parseInt(h), parseInt(m), 0, 0);

    return checkTime < dateStart || checkTime > dateEnd;
  };

  // Helper to check if an entire hour row should be disabled (optional UX boost)
  const isHourDisabled = (h) => {
    if (!dateStart || !dateEnd) return false;
    const hInt = parseInt(h);
    return hInt < dateStart.getHours() || hInt > dateEnd.getHours();
  };

const handleSelect = (h, m) => {
  // 1. Sanitize string inputs into clean 10-base numbers
  const parsedH = parseInt(h, 10);
  const parsedM = parseInt(m, 10);

  // 2. Validate range (Hours: 0-23, Minutes: 0-59)
  if (isNaN(parsedH) || isNaN(parsedM)) return;
  if (parsedH < 0 || parsedH > 23) return;
  if (parsedM < 0 || parsedM > 59) return;

  // 3. Check if time slot is disabled
  if (isTimeDisabled(parsedH, parsedM)) return;

  // 4. Update component local state
  setSelectedHour(parsedH);
  setSelectedMinute(parsedM);

  // 5. Build selected Date object using input parameters
  const date = new Date(dateStart || new Date());
  date.setHours(parsedH, parsedM, 0, 0);

  // 6. Format as TimeOnly string ("HH:mm:ss")
  const pad = (num) => String(num).padStart(2, '0');
  const timeOnlyString = `${pad(parsedH)}:${pad(parsedM)}:00`;

  if (onTimeSelect) {
    onTimeSelect(date);
  }

  console.clear();
  console.log("parsedH=", parsedH);
  console.log("parsedM=", parsedM);
  console.log("TimeOnly string=", timeOnlyString);

  if (typeof ReturnVal === 'function') {
    ReturnVal(timeOnlyString); // Sends "HH:mm:ss" directly to C# TimeOnly endpoint
  }

  setShowCont(false);
};

  const HShowHours =()=>{
    setShowHours(true)
    setShowMinutes(false)
  }
  const HShowMinutes =()=>{
    setShowHours(false)
    setShowMinutes(true)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCont(false)
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortClick = () => {
    setIsSorting(!IsSorting);
    Sorting(!IsSorting);
  };
  const HClear = () => {
    setShowCont(false);
    setSelectedHour('00');
     setSelectedMinute('00');
  };
  return (
    <div id="TimeTilePicker"  ref={dropdownRef}>
      <div className={`head ${IsDynamic? "IsDynamic":""}`}>
        <div className="title">{title}</div>
        <span className="time">
            <input type="number" value={selectedHour} onChange={(e)=>handleSelect(e.target.value, selectedMinute)} onFocus={()=>setShowCont(true)}/> 
            <input type="number" value={selectedMinute} onChange={(e)=>handleSelect(selectedHour, e.target.value)} onFocus={()=>setShowCont(true)}/> 
        </span>
        {Clear>=0?
        <div className='Field-Actions'>
            <div onClick={()=>HClear()}><MdOutlineClear /></div>
            <div  onClick={handleSortClick}><RiSortAlphabetAsc /></div>
        </div>
        :null}
      </div>
    
      <div className={`tile-cont ${ShowCont? 'show' : 'hide'}`}>
        {/* Hours Section */}
        <nav>
            <span className={ShowHours?'selected':null} onClick={()=>HShowHours()}>Hours</span>
            <span className={ShowHours?null:'selected'}onClick={()=>HShowMinutes()}>Minutes</span>
        </nav>
        <div>
            <div className={ShowHours?'show':'hide'}>
            
            <div>
                {hours.map((h) => {
                const disabled = isHourDisabled(h);
                return (
                    <button
                    key={h}
                    disabled={disabled}
                    onClick={() => handleSelect(h, selectedMinute)}
                    className={`hour ${
                        selectedHour.toString().padStart(2, '0') === h.toString().padStart(2, '0') 
                        ? 'selected' 
                        : disabled 
                            ? 'disabled' 
                            : 'allowed'
                    }`}
                    >
                    {h}
                    </button>
                );
                })}
            </div>
            </div>

            {/* Minutes Section */}
            <div className={ShowMinutes?'show':'hide'}>
            
            <div>
                {minutes.map((m) => {
                const disabled = isTimeDisabled(selectedHour, m);
                return (
                    <button
                    key={m}
                    disabled={disabled}
                    onClick={() => handleSelect(selectedHour, m)}
                    className={`minute ${
                        selectedMinute.toString().padStart(2, '0') === m.toString().padStart(2, '0') 
                        ? 'selected' 
                        : disabled 
                            ? 'disabled' 
                            : 'allowed'
                    }`}
                    >
                    {m}
                    </button>
                );
                })}
            </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TimeTilePicker;