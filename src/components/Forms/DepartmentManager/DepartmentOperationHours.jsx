import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setOpenTemplateId } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import Messaging from "../../NewUI/Messaging";
import FormsSelect from "../../NewUI/FormsSelect";
export default function DepartmentOperationHours(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [OpenTemplate, setOpenTemplate] = useState(null);
  const [Message, setMessage] = useState(null);

  useEffect(() => {
    if(Api.NewApiToUserMessage.msg!="Success")
      setMessage(Api.NewApiToUserMessage) 
  }, [Api.NewApiToUserMessage]);
  useEffect(() => {
    dispatch(
      apiRequest({
        flatten: true,
        name: "Department.DepartmentOperationHours.jsx | useEffect",
        url: "api/OpenTemplates/Query",
        method: "POST",
        body: {OrganizationId: Api.Token.OrganizationId},
        auth: true,
        tokenRequired: true,
        storeIn: "OpenTemplates"
      })
    )
   }, []);

return (
  <div class="GlobalOperationHours">
        <div className='GlobalOperationHours-head'>     
          <div className="ChangeSelection" onClick={() => props.ChangeSelection()}>
            <FaArrowLeft />
          </div> 
          <label>Department-wide operation hours ovveride</label>
        </div>
        <div className='OpenTemplates'>
          <div className='EstName'>{props.Department?.Name}</div>

        <FormsSelect
          ElValue={OpenTemplate?.Id}
          placeholder={"Open template"}
          FlatArray={Api.OpenTemplates}
          ReturnVal={(val)=> setOpenTemplate(val)}
          EntityFetcher={true}
        />



        
        <div className='Action-box'>
        <div className='Action' onClick={()=>HDepartmentOperationsOverride(OpenTemplate,props.Department,dispatch,apiRequest,setMessage)}>Perform macro</div>
        <Messaging ParentMessage={Message} IsLocal={true}/>
        </div>
        </div>
  </div>
);

}


   const HDepartmentOperationsOverride=(OpenTemplate,Department,dispatch,apiRequest,setMessage)=>{

    if(OpenTemplate!=null){
  
      dispatch(
        apiRequest({
          flatten: false,
          name: "Departments.DepartmentOperationHours.jsx | useEffect",
          url: "api/OpenTemplates/DepartmentOperationsOverride",
          method: "POST",
          body: {
            OpenTemplateId:OpenTemplate.Id,
            DepartmentId:Department.Id,
          },
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      setMessage({
        Name:"HEstablismentOperationsOverride",
        Origin:"GlobalOperationHours ",
        Mood:true,
        msg:'Operation success'
      })
    })
    }
   }