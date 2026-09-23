import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, clearState } from '../../../Redux/features/ApiReducer';
import { useParams } from 'react-router-dom';
import Login from './Login';
import NewLogo from '../../../assets/ThemesAndLogo/NewLogo.png';
import AppMain from '../AppMain';
import "../../css/AppMain.scss"




export default function Auth(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [ActiveTab, setActiveTab] = useState(0);
  const [organization, setOrganization] = useState(null);
  return (

    <>

      {Api.Token == null?


        <div id='Gate-cont'>

          <img id="MainLogo" src={NewLogo} />
          <label>HOUSING PORTAL</label>
          <div className='Gate'>
            
          {ActiveTab==0 && Api.Token == null?
            <Login/>
          :null}
          </div>
        </div>
      :
      <AppMain />
      }
    </>

  );

}
