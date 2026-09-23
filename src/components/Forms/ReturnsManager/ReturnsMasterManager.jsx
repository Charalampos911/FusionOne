import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, clearJunk, ResetMsg } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import ReturnProducts from './ReturnProducts';
import ReturnServices from './ReturnServices';
import ReturnCheckout from './ReturnCheckout';
import { GiClick } from "react-icons/gi";
import { PiCirclesFourLight } from "react-icons/pi";
import { FiCopy ,FiCheck} from "react-icons/fi";

export default function ReturnsMasterManager({ Customer, ChangeSelection }) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [orders, setOrders] = useState(null);
  const [SelectedEstab, setSelectedEstab] = useState(null);
  const [SelectedOrder, setSelectedOrder] = useState(null);
  const [ActiveTab, setActiveTab] = useState(0);
  const [ActiveView, setActiveView] = useState(0);
  const [AfterCheckout, setAfterCheckout] = useState(0);
  const [PaidOrders, setPaidOrders] = useState(false);
const [copied, setCopied] = useState(false);
  // --- NEW: Global States for holding selected return packages ---
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const handleCopy = () => {
      if (!SelectedOrder?.Id) return;
      navigator.clipboard.writeText(SelectedOrder.Id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  // Reset return states whenever the user changes or deselects the current order
  useEffect(() => {
    setSelectedProducts([]);
    setSelectedServices([]);
    setActiveTab(1); // Default to products view when an order opens
  }, [SelectedOrder]);

  useEffect(() => {
    dispatch(ResetMsg());
    dispatch(
      apiRequest({
        name: "ReturnsMasterManager.jsx | PaidOrdersByCustomer",
        url: "api/Orders/PaidOrdersByCustomer",
        method: "POST",
        body: { CustomerId: Customer },
        auth: true,
        tokenRequired: true,
        storeIn: "PaidOrders"
      })
    ).unwrap()
    .then((Response) => {
      setPaidOrders(Response.data);
      setOrders(Response.data || null);
    });
  }, [Customer, dispatch]);

  useEffect(() => {
    if(AfterCheckout==0)return;
    dispatch(ResetMsg());
    dispatch(
      apiRequest({
        name: "ReturnsMasterManager.jsx | PaidOrdersByCustomer",
        url: "api/Orders/PaidOrdersByCustomer",
        method: "POST",
        body: { CustomerId: Customer },
        auth: true,
        tokenRequired: true,
        storeIn: "PaidOrders"
      })
    ).unwrap()
    .then((Response) => {
      if (Response.data.OrdersByEstab.length === 0) {
        dispatch(clearJunk());
        ChangeSelection();
      }
      setOrders(Response.data || null);
    });
  }, [AfterCheckout, Customer, dispatch, ChangeSelection]);

  useEffect(() => {
    if (SelectedEstab == null) setActiveView(0);
    if (SelectedEstab != null) setActiveView(1);
  }, [SelectedEstab]);

  useEffect(() => {
    if (SelectedOrder == null && SelectedEstab != null) setActiveView(1);
    if (SelectedOrder != null) setActiveView(2);
  }, [SelectedOrder]);

  return (
    <>
      {PaidOrders ? (
        <div className="Overview Wide">
          <div className='Overview-head'>     
            <div className="ChangeSelection" onClick={() => (dispatch(clearJunk()), ChangeSelection())}><FaArrowLeft /></div> 
            <label>{PaidOrders.CustName}</label>
          </div>
          <div id="Cancellations">
            {ActiveView === 0 ? (
              <div className='OrderNav'>
                {PaidOrders.OrdersByEstab.map((opt, index) => (
                  <div key={index} className={SelectedEstab === opt ? 'Selected' : null} onClick={() => setSelectedEstab(opt)}>
                    <span>{opt.EstabName}</span>
                    <span>{opt.OnlineCode}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {ActiveView !== 0 && SelectedEstab != null ? (
              <div className="Path">
                <div><GiClick /></div>
                <div onClick={() => setSelectedEstab(null)}>{SelectedEstab.EstabName} - {SelectedEstab.OnlineCode}</div>
        
                <div onClick={() => setSelectedOrder(null)}>{SelectedOrder != null && ( <><PiCirclesFourLight /> {SelectedOrder.Id.slice(0, 3)}***${SelectedOrder.Id.slice(-3)}</>)}</div>
              
              {SelectedOrder != null?
              <>
                {copied ? <FiCheck style={{ color: '#22c55e' }} /> : 
                <FiCopy 
                  style={{ cursor: 'pointer' }}
                  onClick={handleCopy}
                  title="Copy full ID"
                />}
              </>
              :null}
     {/* <span 
      onClick={handleCopy}
      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      title="Click to copy full ID"
    >
      {`${selectedOrder.Id.slice(0, 3)}***${selectedOrder.Id.slice(-3)}`}
      {copied ? <FiCheck style={{ color: '#22c55e' }} /> : <FiCopy />}
    </span> */}
                <div onClick={() => setActiveTab(1)}>{ActiveTab === 1 && ( <><PiCirclesFourLight /> Products</>)}</div>
             
                <div onClick={() => setActiveTab(2)}>{ActiveTab === 2  && ( <><PiCirclesFourLight /> Services</>)}</div>
         
                <div onClick={() => setActiveTab(3)}>{ActiveTab === 3  && ( <><PiCirclesFourLight /> Checkout</>)}</div>
                
              </div>
            ) : null}

            {ActiveView === 1 && SelectedEstab != null ? (
              <div className='DeptSelect'>
                {PaidOrders.OrdersByEstab.find(e => e.EstablishmentId === SelectedEstab.EstablishmentId).Orders.map((opt, index) => {
                  const productsTotal = opt.OrderProducts.reduce((sum, prod) => sum + (prod.Quantity * prod.Price), 0);
                  const servicesTotal = opt.OrderServices.reduce((sum, service) => {
                    const discountedPrice = service.Price - (service.Price * (service.Discount || 0));
                    return sum + discountedPrice;
                  }, 0);
                  const grandTotal = productsTotal + servicesTotal;

                  return (
                    <div 
                      key={index} 
                      className={SelectedOrder === opt ? 'Selected' : ''} 
                      onClick={() => setSelectedOrder(opt)}
                    >
                      <div>
                        <span>Department:</span>
                        <span>Order products:</span>
                        <span>Order services:</span>
                        <span>Completed at:</span>
                        <span>Grand total: $</span>
                      </div>
                      <div>
                        <span> {opt.Department.Name}</span>
                        <span> {opt.OrderProducts.length}</span>
                        <span> {opt.OrderServices.length}</span>
                        <span> {opt.CompletedAt.split('T')[0]}</span>
                        <span> {grandTotal.toFixed(2)}</span> 
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {ActiveView === 2 ? (
              <>
                <div className='CardsNav'>
                  <div className={ActiveTab === 1 ? 'Selected' : null} onClick={() => setActiveTab(1)}>
                    Products ({selectedProducts.length})
                  </div>
                  <div className={ActiveTab === 2 ? 'Selected' : null} onClick={() => setActiveTab(2)}>
                    Services ({selectedServices.length})
                  </div>
                  <div className={ActiveTab === 3 ? 'Selected' : null} onClick={() => setActiveTab(3)}>
                    Checkout ({selectedProducts.length + selectedServices.length})
                  </div>
                </div>

                <div className='ReturnsPanel'>
                  {SelectedOrder && ActiveTab === 1 ? (
                    <ReturnProducts 
                      SelectedOrder={SelectedOrder} 
                      selectedProducts={selectedProducts}
                      ActiveTab={ActiveTab} 
                      onReturnChange={(items) => setSelectedProducts(items)} 
                    />
                  ) : null}
                  {SelectedOrder && ActiveTab === 2 ? (
                    <ReturnServices 
                      SelectedOrder={SelectedOrder} 
                      ActiveTab={ActiveTab} 
                      
                      onReturnChange={(items) => setSelectedServices(items)} 
                      setMessage={(val) => setMessage(val)}
                    />
                  ) : null}
                  {SelectedOrder && ActiveTab === 3 ? (
                    <ReturnCheckout 
                     
                      selectedProducts={selectedProducts}
                      selectedServices={selectedServices}
                       SelectedOrder={SelectedOrder}  
                      AfterCheckout ={(e) =>     
                        dispatch(
                          apiRequest({
                            name: "ReturnsMasterManager.jsx | PaidOrdersByCustomer",
                            url: "api/Orders/PaidOrdersByCustomer",
                            method: "POST",
                            body: { CustomerId: Customer },
                            auth: true,
                            tokenRequired: true,
                            storeIn: "PaidOrders"
                          })
                        ).unwrap()
                        .then((Response) => {
                          if (Response.data.OrdersByEstab.length === 0) {
                            dispatch(clearJunk());
                            ChangeSelection();
                          }
                          setOrders(Response.data || null);
                          setSelectedOrder(null)
                        })} 
    

                    />
                  ) : null}
                </div>
              </>
            ) : null}


          </div>
        </div>
      ) : "Loading..."}
    </>
  );
}