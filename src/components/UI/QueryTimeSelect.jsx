import React, { useMemo,useState } from 'react';
import {formatLocalDate,toApiDate} from "../../utils/DatesTimesPhasm"
const TimeSelector = ({ targetDate, availability, onTimeSelect, close }) => {
  console.log("targetDate===",targetDate)
  console.log("availability===",availability)
  console.log("onTimeSelect===",onTimeSelect)


  const [userTime, setUserTime] = useState(null);
 const [Message, setMessage] = useState(null);
  const formattedTarget = toApiDate(new Date(targetDate));
    console.log("formattedTarget===",formattedTarget)
  console.log("availability.targetDate===",availability
      .flat()
      .find(day => day.Date === formattedTarget))
  return;
  // 1. Find the specific day in the nested collection
const dayData = useMemo(() => {
    // 1. Convert the long string/object into "2026-02-19"
    const formattedTarget = toApiDate(new Date(targetDate));

    // 2. Search the flattened collection
    return availability
      .flat()
      .find(day => day.Date === formattedTarget);
}, [targetDate, availability]);

  // 2. Generate 15-minute increments from the available slots
  const timeOptions = useMemo(() => {
    if (!dayData || !dayData.Slots) return [];

    const increments = [];
    dayData.Slots.forEach(slot => {
      let current = new Date(slot.Start);
      const end = new Date(slot.End);

      while (current <= end) {
        // Format to HH:mm
        const timeString = current.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        
        increments.push(timeString);
        
        // Add 15 minutes
        current.setMinutes(current.getMinutes() + 15);
      }
    });
    return [...new Set(increments)]; // Remove duplicates if slots overlap
  }, [dayData]);
  const HCustomTime =(time)=>{
    console.log("NewTime === ",time)
    if(timeOptions.length > 0 && timeOptions[0] <= time && timeOptions[timeOptions.length-1]>=time){
      console.log("111")
      setUserTime(time)
      setMessage(null)
    }
    if(timeOptions.length > 0 && timeOptions[0] > time){
     console.log("222")
      setUserTime(timeOptions[0])
      setMessage({Mood:false,msg:`Min time allowed is ${timeOptions[0]}`})
      // onTimeSelect(timeOptions[0])
    }
    if(timeOptions.length > 0 && timeOptions[timeOptions.length-1] < time){
      console.log("333")
      setUserTime(timeOptions[timeOptions.length-1])
      setMessage({Mood:false,msg:`Max time allowed is ${timeOptions[timeOptions.length-1]}`})
      // onTimeSelect(timeOptions[timeOptions.length-1])
    }

  }
  const HCustomCompleted =()=>{
    if(timeOptions.length>0 && timeOptions[0]<= userTime && timeOptions[timeOptions.length-1]>=userTime){
      onTimeSelect(userTime)
    }
  }
  return (
    <div className="time-selector-container">
      <h3>Select Time for {formattedTarget}</h3>
      <div onClick={()=>close()}>Close</div>
      {timeOptions.length > 0 ? (
        <div className="grid-options">
          {timeOptions.map(time => (
            <button 
              key={time} 
              className="time-btn"
              onClick={() => onTimeSelect(time)}
            >
              {time}
            </button>
          ))}
        </div>
      ) : (
        <p className="no-availability">No available slots for this date.</p>
      )}

      <div className="manual-input">
        <label>Or enter custom time:</label>
        <div>
        <input 
          type="time"
          value={userTime}
          onChange={(e) => HCustomTime(e.target.value)}
          step="60"
        />
        <div onClick={() => HCustomCompleted()}>OK</div>
        </div>
      </div>
      {Message?.msg && (
        <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
          {Message.msg}
        </span>
      )}

    </div>
  );
};

export default TimeSelector;