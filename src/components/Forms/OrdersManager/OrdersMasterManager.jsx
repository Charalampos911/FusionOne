import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk,ResetMsg,setDepartmentId } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import OrderProducts from './OrderProducts'
import OrderServices from './OrderServices'
import OrderCheckout from './OrderCheckout'
import FormButton from '../../NewUI/FormButton';

export default function OrdersMasterManager({Customer,ChangeSelection,SuccessReturn,TargetOrder,TargetTab}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  console.log("Customer===",Customer)
  console.log("TargetOrder===",TargetOrder)
  console.log("TargetTab===",TargetTab)
  const [orders, setOrders] = useState(null);
  // const [orderProducts, setOrderProducts] = useState(orders?.OrderProducts);
  // const [orderServices, setOrderServices] = useState(orders?.OrderServices);
 
  // const [orderInputServices, setOrderInputServices] = useState(orders?.OrderServices);
  // const [fiatReceipts, setFiatReceipts] = useState(orders?.OrderServices);
  // const [cryptoReceipt, setCryptoReceipt] = useState(orders?.OrderServices);
  const [SelectedEstab, setSelectedEstab] = useState(null);
  const [SelectedOrder, setSelectedOrder] = useState(TargetOrder || null);
  const [ActiveTab, setActiveTab] = useState(TargetTab || 2);
  const [Message, setMessage] = useState(null);
  const [AfterCheckout, setAfterCheckout] = useState(false);

  
  const [refresh, setRefresh] = useState(0);

  console.log("orders=====",orders)
  useEffect(() => {
  dispatch(ResetMsg())
  setAfterCheckout(false)
  // dispatch(setDepartmentId(SelectedOrder!=null?SelectedOrder?.DepartmentId:null))
  dispatch(
    apiRequest({
      name: "OrdersMasterManager.jsx | OrdersByCutsomer",
      url: "api/Orders/OrdersByCustomer",
      method: "POST",
      body: {CustomerId:Customer},
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
  .then((Response) => {
    console.log("Response==>",Response)
    setOrders(Response.data || null)
    setSelectedOrder(Response.data?.OrdersByEstab[0]?.Orders[0] || null)
    setSelectedEstab(Response.data?.OrdersByEstab[0]?.EstablishmentId || null)
  })
  }, []);


  useEffect(() => {
  // dispatch(ResetMsg())
  // dispatch(
  //   apiRequest({
  //     name: "OrdersMasterManager.jsx | OrdersByCutsomer",
  //     url: "api/Orders/OrdersByCustomer",
  //     method: "POST",
  //     body: {CustomerId:Customer},
  //     auth: true,
  //     tokenRequired: true,
  //     storeIn: "Orders"
  //   })
  // ).unwrap() // Waits for the thunk to resolve successfully
  // .then((Response) => {
  //   console.log("Response==>",Response)
  //   if(Response.data.OrdersByEstab.length==0){
  //     dispatch(clearJunk())
  //     ChangeSelection()
  //   }
  //   setOrders(Response.data || null)
  //   setSelectedOrder(Response.data?.OrdersByEstab[0]?.Orders[0] || null)
  //   setSelectedEstab(Response.data?.OrdersByEstab[0]?.EstablishmentId || null)
  // })
  }, [AfterCheckout]);


  useEffect(() => {
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);

  return (
    <>
   {orders?
      <div className="Overview Wide">
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>(dispatch(clearJunk()),ChangeSelection())}><FaArrowLeft /></div> 
        <label>{orders.CustName}</label>
      </div>
      {!AfterCheckout?
      <div id="OrdersMasterManager">
        
        <div className='Navigation'>
          <div className='OrderNav'>

          {orders.OrdersByEstab.map((opt, index) => (
            <div className={SelectedEstab == opt.EstablishmentId?'Selected':null} onClick={()=>(setSelectedEstab(opt.EstablishmentId),setActiveTab(1))}>{opt.EstabName}</div>
          ))}
          </div>

          {SelectedEstab!=null?
          <div className='OrderNav'>
          {orders.OrdersByEstab.find(e=>e.EstablishmentId == SelectedEstab).Orders.map((opt, index) => (
            <div className={SelectedOrder == opt?'Selected':null} onClick={()=>(setSelectedOrder(opt),setActiveTab(1))}>{opt.Department.Name}</div>
          ))}
          </div>
          :null}

          {SelectedOrder!=null?
          <div className='CardsNav'>
            <div className={ActiveTab == 1?'Selected':null} onClick={()=>(setActiveTab(1),setRefresh(refresh+1))}>Products</div>
            <div className={ActiveTab == 2?'Selected':null}onClick={()=>(setActiveTab(2),setRefresh(refresh+1))}>Services</div>
            <div className={ActiveTab == 3?'Selected':null}onClick={()=>(setActiveTab(3),setRefresh(refresh+1))}>Checkout</div>
          </div>
          :null}

        </div>
        <div className='ListPanel'>
          {SelectedOrder && ActiveTab==1?
          <OrderProducts Orders={orders} SelectedOrder={SelectedOrder} ActiveTab={ActiveTab} refresh={refresh} ChangeSelection={()=>setActiveTab(0)} setMessage={(val)=>setMessage(val)}/>
          :null}
          {SelectedOrder && ActiveTab==2?
          <OrderServices Orders={orders} SelectedOrder={SelectedOrder} ActiveTab={ActiveTab}  refresh={refresh} ChangeSelection={()=>setActiveTab(0)} setMessage={(val)=>setMessage(val)}/>
          :null}
          {SelectedOrder && ActiveTab==3?
          <OrderCheckout Orders={orders} SelectedOrder={SelectedOrder} ActiveTab={ActiveTab}  refresh={refresh} ChangeSelection={()=>setActiveTab(0)} AfterCheckout={()=>setAfterCheckout(true)} setMessage={(val)=>setMessage(val)}/>
          :null}
        </div>
        <div className='MessageCont'>
        {Message?.msg && (
          <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
            {Message.msg}
          </span>
        )}
        </div>
      </div>
      :<div className='AfterSuccess'>
        <label>Successful payment of this order</label>
        <FormButton text={"Select another order"} onClick={()=>SuccessReturn()}/>
      </div>}
      </div>
      :"Loading..."}
    </>

  );

}


