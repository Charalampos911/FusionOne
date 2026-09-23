import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function SpecialsEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  return (
    <div id='SpecialsEditor'>
        <UniversalEditor 
        TList={Api.Specials} 
        EmptyStruct={{ url: "api/EmptyStructs/Specials", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Specials/Query", storeIn: "Specials"}}
        TCreate={{ url: "api/Specials/Create", storeIn: "Specials"}}
        TUpdate={{ url: "api/Specials/Update", storeIn: "Specials"}}
        TDelete={{ url: "api/Specials/SoftDelete", storeIn: "Specials"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Specials Editor"}
        />
   
    </div>
  );

}
