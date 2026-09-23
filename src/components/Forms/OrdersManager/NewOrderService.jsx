import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setEstablishmentId ,setDepartmentId,setDivisionId,clearServices,ResetMsg} from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QueryDateSelect from "../../UI/QueryDateSelect";
import QueryTimeSelect from "../../UI/QueryTimeSelect";
import QuerySelect from "../../NewUI/QuerySelect";
import { IoCalendar } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import {formatLocalDate,toApiDate,formatApi_DateTime} from "../../../utils/DatesTimesPhasm"
import FormDateSelect from "../../NewUI/FormDateSelect";
import { IoCloseSharp } from "react-icons/io5";

import Messaging from '../../NewUI/Messaging';
export default function NewOrderService({Services,SelectedOrder,ChangeSelection}) { 
  console.log("SelectedOrder===",SelectedOrder)
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [userService, setUserService] = useState(null);
  const [showDatePick, setShowDatePick] = useState(false);
  const [showTimePick, setShowTimePick] = useState(false);

  const [userDate , setUserDate] = useState(new Date().toISOString().split('T')[0]);
  const [userTime, setUserTime] = useState(null);
  const [userCustomer, setUserCustomer] = useState(null);
  const [Message, setMessage] = useState(null);
  const [AvailableDivs, setAvailableDivs] = useState(null);
  const [UserDivision, setUserDivision] = useState(null);
  const [AvailableSlots, setAvailableSlots] = useState(null);
 
function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
// 1. Create the refs
const refA = useRef(null);
const refB = useRef(null);
const refC = useRef(null);
const refD = useRef(null);
0
// 2. Link refs to your "setReveal" states
useOutsideClick(refA, () => setRevealA(false));
useOutsideClick(refB, () => setRevealB(false));
useOutsideClick(refC, () => setRevealC(false));
useOutsideClick(refD, () => setRevealD(false));

  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [RevealC, setRevealC] = useState(false);
  const [RevealD, setRevealD] = useState(false);

  useEffect(() => {
    dispatch(clearServices())
    dispatch(ResetMsg())
    setUserCustomer(SelectedOrder.Customer)
    
  }, []);
  useEffect(() => {
    setMessage(null)

  }, [Api.Establishments,Api.Departments,Api.Services,userService,userDate,userCustomer]);
  useEffect(() => {
    console.log("Response==> 111  userDate=="+userDate)
        console.log("Response==> 111  userDate2=="+new Date(new Date(userDate).setHours(0, 0, 0, 0)))
    if(userService!=null){
      dispatch(
        apiRequest({
          name: "NewOrderService.jsx | GetDailyServiceAvailability",
          url: "api/OrderServices/GetDailyServiceAvailability",
          method: "POST",
          body: {
              ServiceId:userService.Id, 
              StartDate:userDate,
              DepartmentId: SelectedOrder.DepartmentId},
          auth: true,
          tokenRequired: true,
          storeIn: "GetDailyServiceAvailability"
        })
      ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 222",Response)
          setAvailableSlots(Response.data)
        })
    }

   }, [userService,userDate]);

const ResetField=()=>{
  setShowDatePick(false)
  setShowTimePick(false)
}

const MasterReset=()=>{
  ResetField()
  setUserDate(null)
  setUserTime(null)
}

const HDateChange = (date) =>{

    ResetField()
    setUserDate(date)
    setUserTime(null)
    setAvailableSlots(null)
    
}
const HTimeChange = (time,AvailableSlots) =>{
  console.log("time====",time)

console.log("AvailableSlots====",AvailableSlots)
  
 console.log("time.toApiDate()====",toApiDate(time))
    // ResetField()
    setUserTime(time)
   
}
  useEffect(() => {
    if(Api.NewApiToUserMessage!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);

  useEffect(() => {
    if(userService==null || userDate == null) return;
      dispatch(
        apiRequest({
          name: "NewOrderService.jsx | GetDailyAvailableDivisions",
          url: "api/OrderServices/GetDailyAvailableDivisions",
          method: "POST",
          body: {
              ServiceId:userService?.Id, 
              targetStart:toApiDate(userDate)},
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 888",Response)
          setAvailableDivs(Response.data)
        })
  }, [userTime]);




return (
<div className='Intergrated NewService'>
        <QuerySelect 
          isDynamic={true}
          optionsArray={Services? Services:[]}
          placeholder="Services*"
          setValue={(val) =>  (setUserService(val!=null?val:null),ResetField())}
          zIndex={3}
        />


      {/* <div className='SpecialDateButton'
        onClick={()=>(setShowDatePick(!showDatePick),setShowTimePick(false))}
      >{userDate?
        toApiDate(userDate)
            :"Date*"} <IoCalendar/> 33
      </div>
      {showDatePick?


      <FormDateSelect ReturnVal={(val) => HDateChange(val)}/>
      :null} */}
      {userService?
      <FormDateSelect ReturnVal={(val) => HDateChange(val)} DateRangeBreak ={()=>console.log("")} AllowPastDates={false} 
      locale={Api.locale}
      />

        :null}






        {userService && userDate && AvailableSlots!=null?

          <div className='MultiTimes'>
          {AvailableSlots.TimeSlots.map((item, index) => (
            <div className={userTime==item.Start?"selected":"" }onClick={()=>HTimeChange(item.Start,AvailableSlots)}>
              <div>{item.Start.split('T')[1].split(':').slice(0, 2).join(':')}</div>
              <div>{item.Capacity +" slots"}</div>
            </div>
          ))}
          </div>


        :AvailableSlots==null && userDate?<span>Select a valid date</span>:<span>Select a service</span>}



      {userTime?
        <>
        <label>Optional/Preferential division</label>
        <QuerySelect 
          isDynamic={true}
          optionsArray={AvailableDivs? AvailableDivs:[]}
          placeholder="Division*"
          setValue={(val) =>  (setUserDivision(val!=null?val:null),ResetField())}
          zIndex={4}
        />
        </>
      :null}
    
 
      {/* <QuerySelect 
        optionsArray={Api.Customers}
        placeholder="Customers*"
        setValue={(val) => setUserCustomer(val!=null?val:null)}
      /> */}
      {userTime?
      <div className='Actions'>
      <div className="ChangeSelection" onClick={()=>ChangeSelection()}><IoCloseSharp /></div> 
      <div className="DirectBook" onClick={()=>TryNewOrderService(SelectedOrder,UserDivision,userService,userTime,dispatch,apiRequest,ChangeSelection)}>Book it!</div> 
      </div>
      :AvailableSlots?<span>Select a time</span>:null}


      <Messaging ParentMessage={Message} IsLocal={true}/>
</div>

);
}



const TryNewOrderService =(SelectedOrder,UserDivision,userService,userTime,dispatch,apiRequest,ChangeSelection)=>{

  console.log("SelectedOrder==",SelectedOrder)
  console.log("UserDivision==",UserDivision)
  console.log("userService==",userService)
  console.log("userTime==",userTime)


  const body = {
    OrderId: SelectedOrder.Id,
    ...(UserDivision != null && { DivisionId: UserDivision.Id }),
    StartDate: userTime,
    ServiceId: userService.Id,
  };

  console.log("body===",body)

  dispatch(
    apiRequest({
      name: "NewOrderService.jsx | TryNewOrderService",
      url: "api/OrderServices/Add",
      method: "POST",
      body: body,
      auth: true,
      tokenRequired: true,
      storeIn: "OrderServices"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 333",Response)
          ChangeSelection()
        })



  
};