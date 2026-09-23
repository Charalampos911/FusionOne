import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { CiShoppingTag } from "react-icons/ci";
import { FaCanadianMapleLeaf } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { BiSolidTrashAlt } from "react-icons/bi";
import FormButton from "../../../components/NewUI/FormButton"
// Import the new child component
import OrderCheckout from '../Views/Orders/OrderCheckout';
import { RiMenuFoldFill,RiMenuFold2Fill  } from "react-icons/ri";
import OrderProductItem from '../Views/Orders/OrderProducts/OrderProductItem';

export default function UserOrders() { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [Message, setMessage] = useState(null);
  const [orders, setOrders] = useState(null);
  const [order, setOrder] = useState(null);
  const [currentView, setCurrentView] = useState(1);
  const [reload, setReload] = useState({ counter: 0 });

const [actionsOpen, setActionsOpen] = useState(false);


  // Safe handler to trigger re-fetches
  const triggerReload = () => {
    setReload((prev) => ({
      ...prev,
      counter: prev.counter + 1,
    }));
  };

  useEffect(() => {
    dispatch(
      apiRequest({
        name: "UserOrders.jsx | GetPendingOrdersAsync",
        url: "api/OrdersSU/GetPendingOrdersAsync",
        method: "POST",
        body: { CustomerId: Api.Token.Customer.Id },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Orders==>", Response.data);
      const freshOrders = Response.data || [];
      setOrders([...freshOrders]);

      // Keep active detailed order in sync with updated list data
      setOrder((prevOrder) => {
        if (!prevOrder) return null;
        const matched = freshOrders.find((o) => o.Id === prevOrder.Id);
        return matched ? { ...matched } : null;
      });
    });
  }, [dispatch, Api.Token.Customer.Id, reload]);

  useEffect(() => {
    if (Api.NewApiToUserMessage.msg !== "Success") {
      setMessage(Api.NewApiToUserMessage);
    }
  }, [Api.NewApiToUserMessage]);

  const HRemoveProduct = (OProductId) => {
    dispatch(
      apiRequest({
        name: "UserOrders.jsx | HRemoveProduct",
        url: "api/OrderProductsSU/RemoveSU",
        method: "DELETE",
        body: { 
          CustomerId: Api.Token.Customer.Id,
          Id: OProductId
         },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Orders==>", Response.data);
      const freshOrders = Response.data || [];
      setOrders([...freshOrders]);

      // Keep active detailed order in sync with updated list data
      setOrder((prevOrder) => {
        if (!prevOrder) return null;
        const matched = freshOrders.find((o) => o.Id === prevOrder.Id);
        return matched ? { ...matched } : null;
      });
    });
  };

  const HRemoveService = (OServiceId) => {
    dispatch(
      apiRequest({
        name: "UserOrders.jsx | HRemoveService",
        url: "api/OrderServicesSU/RemoveSU",
        method: "DELETE",
        body: { 
          CustomerId: Api.Token.Customer.Id,
          Id: OServiceId
         },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Orders==>", Response.data);
      const freshOrders = Response.data || [];
      setOrders([...freshOrders]);

      // Keep active detailed order in sync with updated list data
      setOrder((prevOrder) => {
        if (!prevOrder) return null;
        const matched = freshOrders.find((o) => o.Id === prevOrder.Id);
        return matched ? { ...matched } : null;
      });
    });
  };

  return (
    <>
      {order == null ? (
        <div className='Order-List'>
          <label>Orders</label>
          {orders && orders.map((ord, index) => (
            <div key={ord.Id || index} className='Item' onClick={() => setOrder(ord)}>
              <div>{ord.EstablishmentName} - {ord.DepartmentName}</div>
              <div className='Sums'>
                <div><CiShoppingTag />{ord.OrderProducts.length}</div>
                <div><FaCanadianMapleLeaf />{ord.OrderServices.length}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='Order-Details'>
          <label>Order No: {order.Id}</label><br/>
          <div><h4>{order.EstablishmentName} - {order.DepartmentName}</h4>

          {(currentView === 1 || currentView === 2) && (
              <div className='Actions-cont'>

              {actionsOpen?
             <>
                <RiMenuFoldFill onClick={()=>setActionsOpen(false)}/>

                <div className='Actions'>
                  <FormButton text={"order cart products"} onClick={()=>HSyncOrderProducts(Api.Token.OrganizationId, Api.Token.Customer.Id, order.Id, triggerReload, dispatch, apiRequest)}/>
                  <FormButton text={"order cart services"} onClick={()=>HConfirmAllOrdeServices(Api.Token.OrganizationId, Api.Token.Customer.Id, order.Id, triggerReload, dispatch, apiRequest)}/>
                  <FormButton text={"order both"} onClick={()=>HOrderTheEntireCart(Api.Token.OrganizationId, Api.Token.Customer.Id, order.Id, triggerReload, dispatch, apiRequest)}/>
                  <FormButton text={"Checkout"} onClick={()=>setCurrentView(3)}/>

                </div>
                </>

                
                :
                <RiMenuFold2Fill  onClick={()=>setActionsOpen(true)}/>
                }
              </div>
          )}
          </div>


          <div className='switch'>
            <div className={`${currentView === 1 ? 'selected' : ''}`} onClick={() => setCurrentView(1)}>
              <CiShoppingTag /> Products
            </div>
            <div className={`${currentView === 2 ? 'selected' : ''}`} onClick={() => setCurrentView(2)}>
              <FaCanadianMapleLeaf /> Services
            </div>
          </div>

          {currentView === 1 && (
            <div className='Prod-list'>
              {order.OrderProducts.map((OProd, index) => (
                <OrderProductItem
                  key={OProd.Id || index}
                  OProd={OProd}
                  currency={order.currency}
                  departmentId={order.DepartmentId}
                  HRemoveProduct={HRemoveProduct}
                  reload={triggerReload}
                />
              ))}

            </div>
          )}

          {currentView === 2 && (
            <div className='Prod-list'>
              {order.OrderServices.map((OServ, index) => (
                <div key={OServ.Id || index} className='Order-product'>
                  <div>{OServ.ServiceName}</div>

                  <div>{OServ.StartDate.split('T')[0]} at {OServ.StartDate.split('T')[1]?.slice(0, 5)} - {OServ.AppointmentStatusName}</div>

                  <div><GiSandsOfTime /> {OServ.Duration}' - {OServ.Price} {order.currency}</div>
                  <BiSolidTrashAlt onClick={() => HRemoveService(OServ.Id)} />
                </div>
              ))}
            </div>
          )}

            {currentView === 3 && (
              <div>
                <OrderCheckout SelectedOrder={order} AfterCheckout={()=>setCurrentView(1)}/>
              </div>
            )}

        </div>
      )}
    </>
  );
}

const HSyncOrderProducts = (orgId, CustId, orderId, triggerReload, dispatch, apiRequest) => {
  dispatch(
    apiRequest({
      name: "UserOrders.jsx | GetPendingOrdersAsync",
      url: "api/OrdersSU/SyncEntireOrdeProductsSU",
      method: "POST",
      body: {
        OrganizationId: orgId,
        CustomerId: CustId,
        OrderId: orderId
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ).unwrap() 
  .then((Response) => {
    console.log("Orders==>", Response.data);
    triggerReload();
  });
};


const HConfirmAllOrdeServices = (orgId, CustId, orderId, triggerReload, dispatch, apiRequest) => {
  dispatch(
    apiRequest({
      name: "UserOrders.jsx | GetPendingOrdersAsync",
      url: "api/OrdersSU/ConfirmAllOrdeServicesSU",
      method: "POST",
      body: {
        OrganizationId: orgId,
        CustomerId: CustId,
        OrderId: orderId
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ).unwrap() 
  .then((Response) => {
    console.log("Orders==>", Response.data);
    triggerReload();
  });
};


const HOrderTheEntireCart = (orgId, CustId, orderId, triggerReload, dispatch, apiRequest) => {
  dispatch(
    apiRequest({
      name: "UserOrders.jsx | GetPendingOrdersAsync",
      url: "api/OrdersSU/OrderTheEntireCart",
      method: "POST",
      body: {
        OrganizationId: orgId,
        CustomerId: CustId,
        OrderId: orderId
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ).unwrap() 
  .then((Response) => {
    console.log("Orders==>", Response.data);
    triggerReload();
  });
};