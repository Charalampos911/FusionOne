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

import Messaging from '../../NewUI/Messaging';

export default function UpdateDateOrderService({OrderService,Services,SelectedOrder,ChangeSelection}) { 

  console.log("OrderService===",OrderService)
  console.log("SelectedOrder===",SelectedOrder)
   console.log("OrderService.SegmentStartDate.split('T')[1].substring(0, 5)===",OrderService.SegmentStartDate.split('T')[1].substring(0, 5))
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [userService, setUserService] = useState(null);
  const [showDatePick, setShowDatePick] = useState(false);
  const [showTimePick, setShowTimePick] = useState(false);
  const [userDate, setUserDate] = useState(null);
  const [userTime, setUserTime] = useState(null);
  const [userCustomer, setUserCustomer] = useState(null);
  const [Message, setMessage] = useState(null);
  const [AvailableDivs, setAvailableDivs] = useState(null);
  const [UserDivision, setUserDivision] = useState(null);
  const [AvailableSlots, setAvailableSlots] = useState(null);

   useEffect(() => {
    if(Api.NewApiToUserMessage?.msg!="Success")
     setMessage(Api.NewApiToUserMessage);
   }, [Api.NewApiToUserMessage]);

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
    setUserTime(OrderService.SegmentStartDate)
  }, []);
  useEffect(() => {
    setMessage(null)

  }, [Api.Establishments,Api.Departments,Api.Services,userService,userDate,userCustomer]);
  useEffect(() => {
    console.log("Response==> 111")
      if(userDate==null) return;
      dispatch(
        apiRequest({
          flatten: true,
          name: "NewOrderService.jsx | GetTransferAvailability",
          url: "api/OrderServices/GetTransferAvailability",
          method: "POST",
          body: {
              StartDate:toApiDate(userDate) ,
              OrderServiceId: OrderService.Id},
          auth: true,
          tokenRequired: true,
          storeIn: "GetTransferAvailability"
        })
      ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 444",Response)
          setAvailableSlots(Response.data)
        })
    

   }, [userDate]);

  useEffect(() => {
         console.log("userTimeBB===",userTime)
   }, [userTime]);


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
const HTimeChange = (date) =>{
    ResetField()
    setUserTime(date)
   
}
  useEffect(() => {
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);



return (
<div className='Intergrated NewService'>
      {/* <QuerySelect 
        optionsArray={Services}
        placeholder="Services*"
        setValue={(val) => (setUserService(val!=null?val:null),ResetField())}
      />   */}

      {/* <div className='SpecialDateButton'
        onClick={()=>(setShowDatePick(!showDatePick),setShowTimePick(false))}
      >{userDate?
        toApiDate(userDate)
            :"Date*"} <IoCalendar/>
      </div>
      {showDatePick?
      <div style={{position: "fixed",top: "90px",zIndex:20}}>
      <QueryDateSelect
        setValue={(val) => HDateChange(val)}
      />
      </div>
      :null} */}


      {OrderService?
      <FormDateSelect
        ReturnVal={(val) => HDateChange(val)}   
        PreSelectedDate={OrderService.SegmentStartDate}
        DateRangeBreak={()=>setAvailableSlots(null)}
       />

        :null}







        {AvailableSlots!=null?

          <div className='MultiTimes'>
          {AvailableSlots.TimeSlots.map((item, index) => {
            

            var tileTime = item.Start.split('T')[1].split(':').slice(0, 2).join(':');
            var IsSelected = userTime?.split('T')[1].substring(0, 5) == tileTime ;
   
            console.log("tileTime===",tileTime)
            console.log("IsSelected===",IsSelected)
           return (
            <div className={IsSelected?'selected':''} onClick={()=>setUserTime(item.Start)}>
              <div>{tileTime}</div>
              <div>{item.Capacity +" slots"}</div>
            </div>
          )
          }
        )
        
        }
          </div>


  :null}



   
    
 
      {/* <QuerySelect 
        optionsArray={Api.Customers}
        placeholder="Customers*"
        setValue={(val) => setUserCustomer(val!=null?val:null)}
      /> */}
      {AvailableSlots?
      <div className="DirectBook" onClick={()=>TryUpdateOrderService(OrderService,UserDivision,userTime,dispatch,apiRequest,ChangeSelection)}>UPDATE</div> 
      :null}
      <Messaging ParentMessage={Message} IsLocal={true}/>
</div>

);
}



const TryUpdateOrderService =(OrderService,UserDivision,userTime,dispatch,apiRequest,ChangeSelection)=>{
  console.clear()
  console.log("OrderService==",OrderService)
  console.log("UserDivision==",UserDivision)
  console.log("userTime==",userTime)


  const body = {
    OrderServiceId: OrderService.Id,
    ...(UserDivision != null && { DivisionId: UserDivision }),
    Discount:0,
    StartDate: userTime,
  };

  console.log("body===",body)

  dispatch(
    apiRequest({
      name: "UpdateOrderService.jsx | TryUpdateOrderService",
      url: "api/OrderServices/Update",
      method: "PUT",
      body: body,
      auth: true,
      tokenRequired: true,
      storeIn: "OrderServices"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 333",Response)
          ChangeSelection()
          setMessage({
            Name:"TryUpdateOrderService",
            Origin:"UpdateDateOrderService",
            Mood:true,
            msg:"Date updated successfully",
          })
        })



  
};