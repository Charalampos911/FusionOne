import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import EstablishmentEditor from '../Forms/EstablishmentManager/EstablishmentEditor';
import OnlineProfile from '../Forms/EstablishmentManager/OnlineProfile';
import Overview from '../Forms/EstablishmentManager/Overview';

export default function EstablishmentManager(props) { 
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
          <div className="DButton" onClick={() => setActiveTab(1)}>Overview</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Establishment Editor</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>Online profile</div>
        </div>
        </div>
        :null}
        {activeTab==1? <Overview ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <EstablishmentEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==3? <OnlineProfile ChangeSelection={()=> setActiveTab(0)}/> :null}


        
    </>
  );

}


