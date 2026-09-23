import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import SectorEditor from '../Forms/SectorManager/SectorEditor';
import SectorManagement from '../Forms/SectorManager/SectorManagement';


export default function SectorManager(props) { 
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
          <div className="DButton" onClick={() => setActiveTab(1)}>Sector Editor</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Sector Management</div>
        </div>
        </div>
        :null}
        {activeTab==1? <SectorEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <SectorManagement ChangeSelection={()=> setActiveTab(0)}/> :null}


        
    </>
  );

}


