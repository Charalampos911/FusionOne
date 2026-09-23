import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function EmployeesEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);

  return (
    <div id='EmployeesEditor'>
        <UniversalEditor 
        TList={Api.Employees  } 
        EmptyStruct={{ url: "api/EmptyStructs/Employee", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Employees/Query", storeIn: "Employees"}}
        TCreate={{ url: "api/Employees/Create", storeIn: "Employees"}}
        TUpdate={{ url: "api/Employees/Update", storeIn: "Employees"}}
        TDelete={{ url: "api/Employees/SoftDelete", storeIn: "Employees"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Employees Editor"}
        />
   
    </div>
  );

}
