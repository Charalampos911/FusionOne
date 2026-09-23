import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders } from '../../../Redux/features/ApiReducer';
import FormButton from '../../NewUI/FormButton'
import { FaArrowLeft } from "react-icons/fa";

import QR_Crypto_Routing_Perma from '../../../CryptoPayments/CP_Components/Perma/QR_Crypto_Routing_Perma'

import QR_Viva_Routing_Perma from '../../../CVivaPayments/VP_Components/Perma/QR_Viva_Routing_Perma'
import Messaging from '../../NewUI/Messaging';
export default function PermaCheckout({PermaProductTransactionId,ChangeSelection,AfterCheckout }) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
 const [Message, setMessage] = useState(null);
console.log("PermaCheckout here!!!  - 111")
// return;
  useEffect(() => {
    if(Api.NewApiToUserMessage?.msg!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
 const [PaymentMethod, setPaymentMethod] = useState(0);

 const [CheckoutSuccess, setCheckoutSuccess] = useState(false);
 const [UpdatedPerma, setUpdatedPerma] = useState(null);

useEffect(() => {
  console.log("PermaCheckout here!!!  - 222")
    dispatch(
      apiRequest({
        name: "PayReceiptButton.jsx | handlePayReceipt",
        url: "api/PermaProductTransactions/UpdatedPerma",
        method: "POST",
        body: { Id: PermaProductTransactionId,OrganizationId: Api.Token.OrganizationId},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {
        console.log("PermaCheckout here!!!  - 333")
     
          console.log("");
          console.log("PermaProductTransactionId===",PermaProductTransactionId);
          console.log("");
          console.log("GetUpdatedPerma===",Response.data);
          setUpdatedPerma(Response.data)

      })
  }, []);
console.log("PermaCheckout here!!!  - 444")


  return (
    <div className='OrderCheckout RentalCheckout'>
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>ChangeSelection()}><FaArrowLeft /></div> 
        <label>{"Rental checkout"}</label>
      </div>

    {!CheckoutSuccess && UpdatedPerma?
    <>
      <div className='stats'>
        <div><span>Name:</span><span>{UpdatedPerma?.Name}</span></div>
        <div><span>Qty:</span><span>{UpdatedPerma?.Transaction.Quantity}</span></div>
        <div><span>Rented since:</span>
        <span>
        {UpdatedPerma?.Transaction?.RentDay 
          ? new Date(UpdatedPerma.Transaction.RentDay).toISOString().replace('T', ' at ').slice(0, 19)
          : 'N/A'}
        </span>
        </div>
        <div><span>Charge so far:</span><span>{UpdatedPerma?.Transaction.Total +" "+ UpdatedPerma?.Currency}</span></div>
      </div>

      {PaymentMethod==0?
        <>
          <div class='CheckoutPortal'>
            <FormButton text={"Cash"} onClick={()=>setPaymentMethod(1)}/>
            <FormButton text={"Card"} onClick={()=>setPaymentMethod(2)}/>
            <FormButton text={"Crypto"} onClick={()=>setPaymentMethod(3)}/>

          </div>
        </>
      :null}
    {PaymentMethod==1?
      <div className='CheckoutBox Cash'>
        <div className='Warnings'>
          <label>Attention: Make sure the product returned is functional and in good condition.</label>
        </div>
        <div className='Checkout-btn'>
          <FormButton text={"Complete checkout"} onClick={()=>HCheckOutCash(UpdatedPerma?.Transaction.Rentee,PermaProductTransactionId,UpdatedPerma?.Transaction.Quantity,dispatch,apiRequest,setCheckoutSuccess)}/>
          <FormButton text={"Select another method"} onClick={()=>setPaymentMethod(0)}/>
        </div>
      </div>

      :null}

      {PaymentMethod==2?
         <QR_Viva_Routing_Perma PermaProductTransactionId={PermaProductTransactionId} SuccessAndBack={(e)=>(AfterCheckout(e),console.log("111==>",e))}/>
      :null}
      {PaymentMethod==3?
        <QR_Crypto_Routing_Perma PermaProductTransactionId={PermaProductTransactionId} SuccessAndBack={(e)=>AfterCheckout(e)}/>
      :null}
    </>
    :
    
    // <div className='AfterCheckout'>
    //   <label><b>Successfull payment</b></label>
    //   <FormButton text={"Go back"} onClick={()=>AfterCheckout()}/>
    // </div>
    null
    }
   
    </div> 
  );

}

const HCheckOutCash =async (CustomerId,PermaProductTransactionId,Quantity,dispatch,apiRequest,setCheckoutSuccess)=>{
    dispatch(
    apiRequest({
      name: "OrderCheckout.jsx | HCheckOutCash",
      url: "api/PermaProducts/StopRent",
      method: "POST",
      body: {
      CustomerId:CustomerId,
      TargetId:PermaProductTransactionId,
      Quantity:Quantity,
      IsCard:false
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Checkout success Response==>",Response)
          setCheckoutSuccess(true)
        })
}

