import React, { useState,useRef,useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../Redux/features/ApiReducer';
export default function PaymentSuccess() {
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 


  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('s'); // Captures the 's' parameter from Viva
  const [Token, setToken] = useState(null);

  const [Receipt, setReceipt] = useState(null);

console.log("s==="+transactionId)


  useEffect(() => {



    dispatch(
      apiRequest({
        flatten: false,
        name: "PaymentSuccess.jsx | useEffect",
        url: "api/VivaPayments/VivaSuccess",
        method: "POST",
        body: { orderCode: transactionId },
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {
        const APICorrectData = Response.data;
        const currencyKey = (APICorrectData.Currency || "EUR").toUpperCase();
        console.log("Receipt===",APICorrectData)
        setReceipt(APICorrectData)
      })


  }, []);




  return (
    <>
    {Receipt==null?"Loading...":null}


    {Receipt?.Transaction?.Id?
    <div className='SuccessCont'>
      <h2>✔️ Payment Successful!</h2>
      <div className='stats'>
        <div><span>Name 2:</span><span>{Receipt?.Name}</span></div>
        <div><span>Qty:</span><span>{Receipt?.Transaction?.Quantity}</span></div>
        <div><span>Rented since:</span>
        <span>
        {Receipt?.Transaction?.RentDay 
          ? new Date(Receipt?.Transaction?.RentDay).toISOString().replace('T', ' at ').slice(0, 19)
          : 'N/A'}
        </span>
        </div>
        <div><span>Charge so far:</span><span>{Receipt?.Transaction?.Total +" "+ Receipt?.Currency}</span></div>
      </div>
      {transactionId && (
        <p >
          Transaction ID Reference: <strong>{transactionId}</strong>
        </p>
      )}
      <br />
      <p>You can close this page</p>
      </div>
    :
    null
    }
{Receipt?.OrderId? 
    <div style={{ padding: '40px', textAlign: 'center', color: 'green' }}>
      <h2>✔️ Payment Successful!</h2>


      <p>Payer name: {Receipt?.CustomerName}</p>
      <p>Payer CustomerEmail: {Receipt?.CustomerName}</p>
      <p>Products total: {Receipt?.ProductsTotal}</p>
      <p>Services total: {Receipt?.ServicesTotal}</p>
      <p>Grand total: {Receipt?.Total}</p>
      <p>Thank you for your order.</p>
      {transactionId && (
        <p style={{ color: '#521515', fontSize: '14px' }}>
          Transaction ID Reference: <strong>{transactionId}</strong>
        </p>
      )}
      <br />
      <p>You can close this page</p>
      {/* <Link to="/" style={{ color: '#0052cc' }}>Return to Homepage</Link> */}
    </div>
    :null}
    </>
  );
}