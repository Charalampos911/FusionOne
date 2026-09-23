import React, { useState, useEffect, useRef } from 'react';
import Clear from '../../assets/clear.png';
import Sorting from '../../assets/sorting.png';

export default function DynamicGallerySelect(props) {
  const [Value, setValue] = useState(props.ElValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
 const [IsSorting, setIsSorting] = useState(true);
  // Sync with parent value
  useEffect(() => {
    setValue(props.ElValue || "");
  }, [props.ElValue]);
const handleSortClick = () => {
  const newValue = !IsSorting;
  setIsSorting(newValue);
  props.Sorting(newValue);
};
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (imgUrl) => {
    setValue(imgUrl);
    props.setValue(imgUrl); // Returns the image string/path to parent
    setIsOpen(false);
  };

  return (
    <div id="dynamic-select" ref={dropdownRef}>
      <div className="dynamic-select">
        {Value ? <div className="floating-label">{props.placeholder}</div> : null}
        
        <div 
          className={`select-box ${props.IsRequired && Value ? 'required' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span className={`selected-value ${Value ? 'placeholder' : ''}`}>
            {Value ? (
              <img src={Value} alt="selected" style={{ height: '24px', width: 'auto' }} />
            ) : (
              `Select ${props.placeholder}...`
            )}
          </span>
          <div className="arrow">{isOpen ? '▲' : '▼'}</div>
        </div>

        <div className='Field-Actions'>
          <div className='clear ActionIcon' onClick={() => { setValue(""); props.setValue(""); }}>
            <img src={Clear} alt="clear"/>
          </div>
          <div className='sorting ActionIcon'onClick={handleSortClick}>
             <img src={Sorting}/>
          </div>
          
        </div>
      </div>

      {isOpen && (
        <div id="options-list">
          <ul className="options-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '10px', gap: '10px' }}>
            {props.IconList && props.IconList.map((icon, index) => (
              <li 
                key={index} 
                onClick={() => handleSelect(icon)}
                className={Value === icon ? 'selected' : ''}
                style={{ listStyle: 'none', cursor: 'pointer', border: Value === icon ? '2px solid #007bff' : '1px solid #ddd', padding: '5px', textAlign: 'center' }}
              >
                <img src={icon} alt={`icon-${index}`} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}