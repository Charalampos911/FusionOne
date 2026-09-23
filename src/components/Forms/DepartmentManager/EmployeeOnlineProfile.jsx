import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor  from "../UniversalEditor";

export default function OnlineProfile(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);

  return (
    <div id='OnlineProfile'>
       
      
        <UniversalEditor 
          TList={Api.EmployeeImages} 
          EmptyStruct={{ url: "api/EmptyStructs/EmployeeImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/EmployeeImages/Query", storeIn: "EmployeeImages"}}
          TCreate={{ url: "api/EmployeeImages/Create", storeIn: "EmployeeImages"}}
          TUpdate={{ url: "api/EmployeeImages/Update", storeIn: "EmployeeImages"}}
          TDelete={{ url: "api/EmployeeImages/HardDelete", storeIn: "EmployeeImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Employee - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


