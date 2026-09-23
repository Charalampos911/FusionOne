import React, { useState,useRef,useEffect } from 'react';
import { ethers } from "ethers";
import PayReceiptButtonPerma from "../Perma/PayReceiptButtonPerma"; // Adjust path
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders } from '../../../Redux/features/ApiReducer';
import * as signalR from '@microsoft/signalr';
import FormButton from '../../../components/NewUI/FormButton';
import Messaging from '../../../components/NewUI/Messaging';
export default function PayReceiptFormPerma({PermaProductTransactionId}) {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  console.log("PermaProductTransactionId===111==>",PermaProductTransactionId)
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [TransactionStatus, setTransactionStatus] = useState([false,null]);
  const [connection, setConnection] = useState(null);
  const [UpdatedPerma, setUpdatedPerma] = useState(false);
useEffect(() => {
    dispatch(
      apiRequest({
        name: "PayReceiptButton.jsx | handlePayReceipt",
        url: "api/PermaProductTransactions/UpdatedPerma",
        method: "POST",
        body: { 
          Id: PermaProductTransactionId,
        },
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {
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
          connection.on("PaymentMade", (txHash) => {
            console.log(`Payment confirmed in tx: ${txHash}.`);
            setTransactionStatus([true, txHash]);
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

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      // 1. Initialize the browser provider wrapped around MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // 2. Request account access from the user
      await provider.send("eth_requestAccounts", []);
      
      // 3. Extract the signer profile object
      const userSigner = await provider.getSigner();
      console.log("userSigner===",userSigner)
      // 4. Save state variables
      setSigner(userSigner);
      setAccount(await userSigner.getAddress());
      
      console.log("Wallet connected! Signer ready.");
    } catch (error) {
      console.error("User denied account access or error occurred:", error);
    }
  };







  return (
<div className='CryptoCheckout'>



  <div>
    <h2>Checkout with crypto</h2>
      <div className='stats'>
        <div><span>Name:</span><span>{UpdatedPerma?.Name}</span></div>
        <div><span>Qty:</span><span>{UpdatedPerma?.Transaction?.Quantity}</span></div>
        <div><span>Rented since:</span><span>{UpdatedPerma?.Transaction?.RentDay.split('T')[0]}</span></div>
        <div><span>Charge so far:</span><span>{UpdatedPerma?.Transaction?.Total +" "+ UpdatedPerma?.Currency}</span></div>
      </div>


    {TransactionStatus[0]==false?
    <>
    {!account ? (
      <FormButton text={"Connect MetaMask Wallet"} onClick={connectWallet}/>
    ) : (
      <div className='FinallyPay'>
          <p>Connected Account: &nbsp;
            <code>
              {account ? `${account.slice(0, 5)}*****${account.slice(-5)}` : "Not Connected"}
            </code>
          </p>
        
        {/* STEP 2: Pass the signer profile directly as a prop here */}
        <PayReceiptButtonPerma signer={signer}  PermaProductTransactionId={PermaProductTransactionId}/>
      </div>
    )}

    </>
    :<Messaging ParentMessage={
    {
      msg: `Payment confirmed.  You can close this page`,
      Mood: true
    }
    
    } IsLocal={true}/>}
  </div>



</div>
  );
}