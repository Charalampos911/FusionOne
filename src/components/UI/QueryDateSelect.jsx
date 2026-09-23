import React, { useState,useEffect } from 'react';

const DatePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  
  useEffect(() => {
    console.log("selectedDate===",selectedDate)
    if(selectedDate!=null){
    console.log("selectedDate.toLocaleDateString===",selectedDate.toLocaleDateString())
    console.log("selectedDate.toISOString===",selectedDate.toISOString().split('T')[0])
    }

    if(selectedDate!=null)
    props.setValue(selectedDate)
  }, [selectedDate]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  
  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const handleYearChange = (e) => setViewDate(new Date(parseInt(e.target.value), viewDate.getMonth(), 1));

  const renderDays = () => {
    const days = [];
    // Buffer for start of month
    for (let i = 0; i < startOfMonth.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="day-cell empty"></div>);
    }
    // Actual days
    for (let d = 1; d <= endOfMonth.getDate(); d++) {
      const currentIterDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const isPast = currentIterDate < today;
      const isSelected = selectedDate?.toDateString() === currentIterDate.toDateString();

      days.push(
        <button
          key={d}
          disabled={isPast}
          className={`day-cell ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedDate(currentIterDate)}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="datepicker-container">
      <div className="datepicker-header">
        <button className="nav-arrow" onClick={handlePrevMonth}>&lt;</button>
        
        <div className="view-controls">
          <span className="month-label">{months[viewDate.getMonth()]}</span>
          <select className="year-select" value={viewDate.getFullYear()} onChange={handleYearChange}>
            {Array.from({ length: 10 }, (_, i) => today.getFullYear() + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button className="nav-arrow" onClick={handleNextMonth}>&gt;</button>
      </div>

      <div className="datepicker-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="weekday-label">{day}</div>
        ))}
        {renderDays()}
      </div>

      {selectedDate && (
        <div className="datepicker-footer">
          Selected: <strong>{selectedDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}</strong>
        </div>
      )}
    </div>
  );
};

export default DatePicker;