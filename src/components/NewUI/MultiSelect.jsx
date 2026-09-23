import React, { useState, useEffect, useRef, useMemo } from 'react';

export default function MultiSelect({ CrossMatchArray, optionsArray, placeholder, setValue, zIndex }) {
  const [selectedValues, setSelectedValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  
  // This ref tracks if we have already performed the initial sync from the DB
  const hasInitialized = useRef(false);

  /**
   * 1. Effect: Initial Sync from Database
   * Only runs once when optionsArray and CrossMatchArray are available.
   */
  useEffect(() => {
    // If we haven't initialized yet and we have options to match against
    if (!hasInitialized.current && optionsArray?.length > 0) {
      if (CrossMatchArray && CrossMatchArray.length > 0) {
        const initialMatches = optionsArray.filter(opt => 
          CrossMatchArray.includes(opt.Id)
        );
        setSelectedValues(initialMatches);
      }
      // Mark as initialized so user clicks aren't overwritten by this effect later
      hasInitialized.current = true;
    }
  }, [CrossMatchArray, optionsArray]);

  /**
   * 2. Effect: Reset search/dropdown UI when options change
   */
  useEffect(() => {
    setSearchTerm("");
    setIsOpen(false);
  }, [optionsArray]);

  /**
   * 3. Effect: Handle outside clicks
   */
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

  const filteredOptions = useMemo(() => {
    const baseOptions = optionsArray || [];
    if (!searchTerm) return baseOptions;
    const lowerSearch = searchTerm.toLowerCase();
    return baseOptions.filter((opt) => {
      const name = (opt.Name || opt.LastName || opt.Id || opt[0] || "").toString().toLowerCase();
      return name.includes(lowerSearch);
    });
  }, [optionsArray, searchTerm]);

  const handleSelect = (opt) => {
    let updatedSelection;

    if (opt === null) {
      updatedSelection = [];
    } else {
      const isAlreadySelected = selectedValues.some(item => item.Id === opt.Id);
      if (isAlreadySelected) {
        updatedSelection = selectedValues.filter(item => item.Id !== opt.Id);
      } else {
        updatedSelection = [...selectedValues, opt];
      }
    }

    setSelectedValues(updatedSelection);
    
    // Always pass the IDs back to the parent
    const idArray = updatedSelection.map(item => item.Id);
    setValue(idArray);
  };

  const displayLabel = selectedValues.length > 0 
    ? selectedValues.map(v => v.Name || v.LastName || v.Id).join(", ")
    : placeholder;

  return (
    <div id="dynamic-select" ref={dropdownRef} className={`QuerySelect isDynamic`} style={{ zIndex: zIndex || 0 }}>
      <div className="dynamic-select">
        {selectedValues.length > 0 && <div className="floating-label">{placeholder}</div>}
        
        <div className="select-box" onClick={() => setIsOpen(!isOpen)}>
          <span className={`selected-value ${selectedValues.length === 0 ? 'placeholder-text' : ''}`}>
            {displayLabel}
          </span>
          <div className="arrow">{isOpen ? '▲' : '▼'}</div>
        </div>
      </div>

      {isOpen && (
        <div id="options-list" className="dropdown-container FullPage">
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

          <ul className="options-list" style={{ maxHeight: '200px', overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0 }}>
            <li 
              onClick={() => handleSelect(null)}
              className='clear'
              style={{fontStyle: 'italic',position: 'sticky', top: '0px' }}
            >
              Clear Selection
            </li>
            
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isSelected = selectedValues.some(item => item.Id === opt.Id);
                return (
                  <li 
                    key={opt.Id || index} 
                    onClick={() => handleSelect(opt)}
                    className={`${isSelected ? 'selected' : ''}`}
                    style={{ 
                      display: 'flex', justifyContent: 'space-between', padding: '10px', cursor: 'pointer',
                      backgroundColor: isSelected ? '#f0f7ff' : 'transparent'
                    }}
                  >
                    <span>{opt.Name || opt.LastName || opt.Id || opt[0] || ""}</span>
                    {isSelected && <span style={{ color: '#007bff' }}>✓</span>}
                  </li>
                );
              })
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