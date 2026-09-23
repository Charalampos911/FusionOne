import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor  from "../UniversalEditor";
export default function InputServices(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  //Questionares
  return (
    <div id='InputServices'> 
       
      
        <UniversalEditor 
          TList={Api.InputServices} 
          EmptyStruct={{ url: "api/EmptyStructs/InputService", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/InputServices/Query", storeIn: "InputServices"}}
          TCreate={{ url: "api/InputServices/Create", storeIn: "InputServices"}}
          TUpdate={{ url: "api/InputServices/Update", storeIn: "InputServices"}}
          TDelete={{ url: "api/InputServices/SoftDelete", storeIn: "InputServices"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Questionaires"}
        />
   
      
    </div>
  );

}


