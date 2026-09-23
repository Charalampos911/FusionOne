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
    <div id='PermaProductEditor'>
        <UniversalEditor 
        TList={Api.PermaProducts } 
        EmptyStruct={{ url: "api/EmptyStructs/PermaProduct", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/PermaProducts/Query", storeIn: "PermaProducts"}}
        TCreate={{ url: null, storeIn: "PermaProducts"}}
        TUpdate={{ url: null, storeIn: "PermaProducts"}}
        TDelete={{ url: null, storeIn: "PermaProducts"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Rentals Editor"}
        />
    </div>
  );

}
