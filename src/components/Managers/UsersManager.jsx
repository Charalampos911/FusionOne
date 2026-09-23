import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';

import CreateManager from '../Forms/UsersManager/CreateManager';
import ManagersMonitor from '../Forms/UsersManager/ManagersMonitor';


export default function UsersManager(props) { 
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
          <div className="DButton" onClick={() => setActiveTab(1)}>Create Manager</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Managers Monitor</div>
        </div>
        </div>
        :null}
        {activeTab==1? <CreateManager ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <ManagersMonitor ChangeSelection={()=> setActiveTab(0)}/> :null}


        
    </>
  );

}


