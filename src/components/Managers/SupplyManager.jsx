import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import SupplyEditor from '../Forms/SupplyManager/SupplyEditor';
import ClerkEditor from '../Forms/SupplyManager/ClerkEditor';
// import OnlineProfile from '../Forms/OrganizationManager/OnlineProfile';


export default function SupplyManager(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [activeTab, setActiveTab] = useState(0);
  const isCreate = Api.Organization == null;
  useEffect(() => {
    dispatch(clearJunk())
  }, [activeTab]);

    if(Api.Token.Roles[0]!="Admin" && Api.Token.Roles[0]!="GeneralManager" && Api.Token.Roles[0]!="InventoryClerk") return;
  return (
    <>
        {activeTab==0?
         <div className="DirectionPage">
        <div className="Directions">
          {Api.Token.Roles[0]=="Admin" || Api.Token.Roles[0]=="GeneralManager"?
          <div className="DButton" onClick={() => setActiveTab(1)}>Supply Editor</div>
          :
          <div className="DButton" onClick={() => setActiveTab(2)}>Supply Editor - Clerk</div>
          }
        </div>
        </div>
        :null}
        {activeTab==1? <SupplyEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <ClerkEditor ChangeSelection={()=> setActiveTab(0)}/> :null}


        
    </>
  );

}


