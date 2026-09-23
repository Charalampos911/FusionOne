import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function InventoryEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);

  return (
    <div id='InventoryEditor'>
        <UniversalEditor 
        TList={Api.Inventories} 
        EmptyStruct={{ url: "api/EmptyStructs/Inventory", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Inventories/Query", storeIn: "Inventories"}}
        TCreate={{ url: "api/Inventories/Create", storeIn: "Inventories"}}
        TUpdate={{ url: "api/Inventories/Update", storeIn: "Inventories"}}
        TDelete={{ url: null, storeIn: null}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Inventory Editor"}
        />
    </div>
  );

}
