import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { isMobile } from 'react-device-detect';
import { cycleTheme, setTheme ,setDevice} from './Redux/features/ThemeReducer';
import { Routes, Route, useSearchParams } from 'react-router-dom';

import WhiteBlue from './assets/ThemesAndLogo/white_blue_no_shadow.png';
import NeonBlue from './assets/ThemesAndLogo/neon_blue_no_shadow.png';
import WhiteGreen from './assets/ThemesAndLogo/white_green_no_shadow.png';
import NeonGreen from './assets/ThemesAndLogo/neon_green_no_shadow.png';

import PayOrderWithVivaPerma from './Routing/Perma/payOrderWithVivaPerma';
import CMS_Admin from './Routing/CMS_Admin';
import PayOrderWithCrypto from './Routing/payOrderWithCrypto';
import PayOrderWithCryptoPerma from './Routing/Perma/payOrderWithCryptoPerma';
import PayOrderWithViva from './Routing/payOrderWithViva';
import PayOrderWithVivaSuccess from './Routing/payOrderWithVivaSuccess';
import PayOrderWithVivaFailure from './Routing/payOrderWithVivaFailure';
import SuperUserAuth from './APP1-SuperUser/Components/Auth/Auth';

import HousingAuth from './APP2-Housing/Components/Auth/Auth';
import HousekeepingAuth from './APP3-Housekeeping/Components/Auth/Auth';
import SalesAuth from './APP4-Sales/Components/Auth/Auth';
import MobileorderingAuth from './APP5-Mobileordering/Components/Auth/Auth';
import OrderpreppingAuth from './APP6-Orderprepping/Components/Auth/Auth';
import InventorymanagingAuth from './APP7-Inventorymanaging/Components/Auth/Auth';
import TransportationAuth from './APP8-Transportation/Components/Auth/Auth';
import PrivateservicesAuth from './APP9-Privateservices/Components/Auth/Auth';
import QuickcheckoutAuth from './APP10-Quickcheckout/Components/Auth/Auth';

const VALID_THEMES = ['white-blue', 'white-green', 'neon-blue', 'neon-green'];

function App() {
  const theme = useSelector(state => state.Themes);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  
  // Track if theme is locked via URL parameter
  const [isThemeLocked, setIsThemeLocked] = useState(false);

  useEffect(() => {
    const urlTheme = searchParams.get('theme');

    if (urlTheme && VALID_THEMES.includes(urlTheme)) {
      // 1. Theme passed in URL takes top priority
      dispatch(setTheme(urlTheme));
      setIsThemeLocked(true);
    } else {
      // 2. Otherwise apply current Redux/localStorage theme to DOM
      document.documentElement.setAttribute('data-theme', theme.current);
    }
  }, [searchParams, dispatch]);
 useEffect(() => {
  dispatch(setDevice(isMobile))
}, []);

  const themeIconMap = {
    'white-green': WhiteGreen,
    'neon-green': NeonGreen,
    'white-blue': WhiteBlue,
    'neon-blue': NeonBlue
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<CMS_Admin />} />
        
        <Route path="/payOrderWithCrypto/:OrderId" element={<PayOrderWithCrypto />} />
        <Route path="/payOrderWithCryptoPerma/:PermaProductTransactionId" element={<PayOrderWithCryptoPerma />} />
        <Route path="/payOrderWithViva/:OrderId" element={<PayOrderWithViva />} />
        <Route path="/payOrderWithVivaPerma/:PermaProductTransactionId" element={<PayOrderWithVivaPerma />} />
        <Route path="/payment-success" element={<PayOrderWithVivaSuccess />} />
        <Route path="/payment-failed" element={<PayOrderWithVivaFailure />} />


        {/* PERSONEL APPS */}
        <Route path="/superuser" element={<SuperUserAuth />} />
        <Route path="/housing" element={<HousingAuth />} />
        <Route path="/housekeeping" element={<HousekeepingAuth />} />
        <Route path="/sales" element={<SalesAuth />} />
        <Route path="/mobileordering" element={<MobileorderingAuth />} />
        <Route path="/orderprepping" element={<OrderpreppingAuth />} />
        <Route path="/inventorymanaging" element={<InventorymanagingAuth />} />
        <Route path="/transportation" element={<TransportationAuth />} />
        <Route path="/Privateservices" element={<PrivateservicesAuth />} />
        <Route path="/quickcheckout" element={<QuickcheckoutAuth />} />
        



      </Routes>

      <button 
        className="theme-btn" 
        onClick={() => dispatch(cycleTheme())}
        disabled={isThemeLocked}
        title={isThemeLocked ? "Theme is locked via URL" : "Cycle Theme"}
        style={{ opacity: isThemeLocked ? 0.5 : 1, cursor: isThemeLocked ? 'not-allowed' : 'pointer' }}
      >
        <img 
          src={themeIconMap[theme.current] || WhiteBlue} 
          alt={`${theme.current} theme`} 
        />
      </button>
    </>
  );
}

export default App;