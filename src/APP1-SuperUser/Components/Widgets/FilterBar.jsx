import React, { useState, useEffect, useRef } from 'react';


export const FilterBar = ({ onSearch,categories, onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState({
        Id: null,
        Name: "All",
        Description: "",
        Classification: ""
    });
  const [searchTerm, setSearchTerm] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoriesWithAll, setCategoriesWithAll] = useState([
        {
            Id: null,
            Name: "All",
            Description: "",
            Classification: ""
        },
        ...categories
    ]);

  const dropdownRef = useRef(null);

  // Track screen width <= 950px
  useEffect(() => {
    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth <= 950);
    };

    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  // Close custom dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Condition: Dropdown if > 4 items OR screen width <= 950px
  const useDropdown = categoriesWithAll.length > 4 || isSmallScreen;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    if (onCategoryChange) onCategoryChange(category.Id);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="filter-bar-container">
      {/* Category Selection */}
      <div className="category-section">
        {useDropdown ? (
          /* Custom Custom Select Component */
          <div className="custom-select-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`custom-select-trigger ${isDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedCategory.Name}</span>
              <svg
                className="chevron-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="custom-options-menu">
                {categoriesWithAll.map((cat) => (
                  <li
                    key={cat.Id}
                    className={`custom-option ${selectedCategory === cat ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat.Name}
                    {selectedCategory === cat && (
                      <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          /* Horizontal Chips */
          <div className="category-picker">
            {categoriesWithAll.map((cat) => (
              <button
                key={cat.Id}
                type="button"
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat.Name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Slim Search Input */}
      <div className="search-box">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search divisions..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => handleSearchChange({ target: { value: '' } })}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};