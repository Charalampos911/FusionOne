import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,ResetMsg,clearJunk} from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";

import UniversalEditor  from "../UniversalEditor";
import Scheduler  from "../OrganizationManager/ScheduleTemplateScheduler/Scheduler";
export default function ScheduleTemplate(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    dispatch(ResetMsg())
  }, []);
  useEffect(() => {
    dispatch(clearJunk())
  }, [activeTab]);

  return (
    <>
    {activeTab==0?
    <div id="ScheduleTemplates" className='MainCard'>
      <div className='subCategory'>
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div>
        <div className='subCategoryTitle'>Schedule templates</div>
      </div>
        
         <div className="DirectionPage">
        <div className="Directions">
          <div className="DButton" onClick={() => setActiveTab(1)}>Schedule template Editor</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Schedule days Editor</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>Schedule days Scheduler</div>
        </div>
        </div>
        

    </div>
    :null}
       
      {activeTab==1?
        <UniversalEditor 
        TList={Api.ScheduleTemplates} 
        EmptyStruct={{ url: "api/EmptyStructs/ScheduleTemplate", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/ScheduleTemplates/Query", storeIn: "ScheduleTemplates"}}
        TCreate={{ url: "api/ScheduleTemplates/Create", storeIn: "ScheduleTemplates"}}
        TUpdate={{ url: "api/ScheduleTemplates/Update", storeIn: "ScheduleTemplates"}}
        TDelete={{ url: "api/ScheduleTemplates/HardDelete", storeIn: "ScheduleTemplates"}}
        ChangeSelection={()=>setActiveTab(0)}
        Title={"Schedule templates"}
        />
      :null}
      {activeTab==2?
        <UniversalEditor 
        TList={Api.ScheduleTemplateDays} 
        EmptyStruct={{ url: "api/EmptyStructs/ScheduleTemplateDay", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/ScheduleTemplateDays/Query", storeIn: "ScheduleTemplateDays"}}
        TCreate={{ url: "api/ScheduleTemplateDays/Create", storeIn: "ScheduleTemplateDays"}}
        TUpdate={{ url: "api/ScheduleTemplateDays/Update", storeIn: "ScheduleTemplateDays"}}
        TDelete={{ url: "api/ScheduleTemplateDays/HardDelete", storeIn: "ScheduleTemplateDays"}}
        ChangeSelection={()=>setActiveTab(0)}
        Title={"Schedule template days "}
        />
      :null}
       {activeTab==3?
        <Scheduler ChangeSelection={()=>setActiveTab(0)}/>
      :null}
    </>
  );

}

