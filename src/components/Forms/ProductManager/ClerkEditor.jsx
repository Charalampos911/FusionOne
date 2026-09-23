import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function ProductEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);

  return (
    <div id='ProductEditor'>
        <UniversalEditor 
        TList={Api.Products } 
        EmptyStruct={{ url: "api/EmptyStructs/Product", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Products/Query", storeIn: "Products"}}
        TCreate={{ url: "api/Products/Create", storeIn: "Products"}}
        TUpdate={{ url: "api/Products/Update", storeIn: "Products"}}
        TDelete={{ url: null, storeIn: "Products"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Products Editor - Clerk"}

        />
    </div>
  );

}
