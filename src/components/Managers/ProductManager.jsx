import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import ProductEditor from '../Forms/ProductManager/ProductEditor';
import OnlineProfile from '../Forms/ProductManager/OnlineProfile';
import ClerkEditor from '../Forms/ProductManager/ClerkEditor';

export default function ProductManager(props) { 
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
          <div className="DButton" onClick={() => setActiveTab(1)}>Product Editor</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Online profile</div>
          </>:
          <div className="DButton" onClick={() => setActiveTab(3)}>Product Editor - Clerk</div>
          }
        </div>
        </div>
        :null}
        {activeTab==1? <ProductEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <OnlineProfile ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==3? <ClerkEditor ChangeSelection={()=> setActiveTab(0)}/> :null}

        
    </>
  );

}


