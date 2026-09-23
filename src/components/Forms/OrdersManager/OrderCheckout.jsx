import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from '../../NewUI/QuerySelect'
import FormButton from '../../NewUI/FormButton'


import QR_Crypto_Routing from '../../../CryptoPayments/CP_Components/QR_Crypto_Routing'
import QR_Viva_Routing from '../../../CVivaPayments/VP_Components/QR_Viva_Routing'
export default function OrderCheckout({Orders,SelectedOrder,ActiveTab,refresh,ChangeSelection,AfterCheckout }) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [order, setOrder] = useState(
    Orders.OrdersByEstab[0]?.Orders.find(o => o.Id === SelectedOrder.Id) || null
  );

 const [PaymentMethod, setPaymentMethod] = useState(0);

 const [CheckoutSuccess, setCheckoutSuccess] = useState(false);
 const [UpdatedOrder, setUpdatedOrder] = useState(false);
useEffect(() => {
if(ActiveTab!=3) return;
setPaymentMethod(0)

  }, [refresh]);
useEffect(() => {
    dispatch(
      apiRequest({
        flatten: false,
        name: "PayReceiptButton.jsx | handlePayReceipt",
        url: "api/Orders/GetUpdatedOrder",
        method: "POST",
        body: { OrderId: SelectedOrder.Id },
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {
          console.clear()
          console.log("");
          console.log("SelectedOrder===",SelectedOrder);
          console.log("");
          console.log("Orders===",Orders);
          console.log("GetUpdatedOrder===",Response.data);
          setUpdatedOrder(Response.data)

      })
  }, []);



  return (
    <div className='OrderCheckout'>
    {!CheckoutSuccess?
    <>
      <div className='stats'>
        <div><span>Undelivered Services Total:</span><span>{UpdatedOrder?.UndeliveredOrderServices+" "+ UpdatedOrder.Currency}</span></div>
        <div><span>Services Total:</span><span>{UpdatedOrder?.ServicesTotal +" "+ UpdatedOrder.Currency}</span></div>
        <div><span>Undelivered Products Total:</span><span>{UpdatedOrder?.UndeliveredOrderProducts+" "+ UpdatedOrder.Currency}</span></div>
        <div><span>Products Total:</span><span>{UpdatedOrder?.ProductsTotal +" "+ UpdatedOrder.Currency}</span></div>

        <div><span>Grand total:</span><span>{UpdatedOrder?.ProductsTotal+UpdatedOrder?.ServicesTotal +" "+ UpdatedOrder.Currency}</span></div>
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
          <label>Attention: All temporarilly reserved products in this order, will be un-reserved.</label>
          <label>Attention: All pending status services will be removed.</label>
          <label>Attention: Only the served products and the in-proccess, confirmed and completed services will be charged.</label>
        </div>
        <div className='Checkout-btn'>
          <FormButton text={"Complete checkout"} onClick={()=>HCheckOutCash(order.Id,dispatch,apiRequest,setCheckoutSuccess)}/>
          <FormButton text={"Select another method"} onClick={()=>setPaymentMethod(0)}/>
        </div>
      </div>

      :null}

      {PaymentMethod==2?
         <QR_Viva_Routing orderId={order.Id} SuccessAndBack={()=>AfterCheckout()}/>
      :null}
      {PaymentMethod==3?
        <QR_Crypto_Routing orderId={order.Id} SuccessAndBack={()=>AfterCheckout()}/>
      :null}
    </>
    :
    
    <div className='AfterCheckout'>
      <label><b>Successfull payment</b></label>
      <FormButton text={"Go back"} onClick={()=>AfterCheckout()}/>
    </div>
    
    }</div>
  );

}

const HCheckOutCash =(SelectedOrder,dispatch,apiRequest,setCheckoutSuccess)=>{
    dispatch(
    apiRequest({
      name: "OrderCheckout.jsx | HCheckOutCash",
      url: "api/Orders/CheckOutCash",
      method: "POST",
      body: {
        OrderId:SelectedOrder
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

