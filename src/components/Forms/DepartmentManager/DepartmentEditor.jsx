import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function DepartmentEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);

  return (
    <div id='DepartmentEditor'>
        <UniversalEditor 
        TList={Api.Departments  } 
        EmptyStruct={{ url: "api/EmptyStructs/Department", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Departments/Query", storeIn: "Departments"}}
        TCreate={{ url: "api/Departments/Create", storeIn: "Departments"}}
        TUpdate={{ url: "api/Departments/Update", storeIn: "Departments"}}
        TDelete={{ url: null, storeIn: null}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Department Editor"}
        />
   
    </div>
  );

}
