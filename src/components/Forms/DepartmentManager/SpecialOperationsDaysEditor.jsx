import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function SpecialOperationsDaysEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  return (
    <div id='SpecialOperationsDaysEditor'>
        <UniversalEditor 
        TList={Api.SpecialOperationsDays  } 
        EmptyStruct={{ url: "api/EmptyStructs/SpecialOperationsDay", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/SpecialOperationsDays/Query", storeIn: "SpecialOperationsDays"}}
        TCreate={{ url: "api/SpecialOperationsDays/Create", storeIn: "SpecialOperationsDays"}}
        TUpdate={{ url: "api/SpecialOperationsDays/Update", storeIn: "SpecialOperationsDays"}}
        TDelete={{ url: "api/SpecialOperationsDays/SoftDelete", storeIn: "SpecialOperationsDays"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Special Operations days Editor"}
        />
   
    </div>
  );

}
