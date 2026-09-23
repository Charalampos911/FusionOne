import React, { useState,useRef,useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../Redux/features/ApiReducer';
import FormButton from '../../components/NewUI/FormButton';
export default function PaymentFailed() {
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 


  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('s'); // Captures the 's' parameter from Viva
  const [Token, setToken] = useState(null);

  const [Receipt, setReceipt] = useState(null);
  useEffect(() => {


    console.log("s=",transactionId)
    dispatch(
      apiRequest({
        flatten: false,
        name: "PaymentFailure.jsx | useEffect",
        url: "api/VivaPayments/VivaFailure",
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
    {Receipt==null?"Loading...22":null}

    {Receipt?.Transaction?.Id?
    <div className='FailCont'>
      <h2 className="fail">❌ Payment Failed!</h2>
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
      <p>Your transaction could not be processed. Please try again or use a different card.</p>
      <br />
      <div className='Options'>
      <Link to={Api.PayWithVivaBaseUrlPerma+Receipt?.Transaction?.Id}><FormButton text={"Try Again"}/></Link>
      <Link to="/" ><FormButton text={"Back Home"}/></Link>
      </div>
      <br />
      <p>You can close this page</p>
      </div>
    :
    null
    }









{Receipt?.OrderId? 
    <div className='FailCont' style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
      <h2 className="fail"> ❌ Payment Failed or Canceled</h2>
      <p>Payer name: {Receipt?.CustomerName}</p>
      <p>Payer CustomerEmail: {Receipt?.CustomerName}</p>
      <p>Products total: {Receipt?.ProductsTotal}</p>
      <p>Services total: {Receipt?.ServicesTotal}</p>
      <p>Grand total: {Receipt?.Total}</p>

      <p>Your transaction could not be processed. Please try again or use a different card.</p>
      <br />
      <div className='Options'>
      <Link to={Api.PayWithVivaBaseUrl+Receipt?.OrderId}><FormButton text={"Try Again"}/></Link>
      <Link to="/" ><FormButton text={"Back Home"}/></Link>
      </div>
      <br />
      <p>You can close this page</p>
    </div>
        :null}
    </>
  );
}