import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import Messaging from "../../NewUI/Messaging";
import FormsSelect from "../../NewUI/FormsSelect";
export default function GlobalOperationHours(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [OpenTemplate, setOpenTemplate] = useState(null);

const [Message, setMessage] = useState(null);
  useEffect(() => {
    if(Api.NewApiToUserMessage.msg != "Success")
        setMessage(Api.NewApiToUserMessage)
  }, [Api.NewApiToUserMessage]);


  useEffect(() => {
    setMessage(null)
    dispatch(
      apiRequest({
        flatten: true,
        name: "Establishments.GlobalOperationHours.jsx | useEffect",
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
        <div className='GlobalOperationHours-head' >     
          <div className="ChangeSelection" onClick={() => props.ChangeSelection()}>
            <FaArrowLeft />
          </div> 
          <label title="Establishment-wide operation hours override">Establishment-wide operation hours override</label>
        </div>
        <div className='OpenTemplates'>
          <div className='EstName'>{props.Establishment.Name}</div>

        <FormsSelect
          ElValue={OpenTemplate?.Id}
          placeholder={"Open template"}
          FlatArray={Api.OpenTemplates}
          ReturnVal={(val)=>setOpenTemplate(val)}
          EntityFetcher={true}
        />
        







        <div className='Action-box'>
        <div className='Action' onClick={()=>HEstablismentOperationsOverride(OpenTemplate,props.Establishment,dispatch,apiRequest,setMessage)}>Perform macro</div>

        <Messaging ParentMessage={Message} IsLocal={true}/>
        </div>
        </div>
  </div>
);

}


   const HEstablismentOperationsOverride=async(OpenTemplate,Establishment,dispatch,apiRequest,setMessage)=>{
    dispatch(
      apiRequest({
        flatten: false,
        name: "Establishments.GlobalOperationHours.jsx | useEffect",
        url: "api/OpenTemplates/EstablismentOperationsOverride",
        method: "POST",
        body: {
          OpenTemplateId:OpenTemplate.Id,
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