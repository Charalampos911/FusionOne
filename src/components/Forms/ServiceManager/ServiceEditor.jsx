import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function ServiceEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);

  return (
    <div id='ServiceEditor'>
        <UniversalEditor 
        TList={Api.Services } 
        EmptyStruct={{ url: "api/EmptyStructs/Service", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Services/Query", storeIn: "Services"}}
        TCreate={{ url: "api/Services/Create", storeIn: "Services"}}
        TUpdate={{ url: "api/Services/Update", storeIn: "Services"}}
        TDelete={{ url: "api/Services/SoftDelete", storeIn: "Services"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Services Editor"}

        />
    </div>
  );

}
