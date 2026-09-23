import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RangeDatePicker = ({ value, onChange, minDate, label }) => {
  // Convert string "YYYY-MM-DD" to JS Date for the picker
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;

  const handleChange = (date) => {
    if (!date) return;
    // Format back to "YYYY-MM-DD" using local time to avoid timezone shifts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
  };

  return (
    <div className="picker-wrapper">
      {label && <label style={{ display: 'block' }}>{label}</label>}
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        minDate={minDate}
        dateFormat="yyyy-MM-dd"
        className="date-input-style" // Add your CSS class here
      />
    </div>
  );
};

export default RangeDatePicker;