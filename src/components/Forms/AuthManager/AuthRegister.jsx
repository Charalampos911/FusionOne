import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import FormInput from '../../NewUI/FormInput';
import FormButton from '../../NewUI/FormButton';
import Messaging from '../../NewUI/Messaging';
export default function AuthRegister({QuickLogin}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [IsRequired, setIsRequired] = useState(false);
  const [LocalMessage, setLocalMessage] = useState(null);


console.log("Api===>",Api);
  const HRegister = () => {
    console.log("fullName:"+fullName)
    console.log("email:"+email)
    console.log("username:"+username)
    console.log("password:"+password)
    dispatch(
      apiRequest({
        name: "AuthRegister.jsx | HRegister",
        url: "api/Auth/Register",
        method: "POST",
        body: {
          FullName: fullName,
          Email: email,
          Username: username,
          Password: password
        },
        auth: false,
        tokenRequired: false,
        storeIn: "NewApiToUserMessage"
      })
    )
    setIsRequired(true);
  };

  return (
    <>

{/* {Array.from({ length: 10 }).map((_, i) => (
 ))} */}
    <div id='Gate-card'>
      <FormInput 
        key={0}
        type="text"
        placeholder="Full name"
        ElValue={fullName ?? ""} 
        ReturnVal={(val) => setFullName(val)}
      />
      <FormInput 
        key={1}
        type="text"
        placeholder="Email"
        ElValue={email ?? ""} 
        ReturnVal={(val) => setEmail(val)}
      />

      <FormInput 
        key={2}
        type="text"
        placeholder="Username"
        ElValue={username ?? ""} 
        ReturnVal={(val) => setUsername(val)}
      />
      <FormInput 
        key={3}
        type="password"
        placeholder="Password"
        ElValue={password ?? ""} 
        ReturnVal={(val) => setPassword(val)}
      />

      <FormButton text={"Register"} onClick={()=>HRegister()}/>
      {Api.NewApiToUserMessage?
      <>
      {Api.NewApiToUserMessage?.status?
      <div className='QuickLogin'>
        <span style={{ color: "green" }}>User was registered!</span>
         Please
          <span style={
            {
              color:"blue",
              textDecoration: "underline"
            }} onClick={()=>QuickLogin()}>login</span></div>
      :
          <span style={
            {
              color:"Red"
              
            }} >{Api.NewApiToUserMessage?.message}</span>
            }

      </>:null}
      <span onClick={()=>QuickLogin()}>Already a user? Login now...</span>

      <Messaging IsLocal={false}/>
    </div>
    </>
  );

}


