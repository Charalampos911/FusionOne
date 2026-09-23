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
          TList={Api.DepartmentImages} 
          EmptyStruct={{ url: "api/EmptyStructs/DepartmentImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/DepartmentImages/Query", storeIn: "DepartmentImages"}}
          TCreate={{ url: "api/DepartmentImages/Create", storeIn: "DepartmentImages"}}
          TUpdate={{ url: "api/DepartmentImages/Update", storeIn: "DepartmentImages"}}
          TDelete={{ url: "api/DepartmentImages/HardDelete", storeIn: "DepartmentImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Department - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


