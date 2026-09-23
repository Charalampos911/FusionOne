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
          TList={Api.OrganizationImages} 
          EmptyStruct={{ url: "api/EmptyStructs/OrganizationImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/OrganizationImages/Query", storeIn: "OrganizationImages"}}
          TCreate={{ url: "api/OrganizationImages/Create", storeIn: "OrganizationImages"}}
          TUpdate={{ url: "api/OrganizationImages/Update", storeIn: "OrganizationImages"}}
          TDelete={{ url: "api/OrganizationImages/HardDelete", storeIn: "OrganizationImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Organization - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


