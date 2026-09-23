import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiRequest, setCurrentViewSU } from '../../../Redux/features/ApiReducer';
import { MdAccountCircle } from "react-icons/md";

const MENU_OPTIONS = [
  ['Account', 10],
  ['Orders', 15],
  ['Rentals', 20],
  ['Bookings', 25],
  ['Scanner', 30],
  ['Wallet', 35],
  ['Cards', 40],
  ['Children', 45],
  ['Documents', 50],
];

const UserBadgeWidget = ({ badges = [23, 7, 99, 12] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  // Close dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectOption = (tabKey) => {
    dispatch(setCurrentViewSU(tabKey));
    setIsOpen(false);
  };

  return (
    <div className="user-badge-wrapper" ref={containerRef}>
      {/* Avatar Click Target */}
      <div className="avatar-container" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
        <div className="avatar">
          <MdAccountCircle />
        </div>

        {badges.slice(0, 4).map((value, idx) => (
          <div key={idx} className={`dot blue pos-${idx + 1}`}>
            {value}
          </div>
        ))}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="dropdown-menu">
          {MENU_OPTIONS.map(([label, tabKey]) => (
            <li key={tabKey} onClick={() => handleSelectOption(tabKey)}>
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBadgeWidget;