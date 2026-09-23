import React, { useState,useRef,useEffect, } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor  from "../UniversalEditor";
export default function PermaProductCategories(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);

  return (
    <div id='PermaProductCategories'>
       
      
        <UniversalEditor 
        TList={Api.PermaProductCategories} 
        EmptyStruct={{ url: "api/EmptyStructs/PermaProductCategory", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/PermaProductCategories/Query", storeIn: "PermaProductCategories"}}
        TCreate={{ url: "api/PermaProductCategories/Create", storeIn: "PermaProductCategories"}}
        TUpdate={{ url: "api/PermaProductCategories/Update", storeIn: "PermaProductCategories"}}
        TDelete={{ url: "api/PermaProductCategories/SoftDelete", storeIn: "PermaProductCategories"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Rental Categories"}
        />
   
      
    </div>
  );

}


