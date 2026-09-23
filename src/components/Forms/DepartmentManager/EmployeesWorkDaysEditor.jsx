import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function EmployeesWorkDaysEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  return (
    <div id='EmployeesWorkDaysEditor'>
        <UniversalEditor 
        TList={Api.EmployeeWorkDays  } 
        EmptyStruct={{ url: "api/EmptyStructs/EmployeeWorkDay", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/EmployeeWorkDays/Query", storeIn: "EmployeeWorkDays"}}
        TCreate={{ url: "api/EmployeeWorkDays/Create", storeIn: "EmployeeWorkDays"}}
        TUpdate={{ url: "api/EmployeeWorkDays/Update", storeIn: "EmployeeWorkDays"}}
        TDelete={{ url: "api/EmployeeWorkDays/SoftDelete", storeIn: "EmployeeWorkDays"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Employee work days Editor"}
        />
   
    </div>
  );

}
