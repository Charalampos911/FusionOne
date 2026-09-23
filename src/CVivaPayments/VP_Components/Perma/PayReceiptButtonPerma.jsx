import React, { useState } from 'react';
import { useSelector,useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import FormButton from '../../../components/NewUI/FormButton';
// 12 Largest Global Fiat Currencies mapped to Chainlink Data Feeds (Base Mainnet)


export default function PayReceiptButtonPerma({ PermaProductTransactionId }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const Api = useSelector((state) => state.Api); 
  // Helper to hash string GUIDs to bytes32 matching Solidity keccak256

  const handlePayReceipt = async (dispatch, apiRequest, PermaProductTransactionId) => {


    // setLoading(true);

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
        const APICorrectData = Response.data;
        const currencyKey = (APICorrectData.Currency || "EUR").toUpperCase();



          // 4. Submit the transaction straight down to payReceipt
    dispatch(
      apiRequest({
        name: "PayReceiptButton.jsx | handlePayReceipt",
        url: "api/VivaPayments/create-order-perma",
        method: "POST",
        body: {
          amount: APICorrectData.Transaction.Total, // Major currency format (decimals)
          customerEmail: APICorrectData.Transaction.RenteeEmail,
          customerName: APICorrectData.Transaction.RenteeName,
          PermaId: APICorrectData.Transaction.Id
         },
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {
        console.clear()
        console.log("Viva===",Response)
        if (!Response.data.orderCode) {
          throw new Error('Backend failed to generate payment order.');
        }
 
      if (Response.data.orderCode) {
        // Redirect the user out to Viva's hosted Smart Checkout platform
        // window.location.href = `https://demo.vivapayments.com/web/checkout?ref=${Response.data.orderCode}`;
        alert("Response.data.orderCode 111=="+Response.data.orderCode)
        // window.open(
        //   `https://demo.vivapayments.com/web/checkout?ref=${Response.data.orderCode}`,
        //   "_blank",
        //   "noopener,noreferrer"
        // );
        // alert("Response.data.orderCode 222=="+Response.data.orderCode)
        window.location.href = `https://demo.vivapayments.com/web/checkout?ref=${Response.data.orderCode}`;
      } else {
        alert('Failed to get an order code from the server.');
      }


      })
      .catch((err) => {
        console.error("Backend checkout request failed:", err);
        setLoading(false);
      });
    })
  }

  return (
      <FormButton text= {loading ? "Processing..." : "Pay Invoice"} onClick={() => !loading ?handlePayReceipt(dispatch, apiRequest, PermaProductTransactionId):null}/>
  );
}