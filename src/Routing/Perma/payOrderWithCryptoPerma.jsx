
import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';


import{DefineRelationships} from "../../Redux/features/ApiReducer"

// Components
import  PayReceiptFormPerma  from '../../CryptoPayments/CP_Components/Perma/PayReceiptFormPerma';

function PayOrderWithCryptoPerma() {
  const Api = useSelector((state) => state.Api);
  const { PermaProductTransactionId } = useParams();
  const dispatch = useDispatch(); 
  useEffect(() => {
  dispatch(DefineRelationships())
  }, []);


  console.log("URL-PermaProductTransactionId == ",PermaProductTransactionId)
  return (
    <>
      <title>Fusion one</title>
      <PayReceiptFormPerma PermaProductTransactionId={PermaProductTransactionId} />
    </>
  );
}
export default PayOrderWithCryptoPerma;