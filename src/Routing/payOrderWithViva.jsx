
import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';


import{DefineRelationships} from "../Redux/features/ApiReducer"

// Components
import  PayReceiptForm  from '../CVivaPayments/VP_Components/PayReceiptForm';

function payOrderWithViva() {
  const Api = useSelector((state) => state.Api);
  const { OrderId } = useParams();
  const dispatch = useDispatch(); 
  useEffect(() => {
  dispatch(DefineRelationships())
  }, []);


  console.log("URL-OrderId == ",OrderId)
  return (
    <>
      <title>Checkout-viva.com</title>
      <PayReceiptForm OrderId={OrderId} />
    </>
  );
}
export default payOrderWithViva;