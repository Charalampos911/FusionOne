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




export default function UpdateStatusOrderService({OrderService,Services,SelectedOrder,ChangeSelection}) { 
  console.log("OrderService=== 000",OrderService)
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
  const [ServiceStatuses, setServiceStatuses] = useState(null);
  const [AcceptableServiceStatuses, setAcceptableServiceStatuses] = useState(null);


  const [UserServiceStatus, setUserServiceStatus] = useState(null);
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
    console.log("Response==> 111")
      dispatch(
        apiRequest({
          flatten: true,
          name: "UpdateStatusOrderService.jsx | GetServiceStatuses",
          url: "api/Enumerals/GetEnum/ServiceStatus",
          method: "GET",
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap() // Waits for the thunk to resolve successfully
        .then((ResponseA) => {
          console.log("Response==> 444",ResponseA)
          setServiceStatuses(ResponseA.data)
        

      dispatch(
        apiRequest({
          flatten: true,
          name: "UpdateStatusOrderService.jsx | GetAcceptableServiceStatuses",
          url: "api/OrderServices/GetAcceptableServiceStatuses",
          method: "POST",
          body: {
            OrderServiceId: OrderService.Id
          },
          auth: true,
          tokenRequired: true,
          storeIn: "GetServiceStatuses"
        })
      ).unwrap() // Waits for the thunk to resolve successfully
      .then((ResponseB) => {
        console.log("Response==> 555", ResponseB);

        // 1. Flatten ResponseB.data down to an array of pure numbers (e.g., [1, 2])
        const allowedIds = ResponseB.data.flat();

        // 2. Filter ResponseA.data 
        // 'item' represents an array like ['InProgress', 1]. item[1] gets the number 1.
        const filteredStatuses = ResponseA.data.filter(item => 
          allowedIds.includes(item[1])
        );
        console.log("AcceptableServiceStatuses===",filteredStatuses)
        // 3. Save the matching statuses into your state
        setAcceptableServiceStatuses(filteredStatuses);
      })
    
      })
   }, []);

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
    
}
const HTimeChange = (date) =>{
    ResetField()
    setUserTime(date)
   
}
  useEffect(() => {
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);




return (
<div className='Intergrated UpdateServiceStatus'>
      <label>Current: {ServiceStatuses && ServiceStatuses.find(e=>e[1] == OrderService.AppointmentStatus)[0]}</label>
      <QuerySelect 
        isDynamic={true}
        optionsArray={AcceptableServiceStatuses}
        placeholder="Service Status*"
        setValue={(val) => setUserServiceStatus(val!=null?val:null)}
      />


      {UserServiceStatus?
      <div className="DirectBook" onClick={()=>TryUpdateServiceStatus(UserServiceStatus[1],OrderService,dispatch,apiRequest,ChangeSelection)}>UPDATE</div> 
      :null}
      {Message?.msg && (
        <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
          {Message.msg}
        </span>
      )}
</div>

);
}



const TryUpdateServiceStatus =(UserServiceStatus, OrderService,dispatch,apiRequest,ChangeSelection)=>{
  const body = {
    OrderServiceId: OrderService.Id,
    ServiceStatus: UserServiceStatus
  };

  console.log("body===",body)

  dispatch(
    apiRequest({
      name: "UpdateServiceStatus.jsx | TryUpdateServiceStatus",
      url: "api/OrderServices/UpdateServiceStatus",
      method: "PUT",
      body: body,
      auth: true,
      tokenRequired: true,
      storeIn: "UpdateServiceStatus"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 333",Response)
          ChangeSelection()
        })



  
};