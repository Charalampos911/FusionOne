import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import FormsSelect from "../../NewUI/FormsSelect";
import Messaging from '../../NewUI/Messaging';
export default function DepartmentSpecialsHours(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [ScheduleTemplate, setScheduleTemplate] = useState(null);
  const [Message, setMessage] = useState(null);

  useEffect(() => {
    if(Api.NewApiToUserMessage.msg!="Success")
      setMessage(Api.NewApiToUserMessage) 
  }, [Api.NewApiToUserMessage]);
  useEffect(() => {
    dispatch(
      apiRequest({
        flatten: true,
        name: "Department.DepartmentSpecialsHours.jsx | useEffect",
        url: "api/ScheduleTemplates/Query",
        method: "POST",
        body: {OrganizationId: Api.Token.OrganizationId},
        auth: true,
        tokenRequired: true,
        storeIn: "ScheduleTemplates"
      })
    )
   }, []);

return (
  <div class="GlobalOperationHours">
        <div className='GlobalOperationHours-head'>     
          <div className="ChangeSelection" onClick={() => props.ChangeSelection()}>
            <FaArrowLeft />
          </div> 
          <label>Department-wide specials hours ovveride</label>
        </div>
        <div className='OpenTemplates'>

        <div className='EstName'>{props.Department.Name}</div>

        <FormsSelect
          ElValue={ScheduleTemplate?.Id}
          placeholder={"Schedule template"}
          FlatArray={Api.ScheduleTemplates}
          ReturnVal={(val)=>setScheduleTemplate(val)}
           EntityFetcher={true}
        />

        
        <div className='Action-box'>
        <div className='Action' onClick={()=>HDepartmentSpecialsDaysOverride(ScheduleTemplate,props.Department,dispatch,apiRequest,setMessage)}>Perform macro</div>
        <Messaging ParentMessage={Message} IsLocal={true}/>
        </div>
        </div>
  </div>
);

}


   const HDepartmentSpecialsDaysOverride=(ScheduleTemplate,Department,dispatch,apiRequest,setMessage)=>{

    if(ScheduleTemplate!=null){
      dispatch(
        apiRequest({
          flatten: false,
          name: "Departments.DepartmentSpecialsHours.jsx | DepartmentSpecialsDaysOverride",
          url: "api/OpenTemplates/DepartmentSpecialsDaysOverride",
          method: "POST",
          body: {
            ScheduleTemplateId:ScheduleTemplate.Id,
            DepartmentId:Department.Id,
          },
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      )    .then((Response) => {
         setMessage({
          Name:"HEstablismentOperationsOverride",
          Origin:"GlobalOperationHours ",
          Mood:true,
          msg:'Operation success'
        })
    })
    }
   }