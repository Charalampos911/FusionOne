import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';




export default function ClerkEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  return (
    <div id='CustomerEditor'>
        <UniversalEditor 
        TList={Api.Customers  } 
        EmptyStruct={{ url: "api/EmptyStructs/Customer", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Customers/Query", storeIn: "Customers"}}
        TCreate={{ url: null, storeIn: "Customers"}}
        TUpdate={{ url: null, storeIn: "Customers"}}
        TDelete={{ url: null, storeIn: "Customers"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Customer Editor"}
        
        />
   
    </div>
  );

}


