import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setEstablishmentId ,setDepartmentId,ResetMsg} from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from "../../NewUI/QuerySelect";
import FormButton from "../../NewUI/FormButton";
import MultiSelect from "../../NewUI/MultiSelect";




export default function ServiceSpecials({ChangeSelection}) {    // <NewOrder ChangeSelection={()=> setActiveTab(0)}/>
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 


  const [Message, setMessage] = useState(null);


  const [Establishments, setEstablishments] = useState(null);
  const [Establishment, setEstablishment] = useState(Api.EstablishmentId || null);
  const [Departments, setDepartments] = useState(null);
  const [Department, setDepartment] = useState(Api.DepartmentId || null);
  const [Services, setServices] = useState(null);
  const [Service, setService] = useState(null);
  const [ServiceSpecials, setServiceSpecials] = useState(null);
  const [Specials, setSpecials] = useState(null);
  const [SpecialsArray, setSpecialsArray] = useState(null);
  useEffect(() => {
    dispatch(
      apiRequest({
        name: "ServiceSpecials.jsx | Establishments/Query",
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
  }, []);

  useEffect(() => {

    if(Establishment==null) return;
    dispatch(
      apiRequest({
        name: "ServiceSpecials.jsx | Departments/Query",
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

    if(Department)
    dispatch(
      apiRequest({
        name: "ServiceSpecials.jsx | Services/Query",
        url: "api/Services/Query",
        method: "POST",
        body: {OrganizationId:Api.Token.OrganizationId,DepartmentId: Department.Id},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setServices(Response.data)
        })

   }, [Department]);

  useEffect(() => {

    setSpecialsArray(null)

  }, [Establishment,Department,Service]);

  useEffect(() => {
    console.log("Service 344==",Service)
    if(Service)
    setServiceSpecials(Service.SpecialsArray)
    if(Department)
    dispatch(
      apiRequest({
        name: "ServiceSpecials.jsx | Specials/Query",
        url: "api/Specials/Query",
        method: "POST",
        body: {OrganizationId:Api.Token.OrganizationId,DepartmentId: Department.Id},
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setSpecials(Response.data)
        })

   }, [Service]);

  useEffect(() => {
    setMessage(null)
  }, [Api.Establishments,Api.Departments,SpecialsArray]);

  useEffect(() => {
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
return (
  <>
  <div className="Overview">
    <div className='Overview-head'>     
      <div className="ChangeSelection" onClick={()=>ChangeSelection()}><FaArrowLeft /></div> 
      <label>Service Specials</label>
    </div>
      <div id="DirectBooking">
        
        {Api.Token.Roles[0]=="Admin"?
        <> 
        <QuerySelect 
          isDynamic={true}
          optionsArray={Establishments? Establishments:[]}
          placeholder="Establishments"
          setValue={(val) => (setEstablishment(val!=null?val:null))}
          zIndex={4}
        />
        <QuerySelect 
          isDynamic={true}
          optionsArray={Departments? Departments:[]}
          placeholder="Departments"
          setValue={(val) => (setDepartment(val!=null?val:null))}
          zIndex={3}
        />


        </>
        :null}

        <QuerySelect 
          isDynamic={true}
          optionsArray={Services? Services:[]}
          placeholder="Services"
          setValue={(val) => (setService(val!=null?val:null))}
          zIndex={2}
        />


        <MultiSelect 
          CrossMatchArray = {ServiceSpecials?ServiceSpecials:[]}
          optionsArray={Specials? Specials:[]}
          placeholder="Specials"
          setValue={(val) => (setSpecialsArray(val!=null?val:null))}
          zIndex={1}
        />


        <FormButton text={"Save changes"} onClick={()=>HSave(Service.Id,SpecialsArray,dispatch,apiRequest)}/>
          <p>Note: You are linking specials to services in this form</p>

        {Message?.msg && (
          <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
            {Message.msg}
          </span>
        )}
      </div>
    </div>
     </> 
);
}

const HSave =(ServiceId,SpecialsArray,dispatch,apiRequest)=>{
  if(SpecialsArray==null) alert("Warning: Select specials then try again.")
  const body = {
    ServiceId: ServiceId,
    SpecialsArray: SpecialsArray
  };
  dispatch(
    apiRequest({
      name: "DirectBooking.jsx | TryNewOrder",
      url: "api/Services/UpdateSpecials",
      method: "PUT",
      body: body,
      auth: true,
      tokenRequired: true,
      storeIn:null
    })
  )
  .unwrap()
  .then((Response) => {
    console.log("Response==>",Response)
  })

};