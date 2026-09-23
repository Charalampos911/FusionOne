import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,DefineRelationships  } from '../../../Redux/features/ApiReducer';
import FormInput from '../../NewUI/FormInput';
import FormButton from '../../NewUI/FormButton';
import Messaging from '../../NewUI/Messaging';


export default function AuthLogin({RegisterFirst}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  console.log("Api===>",Api);
  const HLogin = () => {
    console.log("username:"+username)
    console.log("password:"+password)
    dispatch(
      apiRequest({
        name: "AuthLogin.jsx | HLogin",
        url: "api/Auth/Login",
        method: "POST",
        body: {
          Username: username,
          Password: password
        },
        auth: false,
        tokenRequired: false,
        storeIn: "Token"
      })
    )
  };

  return (
    <>
    <div id='Gate-card'>
      <FormInput 
        key={0}
        type="text"
        placeholder="Username"
        ElValue={username ?? ""} 
        ReturnVal={(val) => setUsername(val)}
      />

      <FormInput 
        key={1}
        type="Password"
        placeholder="Password"
        ElValue={password ?? ""} 
        ReturnVal={(val) => setPassword(val)}
      />
      <FormButton text={"Login"} onClick={()=>HLogin()}/>
      <span onClick={()=>RegisterFirst()}>Not a user? Register now...</span>
       <Messaging IsLocal={false}/>
    </div>
    </>
  );

}


