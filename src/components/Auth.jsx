import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, clearState } from '../Redux/features/ApiReducer';
import AuthRegister from './Forms/AuthManager/AuthRegister';
import AuthLogin from './Forms/AuthManager/AuthLogin';
import NewLogo from '../assets/ThemesAndLogo/NewLogo.png';
export default function Auth(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [ActiveTab, setActiveTab] = useState(0);

  return (
    <div id='Gate-cont'>

      <img id="MainLogo" src={NewLogo} />
      <label>CMS PORTAL</label>
      <div className='Gate'>
      {ActiveTab==0?
        <AuthLogin RegisterFirst={()=> {setActiveTab(1),dispatch(clearState())}} />
      :null}
      {ActiveTab==1?
        <AuthRegister QuickLogin={()=> {setActiveTab(0),dispatch(clearState())}}/>
      :null}
      </div>
    </div>
  );

}


