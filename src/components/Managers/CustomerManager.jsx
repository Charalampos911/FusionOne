import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,clearJunk} from '../../Redux/features/ApiReducer';


import CustomerEditor from '../Forms/CustomerManager/CustomerEditor';
import NewCustomer from '../Forms/CustomerManager/NewCustomer';
import ClerkEditor from '../Forms/CustomerManager/ClerkEditor';
import BankCardsEditor from '../Forms/CustomerManager/BankCardsEditor';
import IdDocumentsEditor from '../Forms/CustomerManager/IdDocumentsEditor';
export default function CustomerManager(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [activeTab, setActiveTab] = useState(0);
  const isCreate = Api.Organization == null;
  useEffect(() => {
    dispatch(clearJunk())
  }, [activeTab]);

   if(Api.Token.Roles[0]=="CentralAccountant" || Api.Token.Roles[0]=="Online" || Api.Token.Roles[0]=="LocalAccountant") return;
  return (
    <>
        {activeTab==0?
         <div className="DirectionPage">
        <div className="Directions">
          {Api.Token.Roles[0]!="InventoryClerk"?
          <>
          <div className="DButton" onClick={() => setActiveTab(1)}>Customer Editor</div>
          <div className="DButton" onClick={() => setActiveTab(2)}>New customer</div>
          <div className="DButton" onClick={() => setActiveTab(3)}>New customer and order</div>

          <div className="DButton" onClick={() => setActiveTab(4)}>Documents Editor</div>
          <div className="DButton" onClick={() => setActiveTab(5)}>Cards Editor</div>
          </>
          :
          <div className="DButton" onClick={() => setActiveTab(6)}>Customer Editor - Clerk</div>
          }
          </div>
        </div>
        :null}
        {activeTab==1? <CustomerEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==2? 
        
                  <NewCustomer 
                  Title="Create a customer"
                  ChangeSelection={()=>setActiveTab(0)}
                  EstablishmentId ={Api.EstablishmentId || null}
                  DepartmentId ={Api.DepartmentId || null}
                  CreateOrder ={false}
                  NewCustomer={()=>null}
                  />
        :null}
        {activeTab==3? 
        
                  <NewCustomer 
                  Title="Create a customer and order"
                  ChangeSelection={()=>setActiveTab(0)}
                  EstablishmentId ={Api.EstablishmentId || null}
                  DepartmentId ={Api.DepartmentId || null}
                  CreateOrder ={true}
                  NewCustomer={()=>null}
                  />
        :null}
        
        {activeTab==4? <IdDocumentsEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==5? <BankCardsEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
        {activeTab==6? <ClerkEditor ChangeSelection={()=> setActiveTab(0)}/> :null}
    </>
  );

}


