import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import FormsSelect from "../../NewUI/FormsSelect";
import Messaging from '../../NewUI/Messaging';
export default function GlobalEmployeeHours(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  console.clear()
  console.log("props.Establishment===",props.Establishment)
  const [ScheduleTemplate, setScheduleTemplate] = useState(null);

const [Message, setMessage] = useState(null);
  useEffect(() => {
    if(Api.NewApiToUserMessage.msg != "Success")
      setMessage(Api.NewApiToUserMessage)
  }, [Api.NewApiToUserMessage]);

  useEffect(() => {
    dispatch(
      apiRequest({
        flatten: true,
        name: "Establishments.GlobalEmployeeHours.jsx | useEffect",
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
          <label>Establishment-wide employee hours override</label>
        </div>
        <div className='OpenTemplates'>
        <div className='EstName'>{props.Establishment.Name}</div>

        <FormsSelect
          ElValue={ScheduleTemplate?.Id}
          placeholder={"Schedule template"}
          FlatArray={Api.ScheduleTemplates}
          ReturnVal={(val)=>setScheduleTemplate(val)}
           EntityFetcher={true}
        />
        



      
        <div className='Action-box'>
        <div className='Action' onClick={()=>HEstablismentOperationsOverride(ScheduleTemplate,props.Establishment,dispatch,apiRequest,setMessage)}>Perform macro</div>
        <Messaging ParentMessage={Message} IsLocal={true}/>
        </div>
          </div>
  </div>
);

}


   const HEstablismentOperationsOverride=(ScheduleTemplate,Establishment,dispatch,apiRequest,setMessage)=>{
    dispatch(
      apiRequest({
        flatten: false,
        name: "Establishments.GlobalEmployeeHours.jsx | useEffect",
        url: "api/OpenTemplates/EstablismentEmployeeDaysOverride",
        method: "POST",
        body: {
          ScheduleTemplateId:ScheduleTemplate.Id,
          EstablishmentId:Establishment.Id,
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