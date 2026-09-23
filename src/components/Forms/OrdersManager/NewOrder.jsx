import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setEstablishmentId ,setDepartmentId,ResetMsg} from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import OrdersMasterManager from './OrdersMasterManager'
import QuerySelect from "../../NewUI/QuerySelect";
import FormButton from "../../NewUI/FormButton";

export default function NewOrder({ChangeSelection,preVal=null}) {    // <NewOrder ChangeSelection={()=> setActiveTab(0)}/>
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 


  const [Message, setMessage] = useState(null);
  const [Notes, setNotes] = useState(null);
  const [Order, setOrder] = useState(false);


  const [Establishments, setEstablishments] = useState(null);
  const [Establishment, setEstablishment] = useState(Api.EstablishmentId || null);
  const [Departments, setDepartments] = useState(null);
  const [Department, setDepartment] = useState(Api.DepartmentId || null);
  const [Customers, setCustomers] = useState(null);
  const [Customer, setCustomer] = useState(preVal);

  useEffect(() => {
    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Establishments/Query",
        url: "api/Establishments/Query",
        method: "POST",
        body: {},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    )
    .unwrap() 
    .then((Response) => {
      console.log("Response==>",Response)
        setEstablishments(Response.data)
    })
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
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setCustomers(Response.data)
        })

  }, []);

  useEffect(() => {
    if(Establishment==null) return;
    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Departments/Query",
        url: "api/Departments/Query",
        method: "POST",
        body: {EstablishmentId:Establishment.Id},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setDepartments(Response.data)
        })
   }, [Establishment]);


  useEffect(() => {


   }, []);




  useEffect(() => {
    setMessage(null)
  }, [Api.Establishments,Api.Departments,Customer]);

  useEffect(() => {
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
return (
  <>
  {!Order?
  <div className="Overview">
    <div className='Overview-head'>     
      <div className="ChangeSelection" onClick={()=>ChangeSelection()}><FaArrowLeft /></div> 
      <label>New order</label>
    </div>
      <div id="DirectBooking">
        
        {Api.Token.Roles[0]=="Admin"?
        <> 
        <QuerySelect 
          isDynamic={true}
          optionsArray={Establishments? Establishments:[]}
          placeholder="Establishments"
          setValue={(val) => (setEstablishment(val!=null?val:null))}
          zIndex={3}
        />
        <QuerySelect 
          isDynamic={true}
          optionsArray={Departments? Departments:[]}
          placeholder="Departments"
          setValue={(val) => (setDepartment(val!=null?val:null))}
          zIndex={2}
        />


        </>
        :null}

        <QuerySelect 
          isDynamic={true}
          optionsArray={Customers? Customers:[]}
          placeholder="Customers"
          setValue={(val) => (setCustomer(val!=null?val:null))}
          zIndex={1}
          preVal={Customer}
        />
        {Establishment==null?
          <span>Select an establishment...</span>
        :Department==null?
          <span>Select a department...</span>
        :Customer==null?
          <span>Select a Customer...</span>
        :<FormButton text={"Create a new order"} onClick={()=>TryNewOrder(Department.Id,Customer.Id,Notes,dispatch,apiRequest,setOrder)}/>
        }

        {Message?.msg && (
          <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
            {Message.msg}
          </span>
        )}
      </div>
    </div>
    :
      <OrdersMasterManager Customer = {Customer.Id} ChangeSelection={()=>setOrder(false)}/>
    }



     </> 
);
}

const TryNewOrder =(DepartmentId,CustomerId,Notes,dispatch,apiRequest,setOrder)=>{
  const body = {
    DepartmentId: DepartmentId,
    OrderOrigin: 0,
    CustomerId: CustomerId,
    ...(Notes != null && { Notes: Notes })
  };
  dispatch(
    apiRequest({
      name: "DirectBooking.jsx | TryNewOrder",
      url: "api/Orders/Create",
      method: "POST",
      body: body,
      auth: true,
      tokenRequired: true,
      storeIn: "Orders"
    })
  )
  .unwrap()
  .then((Response) => {
    console.log("Response==>",Response)
      setOrder(true)
  })

};