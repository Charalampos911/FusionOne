import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,ResetMsg } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";

import FormInput from '../../NewUI/FormInput';
import FormButton from '../../NewUI/FormButton';
import Messaging from '../../NewUI/Messaging';
export default function Details(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
const [Name, setName] = useState(Api.Organization?.Name);
const [Description, setDescription] = useState(Api.Organization?.Description);
const [Phone, setPhone] = useState(Api.Organization?.Phone);
const [Address, setAddress] = useState(Api.Organization?.Address);
const [City, setCity] = useState(Api.Organization?.City);
const [Region, setRegion] = useState(Api.Organization?.Region);
const [PostalCode, setPostalCode] = useState(Api.Organization?.PostalCode);
const [Country, setCountry] = useState(Api.Organization?.Country);
const [Email, setEmail] = useState(Api.Organization?.Email);
const [OnlineCode, setOnlineCode] = useState(Api.Organization?.OnlineCode);


  const [IsRequired, setIsRequired] = useState(false); 
  const isCreate = Api.Organization == null;

  const Required = Name && Description && Phone && Address && City && Region && PostalCode && Country && Email && OnlineCode;

  const HUpdate = () => {
    console.clear()
    console.log("isCreate=",isCreate)
    console.log("Required=",Required)
    console.log("Data=",{
      Name:Name,
      Description:Description,
      Phone:Phone,
      Address:Address,
      City:City,
      Region:Region,
      PostalCode:PostalCode,
      Country:Country,
      Email:Email,
      OnlineCode:OnlineCode
    })
    
    const url = isCreate
      ? "api/Organizations/Create"
      : "api/Organizations/Update";

    const method = isCreate ? "POST" : "PUT";
    const body = {
      ...(Name ? { Name } : {}),
      ...(Description ? { Description } : {}),
      ...(Phone ? { Phone } : {}),
      ...(Address ? { Address } : {}),
      ...(City ? { City } : {}),
      ...(Region ? { Region } : {}),
      ...(PostalCode ? { PostalCode } : {}),
      ...(Country ? { Country } : {}),
      ...(Email ? { Email } : {}),
      ...(OnlineCode ? { OnlineCode } : {}),
    };
    dispatch(
      apiRequest({
        flatten: true,
        name: "Organization.Details.jsx | HUpdate",
        url: url,
        method: method,
        body: body,
        auth: true,
        tokenRequired: true,
        storeIn: "Organization"
      })
    );
    setIsRequired(true)
  };


  return (

    <div id="Details" className='MainCard'>
      <div className='subCategory'>
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div>
        <div className='subCategoryTitle'>Details</div>
      </div>
      {/* <div className='Form'> */}

      <FormInput 
        key={0}
        type="text"
        placeholder="Name"
        ElValue={Name ?? ""} 
        ReturnVal={(val) => setName(val)}
      />

      <FormInput 
        key={1}
        type="text"
        placeholder="Description"
        ElValue={Description ?? ""} 
        ReturnVal={(val) => setDescription(val)}
      />

      <FormInput 
        key={2}
        type="text"
        placeholder="Phone"
        ElValue={Phone ?? ""} 
        ReturnVal={(val) => setPhone(val)}
      />

      <FormInput 
        key={3}
        type="text"
        placeholder="Address"
        ElValue={Address ?? ""} 
        ReturnVal={(val) => setAddress(val)}
      />

      <FormInput 
        key={4}
        type="text"
        placeholder="City"
        ElValue={City ?? ""} 
        ReturnVal={(val) => setCity(val)}
      />

      <FormInput 
        key={5}
        type="text"
        placeholder="Region / State"
        ElValue={Region ?? ""} 
        ReturnVal={(val) => setRegion(val)}
      />

      <FormInput 
        key={6}
        type="text"
        placeholder="Postal Code"
        ElValue={PostalCode ?? ""} 
        ReturnVal={(val) => setPostalCode(val)}
      />

      <FormInput 
        key={7}
        type="text"
        placeholder="Country"
        ElValue={Country ?? ""} 
        ReturnVal={(val) => setCountry(val)}
      />

      <FormInput 
        key={8}
        type="text"
        placeholder="Email"
        ElValue={Email ?? ""} 
        ReturnVal={(val) => setEmail(val)}
      />
      <FormInput 
        key={8}
        type="text"
        placeholder="Online Code"
        ElValue={OnlineCode ?? ""} 
        ReturnVal={(val) => setOnlineCode(val)}
      />
      {/* </div> */}

      <FormButton text={isCreate?"Register":"Update"} onClick={()=>HUpdate()}/>
      {isCreate?<><label className='seed'>Instead of registering manually,you can one time seed 3 departments,create example customers,employees,divisions e.c.t then re-login</label>
      <FormButton text={"Seed 3 departments"} onClick={()=>HInitialSeeder(dispatch,apiRequest)}/></>:null}

        <Messaging IsLocal={false}/>
    </div>
  );

}


  const HInitialSeeder=(dispatch,apiRequest)=>{
    dispatch(
      apiRequest({
        flatten: true,
        name: "OrganizationManager.jsx | HInitialSeeder",
        url: "api/OrganizationSeeding/seed",
        method: "POST",
        body: {},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
  }