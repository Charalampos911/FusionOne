import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, clearState } from '../../../Redux/features/ApiReducer';
import { useParams } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import NewLogo from '../../../assets/ThemesAndLogo/NewLogo.png';
import OrganizationSelect from './OrganizationSelect';

import EstablishmentSelect from '../Views/ScopeSelections/EstablishmentSelect';
import "../../css/OrganizationCarousel.scss"
import "../../css/Navbar.scss"
import "../../css/UserBadgeWidget.scss"
import "../../css/OnlineDateAndTimeWidget.scss"
import "../../css/OnlineSelect.scss"
import "../../css/OnlineDateSelect.scss"
import "../../css/FilterBar.scss"
import "../../css/ImageLightbox.scss"
import "../../css/GeneralsSU.scss"

import "../../css/UserAccountSU.scss"
import "../../css/UserBookingsSU.scss"
import "../../css/UserCardsSU.scss"
import "../../css/UserDocumentsSU.scss"
import "../../css/UserHomeSU.scss"
import "../../css/UserOrdersSU.scss"
import "../../css/UserRentalsSU.scss"
import "../../css/UserScannerSU.scss"
import "../../css/UserSchildrenSU.scss"
import "../../css/UserWalletSU.scss"



export default function Auth(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [ActiveTab, setActiveTab] = useState(0);
  const [organization, setOrganization] = useState(null);
  const { OrgOC } = useParams();
  const [onlineStatus, setOnlineStatus] = useState(null);



  useEffect(() => {
    if(organization!=null)
    dispatch(
      apiRequest({
        name: "Auth.jsx | CheckOrganizationImagesAsync",
        url: "api/EstablishmentsSU/CheckOrganizationImagesAsync",
        method: "POST",
        body: {
          OnlineCode: organization
        },
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap() 
    .then((Response) => {
      console.log("onlineStatus==>",Response)
      setOnlineStatus(Response.data)
    })
  

}, [organization]);



  return (

    <>
    {Api.Token==null?
    <>
      {OrgOC!=null || organization!=null?


        <div id='Gate-cont'>

          <img id="MainLogo" src={NewLogo} />
          <label>Fusion one</label>
          <div className='Gate'>
            
          {ActiveTab==0 && Api.Token == null?
            <Login RegisterFirst={()=> {setActiveTab(1),dispatch(clearState())}} organization={OrgOC?OrgOC:organization} />
          :null}
          {ActiveTab==1?
            <Register QuickLogin={()=> {setActiveTab(0),dispatch(clearState())}} organization={OrgOC?OrgOC:organization} />
          :null}
          </div>
        </div>

      :<OrganizationSelect organization={organization} setOrganization ={(val)=>setOrganization(val)} />}
    </>
  :
  <EstablishmentSelect onlineStatus={onlineStatus}/>
  }
  </>
  );

}
