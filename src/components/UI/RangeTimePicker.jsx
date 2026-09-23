import React from "react";
import DatePicker from "react-datepicker";

const RangeTimePicker = ({ value, onChange, minTime, label, dateContext }) => {
  // We need a dummy date to make the time picker work, we use dateContext or today
  const dummyDate = dateContext || "2026-01-01";
  const selectedTime = value ? new Date(`${dummyDate}T${value}`) : null;

  const handleChange = (time) => {
    if (!time) return;
    // Format back to "HH:mm:ss"
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    onChange(`${hours}:${minutes}:${seconds}`);
  };

  return (
    <div className="picker-wrapper">
      {label && <label style={{ display: 'block' }}>{label}</label>}
      <DatePicker
        selected={selectedTime}
        onChange={handleChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="HH:mm:ss"
        minTime={minTime}
        maxTime={new Date(new Date().setHours(23, 59, 59))}
      />
    </div>
  );
};

export default RangeTimePicker;