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
          TList={Api.ProductImages} 
          EmptyStruct={{ url: "api/EmptyStructs/ProductImage", storeIn: "EmptyStruct"}}
          TQuery={{ url: "api/ProductImages/Query", storeIn: "ProductImages"}}
          TCreate={{ url: "api/ProductImages/Create", storeIn: "ProductImages"}}
          TUpdate={{ url: "api/ProductImages/Update", storeIn: "ProductImages"}}
          TDelete={{ url: "api/ProductImages/HardDelete", storeIn: "ProductImages"}}
          ChangeSelection={()=>props.ChangeSelection()}
          Title={"Rentals - Online profile"}
          HasMedia={true}
        />
   
      
    </div>
  );

}


