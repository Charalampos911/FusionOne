
import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';


import{DefineRelationships} from "../Redux/features/ApiReducer"

// Components
import  PayReceiptForm  from '../CryptoPayments/CP_Components/PayReceiptForm';

function payOrderWithCrypto() {
  const Api = useSelector((state) => state.Api);
  const { OrderId } = useParams();
  const dispatch = useDispatch(); 
  useEffect(() => {
  dispatch(DefineRelationships())
  }, []);


  console.log("URL-OrderId == ",OrderId)
  return (
    <>
      <title>Fusion one</title>
      <PayReceiptForm OrderId={OrderId} />
    </>
  );
}
export default payOrderWithCrypto;