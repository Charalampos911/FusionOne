import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,ResetMsg } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import UniversalEditor  from "../UniversalEditor";
export default function ProductCategories(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  useEffect(() => {
    dispatch(ResetMsg())
  }, []);

  return (
    <div id='ProductCategories'>
       
      
        <UniversalEditor 
        TList={Api.ProductCategories} 
        EmptyStruct={{ url: "api/EmptyStructs/ProductCategory", storeIn: "EmptyStruct"}}
        TQuery={{ url: "api/ProductCategories/Query", storeIn: "ProductCategories"}}
        TCreate={{ url: "api/ProductCategories/Create", storeIn: "ProductCategories"}}
        TUpdate={{ url: "api/ProductCategories/Update", storeIn: "ProductCategories"}}
        TDelete={{ url: "api/ProductCategories/SoftDelete", storeIn: "ProductCategories"}}
        ChangeSelection={()=>props.ChangeSelection()}
        Title={"Product categories"}
        />
   
      
    </div>
  );

}


