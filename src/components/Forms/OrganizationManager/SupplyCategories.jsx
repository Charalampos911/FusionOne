import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor  from "../UniversalEditor";
export default function SupplyCategories(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);

  return (
    <div id='SupplyCategories'>
       
      
        <UniversalEditor 
          TList={Api.SupplyCategories} 
          EmptyStruct={{ url: "api/EmptyStructs/SupplyCategory", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/SupplyCategories/Query", storeIn: "SupplyCategories"}}
          TCreate={{ url: "api/SupplyCategories/Create", storeIn: "SupplyCategories"}}
          TUpdate={{ url: "api/SupplyCategories/Update", storeIn: "SupplyCategories"}}
          TDelete={{ url: "api/SupplyCategories/SoftDelete", storeIn: "SupplyCategories"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Supply categories"}
        />
   
      
    </div>
  );

}


