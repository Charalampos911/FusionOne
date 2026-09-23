import React, { useState,useRef,useEffect } from 'react';
import { ethers } from "ethers";
import PayReceiptButtonPerma from "../Perma/PayReceiptButtonPerma"; // Adjust path
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import * as signalR from '@microsoft/signalr';
import Messaging from '../../../components/NewUI/Messaging';
export default function PayReceiptFormPerma({PermaProductTransactionId}) {
  const [account, setAccount] = useState("");
  console.log("PermaProductTransactionId===111==>",PermaProductTransactionId)
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [TransactionStatus, setTransactionStatus] = useState([0,null]);
  const [connection, setConnection] = useState(null);
 const [UpdatedPerma, setUpdatedPerma] = useState(null);


useEffect(() => {

  console.log("PermaCheckout here!!!  - 222")
    dispatch(
      apiRequest({
        name: "PayReceiptButton.jsx | handlePayReceipt",
        url: "api/PermaProductTransactions/UpdatedPerma",
        method: "POST",
        body: { Id: PermaProductTransactionId},
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {
        console.log("PermaCheckout here!!!  - 333")
          console.clear()
          console.log("");
          console.log("PermaProductTransactionId===",PermaProductTransactionId);
          console.log("");
          console.log("GetUpdatedPerma===",Response.data);
          setUpdatedPerma(Response.data)

      })

// 1. Build the connection
    const newConnection = new signalR.HubConnectionBuilder()
       .withUrl(Api.cmsHub)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

useEffect(() => {
    // 2. Start the connection once it's built
    if (connection) {
      connection.start()
        .then(() => {
          console.log("Connected to API real-time hub!");

          // Listen for the signal from C#
          connection.on("VivaPaymentSuccess", (txHash) => {
            console.log(`Payment confirmed in tx: ${txHash}.`);
            setTransactionStatus([1, txHash]);
          });
          connection.on("VivaPaymentFailed", (txHash) => {
            console.log(`Payment failed in tx: ${txHash}.`);
            setTransactionStatus([2, txHash]);
          });

        })
        .catch(err => console.error("SignalR Connection Error: ", err));
    }

    // 3. Clean up properly when the component unmounts
    return () => {
      if (connection) {
        connection.off("PaymentMade"); // Remove listener
        connection.stop();
      }
    };
  }, [connection]); // Runs whenever the connection state initializes







  return (
<div className='CryptoCheckout'>



  <div>
    <h2>Checkout with Viva</h2>
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


    {TransactionStatus[0]==0?
      <div className='FinallyPay'>
        <PayReceiptButtonPerma PermaProductTransactionId={PermaProductTransactionId}/>
      </div>
    :null}

    {TransactionStatus[0]==1?
    <Messaging ParentMessage={
    {
      msg: `Payment confirmed. You can close this page`,
      Mood: true
    }
    } />
    :null}

    {TransactionStatus[0]==2?

    <>
      <div className='FinallyPay'>
        <PayReceiptButtonPerma PermaProductTransactionId={PermaProductTransactionId}/>
      </div>
      <Messaging ParentMessage={
      {
        msg: `Payment failed. Try again!`,
        Mood: true
      }
      } />
    </>

    :null}

  </div>



</div>
  );
}