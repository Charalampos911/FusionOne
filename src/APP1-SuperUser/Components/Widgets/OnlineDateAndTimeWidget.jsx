import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setEstablishmentId ,setDepartmentId,setDivisionId,clearServices,ResetMsg} from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QueryDateSelect from "../../../components/UI/QueryDateSelect";
import QueryTimeSelect from "../../../components/UI/QueryTimeSelect";
import OnlineSelect from './OnlineSelect';
import { IoCalendar } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import {toApiDate,toApiDateTime} from "../../../utils/DatesTimesPhasm"
import OnlineDateSelect from './OnlineDateSelect';
import { IoCloseSharp } from "react-icons/io5";
import Messaging from '../../../components/NewUI/Messaging';
import { MdArrowCircleLeft } from "react-icons/md";

export default function OnlineDateAndTimeWidget({IsDiv, service=null,division=null,customer,department,GoBack,Browse}) { 

if(service==null && division== null) return;


  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [showDatePick, setShowDatePick] = useState(false);
  const [showTimePick, setShowTimePick] = useState(false);
  const [actionText, setActionText] = useState(false);

  const [userDate , setUserDate] = useState(new Date().toISOString().split('T')[0]);
  const [userTime, setUserTime] = useState(null);

  const [Message, setMessage] = useState(null);

  const [ActiveTab, setActiveTab] = useState(0);

  const [UserService, setUserService] = useState(service);
  const [UserDivision, setUserDivision] = useState(division);
  const [userFinal, setUserFinal] = useState(null);


  const [AvailableSlots, setAvailableSlots] = useState(null);

  const [divisions, setDivisions] = useState(false);
  const [services, setServices] = useState(false);


// console.clear()
console.log("service===",service)
console.log("division===",division)
console.log("customer===",customer)
console.log("department===",department)


console.log("divisions===",divisions)
console.log("services===",services)


console.log("AvailableSlots===",AvailableSlots)




 
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

// 2. Link refs to your "setReveal" states
useOutsideClick(refA, () => setRevealA(false));
useOutsideClick(refB, () => setRevealB(false));
useOutsideClick(refC, () => setRevealC(false));
useOutsideClick(refD, () => setRevealD(false));

  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [RevealC, setRevealC] = useState(false);
  const [RevealD, setRevealD] = useState(false);

  // useEffect(() => {
  //   dispatch(clearServices())
  //   dispatch(ResetMsg())
    
  // }, []);
  // useEffect(() => {
  //   setMessage(null)

  // }, [Api.Establishments,Api.Departments,Api.Services,service,userDate]);
  useEffect(() => {


      dispatch(
        apiRequest({
          name: "NewOrderService.jsx | GetDailyServiceAvailability",
          url: IsDiv?"api/ServicesSU/Query":"api/DivisionsSU/Query",
          method: "POST",
          body: {
              OrganizationId: Api.Token.OrganizationId,
              ServiceCategoryId: IsDiv?division?.ServiceCategoryId:service?.ServiceCategoryId,
              DivisionId: IsDiv?UserDivision.Id:null,
              ServiceId: !IsDiv?UserService.Id:null
          },
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 222",Response)
               console.log("ActiveTab==> 222",ActiveTab)

          IsDiv?
          setServices(Response.data)
          :setDivisions(Response.data)
        })
    

   }, [service,division,department,userDate]);


const HFinish = (fin) =>{
    console.log("UserFinal == ",fin)
    setUserFinal(fin)
    
}


  useEffect(() => {
    if(Api.NewApiToUserMessage.msg!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);




const HSelection = (serv) =>{
  IsDiv?
    setUserService(serv)
    :
    setUserDivision(serv)


    setActiveTab(1)
}


return (
<div className='online-service-selection'>

      {services==null?
        <div>OUT OF ORDER</div>
      :null}
      {(services!=null || divisions!=null) && ActiveTab==0?
        <>
          
          <OnlineSelect 
            IsDiv={IsDiv}
            optionsArray={IsDiv? services :divisions }
            placeholder={`Pick a ${IsDiv?"service":"division"}`}
            setValue={(val) =>  HSelection(val)}
        
            GoBack={()=>GoBack()}
          />
        </>
      :null
      }


      {UserService && ActiveTab==1 && userFinal==null?
        <OnlineDateSelect ReturnVal={(val) => HFinish(val)} DateRangeBreak ={()=>console.log("")} AllowPastDates={false} 
          locale={Api.locale} GoBack={()=>setActiveTab(0)}
          department={department}
          service={UserService}
          division={UserDivision}
        />
      :null}



      {userFinal?
      <div className='confirmation'>
        <div className='head'>
        <div
          className="online-back"
          onClick={() => (setUserFinal(null), setActiveTab(1),setActionText(false))}
        >
          <MdArrowCircleLeft />
        </div>
       
        <label>Your selection</label>
        </div>
        <div className='Cont'>
        <div>
          <label>Department:</label>
          <span>{userFinal.Department.Name}</span>
        </div>
        <div>
          <label>Division:</label>
          <span>{userFinal.Division.Name}</span>
        </div>
         <div>
          <label>Service:</label>
          <span>{userFinal.Service.Name}</span>
        </div>
         <div>
          <label>Date & time:</label>
          <span>
            {userFinal.StartDate.toLocaleDateString("el-GR")}{" - "}
            {userFinal.StartDate.toLocaleTimeString("el-GR", { hour: '2-digit', minute: '2-digit', hour12: false })} 
          </span>
        </div>
      </div>
        
      <div className='Actions'>
      <div className="DirectBook" onClick={()=>actionText?Browse():TryNewOrderService(Api.Token.OrganizationId,Api.Token.Customer,userFinal.Department,null,userFinal.Division,userFinal.Service,userFinal.StartDate,dispatch,apiRequest,setActionText)}>{actionText?"Booked, browse more...":"Book it!"}</div> 
      </div>
      </div>
      :
      ""
      }

      <Messaging ParentMessage={Message} IsLocal={true}/>
</div>

);
}



const TryNewOrderService =(OrganizationId,Customer,Department,SelectedOrder,UserDivision,UserService,userTime,dispatch,apiRequest,setActionText)=>{
console.clear()
    console.log("OrganizationId==",OrganizationId)
      console.log("CustomerId==",Customer.Id)
        console.log("DepartmentId==",Department.Id)


  console.log("SelectedOrder==",SelectedOrder)
  console.log("UserDivision==",UserDivision)
  console.log("UserService==",UserService)
  console.log("userTime==",userTime)
console.log("userTime.toLocaleDateString()==",userTime.toLocaleDateString())
console.log("userTime.toISOString()==",userTime.toISOString())

const result = toApiDate(userTime);

console.log(result); // "2026-02-27"
const result2 = toApiDateTime(userTime);

console.log(result2); // "2026-02-27T01:45:00.000Z"


  const body = {
    OrganizationId: OrganizationId,
    CustomerId: Customer.Id,
    DepartmentId:Department.Id,
    ...(SelectedOrder != null && { OrderId: SelectedOrder.Id }),
    ...(UserDivision != null && { DivisionId: UserDivision.Id }),
    ...(UserService != null && { ServiceId: UserService.Id }),
    StartDate: result2
  };

  console.log("body===",body)
// return;
  dispatch(
    apiRequest({
      name: "NewOrderService.jsx | TryNewOrderService",
      url: "api/OrderServicesSU/AddOrderServiceSU",
      method: "POST",
      body: body,
      auth: true,
      tokenRequired: true,
      storeIn: "OrderServicesSU"
    })
  ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("OrderServicesSU==>",Response)
          setActionText(true)
        })



  
};