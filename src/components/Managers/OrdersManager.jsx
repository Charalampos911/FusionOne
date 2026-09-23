import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,clearJunk} from '../../Redux/features/ApiReducer';


import OrdersByCustomer from '../Forms/OrdersManager/OrdersByCustomer';
import ReturnsByCustomer from '../Forms/ReturnsManager/ReturnsByCustomer';
import NewOrder from '../Forms/OrdersManager/NewOrder';


export default function OrdersManager(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [activeTab, setActiveTab] = useState(0);
  const isCreate = Api.Organization == null;
  useEffect(() => {
    dispatch(clearJunk())
  }, [activeTab]);

  if(Api.Token.Roles[0]!="Admin" && Api.Token.Roles[0]!="GeneralManager" && Api.Token.Roles[0]!="DepartmentManager") return;

  return (
    <>
        {activeTab==0?
         <div className="DirectionPage">
        <div className="Directions">
          <div className="DButton" onClick={() => setActiveTab(1)}>New order</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>Orders by Customer</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>Returns by Customer</div>
        </div>
        </div>
        :null}
        
        {activeTab==1? <NewOrder ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? <OrdersByCustomer ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==3? <ReturnsByCustomer ChangeSelection={()=> setActiveTab(0)}/> :null}


        
    </>
  );

}


