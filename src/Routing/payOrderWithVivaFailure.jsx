
import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';


import{DefineRelationships} from "../Redux/features/ApiReducer"

// Components
import  PaymentFailed  from '../CVivaPayments/VP_Components/PaymentFailed';

function payOrderWithVivaFailure() {
  const Api = useSelector((state) => state.Api);
  const { OrderId } = useParams();
  const dispatch = useDispatch(); 
  useEffect(() => {
  dispatch(DefineRelationships())
  }, []);


  console.log("URL-OrderId == ",OrderId)
  return (
    <>
      <title>Failed-viva.com</title>
      <PaymentFailed  />
    </>
  );
}
export default payOrderWithVivaFailure;