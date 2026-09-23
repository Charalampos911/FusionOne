import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import UniversalEditor  from "../UniversalEditor";
export default function ServiceCategories(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [ActiveTab, setActiveTab] = useState(0);

  return (
    <div id='ServiceCategories'>
       
      
        <UniversalEditor 
          TList={Api.ServiceCategories} 
          EmptyStruct={{ url: "api/EmptyStructs/ServiceCategory", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/ServiceCategories/Query", storeIn: "ServiceCategories"}}
          TCreate={{ url: "api/ServiceCategories/Create", storeIn: "ServiceCategories"}}
          TUpdate={{ url: "api/ServiceCategories/Update", storeIn: "ServiceCategories"}}
          TDelete={{ url: "api/ServiceCategories/SoftDelete", storeIn: "ServiceCategories"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Service categories"}
        />
   
      
    </div>
  );

}


