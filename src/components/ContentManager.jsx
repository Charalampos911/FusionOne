import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,DefineRelationships,setEstablishmentId,setDepartmentId } from '../Redux/features/ApiReducer';
import { RiLoaderFill } from "react-icons/ri";
import OrganizationManager from './Managers/OrganizationManager';
import CustomerManager from './Managers/CustomerManager';
import EstablishmentManager from './Managers/EstablishmentManager';
import DepartmentManager from './Managers/DepartmentManager';
import DivisionManager from './Managers/DivisionManager';
import OrdersManager from './Managers/OrdersManager';
import InventoryManager from './Managers/InventoryManager';
import SectorManager from './Managers/SectorManager';
import ServicesManager from './Managers/ServicesManager';
import ProductManager from './Managers/ProductManager';
import SupplyManager from './Managers/SupplyManager';
import PermaProductManager from './Managers/PermaProductManager';
import UsersManager from './Managers/UsersManager';

import HierarchyMenu from './Menus/HierarchyMenu';

export default function ContentManager(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const Device = useSelector((state) => state.Themes.device);
  const [HierarchyTab, setHierarchyTab] = useState(0);
useEffect(() => {
  console.log("HierarchyTab===",HierarchyTab)
 }, [HierarchyTab]);
   useEffect(() => {
    if(Api.Token!=null){
      dispatch(DefineRelationships())
      dispatch(
        apiRequest({
          name: "ContentManager.jsx | Organizations.Query",
          url: "api/Organizations/Query",
          method: "POST",
          body: {},
          auth: true,
          tokenRequired: true,
          storeIn: "Organization"
        })
      );
      if(Api.Token.Roles[0]=="GeneralManager"){
      // Case the user is a General manager, he can only access his one establishment
       dispatch(setEstablishmentId(Api.Token.EstablishmentId))
      }

      if(Api.Token.Roles[0]=="DepartmentManager"){
        // Case the user is a Department manager, he can only access his one department
       dispatch(setEstablishmentId(Api.Token.EstablishmentId))
       dispatch(setDepartmentId(Api.Token.DepartmentId))
      }
      if(Api.Token.Roles[0]=="Admin"){
        // Case the user is an Admin, he can only access his one entire organization
      }
    }
    dispatch(
    apiRequest({
      name: "ContentManager.jsx | GetCustomers",
      url: "api/Customers/Query",
      method: "POST",
      body: {IsBlacklisted:false},
      auth: true,
      tokenRequired: true,
      storeIn: "Customers"
    })
    )
   }, [Api.Token]);
  return (
    <>
    
    <div id='ContentManager'>
      <HierarchyMenu setHierarchyTab={setHierarchyTab}/>
      {Device?<div style={{height:"40px"}}></div>:null}
      {HierarchyTab==0? <OrganizationManager/> : null}
      {Api.Organization!=null?
      <>
      {HierarchyTab==1? <CustomerManager/> : null}
      {HierarchyTab==2? <EstablishmentManager/> : null}
      {HierarchyTab==3? <DepartmentManager/> : null}
      {HierarchyTab==4? <DivisionManager/> : null}
      {HierarchyTab==5? <OrdersManager/> : null}


      {HierarchyTab==6? <InventoryManager/> : null}
      {HierarchyTab==7? <SectorManager/> : null}
      {HierarchyTab==8? <ServicesManager/> : null}
      {HierarchyTab==9? <ProductManager/> : null}
      {HierarchyTab==10? <SupplyManager/> : null}
      {HierarchyTab==11? <PermaProductManager/> : null}

      {HierarchyTab==12? <UsersManager/> : null}
      </>
      :null
      // <div className='Loader'><RiLoaderFill /> <div>please wait...</div></div>
      
      }
    </div>

   
    </>
  );

}


