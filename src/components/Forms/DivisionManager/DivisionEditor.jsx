import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function DivisionEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  return (
    <div id='DivisionEditor'>
        <UniversalEditor 
        TList={Api.Divisions  } 
        EmptyStruct={{ url: "api/EmptyStructs/Division", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Divisions/Query", storeIn: "Divisions"}}
        TCreate={{ url: "api/Divisions/Create", storeIn: "Divisions"}}
        TUpdate={{ url: "api/Divisions/Update", storeIn: "Divisions"}}
        TDelete={{ url: null, storeIn: null}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Division Editor"}
        />
   
    </div>
  );

}


