import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearTenantUsers } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft , FaChevronLeft, FaChevronRight, FaChevronDown,FaChevronUp ,FaLock,FaLockOpen } from "react-icons/fa";
export default function ManagersByAttribute({Body}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  

const [tenantUsers, setTenantUsers] = useState(null);
const [tenantUser, setTenantUser] = useState(null);

  useEffect(() => {


    // dispatch(apiRequest({
    //   url: "api/Auth/Tenant/Users",
    //   method: "POST",
    //   body: Body,
    //   storeIn: "TenantUsers",
    //   auth: true, 
    //   tokenRequired: true
    // })).unwrap() // Waits for the thunk to resolve successfully
    //     .then((Response) => {
    //       console.log("TenantUsers===>",Response.data)
    //        setTenantUsers(Response.data)
    //     });


  console.log("ManagersByAttribute.Body===>",Body)
      dispatch(apiRequest({
         name: "CreateManager.jsx | Departments",
        url:"api/Auth/Tenant/Users",
        method: "POST",
        body: Body, 
        storeIn:null ,
        auth: true,
        tokenRequired: true,
      }))
      .unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("TenantUsers===>",Response.data)
           setTenantUsers(Response.data)
        })
      ;





  }, [Body]);

  const HToggle=(item)=>{
  console.log("HToggle.item=",item)
 var Id = item.Id ;
 var Roles = item.Roles[0] ;
  var EstablishmentId = item.EstablishmentId ;
   var DepartmentId = item.DepartmentId ;



    const body = {
      ...(Id ? { Id  } : {}),
      ...(Roles? { Roles } : {}),
      ...(EstablishmentId ? { EstablishmentId } : {}),
      ...(DepartmentId ? { DepartmentId } : {})
    };
    dispatch(apiRequest({
      name: "CreateManager.jsx | HToggle",
      url: "api/Auth/Tenant/ActiveUserToggle",
      method: "POST",
      body: body,
      storeIn:null,
      auth: true, 
      tokenRequired: true
      }))
      .unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("ActiveUserToggle.TenantUsers===>",Response.data)
           setTenantUsers(Response.data)
        })

  }
  return (
    <div id='ManagersByAttribute'>
      <div className='TenantUsersSelect'>
        <div className='subCategory'>
          <div className="ChangeSelection" onClick={()=>props.ChangeSelection()} ><FaArrowLeft /></div>
          <div className='subCategoryTitle'>Application users</div>
        </div>
        <div className='FlatSelect LargeFlat'>
        { tenantUsers && tenantUsers.map(item => 
          <div onClick={()=>setTenantUser(item)}>
            <div>
              <span>User role:</span>
              <span>Full name:</span>
              <span>Username: </span>
            </div>
            <div>
              <span>{item.DisplayName}</span>
              <span>{item.FullName}</span>
              <span>{item.Username}</span>
            </div>
            <div className='Lock' onClick={()=>HToggle(item)}> {item.IsActive? <FaLockOpen />:<FaLock/>}</div>
          </div>
        )}
        </div>
      </div>
    </div>
  );

}


