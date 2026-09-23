import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import InventoryEditor from '../Forms/InventoryManager/InventoryEditor';
// import OnlineProfile from '../Forms/OrganizationManager/OnlineProfile';


export default function InventoryManager(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [activeTab, setActiveTab] = useState(0);
  const isCreate = Api.Organization == null;
  useEffect(() => {
    dispatch(clearJunk())
  }, [activeTab]);

if(Api.Token.Roles[0]!="Admin" && Api.Token.Roles[0]!="GeneralManager") return;

  return (
    <>
        {activeTab==0?
         <div className="DirectionPage">
        <div className="Directions">
          <div className="DButton" onClick={() => setActiveTab(1)}>Inventory Editor</div>
          {/* <div className="DButton" onClick={() => setActiveTab(2)}>Online profile</div> */}
        </div>
        </div>
        :null}
        {activeTab==1? <InventoryEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {/* {activeTab==2? <OnlineProfile ChangeSelection={()=> setActiveTab(0)}/> :null} */}


        
    </>
  );

}


