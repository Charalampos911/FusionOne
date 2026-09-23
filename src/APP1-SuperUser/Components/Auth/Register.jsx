import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import FormInput from '../../../components/NewUI/FormInput';
import FormButton from '../../../components/NewUI/FormButton';
import Messaging from '../../../components/NewUI/Messaging';
import QuerySelect from '../../../components/NewUI/QuerySelect';
export default function AuthRegister({organization,QuickLogin}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [genders, setGenders] = useState(null);
  const [gender, setGender] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [LocalMessage, setLocalMessage] = useState(null);

  const [message, setMessage] = useState(null);

  useEffect(() => {

    dispatch(
      apiRequest({
        name: "AuthRegister.jsx | GetEnum",
        url: "api/Enumerals/GetEnum/Gender",
        method: "GET",
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Genders==>",Response.data)
      setGenders(Response.data)
    })




  }, []);

  useEffect(() => {
    if(Api.NewApiToUserMessage!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);

console.log("Api===>",Api);
  const HRegister = () => {
    console.clear()
      console.log("organization:"+organization)
    console.log("firstName:"+firstName)
    console.log("lastName:"+lastName)
    console.log("email:"+email)
    console.log("phone:"+phone)
    console.log("genders:"+genders)
    console.log("gender:"+gender)
    console.log("gender[0]:"+gender[0])
    console.log("username:"+username)
    console.log("password:"+password)
    console.log("password2:"+password2)



    if(password != password2){   
       setMessage({
          Name:"HRegister",
          Origin:"AuthRegister ",
          Mood:false,
          msg:"Passwords dont match"
        })
        return;
      }



// return;
    dispatch(
      apiRequest({
        name: "AuthRegister.jsx | HRegister",
        url: "api/CustomersSU/Register",
        method: "POST",
        body: {

          FirstName: firstName,
          LastName: lastName,
          Phone: phone,
          Gender: gender[1],
          Email: email,
          Username: username,
          Password: password,

          OnlineCode: organization

        },
        auth: false,
        tokenRequired: false,
        storeIn: "NewApiToUserMessage"
      })
    ).unwrap() 
    .then((Response) => {
      console.log("Response==>",Response)

        setMessage({
          Name:"HRegister",
          Origin:"AuthRegister.jsx  ",
          Mood:true,
          msg:"Successful registration, please log-in"
        })

    })
  };

  return (
    <>
    <div id='Gate-card'>
      <FormInput 
        key={0}
        type="text"
        placeholder="First name"
        ElValue={firstName ?? ""} 
        ReturnVal={(val) => setFirstName(val)}
      />
      <FormInput 
        key={1}
        type="text"
        placeholder="Last name"
        ElValue={lastName ?? ""} 
        ReturnVal={(val) => setLastName(val)}
      />

      <FormInput 
        key={2}
        type="text"
        placeholder="Phone"
        ElValue={phone ?? ""} 
        ReturnVal={(val) => setPhone(val)}
      />

      <QuerySelect 
        zIndex={10}
        isDynamic={true}
        optionsArray={genders}
        placeholder="Gender"
        setValue={(val) => setGender(val!=null?val:null)}
      />

      <FormInput 
        key={4}
        type="text"
        placeholder="Email"
        ElValue={email ?? ""} 
        ReturnVal={(val) => setEmail(val)}
      />

      <FormInput 
        key={5}
        type="text"
        placeholder="Username"
        ElValue={username ?? ""} 
        ReturnVal={(val) => setUsername(val)}
      />
      <FormInput 
        key={6}
        type="password"
        placeholder="Password"
        ElValue={password ?? ""} 
        ReturnVal={(val) => setPassword(val)}
      />
      <FormInput 
        key={6}
        type="password"
        placeholder="Repeat password"
        ElValue={password2 ?? ""} 
        ReturnVal={(val) => setPassword2(val)}
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

      <Messaging ParentMessage={message} IsLocal={true}/>
    </div>
    </>
  );

}


