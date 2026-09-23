import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';
export default function ClerkEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  

  return (
    <div id='PermaProductEditor'>
        <UniversalEditor 
        TList={Api.PermaProducts } 
        EmptyStruct={{ url: "api/EmptyStructs/PermaProduct", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/PermaProducts/Query", storeIn: "PermaProducts"}}
        TCreate={{ url: "api/PermaProducts/Create", storeIn: "PermaProducts"}}
        TUpdate={{ url: "api/PermaProducts/Update", storeIn: "PermaProducts"}}
        TDelete={{ url: null, storeIn: "PermaProducts"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Rentals Editor - Clerk"}
        />
    </div>
  );

}
