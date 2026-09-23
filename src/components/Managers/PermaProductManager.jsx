import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import PermaProductEditor from '../Forms/PermaProductManager/PermaProductEditor';
import PermaProductEditorClerk from '../Forms/PermaProductManager/PermaProductEditorClerk';


import OnlineProfile from '../Forms/PermaProductManager/OnlineProfile';
import RentalsByCustomer from '../Forms/PermaProductManager/RentalsByCustomer';

export default function PermaProductManager(props) { 
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
          <>
          <div className="DButton" onClick={() => setActiveTab(1)}>Rentals Editor</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Online profile</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>Rentals Editor - Clerk</div>
          <div className="DButton" onClick={() => setActiveTab(4)}>Rentals by Customer</div>
          </>:
          <div className="DButton" onClick={() => setActiveTab(3)}>Rentals Editor - Clerk</div>
          }
        </div>
        </div>
        :null}
        {activeTab==1? <PermaProductEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <OnlineProfile ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==3? <PermaProductEditorClerk ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==4? <RentalsByCustomer ChangeSelection={()=> setActiveTab(0)}/> :null}
        
    </>
  );

}


