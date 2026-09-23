import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,DefineRelationships  } from '../../../Redux/features/ApiReducer';
import FormInput from '../../../components/NewUI/FormInput';
import FormButton from '../../../components/NewUI/FormButton';
import Messaging from '../../../components/NewUI/Messaging';

export default function AuthLogin({RegisterFirst,organization}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [username, setUsername] = useState("haralabos");
  const [password, setPassword] = useState("123456");

  console.log("Api===>",Api);
  const HLogin = () => {
    console.log("username:"+username)
    console.log("password:"+password)
    dispatch(
      apiRequest({
        name: "AuthLogin.jsx | HLogin",
        url: "api/CustomersSU/Login",
        method: "POST",
        body: {
          OnlineCode: organization,
          usernameOrEmail: username,
          Password: password
        },
        auth: false,
        tokenRequired: false,
        storeIn: "Token"
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Response==>",Response)
    })
  };

  return (
    <>
    <div id='Gate-card'>
      <FormInput 
        key={0}
        type="text"
        placeholder="Username or email"
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


