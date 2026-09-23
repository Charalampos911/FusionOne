import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import Details from '../Forms/OrganizationManager/Details';
import OnlineProfile from '../Forms/OrganizationManager/OnlineProfile';
import ServiceCategories from '../Forms/OrganizationManager/ServiceCategories';
import ProductCategories from '../Forms/OrganizationManager/ProductCategories';
import SupplyCategories from '../Forms/OrganizationManager/SupplyCategories';
import PermaProductCategories from '../Forms/OrganizationManager/PermaProductCategories';
import ScheduleTemplate from '../Forms/OrganizationManager/ScheduleTemplate';
import OpenTemplate from '../Forms/OrganizationManager/OpenTemplate';
import InputServices from '../Forms/OrganizationManager/InputServices';

export default function OrganizationManager(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [activeTab, setActiveTab] = useState(0);
  const isCreate = Api.Organization == null;
  useEffect(() => {
    dispatch(clearJunk())
  }, [activeTab]);

  if(Api.Token.Roles[0]!="Admin") return;
  return (
    <>
        {activeTab==0?
         <div className="DirectionPage">


          
        <div className="Directions">
          <div className="DButton" onClick={() => setActiveTab(1)}>Details</div>
          {!isCreate?
          <>
          <div className="DButton" onClick={() => setActiveTab(2)}>Online profile</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>Service Categories</div>
          <div className="DButton" onClick={() => setActiveTab(4)}>Product Categories</div>
          <div className="DButton" onClick={() => setActiveTab(5)}>Supply Categories</div>
          <div className="DButton" onClick={() => setActiveTab(6)}>Rental Categories</div>
          <div className="DButton" onClick={() => setActiveTab(7)}>Schedule templates</div>
          <div className="DButton" onClick={() => setActiveTab(8)}>Operation templates</div>
          <div className="DButton" onClick={() => setActiveTab(9)}>Questionnaires</div>
          </>:null}
          
        </div>
        </div>
        :null}
        {activeTab==1? <Details ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <OnlineProfile ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==3? <ServiceCategories ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==4? <ProductCategories ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==5? <SupplyCategories ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==6? <PermaProductCategories ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==7? <ScheduleTemplate ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==8? <OpenTemplate ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==9? <InputServices ChangeSelection={()=> setActiveTab(0)}/> :null}

        
    </>
  );

}


