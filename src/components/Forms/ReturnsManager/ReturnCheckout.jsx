import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import FormButton from '../../NewUI/FormButton';

export default function ReturnCheckout({ selectedProducts, selectedServices, SelectedOrder, AfterCheckout}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [Message, setMessage] = useState(null);
  const [CheckoutSuccess, setCheckoutSuccess] = useState(false);

  // Calculate unified totals across both tabs
  const productsRefundTotal = (selectedProducts || []).reduce((sum, item) => sum + (item.Product.Price * item.QuantityToReturn), 0);
  const servicesRefundTotal = (selectedServices || []).reduce((sum, item) => sum + item.Service.Price, 0);
  const grandRefundTotal = productsRefundTotal + servicesRefundTotal;

  // Final confirmation dispatcher
  const handleFinalBatchSubmit = () => {
    // 1. Trim the Product objects out from ReturnProducts array
    const cleanedProducts = (selectedProducts || []).map(({ OrderProductId, QuantityToReturn }) => ({
      OrderProductId,
      QuantityToReturn
    }));

    // 2. Trim the Service objects out from ReturnServices array
    const cleanedServices = (selectedServices || []).map(({ OrderServiceId, RefundService }) => ({
      OrderServiceId,
      RefundService
    }));

    const requestPayload = {
      OrderId: SelectedOrder.Id,
      ReturnProducts: cleanedProducts,
      ReturnServices: cleanedServices
    };

    // Log the trimmed payload verification snapshot
    console.clear();
    console.log("Trimmed Payload Data Body ==>", requestPayload);

    // 3. Fire clean batch array payload to your backend database
    dispatch(
      apiRequest({
        name: "ReturnsMasterManager.jsx | MultiItemReturn",
        url: "api/ProductTransactions/MultiItemReturn", 
        method: "POST",
        body: requestPayload,
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
      .unwrap()
      .then((Response) => {
        console.log("Checkout success Response ==>", Response);
        setCheckoutSuccess(true);
        setMessage({ msg: "Refund processed successfully!", Mood: true });
      })
      .catch((error) => {
        console.error(error);
        setMessage({ msg: "Failed to process database refund package.", Mood: false });
      });
  };

  return (
    <div className='OrderCheckout'>
      {!CheckoutSuccess ? (
        <>
          {(selectedProducts?.length > 0 || selectedServices?.length > 0) && (
            <div className="BatchSummary" style={{ padding: '15px' }}>
              <h3>Return Package Summary</h3>
              <ul>
                {selectedProducts?.map((p, idx) => (
                  <li key={idx}>[Product] {p.Product.Name} x{p.QuantityToReturn} - {(p.Product.Price * p.QuantityToReturn).toFixed(2)} €</li>
                ))}
                {selectedServices?.map((s, idx) => (
                  <li key={idx}>[Service] {s.Service.Name} - {s.Service.Price.toFixed(2)} €</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className='RefundActions'>
            <strong style={{ marginRight: '20px', fontSize: '16px' }}>Total Refund Amount: {grandRefundTotal.toFixed(2)} €</strong>
            {selectedProducts?.length > 0 || selectedServices?.length > 0 ? (
              <button onClick={handleFinalBatchSubmit}>
                Process Combined Refund
              </button>
            ) : null}
          </div>
        </>
      ) : (
        <div className='AfterCheckout'>
          <label>Successful payment</label>
          <FormButton text={"Go back"} onClick={() => AfterCheckout("wtf22")} />
        </div>
      )}

      <div className='MessageCont'>
        {Message?.msg && (
          <span style={{ color: Message?.Mood ? "darkgreen" : "darkred", fontWeight: 'bold' }}>
            {Message.msg}
          </span>
        )}
      </div>
    </div>
  );
}