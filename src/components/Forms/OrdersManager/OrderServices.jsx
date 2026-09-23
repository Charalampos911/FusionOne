import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders,clearOrderServices,ResetMsg } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from '../../NewUI/QuerySelect'
import { CiCircleRemove } from "react-icons/ci";
import Create from "../../../assets/create.png";
import Update from "../../../assets/update.png";
import NewOrderService from "./NewOrderService";
import UpdateDateOrderService from "./UpdateDateOrderService";
import UpdateStatusOrderService from "./UpdateStatusOrderService";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlinePendingActions } from "react-icons/md";
import AssignEmployeeOrderService from './AssignEmployeeOrderService';

import { TbProgressDown } from "react-icons/tb";
import { GrCompliance } from "react-icons/gr";

import { MdOutlineDeleteForever } from "react-icons/md";
export default function OrderServices({Orders,SelectedOrder,ActiveTab,refresh ,ChangeSelection,setMessage}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  console.log("");
  console.log("SelectedOrder===",SelectedOrder);
  console.log("");
  console.log("orders===",Orders.Orders);
 const [order, setOrder] = useState(null);
    console.log("order===",order);
  const [OrderServices, setOrderServices] = useState(null);
  const [OrderInputServices, setOrderInputServices] = useState(null);
  const [FiatReceipts, setFiatReceipts] = useState(null);
  const [CryptoReceipt, setCryptoReceipt] = useState(null);
  const [SelectedItem, setSelectedItem] = useState(null);
  const [NewProduct, setNewProduct] = useState(null);
  const [Redirect, setRedirect] = useState(0);
  const [Services, setServices] = useState(null);

  const [ServiceStatuses, setServiceStatuses] = useState(null);




  useEffect(() => {
      dispatch(
        apiRequest({
          flatten: true,
          name: "UpdateStatusOrderService.jsx | GetServiceStatuses",
          url: "api/Enumerals/GetEnum/ServiceStatus",
          method: "GET",
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap() // Waits for the thunk to resolve successfully
        .then((ResponseA) => {
          console.log("Response==> 9776t",ResponseA)
          setServiceStatuses(ResponseA.data)
        });
  }, []);


  useEffect(() => {
    if(ActiveTab!=2) return;
    setRedirect(0)
    dispatch(
    apiRequest({
      name: "OrderServices.jsx | useEffect",
      url: "api/Services/Query",
      method: "POST",
      body: {
        DepartmentId: SelectedOrder.DepartmentId
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    }))
    .unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
      console.log("Response.Services==>",Response)
      setServices(Response.data)
    })
  }, [ActiveTab,SelectedOrder,refresh]);

  useEffect(() => {
    dispatch(ResetMsg())
    var NewOrder = Orders.OrdersByEstab[0]?.Orders.find(o => o.Id === SelectedOrder.Id) || null;
    setOrder(NewOrder)


  GetTheCurrentOrderServices(SelectedOrder,apiRequest,dispatch,setOrderServices)


  }, [ActiveTab,SelectedOrder,Orders,Redirect]);


  










  return (
    <>
      {Redirect == 0 ? (
        <div id="OrderServices">
          <div className="OrderList">
            {OrderServices &&
              OrderServices.map((item, index) => (
                <div
                  className={`Item OrderService ${SelectedItem === item ? "Selected" : ""}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div>
                    <span>Name:</span>
                    <span>{item.Service.Name}</span>
                  </div>
                  <div>
                    <span>Description:</span>
                    <span>{item.Service.Description}</span>
                  </div>
                  <div>
                    <div>
                      <span>Date:</span>
                      <span>{item.StartDate.split('T')[0]}</span>
                      <span>Time:</span>
                      <span>{item.StartDate.split('T')[1].slice(0, 5)}"</span>
                    </div>
                    <div>
                      <span>Division:</span>
                      <span>{item.Division?.Name}</span>
                      <span>Floor:</span>
                      <span>{item.Division?.FloorNumber}"</span>
                    </div>
                  </div>
                  <div>
                    <span>Duration:</span>
                    <span>{item.Service.DurationMinutes}'</span>
                    <span>Price:</span>
                    <span>{item.Service.Price} €</span>
                    <span>Status:</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {/* Render the Text */}
                      {ServiceStatuses?.find(status => status[1] === item.AppointmentStatus)?.[0] || 'Unknown'}
                      {/* Render the Icon */}
                      {(() => {
                        switch (item.AppointmentStatus) {
                          case 0: return <div className='StatusIcons pending'><MdOutlinePendingActions  /></div>;
                          case 1: return <div className='StatusIcons inprocess'><TbProgressDown /></div>;
                          case 2: return <div className='StatusIcons completed'><GrCompliance /></div>;
                          case 3: return <div className='StatusIcons confirmed'><GiConfirmed /></div>;
                          default: return null;
                        }
                      })()}
                      
                    
                      
                    </span>

                  </div>
                  <div
                    onClick={() => HRem(item.Id,SelectedOrder, dispatch, apiRequest,setOrderServices,item.AppointmentStatus!=2?"Remove":"MasterRemove")}
                  >
                    {item.AppointmentStatus!=2?
                    <CiCircleRemove />
                    :<MdOutlineDeleteForever />} 
                  </div>
  
                </div>
              ))}
          
          <div className="Actions">
            <div onClick={() => setRedirect(1)}>Add</div>
            {SelectedItem != null ? (
              <>
                <div onClick={() => setRedirect(2)}>Date update</div>
                <div onClick={() => setRedirect(3)}>Status update</div>
                <div onClick={() => setRedirect(4)}>Assign employee</div>
              </>
            ) : null}
          </div>
          </div>
        </div>
      ) : null}
      {Redirect == 1 ? (
        <NewOrderService
          Services={Services}
          SelectedOrder={SelectedOrder}
          ChangeSelection={() => setRedirect(0)}
        />
      ) : null}
      {Redirect == 2 ? (
        <UpdateDateOrderService
          OrderService={SelectedItem}
          Services={Services}
          SelectedOrder={SelectedOrder}
          ChangeSelection={() => setRedirect(0)}
        />
      ) : null}
      {Redirect == 3 && ServiceStatuses? (
        <UpdateStatusOrderService
        ServiceStatuses={ServiceStatuses}
          OrderService={SelectedItem}
          Services={Services}
          SelectedOrder={SelectedOrder}
          ChangeSelection={() => setRedirect(0)}
        />
      ) : null}
      {Redirect == 4 && ServiceStatuses? (
        <AssignEmployeeOrderService
          OrderService={SelectedItem}
          ChangeSelection={() => setRedirect(0)}
        />
      ) : null}
    </>
  );

}
const HRem =(item,SelectedOrder,dispatch,apiRequest,setOrderServices,Type)=>{
    dispatch(
    apiRequest({
      name: "OrderServices.jsx | HRem",
      url: "api/OrderServices/"+type,
      method: "DELETE",
      body: {
        Id: item,
      },
      auth: true,
      tokenRequired: true,
      storeIn: "OrderServices"
    })
  )
  .unwrap() 
  .then(() => {
    
      OrdersByCustomer(SelectedOrder,apiRequest,dispatch,setOrderServices)
      setSelectedItem(null)
      setManualRefresh(ManualRefresh+1)
  })
}


const OrdersByCustomer =(SelectedOrder,apiRequest,dispatch,setOrderServices)=>{

  dispatch(
    apiRequest({
      name: "QueryOrderSelect.jsx | OrdersByCutsomer",
      url: "api/Orders/OrdersByCustomer",
      method: "POST",
      body: {CustomerId:SelectedOrder.CustomerId},
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })
  )  
  GetTheCurrentOrderServices(SelectedOrder,apiRequest,dispatch,setOrderServices)
}


// GetTheCurrentOrderServices(SelectedOrder,apiRequest,dispatch,setOrderServices)
const GetTheCurrentOrderServices=(SelectedOrder,apiRequest,dispatch,setOrderServices)=>{

  dispatch(
    apiRequest({
      name: "OrderProducts.jsx | HInc",
      url: "api/OrderServices/CustomerOrdersOrderServicesList",
      method: "POST",
      body: {
        OrderId: SelectedOrder.Id
      },
      auth: true,
      tokenRequired: true,
      storeIn:null
    })
  )
    .unwrap() // Waits for the thunk to resolve successfully
      .then((Response) => {
        console.log("OrderServices===>",Response.data)
      setOrderServices(Response.data)
    })
}