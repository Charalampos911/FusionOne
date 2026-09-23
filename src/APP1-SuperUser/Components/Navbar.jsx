import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setCurrentViewSU,NavBarInteracted  } from '../../Redux/features/ApiReducer';
import  UserBadgeWidget  from '../Components/UserBadge/UserBadgeWidget';

export const Navbar = ({onlineStatus}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const toggleMobileMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const handleNavClick = (tabKey) => {
    // setView(tabKey)
    dispatch(NavBarInteracted());
    dispatch(setCurrentViewSU(tabKey));
    // setInteraction(interaction+1);
    setIsMobileOpen(false); // Close mobile drawer when selecting an item
  };

  var EstabScope = !(Api.CurrentViewSU >= 1);
  var DeptScope = !(Api.CurrentViewSU >= 2);


  return (
    <header className="fusion-navbar">
      <div className="navbar-container">
        {/* Top-Left Hamburger Icon for Mobile */}
        <button
          className={`hamburger-btn ${isMobileOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Brand Logo */}
        <div className="navbar-brand">
          <span className="brand-accent">Fusion</span>One
        </div>

        {/* Mobile Backdrop Overlay */}
        {isMobileOpen && (
          <div className="navbar-backdrop" onClick={() => setIsMobileOpen(false)} />
        )}

        {/* Navigation Links (Desktop bar / Mobile drawer) */}
        <nav className={`navbar-menu ${isMobileOpen ? "mobile-open" : ""}`}>
          {/* <div className="mobile-drawer-header">
            <span className="drawer-title">Navigation</span>
          </div> */}

          <button
            className={`nav-link ${Api.CurrentViewSU === 0 ? "active" : ""}`}
            onClick={() => handleNavClick(0)}
          >
            Establishments
          </button>
          
          <button
            className={`nav-link ${Api.CurrentViewSU === 1 ? "active" : ""} ${EstabScope?"scopedOut":""}`}
            onClick={() => handleNavClick(1)}
          >
            Departments
          </button>



          {Api.CurrentViewSU<10 && onlineStatus?.Departments?.find(e => e.DepartmentId === Api.DepartmentSU?.Id)?.HasDivisionImages?
          <button
            className={`nav-link ${Api.CurrentViewSU === 3 ? "active" : ""}  ${DeptScope?"scopedOut":""}`}
            onClick={() => handleNavClick(3)}
          >
            Divisions
          </button>
          :null}

          {Api.CurrentViewSU<10 && onlineStatus?.Departments?.find(e => e.DepartmentId === Api.DepartmentSU?.Id)?.HasServiceImages?
          <button
            className={`nav-link ${Api.CurrentViewSU === 4 ? "active" : ""}  ${DeptScope?"scopedOut":""}`}
            onClick={() => handleNavClick(4)}
          >
            services
          </button>
          :null}
          {Api.CurrentViewSU<10 && onlineStatus?.Departments?.find(e => e.DepartmentId === Api.DepartmentSU?.Id)?.HasProductImages?
         <button
            className={`nav-link ${Api.CurrentViewSU === 5 ? "active" : ""}  ${DeptScope?"scopedOut":""}`}
            onClick={() => handleNavClick(5)}
          >
            products
          </button>
          :null}

        {Api.CurrentViewSU<10 && onlineStatus?.Departments?.find(e => e.DepartmentId === Api.DepartmentSU?.Id)?.HasEmployeeImages?
         <button
            className={`nav-link ${Api.CurrentViewSU === 6 ? "active" : ""}  ${DeptScope?"scopedOut":""}`}
            onClick={() => handleNavClick(6)}
          >
            employees
          </button>
          :null}

          {Api.CurrentViewSU<10 && onlineStatus?.Departments?.find(e => e.DepartmentId === Api.DepartmentSU?.Id)?.HasPermaProductImages?
         <button
            className={`nav-link ${Api.CurrentViewSU === 7 ? "active" : ""}  ${DeptScope?"scopedOut":""}`}
            onClick={() => handleNavClick(7)}
          >
            rentals
          </button>
          :null}
            <UserBadgeWidget onClick={() => handleNavClick(8)} />

        </nav>
      </div>
    </header>
  );
};