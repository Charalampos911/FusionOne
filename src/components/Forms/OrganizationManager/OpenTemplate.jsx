import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,ResetMsg,clearJunk } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";

import UniversalEditor  from "../UniversalEditor";
import Scheduler  from "../OrganizationManager/OpenTemplateScheduler/Scheduler";
export default function OpenTemplate(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  useEffect(() => {
    dispatch(ResetMsg())
  }, []);
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    dispatch(clearJunk())
  }, [activeTab]);
  return (
    <>
    {activeTab==0?
    <div id="OpenTemplate" className='MainCard'>
      <div className='subCategory'>
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div>
        <div className='subCategoryTitle'>Operation templates</div>
      </div>
        
         <div className="DirectionPage">
        <div className="Directions">
          <div className="DButton" onClick={() => setActiveTab(1)}>Operation template Editor</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Operation template days Editor</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>Operation template days Scheduler</div>
        </div>
        </div>
        

    </div>
    :null}
       
      {activeTab==1?
        <UniversalEditor 
        TList={Api.OpenTemplates} 
        EmptyStruct={{ url: "api/EmptyStructs/OpenTemplate", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/OpenTemplates/Query", storeIn: "OpenTemplates"}}
        TCreate={{ url: "api/OpenTemplates/Create", storeIn: "OpenTemplates"}}
        TUpdate={{ url: "api/OpenTemplates/Update", storeIn: "OpenTemplates"}}
        TDelete={{ url: "api/OpenTemplates/HardDelete", storeIn: "OpenTemplates"}}
        ChangeSelection={()=>setActiveTab(0)}
        Title={"Open templates"}
        />
      :null}
      {activeTab==2?
        <UniversalEditor 
        TList={Api.OpenTemplateDays} 
        EmptyStruct={{ url: "api/EmptyStructs/OpenTemplateDay", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/OpenTemplateDays/Query", storeIn: "OpenTemplateDays"}}
        TCreate={{ url: "api/OpenTemplateDays/Create", storeIn: "OpenTemplateDays"}}
        TUpdate={{ url: "api/OpenTemplateDays/Update", storeIn: "OpenTemplateDays"}}
        TDelete={{ url: "api/OpenTemplateDays/HardDelete", storeIn: "OpenTemplateDays"}}
        ChangeSelection={()=>setActiveTab(0)}
        Title={"Open template days "}
        />
      :null}
      {activeTab==3?

         <Scheduler ChangeSelection={()=>setActiveTab(0)}/>
      :null}
    </>
  );

}

