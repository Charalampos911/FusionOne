import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function SectorEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);

  return (
    <div id='SectorEditor'>
        <UniversalEditor 
        TList={Api.Sectors } 
        EmptyStruct={{ url: "api/EmptyStructs/Sector", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Sectors/Query", storeIn: "Sectors"}}
        TCreate={{ url: "api/Sectors/Create", storeIn: "Sectors"}}
        TUpdate={{ url: "api/Sectors/Update", storeIn: "Sectors"}}
        TDelete={{ url: null, storeIn: null}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Sectors Editor"}
        />
    </div>
  );

}
