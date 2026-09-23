import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import UniversalEditor from '../UniversalEditor';

import DynamicInput from '../../UI/DynamicInput';
import QuerySelect from '../../NewUI/QuerySelect';
import FormsSelect from '../../NewUI/FormsSelect';
import FormInput from '../../NewUI/FormInput';
import FormButton from '../../NewUI/FormButton';
import Messaging from '../../NewUI/Messaging';

import { FaArrowLeft } from "react-icons/fa";
import OrdersMasterManager from '../OrdersManager/OrdersMasterManager';
export default function NewCustomer({
  Title,
  ChangeSelection,
  EstablishmentId,
  DepartmentId,
  CreateOrder,
  NewCustomer
}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [ElementTitle, setElementTitle] = useState(Title || "Create a customer");
  const [ActiveTab, setActiveTab] = useState(0);
  const [Message, setMessage] = useState(null);
  // const [NewCustomer, setNewCustomer] = useState(null);
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");

  const [UserEstablishment, setUserEstablishment] = useState(EstablishmentId || null);
  const [UserDepartment, setUserDepartment] = useState(DepartmentId || null);
  const [UserNewCustomer, setUserNewCustomer] = useState(null);

  const [Establishments, setEstablishments] = useState(null);
  const [Departments, setDepartments] = useState(null);
  
console.log("EstablishmentId 222 ===",EstablishmentId)

console.log("DepartmentId 222 ===",DepartmentId)

console.log("CreateOrder 222 ===",CreateOrder)

  useEffect(() => {
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);



useEffect(() => {
  if(EstablishmentId != null) return; 
    dispatch(
      apiRequest({
        name: "NewCustomer.jsx | Establishments/Query",
        url: "api/Establishments/Query",
        method: "POST",
        body: {},
        auth: true,
        tokenRequired: true,
        storeIn: "Establishments"
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setEstablishments(Response.data)
        })
}, []);

  useEffect(() => {
    if(UserEstablishment==null) return;
    dispatch(
      apiRequest({
        name: "NewCustomer.jsx | Departments/Query",
        url: "api/Departments/Query",
        method: "POST",
        body: {EstablishmentId:UserEstablishment},
        auth: true,
        tokenRequired: true,
        storeIn: "Departments"
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==44>",Response)
           setDepartments(Response.data)
        })
   }, [UserEstablishment]);

  return (
    <>
    {ActiveTab==0?
      <div className="Overview">
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>ChangeSelection()}><FaArrowLeft /></div> 
        <label><span>{ElementTitle}</span></label>
      </div>
    
    <div id='NewCustomer'>
      {EstablishmentId == null && CreateOrder?
         <QuerySelect 
           isDynamic={true}
           optionsArray={Establishments? Establishments:[]}
           placeholder="Establishments"
           setValue={(val) => setUserEstablishment(val.Id)}
           zIndex={2}
         />

      // <FormsSelect
      //   ElValue={null}
      //   placeholder={"Establishments"}
      //   FlatArray={Establishments? Establishments:[]}
      //   ReturnVal={(val) => setUserEstablishment(val)}
      // />

      :null}
      {DepartmentId == null && CreateOrder?
         <QuerySelect 
           isDynamic={true}
           optionsArray={Departments? Departments:[]}
           placeholder="Departments"
           setValue={(val) => setUserDepartment(val.Id)}
           zIndex={1}
         />

      // <FormsSelect
      //   ElValue={null}
      //   placeholder={"Departments"}
      //   FlatArray={Departments? Departments:[]}
      //   ReturnVal={(val) => setUserDepartment(val)}
      // />


      :null}

      <FormInput 
        key={0}
        type="text"
        placeholder="First name"
        ElValue={FirstName ?? ""} 
        ReturnVal={(val) => setFirstName(val)}
      />

      <FormInput 
        key={1}
        type="text"
        placeholder="Last name"
        ElValue={LastName ?? ""} 
        ReturnVal={(val) => setLastName(val)}
      />

      <FormInput 
        key={2}
        type="text"
        placeholder="Phone number"
        ElValue={Phone ?? ""} 
        ReturnVal={(val) => setPhone(val)}
      />

      <FormInput 
        key={3}
        type="text"
        placeholder="Email"
        ElValue={Email ?? ""} 
        ReturnVal={(val) => setEmail(val)}
      />

      <FormButton text={"Create"} onClick={()=>HNewCustomer(UserDepartment,FirstName,LastName,Phone,Email,dispatch,apiRequest,CreateOrder,NewCustomer,setUserNewCustomer,setActiveTab)}/>
      <Messaging ParentMessage={Message} />
    </div>
    </div>
    :null}

    {UserNewCustomer && ActiveTab==1?
  
    <OrdersMasterManager Customer = {UserNewCustomer} ChangeSelection={()=>setActiveTab(0)}/>
    :null}
   </>
  );

}



const HNewCustomer =(UserDepartment,FirstName,LastName,Phone,Email,dispatch,apiRequest,CreateOrder,NewCustomer,setUserNewCustomer,setActiveTab)=>{

  dispatch(
    apiRequest({
      name: "NewCustomer.jsx | Customers.FormCreate",
      url: "api/Customers/FormCreate",
      method: "POST",
      body: {
        FirstName:FirstName,
        LastName:LastName,
        Phone:Phone,
        Email:Email
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  )
  .unwrap() // Waits for the thunk to resolve successfully
  .then((ResponseA) => {
    console.log("ResponseA==>",ResponseA)
    console.log("CreateOrder==>",CreateOrder)
    if(CreateOrder){
      dispatch(
        apiRequest({
          name: "NewCustomer.jsx | Customers.FormCreate",
          url: "api/Orders/Create",
          method: "POST",
          body: {
            DepartmentId:UserDepartment,
            OrderOrigin:0,
            CustomerId:ResponseA.data.Id,
            Notes:""
          },
          auth: true,
          tokenRequired: true,
          storeIn: "Orders"
        })
      )
      .unwrap() // Waits for the thunk to resolve successfully
      .then((ResponseB) => {
        console.log("ResponseB==>",ResponseB)
        setUserNewCustomer(ResponseA.data.Id)
        setActiveTab(1)

      })
  }else{

    NewCustomer(ResponseA.data.Id)
  }

  
  })
}
