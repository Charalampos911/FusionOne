import React, { useState,useRef,useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // SVG renders beautifully at any scale
import * as signalR from '@microsoft/signalr';
import Messaging from "../../components/NewUI/Messaging.jsx"
import { useSelector, useDispatch } from "react-redux";
import { isMobile, isTablet, isDesktop } from 'react-device-detect';
function QR_Viva_Routing({ orderId, SuccessAndBack }) {
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const IsDevice = isMobile || isTablet;
  // Construct the absolute URL using your domain name and the unique GUID
  // const targetUrl = `https://www.fusionone.com/payOrderWithCrypto/${orderId}`;
  const targetUrl =  Api.PayWithVivaBaseUrl+orderId;  

    const [connection, setConnection] = useState(null); //Web hook
    const [TransactionStatus, setTransactionStatus] = useState([0,null]);

    useEffect(() => {
      if(TransactionStatus[0]==1){
        
         SuccessAndBack({msg:"Successful payment!",Mood:true})
      }
        if(TransactionStatus[0]==2){

         SuccessAndBack({msg:"Payment failed!",Mood:false})
      }
        }, [TransactionStatus]);
    useEffect(() => {
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
if (TransactionStatus[0] === 0 && IsDevice) {
  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}
    // 3. Clean up properly when the component unmounts
    return () => {
      if (connection) {
        connection.off("PaymentMade"); // Remove listener
        connection.stop();
      }
    };
  }, [connection]); 

  return (
    <>
     {TransactionStatus[0]==0?
    <div className="qr-container" style={{ textAlign: 'center', margin: '20px' }}>
      <h3>Scan to Pay with Viva</h3>
      <p>Scan this QR code with your mobile device to complete your payment.</p>
       <div style={{ marginTop: '10px' }}>
        <a href={targetUrl} target="_blank" rel="noopener noreferrer">
          Go to Payment Page
        </a>
      </div>
      <div style={{ background: '#white', padding: '16px', display: 'inline-block', borderRadius: '8px' }}>
        <QRCodeSVG 
          value={targetUrl} 
          size={200}          // Size in pixels
          bgColor={"#ffffff"} // Background color
          fgColor={"#000000"} // QR Code color
          level={"M"}         // Error correction level (L, M, Q, H)
        />
      </div>
      
      
      {/* Optional: Provide a fallback clickable link for desktop users */}

    </div>
    :null}

    {/* {TransactionStatus[0]==1?
    
    <>
        <div style={{ marginTop: '10px' }} onClick={()=>SuccessAndBack()}>
          
            Return to previous page
        </div>

        <Messaging ParentMessage={{
          msg:"Successful payment",
          Mood: true,
        }}/>
    </>
    :null} */}
    </>
  );
}

export default QR_Viva_Routing;