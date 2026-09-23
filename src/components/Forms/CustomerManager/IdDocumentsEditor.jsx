import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';




export default function IdDocumentsEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 


  return (
    <div id='CustomerEditor'>
        <UniversalEditor 
        TList={Api.IdDocuments  } 
        EmptyStruct={{ url: "api/EmptyStructs/IdDocument", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Customers/QueryIdDocuments", storeIn: "IdDocuments"}}
        TCreate={{ url: null, storeIn: "IdDocuments"}}
        TUpdate={{ url: null, storeIn: "IdDocuments"}}
        TDelete={{ url: null, storeIn: "IdDocuments"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Id documents Editor"}
        
        />
   
    </div>
  );

}


