import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function QuerySelect({
  optionsArray,
  setValue,
  isDynamic,
  placeholder,
  zIndex,
  preVal = null
}) {
  const [Val, setVal] = useState(preVal);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Sync internal state whenever preVal changes from parent
  useEffect(() => {
    setVal(preVal);
  }, [preVal]);

  // Reset search state when options change without clearing preVal
  useEffect(() => {
    setSearchTerm("");
    setIsOpen(false);
  }, [optionsArray]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to extract display text cleanly
  const getDisplayText = (item) => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    return item.Name || item.LastName || item.Id || (Array.isArray(item) ? item[0] : "") || "";
  };

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    const baseOptions = optionsArray || [];
    if (!searchTerm) return baseOptions;

    return baseOptions.filter((opt) => {
      const name = getDisplayText(opt).toString().toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  }, [optionsArray, searchTerm]);

  const handleSelect = (selectedItem) => {
    setVal(selectedItem);
    setIsOpen(false);
    setSearchTerm("");

    if (setValue) {
      setValue(selectedItem);
    }
  };

  const selectedDisplay = getDisplayText(Val || preVal);

  return (
    <div id="dynamic-select" ref={dropdownRef} className={`QuerySelect ${isDynamic ? 'isDynamic' : ''}`} style={{ zIndex: zIndex || 0 }}>
      <div className="dynamic-select">
        {(Val || preVal) ? <div className="floating-label">{placeholder}</div> : null}
        
        <div className="select-box" onClick={() => setIsOpen(!isOpen)}>
          <span className={`selected-Val ${!selectedDisplay ? 'placeholder-text' : ''}`}>
            {selectedDisplay || placeholder}
          </span>
          <div className="arrow">{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {isOpen && (
        <div id="options-list" className="dropdown-container FullPage">
          {/* Search Input Field */}
          <div className="search-wrapper" style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
            <label>{placeholder}</label>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <ul className="options-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <li 
              onClick={() => handleSelect(null)}
              className={Val == null ? 'selected clear' : 'clear'}
              style={{ fontStyle: 'italic', position: 'sticky', top: '0px' }}
            >
              Clear Selection
            </li>
            
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <li 
                  key={opt?.Id || index} 
                  onClick={() => handleSelect(opt)}
                  className={`${opt === Val ? 'selected' : ''}`}
                >
                  {getDisplayText(opt)}
                </li>
              ))
            ) : (
              <li style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}