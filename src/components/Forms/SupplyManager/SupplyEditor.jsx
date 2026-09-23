import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function SupplyEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  return (
    <div id='SupplyEditor'>
        <UniversalEditor 
        TList={Api.Supplies } 
        EmptyStruct={{ url: "api/EmptyStructs/Supply", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Supplies/Query", storeIn: "Supplies"}}
        TCreate={{ url: "api/Supplies/Create", storeIn: "Supplies"}}
        TUpdate={{ url: "api/Supplies/Update", storeIn: "Supplies"}}
        TDelete={{ url: "api/Supplies/Delete", storeIn: "Supplies"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Supplies Editor"}
        />
    </div>
  );

}
