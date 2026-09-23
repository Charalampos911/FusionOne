import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from '../../NewUI/QuerySelect'
import ReturnsMasterManager from './ReturnsMasterManager'

import FormButton from '../../NewUI/FormButton'


export default function ReturnsByCustomer(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [selectedOrder, setSelectedOrder] = useState(false);

  const [ActiveTab, setActiveTab] = useState(0);

  const [Customers, setCustomers] = useState(null);
  const [Customer, setCustomer] = useState(null);
  const [PaidOrders, setPaidOrders] = useState(null);


  useEffect(() => {
    dispatch(clearOrders())
    setPaidOrders(null)
    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Customers/Query",
        url: "api/Customers/Query",
        method: "POST",
        body: {OrganizationId:Api.Token.OrganizationId, IsBlacklisted:false},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Response==>",Response)
        setCustomers(Response.data)
    })
  }, []);
const HCustomer=(val)=>{
  setCustomer(val)
  if(val==null) dispatch(clearOrders())
  dispatch(
    apiRequest({
      name: "QueryOrderSelect.jsx | OrdersByCutsomer 111",
      url: "api/Orders/PaidOrdersByCustomer",
      method: "POST",
      body: {CustomerId:val.Id},
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  ) .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Response==>",Response)
        setPaidOrders(Response.data)
    })


}
  return (
    <>
    {ActiveTab==0?
    <div className="Overview">
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>ActiveTab==0?props.ChangeSelection():setActiveTab(0)}><FaArrowLeft /></div> 
        <label>{ActiveTab==0?"Returns by customer":"Returns manager"}</label>
      </div>
      <div id='QueryOrderSelect'>
        <QuerySelect 
          isDynamic={true}
          optionsArray={Customers? Customers:[]}
          placeholder="Customers"
          setValue={(val) => (HCustomer(val!=null?val:null))}
          zIndex={1}
        />


        {PaidOrders && PaidOrders?.NumberOrders >0?
        <>
          <div className='OrderCard' onClick={()=>setActiveTab(1)}>
              <div>
                <div><span>Completed orders:</span><span>{PaidOrders?.NumberOrders}</span></div>
              </div>
          </div>

        </>
        :Api.PaidOrders?.NumberOrders==0?
          <div style={{overflow: 'visible'}}> 
            <div className='NoOrdersFound'>No orders found</div>
          </div>
          :
          <span>Select a customer!!!</span>}
      </div>
      
    </div>

    :
      <ReturnsMasterManager 
        Customer={Customer?.Id} 
        ChangeSelection={() => setActiveTab(0)} 
      />
      }
  </>
  );

}


