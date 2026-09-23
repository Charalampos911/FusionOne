import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';


import DivisionEditor from '../Forms/DivisionManager/DivisionEditor';
import OnlineProfile from '../Forms/DivisionManager/OnlineProfile';
import Overview from '../Forms/DivisionManager/Overview';
import DailyScheduler from '../Forms/DivisionManager/DailyScheduler/Scheduler';
export default function DivisionManager(props) { 
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
          <div className="DButton" onClick={() => setActiveTab(1)}>Operations Overview</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Division Editor</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>Online profile</div>
          <div className='DButton' onClick={() => setActiveTab(4)}>Daily scheduler</div>
        </div>
        </div>
        :null}
        {activeTab==1? <Overview ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <DivisionEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==3? <OnlineProfile ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==4? <DailyScheduler ChangeSelection={()=> setActiveTab(0)}/> :null}

        
    </>
  );

}


