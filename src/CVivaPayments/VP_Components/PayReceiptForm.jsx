import React, { useState,useRef,useEffect } from 'react';
import { ethers } from "ethers";
import PayReceiptButton from "./PayReceiptButton"; // Adjust path
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders } from '../../Redux/features/ApiReducer';
import * as signalR from '@microsoft/signalr';
import FormButton from '../../components/NewUI/FormButton';
import Messaging from '../../components/NewUI/Messaging';
export default function PayReceiptForm({OrderId}) {
  const [account, setAccount] = useState("");
  console.log("OrderId===111==>",OrderId)
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [TransactionStatus, setTransactionStatus] = useState([0,null]);
  const [connection, setConnection] = useState(null);
  const [UpdatedOrder, setUpdatedOrder] = useState(false);
useEffect(() => {
    dispatch(
      apiRequest({
        flatten: false,
        name: "PayReceiptButton.jsx | handlePayReceipt",
        url: "api/Orders/GetUpdatedOrder",
        method: "POST",
        body: { OrderId: OrderId },
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {

          console.log("GetUpdatedOrder===",Response.data);
          setUpdatedOrder(Response.data)

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
      <div><div>Undelivered Services Total:</div><div>{UpdatedOrder?.UndeliveredOrderServices +" "+ UpdatedOrder.Currency}</div></div>
      <div><div>Services Total:</div><div>{UpdatedOrder?.ServicesTotal +" "+ UpdatedOrder.Currency}</div></div>
      <div><div>Undelivered Products Total:</div><div>{UpdatedOrder?.UndeliveredOrderProducts +" "+ UpdatedOrder.Currency}</div></div>
      <div><div>Products Total:</div><div>{UpdatedOrder?.ProductsTotal +" "+ UpdatedOrder.Currency}</div></div>

      <div><div>Grand total:</div><div>{UpdatedOrder?.ServicesTotal + UpdatedOrder?.ProductsTotal} {UpdatedOrder.Currency}</div></div>
    </div>


    {TransactionStatus[0]==0?
      <div className='FinallyPay'>
        <PayReceiptButton orderId={OrderId}/>
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
        <PayReceiptButton orderId={OrderId}/>
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