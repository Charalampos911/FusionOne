import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';

export default function EstablishmentEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);

  return (
    <div id='EstablishmentEditor'>
        <UniversalEditor 
        TList={Api.Establishments} 
        EmptyStruct={{ url: "api/EmptyStructs/Establishment", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Establishments/Query", storeIn: "Establishments"}}
        TCreate={{ url: "api/Establishments/Create", storeIn: "Establishments"}}
        TUpdate={{ url: "api/Establishments/Update", storeIn: "Establishments"}}
        TDelete={{ url: null, storeIn: null}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Establishment Editor"}
        />
   
    </div>
  );

}


