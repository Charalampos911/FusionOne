import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';




export default function BankCardsEditor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 


  return (
    <div id='CustomerEditor'>
        <UniversalEditor 
        TList={Api.BankCards  } 
        EmptyStruct={{ url: "api/EmptyStructs/BankCard", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/Customers/QueryBankCards", storeIn: "BankCards"}}
        TCreate={{ url: null, storeIn: "BankCards"}}
        TUpdate={{ url: null, storeIn: "BankCards"}}
        TDelete={{ url: null, storeIn: "BankCards"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Bank Cards Editor"}
        
        />
   
    </div>
  );

}


