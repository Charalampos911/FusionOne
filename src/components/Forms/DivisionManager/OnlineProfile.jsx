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
          TList={Api.DivisionImages} 
          EmptyStruct={{ url: "api/EmptyStructs/DivisionImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/DivisionImages/Query", storeIn: "DivisionImages"}}
          TCreate={{ url: "api/DivisionImages/Create", storeIn: "DivisionImages"}}
          TUpdate={{ url: "api/DivisionImages/Update", storeIn: "DivisionImages"}}
          TDelete={{ url: "api/DivisionImages/HardDelete", storeIn: "DivisionImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Division - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


