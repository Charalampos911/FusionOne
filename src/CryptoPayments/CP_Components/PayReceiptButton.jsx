import React, { useState } from 'react';
import { ethers } from "ethers";
import { useSelector,useDispatch } from "react-redux";
import { useContract } from "../useContract";
import { callContractFunction } from "../callContractFunction";
import { apiRequest } from '../../Redux/features/ApiReducer';
import FormButton from '../../components/NewUI/FormButton';
// 12 Largest Global Fiat Currencies mapped to Chainlink Data Feeds (Base Mainnet)
const CHAINLINK_FIAT_INDEX = {
  USD: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70", // ETH / USD
  EUR: "0x6FA39860b7F1878aa497fbaB54D40713838520D8", // ETH / EUR
  GBP: "0x7B07FF0E159939308F49e681c9e37667C085f1cE", // ETH / GBP
  JPY: "0x4e6Cf9E9642D0EbeA6EcCcb92501DF3f868FE5c2", // ETH / JPY
  CAD: "0xa1aBc4D8be99393847Be78401314C7AdF189F2A6", // ETH / CAD
  AUD: "0xB20E15CEb9B6817f7A56667500366D06EFAfe7be", // ETH / AUD
  CHF: "0x0B0e5CEf48CAdC52c38A651ba0b36E9e917FF077", // ETH / CHF
  CNY: "0xD06CbfBBe65Bdf1eFA56D932Bcb1B679261CAd0B", // ETH / CNY
  HKD: "0x89eCeF101A6f9A0284CD9CFF3874B8123A1Bf5dE", // ETH / HKD
  SGD: "0x39E99eFF8c47E17FA1B64F0A914b7F20B6D9bF59", // ETH / SGD
  INR: "0x63351C771b96aB928a38Ff84f00Dba238e83bA2A", // ETH / INR
  AED: "0xFE856860E8867566dD4F4628373b98d9A0fe84E4", // ETH / AED
};

export default function PayReceiptButton({ signer, orderId }) {
  const { contract } = useContract(signer);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const Api = useSelector((state) => state.Api); 
  // Helper to hash string GUIDs to bytes32 matching Solidity keccak256
  const formatGuid = (guid) => {
    const cleanHex = guid.replace(/-/g, "");
    const paddedHex = cleanHex.padEnd(64, "0");
    return "0x" + paddedHex;
  };

  const handlePayReceipt = async (dispatch, apiRequest, orderId) => {
    if (!contract) {
      console.error("Smart contract context not loaded yet.");
      return;
    }

    // setLoading(true);

    dispatch(
      apiRequest({
        flatten: false,
        name: "PayReceiptButton.jsx | handlePayReceipt",
        url: "api/Orders/GetUpdatedOrderForCryptoCheckout",
        method: "POST",
        body: { OrderId: orderId },
        auth: false,
        tokenRequired: false,
        storeIn: "LOOK_DATA"
      })
    ).unwrap()
      .then(async (Response) => {
        const APICorrectData = Response.data;
        const OrganizationId = APICorrectData.OrganizationId;
        const TenantAddress = APICorrectData.TenantAddress;
        const Total = APICorrectData.Total; // e.g. "440.00" string
        const ReceiptGuid = APICorrectData.ReceiptGuid;

        const currencyKey = (APICorrectData.Currency || "EUR").toUpperCase();
        const PriceAddress = CHAINLINK_FIAT_INDEX[currencyKey].toLowerCase(); // live index fallback

        try {
          const Bytes32OrganizationId = formatGuid(OrganizationId);
          const Bytes32ReceiptGuid = formatGuid(ReceiptGuid);
          const contractFiatAmount = Math.round(parseFloat(Total) * 100); // 440.00 -> 44000

          // 1. Mock the target price locally using Chainlink's 8-decimal standard
          // Example: 3200.00 EUR/USD -> 320000000000
          const mockEthPrice = 1365.44 * 1e8;

          // 2. Perform the exact Solidity pricing formula natively in JS using BigInt
          // Equation: (fiatAmount * 10^24) / mockEthPrice
          const multiplier = 10n ** 24n;
          const finalRequiredWei = (BigInt(contractFiatAmount) * multiplier) / BigInt(mockEthPrice);

          // 3. Add your standard 2% safety cushion for MetaMask
          const txValueWei = (finalRequiredWei * 102n) / 100n;

          console.log("--- LOCAL JAVASCRIPT MOCK METRICS ---");
          console.log("Currency Assumed:", currencyKey);
          console.log("APICorrectData:", APICorrectData);
          console.log("TenantAddress:", TenantAddress);
          console.log("contractFiatAmount (Cents):", contractFiatAmount);
          console.log("mockEthPrice (8-dec):", mockEthPrice.toString());
          console.log("Calculated Baseline Wei:", finalRequiredWei.toString());
          console.log("Calculated Wei Value (With 2% Cushion):", txValueWei.toString());
          console.log("-------------------------------------");
          // return;
          // 4. Submit the transaction straight down to payReceipt
          const txResponse = await callContractFunction(
            contract,
            "payReceipt",
            "PaymentMade",
            (eventData) => { console.log("Event Emitted:", eventData); },
            false, 
            txValueWei, // msg.value payload (Baseline Wei + 2% Cushion)
            [
              Bytes32OrganizationId, 
              TenantAddress, 
              Bytes32ReceiptGuid, 
              finalRequiredWei,        // Parameter 3: RequiredAmount baseline expected by your validation logic
              Total, // Parameter 4: fiatAmount (e.g. 44000)
              BigInt(mockEthPrice),       // Parameter 5: FakedPrice exchange rate
              false // IsPerma
            ]
          );

          // 5. Explicitly wait for your local Anvil block to mint
          // if (txResponse && typeof txResponse.wait === "function") {
          //   console.log("Transaction pending in mempool... Hash:", txResponse.hash);
          //   const receipt = await txResponse.wait(); 
            
          //   if (receipt.status === 1) {
          //     console.log("Success! Local transaction confirmed.");
          //   } else {
          //     throw new Error("Transaction was mined but reverted on-chain.");
          //   }
          // }

        } catch (e) {
          console.error("Payment Routine Failed", e);
          alert("Transaction failed or was canceled.");
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Backend checkout request failed:", err);
        setLoading(false);
      });
  };

  return (
      <FormButton text= {loading ? "Processing..." : "Pay Invoice"} onClick={() => !loading && contract?handlePayReceipt(dispatch, apiRequest, orderId):null}/>
  );
}