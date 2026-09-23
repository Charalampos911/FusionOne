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
          TList={Api.EstablishmentImages} 
          EmptyStruct={{ url: "api/EmptyStructs/EstablishmentImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/EstablishmentImages/Query", storeIn: "EstablishmentImages"}}
          TCreate={{ url: "api/EstablishmentImages/Create", storeIn: "EstablishmentImages"}}
          TUpdate={{ url: "api/EstablishmentImages/Update", storeIn: "EstablishmentImages"}}
          TDelete={{ url: "api/EstablishmentImages/HardDelete", storeIn: "EstablishmentImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Establishment - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


