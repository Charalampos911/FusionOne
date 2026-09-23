import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';




export default function CustomerEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  return (
    <div id='CustomerEditor'>
        <UniversalEditor 
        TList={Api.Customers  } 
        EmptyStruct={{ url: "api/EmptyStructs/Customer", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Customers/Query", storeIn: "Customers"}}
        TCreate={{ url: "api/Customers/Create", storeIn: "Customers"}}
        TUpdate={{ url: "api/Customers/Update", storeIn: "Customers"}}
        TDelete={{ url: null, storeIn: null}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Customer Editor"}
        
        />
   
    </div>
  );

}


