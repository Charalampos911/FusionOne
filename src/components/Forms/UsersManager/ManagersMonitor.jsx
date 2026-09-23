



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
import ManagersByAttribute from "./ManagersByAttribute";

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

const [TenantRequest, setTenantRequest] = useState(null);

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
 useEffect(() => {
   const body = {
      ...(Roles? { Roles } : {}),
      ...(EstablishmentId ? { EstablishmentId } : {}),
      ...(DepartmentId ? { DepartmentId } : {})
    };
    console.clear()
    console.log("body=",body)
    setTenantRequest(body)
  }, [Roles]);


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
          ReturnVal={(val)=>(setRoles(val.Name))}
          EntityFetcher={true}
        />

       <ManagersByAttribute
           Body={TenantRequest}

        /> 


      </div>

      <FormButton text={"Create user"} onClick={()=>HNew()}/>

      <Messaging ParentMessage={Message} IsLocal={true}/>
    </div>
  );

}










// import React, { useState,useRef,useEffect } from 'react';
// import { useSelector, useDispatch } from "react-redux";
// import { apiRequest } from '../../../Redux/features/ApiReducer';
// import { FaArrowLeft , FaChevronLeft, FaChevronRight, FaChevronDown,FaChevronUp    } from "react-icons/fa";
// import { TiChevronRight } from "react-icons/ti";

// import ManagersByAttribute from "./ManagersByAttribute";

// export default function ManagersMonitor(props) { 
//   const Api = useSelector((state) => state.Api); 
//   const dispatch = useDispatch(); 

//   const [Establishment, setEstablishment] = useState(null);
//   const [Department, setDepartment] = useState(null);
//   const [GoCentralAccountants, setGoCentralAccountants] = useState(false);
//   const [GoGeneralManagers, setGoGeneralManagers] = useState(false);
//   const [GoLocalAccountants, setGoLocalAccountants] = useState(false);
//   const [GoDepartmentManagers, setGoDepartmentManagers] = useState(false);
//   const [GoInventoryClerks, setGoInventoryClerks] = useState(false);
//   const [Message, setMessage] = useState(null);
//   useEffect(() => {
//       setMessage(Api.NewApiToUserMessage);
//   }, [Api.NewApiToUserMessage]);
//   useEffect(() => {
//     dispatch(apiRequest({
//       url: "api/Establishments/Query",
//       method: "POST",
//       body: {},
//       storeIn: "Establishments",
//       auth: true, 
//       tokenRequired: true
//     }));
//     HandleNewSelection()
//     console.log("GoGeneralManagers=",GoGeneralManagers,"GoLocalAccountants=",GoLocalAccountants,"GoDepartmentManagers=",GoDepartmentManagers,"GoInventoryClerks=",GoInventoryClerks)
//   }, []);
//   useEffect(() => {
//     if(Establishment!=null)
//     dispatch(apiRequest({
//       url: "api/Departments/Query",
//       method: "POST",
//       body: {EstablishmentId: Establishment.Id},
//       storeIn: "Departments",
//       auth: true, 
//       tokenRequired: true
//     }));
//   }, [Establishment]);


// console.log("Api.Establishments==",Api.Establishments)
// console.log("Establishment=",Establishment)


// const HandleNewSelection = () =>
// {
//     setEstablishment(null)
//     setDepartment(null)
//     setGoCentralAccountants(false)
//     setGoGeneralManagers(false)
//     setGoLocalAccountants(false)
//     setGoDepartmentManagers(false)
//     setGoInventoryClerks(false)
// }

//   return (

//     <div id='ManagersMonitor'>
//     {
//     !(GoCentralAccountants ||
//       GoGeneralManagers || 
//       GoLocalAccountants || 
//       GoDepartmentManagers || 
//       GoInventoryClerks)?
//     <>
//     <div className="Branch" onClick={()=>setGoGeneralManagers(true)}><TiChevronRight/>Central Accountants</div>
//     {Establishment==null?
//       <div className='EstablishmentSelect'>
//         <div className='subCategory'>
//           <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div>
//           <div className='subCategoryTitle'>Select an establishment</div>
//         </div>
//         <div className='FlatSelect'>
//         { Api.Establishments && Api.Establishments.map(item => 
//           <div onClick={()=>setEstablishment(item)}>{item.Name}</div>
//         )}
//         </div>
//       </div>
//     :null}

//     {Establishment!=null?
//       <>
//         <div className='subCategory MultiSelect'>
//           <div className="ChangeSelection" onClick={()=>{setEstablishment(null),setDepartment(null)}}><FaArrowLeft /></div>
//           <div className='subCategoryTitle'>{Establishment.Name}</div>
//         </div>

//       <div className="Branch" onClick={()=>setGoGeneralManagers(true)}><TiChevronRight/>General managers</div>
//       <div className="Branch" onClick={()=>setGoLocalAccountants(true)}><TiChevronRight/>Local accountants</div>
//       {Department==null?
//       <div className='DepartmentsSelect'>
//         <div className='subCategory'>
          
//           <div className='subCategoryTitle'>Select a department</div>
//           <div className="ChangeSelection" ><FaChevronDown /></div>
//         </div>
//         <div className='FlatSelect'>
//         { Api.Departments && Api.Departments.map(item => 
//           <div onClick={()=>setDepartment(item)}>{item.Name}</div>
//         )}
//         </div>
//       </div>
//       :
//       <>
//       <div className='subCategory MultiSelect InnerSelect'>
        
//         <div className='subCategoryTitle'>{Department.Name}</div>
//         <div className="ChangeSelection" onClick={()=>setDepartment(null)}><FaChevronUp /></div>
//       </div>

//       <div className="Branch" onClick={()=>setGoDepartmentManagers(true)}><TiChevronRight/>Department managers</div>
//       <div className="Branch" onClick={()=>setGoInventoryClerks(true)}><TiChevronRight/>Inventory clerks</div>
//       </>
//       }
//       </>
//     :null}
//     </>:
//       <ManagersByAttribute
//         Establishment={Establishment}
//         Department={Department}
//         GoCentralAccountants={GoCentralAccountants}
//         GoGeneralManagers={GoGeneralManagers}
//         GoLocalAccountants={GoLocalAccountants}
//         GoDepartmentManagers={GoDepartmentManagers}
//         GoInventoryClerks={GoInventoryClerks}
//         ChangeSelection={()=> HandleNewSelection()(0)}
//         />}
//         {Message?.msg && (
//           <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
//             {Message.msg}
//           </span>
//         )}
//     </div>
//   );

// }


