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
          TList={Api.PermaProductImages} 
          EmptyStruct={{ url: "api/EmptyStructs/PermaProductImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/PermaProductImages/Query", storeIn: "PermaProductImages"}}
          TCreate={{ url: "api/PermaProductImages/Create", storeIn: "PermaProductImages"}}
          TUpdate={{ url: "api/PermaProductImages/Update", storeIn: "PermaProductImages"}}
          TDelete={{ url: "api/PermaProductImages/HardDelete", storeIn: "PermaProductImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Rentals - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


