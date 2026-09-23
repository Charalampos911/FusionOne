import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOrders } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from '../../NewUI/QuerySelect'
import OrdersMasterManager from './OrdersMasterManager'
import NewOrder from './NewOrder'

import FormButton from '../../NewUI/FormButton'


export default function OrdersByCustomer(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [ActiveTab, setActiveTab] = useState(0);

  const [Customers, setCustomers] = useState(null);
  const [Customer, setCustomer] = useState(null);


const ClearComponent = () =>{

setActiveTab(0)
setCustomers(null)
setCustomer(null)
dispatch(clearOrders())
}


  useEffect(() => {
    dispatch(clearOrders())
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
      url: "api/Orders/OrdersByCustomer",
      method: "POST",
      body: {CustomerId:val.Id},
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })
  )


}
  return (
    <>
    {ActiveTab==0?
    <div className="Overview">
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>ActiveTab==0?props.ChangeSelection():setActiveTab(0)}><FaArrowLeft /></div> 
        <label>{ActiveTab==0?"Orders by customer":"Orders manager"}</label>
      </div>
      <div id='QueryOrderSelect'>
        <QuerySelect 
          isDynamic={true}
          optionsArray={Customers? Customers:[]}
          placeholder="Customers"
          setValue={(val) => (HCustomer(val!=null?val:null))}
          zIndex={1}
        />


        {Api.Orders && Api.Orders?.NumberOrders >0?
        <>
          <div className='OrderCard' onClick={()=>setActiveTab(1)}>
              <div>
                <div><span>Orders:</span><span>{Api.Orders?.NumberOrders}</span></div>
                <div><span>Products:</span><span>{Api.Orders?.NumberProducts}</span></div>
                <div><span>Services:</span><span>{Api.Orders?.NumberServices}</span></div>
              </div>
              <div className='GrandTotal'><span>Grand total:</span><span>{Api.Orders?.GrandTotal} €</span></div>

          </div>

        </>
        :Api.Orders?.NumberOrders==0 && Customer!=null?
          <div style={{overflow: 'visible'}}> 
            <div className='NoOrdersFound'>No orders found</div>
            <FormButton text={"Create an order"} onClick={()=>setActiveTab(2)}/>
          </div>
          :
          <span>Select a customer!!!</span>}
      </div>
      
    </div>

    :null}

{ActiveTab === 1 ? (() => {
    console.log("444 Customer.Id==", Customer.Id);
    return (
      <OrdersMasterManager 
        Customer={Customer.Id} 
        ChangeSelection={() => setActiveTab(0)} 
        SuccessReturn={()=>ClearComponent()}
      />
    );
})() : null}
    {ActiveTab==2?
    <NewOrder ChangeSelection={()=> (setActiveTab(0),setCustomer(null))} preVal={Customer}/>
    :null}
  </>
  );

}


