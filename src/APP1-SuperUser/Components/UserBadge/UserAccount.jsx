import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';




import FormInput from '../../../components/NewUI/FormInput'
import FormButton from '../../../components/NewUI/FormButton';
import Messaging from '../../../components/NewUI/Messaging';
import QuerySelect from '../../../components/NewUI/QuerySelect';


import { FaArrowLeft } from "react-icons/fa";
export default function UserAccount({
  ChangeSelection,
  CreateOrder,
  NewCustomer
}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [ActiveTab, setActiveTab] = useState(0);
  const [Message, setMessage] = useState(null);
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");
  const [genders, setGenders] = useState(null);
  const [Gender, setGender] = useState("");


  useEffect(() => {
    dispatch(
      apiRequest({
        name: "AuthRegister.jsx | GetEnum",
        url: "api/Enumerals/GetEnum/Gender",
        method: "GET",
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Genders==>",Response.data)
      setGenders(Response.data)
    })


    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Customers/Query",
        url: "api/CustomersSU/UpdatedCustomerSU",
        method: "POST",
        body: {Id:Api.Token.Customer.Id},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Response==>",Response)
        setFirstName(Response.data.FirstName)
         setLastName(Response.data.LastName)
          setPhone(Response.data.Phone)
           setEmail(Response.data.Email)
            setGender(Response.data.Gender)
    })
  }, []);



  useEffect(() => {
    if(Api.NewApiToUserMessage.msg!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
  return (
      <div className="Overview">
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>ChangeSelection()}><FaArrowLeft /></div> 
        <label><span>Account</span></label>
      </div>
    
    <div id='NewCustomer'>
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

      <QuerySelect 
        zIndex={10}
        isDynamic={true}
        optionsArray={genders}
        placeholder="Gender"
        setValue={(val) => setGender(val!=null?val:null)}
      />

      <FormButton text={"Update info"} onClick={()=>HUpdateCustomer(Api.Token.Customer.Id,FirstName,LastName,Phone,Email,Gender,dispatch,apiRequest,setActiveTab,setFirstName,setLastName,setPhone,setEmail,setGender)}/>
      <Messaging ParentMessage={Message} />
    </div>
    </div>
  );

}



const HUpdateCustomer =(Id,FirstName,LastName,Phone,Email,Gender,dispatch,apiRequest,setFirstName,setLastName,setPhone,setEmail,setGender)=>{

  dispatch(
    apiRequest({
      name: "NewCustomer.jsx | Customers.FormCreate",
      url: "api/CustomersSU/UpdateCustomerSU",
      method: "POST",
      body: {
        Id:Id,
        FirstName:FirstName,
        LastName:LastName,
        Phone:Phone,
        Email:Email,
        Gender:Gender[1]
      },
      auth: true,
      tokenRequired: true,
      storeIn: null
    })
  )
  .unwrap() // Waits for the thunk to resolve successfully
  .then((ResponseA) => {
    console.log("ResponseA==>",ResponseA)

    setFirstName(Response.data.FirstName)
    setLastName(Response.data.LastName)
    setPhone(Response.data.Phone)
    setEmail(Response.data.Email)
    setGender(Response.data.Gender)

  
  })
}
