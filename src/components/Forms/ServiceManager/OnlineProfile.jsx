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
          TList={Api.ServiceImages} 
          EmptyStruct={{ url: "api/EmptyStructs/ServiceImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/ServiceImages/Query", storeIn: "ServiceImages"}}
          TCreate={{ url: "api/ServiceImages/Create", storeIn: "ServiceImages"}}
          TUpdate={{ url: "api/ServiceImages/Update", storeIn: "ServiceImages"}}
          TDelete={{ url: "api/ServiceImages/HardDelete", storeIn: "ServiceImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Services - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


