import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,ResetMsg } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import DynamicInput from '../../UI/DynamicInput';
import DynamicSelect from "../../UI/DynamicSelect"
import FormsSelectFetch from '../../NewUI/FormsSelectFetch';
import FormsSelect  from '../../NewUI/FormsSelect';
import FormInput from '../..//NewUI/FormInput';

import FormButton from '../..//NewUI/FormButton';
import Messaging from '../../NewUI/Messaging';
export default function CreateManager(props) { 
const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
const [FullName, setFullName] = useState(null);
const [Email, setEmail] = useState(null);
const [Username, setUsername] = useState(null);
const [Password, setPassword] = useState(null);
const [assignableRoles, setAssignableRoles] = useState(null);
const [Roles, setRoles] = useState(null);
const [establishments, setEstablishments] = useState(null);
const [EstablishmentId, setEstablishmentId] = useState(null);
const [departments, setDepartments] = useState(null);
const [DepartmentId, setDepartmentId] = useState(null);



const [Message, setMessage] = useState(null);
const [IsRequired, setIsRequired] = useState(false); 

const Required = FullName && Email  && Username && Password && Roles && EstablishmentId && DepartmentId;
   useEffect(() => {
    if(Api.NewApiToUserMessage?.msg!="Success")
     setMessage(Api.NewApiToUserMessage);
   }, [Api.NewApiToUserMessage]);

    useEffect(() => {
      dispatch(ResetMsg());

      dispatch(apiRequest({
        name:"CreateManager | Establishments",
        url: getRelationship("EstablishmentId")[1],
        method: "POST",
        body: {}, 
        storeIn: null,
        auth: true,
        tokenRequired: true,
      }))
      .unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
           setEstablishments(Response.data)
        })
      ;


dispatch(
  apiRequest({
    name: "CreateManager.jsx | AssignableRoles",
    url: "api/Auth/AssignableRoles",
    method: "GET",
    body: null,
    auth: false,
    tokenRequired: false,
    storeIn: null
  })
)
.unwrap()
.then((Response) => {
  console.log("AssignableRoles===", Response);

  // Map the array strings into objects with Id and Name properties
  const formattedRoles = Response.data.map((roleName, index) => ({
    Id: index,
    Name: roleName
  }));
  console.clear()
  console.log("formattedRoles===",formattedRoles)
  setAssignableRoles(formattedRoles);
});
    }, []);


  useEffect(() => {
    if (EstablishmentId) {
      dispatch(apiRequest({
         name: "CreateManager.jsx | Departments",
        url: getRelationship("DepartmentId")[1],
        method: "POST",
        body: {EstablishmentId:EstablishmentId}, 
        storeIn:null ,
        auth: true,
        tokenRequired: true,
      }))
      .unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
           setDepartments(Response.data)
        })
      ;
    }
  }, [EstablishmentId]);

  const HNew = () => {
    console.clear()
    console.log("Required=",Required)
    console.log("Data=",{
      FullName:FullName,
      Email:Email,
      Username:Username,
      Password:Password,
      Roles:Roles,
      EstablishmentId:EstablishmentId,
      DepartmentId:DepartmentId
    })
    
    const body = {
      ...(FullName ? { FullName } : {}),
      ...(Email ? { Email } : {}),
      ...(Username ? { Username } : {}),
      ...(Password ? { Password } : {}),
      ...(Roles? { Roles } : {}),
      ...(EstablishmentId ? { EstablishmentId } : {}),
      ...(DepartmentId ? { DepartmentId } : {})
    };
    console.log("body=",body)

// return;
    dispatch(
      apiRequest({
        name: "CreateManager.jsx | HNew",
        url: "api/Auth/CreateManager",
        method: "POST",
        body: body,
        auth: true,
        tokenRequired: true,
        storeIn: null
      }))
      .unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
        setMessage({
          Name:"HNew",
          Origin:"CreateManager ",
          Mood:true,
          msg:"User created successfully"
        })
        })
      ;
    setIsRequired(true)
  };

  const getRelationship = (key) => {
    if (!Api.Relationships) return null;
    // Relationships is an array of arrays: [key, url, storeIn]
    return Api.Relationships.find(rel => rel[0] === key);
  };
  




  return (

    <div id="CreateManager" className='MainCard CustomCard'>
      <div className='subCategory'>
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div>
        <div className='subCategoryTitle'>Create users</div>
      </div>
      <div className='Form CreateUser'>

        <FormsSelect
          zIndex={12}
          ElValue={EstablishmentId}
          placeholder={"Establishment"}
          FlatArray={establishments}
          ReturnVal={(val)=>setEstablishmentId(val)}
          EntityFetcher={false}
        />
        <FormsSelect
          zIndex={11}
          ElValue={DepartmentId}
          placeholder={"Department"}
          FlatArray={departments}
          ReturnVal={(val)=>setDepartmentId(val)}
          EntityFetcher={false}
        />
        <FormsSelect
          zIndex={10}
          ElValue={Roles}
          placeholder={"Role"}
          FlatArray={assignableRoles}
          ReturnVal={(val)=>(setRoles([val.Name]))}
          EntityFetcher={true}
        />


      <FormInput 
        key={3}
        type="text"
        placeholder="Full name"
        ElValue={FullName ?? ""} 
        ReturnVal={(val) => setFullName(val)}
      />

      <FormInput 
        key={4}
        type="text"
        placeholder="Email"
        ElValue={Email ?? ""} 
        ReturnVal={(val) => setEmail(val)}
      />

      <FormInput 
        key={5}
        type="text"
        placeholder="Username"
        ElValue={Username ?? ""} 
        ReturnVal={(val) => setUsername(val)}
      />

      <FormInput 
        key={6}
        type="text"
        placeholder="Password"
        ElValue={Password ?? ""} 
        ReturnVal={(val) => setPassword(val)}
      />

      </div>

      <FormButton text={"Create user"} onClick={()=>HNew()}/>

      <Messaging ParentMessage={Message} IsLocal={true}/>
    </div>
  );

}


