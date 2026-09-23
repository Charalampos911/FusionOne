import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';



import { FaArrowLeft } from "react-icons/fa";
export default function UserScanner() { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [Message, setMessage] = useState(null);



  useEffect(() => {
    // dispatch(
    //   apiRequest({
    //     name: "AuthRegister.jsx | GetEnum",
    //     url: "api/Enumerals/GetEnum/Gender",
    //     method: "GET",
    //     auth: false,
    //     tokenRequired: false,
    //     storeIn: null
    //   })
    // ).unwrap() 
    // .then((Response) => {
    //   console.log("Genders==>",Response.data)
    //   setGenders(Response.data)
    // })

  }, []);



  useEffect(() => {
    if(Api.NewApiToUserMessage.msg!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
  return (
    <>
        User Scanner
   </>
  );

}

