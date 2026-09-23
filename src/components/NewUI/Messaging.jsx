import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,ResetMsg} from '../../Redux/features/ApiReducer';

    //  const [LocalMessage, setLocalMessage] = useState(null);

    //   import Messaging from '../../NewUI/Messaging';

    //   <Messaging ParentMessage={Message} IsLocal={true}/>
    //   <Messaging IsLocal={false}/>
    // {
    //   msg: message,
    //   Mood:true/false
    // }


        // setMessage({
        //   Name:"useEffect",
        //   Origin:"GlobalOperationHours ",
        //   Mood:false,
        //   msg:Api.NewApiToUserMessage
        // })

  // useEffect(() => {
  //   if(Api.NewApiToUserMessage.msg!="Success")
  //   setMessage(Api.NewApiToUserMessage);
  // }, [Api.NewApiToUserMessage]);


export default function Messaging({ParentMessage,IsLocal}) { 
    const Api = useSelector((state) => state.Api); 
    const dispatch = useDispatch(); 

   const [Message, setMessage] = useState(ParentMessage || null);

    useEffect(() => {
      dispatch(ResetMsg());
    }, []);

   useEffect(() => {
    if(!IsLocal)
     setMessage(Api.NewApiToUserMessage);

    if(IsLocal)
     setMessage(ParentMessage);
   }, [Api.NewApiToUserMessage,ParentMessage]);


  return (
    <>
      {Message?.msg && (
        <span className={`Messaging ${Message?.Mood ?"green":"red"}`} >
          {Message?.msg} 
        </span> 
        )}
    </>
  )
}