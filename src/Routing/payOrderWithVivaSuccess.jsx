
import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';


import{DefineRelationships} from "../Redux/features/ApiReducer"

// Components
import  PaymentSuccess  from '../CVivaPayments/VP_Components/PaymentSuccess';

function payOrderWithVivaSuccess() {
  const Api = useSelector((state) => state.Api);
  const { OrderId,PermaProductTransactionId } = useParams();
  const dispatch = useDispatch(); 
  useEffect(() => {
  dispatch(DefineRelationships())
  }, []);


  console.log("URL-OrderId == ",OrderId)
  console.log("URL-PermaProductTransactionId == ",PermaProductTransactionId)

  
  return (
    <>
      <title>Fusion one</title>
      <PaymentSuccess  OrderId={OrderId} PermaProductTransactionId={PermaProductTransactionId}/>
    </>
  );
}
export default payOrderWithVivaSuccess;