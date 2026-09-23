import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setDepartmentId,setDivisionId ,clearDivisionOpenDays} from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import DynamicDateSelect from "../../../UI/DynamicDateSelect";
import DynamicSelect from "../../../UI/DynamicSelect";
import QuerySelect from "../../../NewUI/QuerySelect";
import FormDateSelect from "../../../NewUI/FormDateSelect";
import { IoPersonAddOutline } from "react-icons/io5";

import { GiConfirmed } from "react-icons/gi";



import { GrCompliance } from "react-icons/gr";

import { BiTransfer } from "react-icons/bi";
import { TbProgressHelp,TbProgressDown,TbProgressCheck,TbProgressX   } from "react-icons/tb";
import { TbShoppingBag } from "react-icons/tb";

import NewCustomer from "../../CustomerManager/NewCustomer";
import dayjs from "dayjs";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineSegment,MdOutlinePendingActions } from "react-icons/md";

import OrdersMasterManager from '../../OrdersManager/OrdersMasterManager';

import ScopeManager from '../../../UI/ScopeManager';
export default function Scheduler(props) { 
  console.log("props===",props)
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [Scope, setScope] = useState(true);

  const [ActiveTab, setActiveTab] = useState(0);
  const [Segment, setSegment] = useState(null);
  const [SelectedSegment, setSelectedSegment] = useState(null);
  const [TransferSegment, setTransferSegment] = useState(null);
  const [Departments, setDepartments] = useState(null);
  const [Department, setDepartment] = useState(Api.DepartmentId || null);
  const [Message, setMessage] = useState(null);
  const [DivisionsByDept, setDivisionsByDept] = useState(null);
  const [ServiceStatuses, setServiceStatuses] = useState(null);
  const [SelectedTime, SetSelectedTime] = useState(null);

  const [Division, setDivision] = useState(null);
  const [UserDate, setUserDate] = useState(new Date().toISOString().split('T')[0]);
  const [OpenWeek, setOpenWeek] = useState("A");
  const [availableTimeSlots, setAvailableTimeSlots] = useState(null);
  const [DailyQueryByDivision, setDailyQueryByDivision] = useState(null);

  const [refresh, setRefresh] = useState(null);

    useEffect(() => {
      setMessage(Api.NewApiToUserMessage);
    }, [Api.NewApiToUserMessage]);
  const PrintState =()=>{
    console.clear()
    console.log(" ")
    console.log("Department==",Department)
    console.log("UserDate==",UserDate)
    console.log("ServiceStatuses==",ServiceStatuses)
    console.log("SelectedTime==",SelectedTime)
    console.log("SelectedSegment==",SelectedSegment)
    console.log("TransferSegment==",TransferSegment)
    
    console.log(" ")
  }
  useEffect(() => {
    PrintState()
  }, [SelectedTime]);
  useEffect(() => {
    if(Department==null) return;
    PrintState()
    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | useEffect",
        url: "api/OrderServices/DailyQueryByDivision",
        method: "POST",
        body: {
          StartDate: UserDate,
          DepartmentId:Department,
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )

    .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
        setDailyQueryByDivision(Response.data)
    })
    const isPastDate = dayjs(UserDate).isBefore(dayjs(), "day");
    setAvailableTimeSlots(null)
    if(TransferSegment!=null && !isPastDate )
    TransferSlotsPerDate(UserDate,TransferSegment,setAvailableTimeSlots,SetSelectedTime,apiRequest,dispatch)

   }, [UserDate,Department,refresh]);


  useEffect(() => {
    PrintState()

    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | useEffect",
        url: "api/Enumerals/GetEnum/ServiceStatus",
        method: "GET",
        auth: true,
        tokenRequired: true,
        storeIn: "ServiceStatuses"
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Response.ServiceStatuses==>",Response)
        setServiceStatuses(Response.data)
    })

   }, []);
   
const handleDateChange = (val) => {
  // Convert the string "2026-01-21" into a Date Object
  const dateObj = new Date(val);
  console.log("Newest date===",val)
  console.log("Newest dateObj===",dateObj)
  setUserDate(val);
  // Get the day of the month (21)
  const day = dateObj.getDate();
  // Calculate the index (1-7=0, 8-14=1, 15-21=2, 22-28=3, 29+=4)
  const weekIndex = Math.ceil(day / 7) - 1;
  // Safely pick the week from your array
  const selectedWeek = Weeks[Math.min(weekIndex, Weeks.length - 1)];
  setOpenWeek(selectedWeek);
};

var totalDays = Api.DivisionOpenDays?.reduce((acc, week) => acc + (week?.length || 0), 0) || 0;
var Weeks = totalDays>28?['A','B','C','D','E']:['A','B','C','D'];
const times = [];

for (let i = 0; i < 24; i++) {
  const hour = i.toString().padStart(2, '0');
  times.push(`${hour}:00`);
  times.push(`${hour}:30`);
}
console.log("times===",times)
const PX_PER_MINUTE = 1;
const isTimeSlotAvailable = (timeString, division) => {
  if (!division?.TimeSlots || division.TimeSlots.length === 0) return false;

  return division.TimeSlots.some((slot) => {
    // Convert UTC Start to local time (HH:mm) or match format
    const slotTime = dayjs(slot.Start).format("HH:mm");
    return slotTime === timeString;
  });
};
return (
  <>
  {ActiveTab==0?
  <div id="Daily-Scheduler-container">
    <div className="Daily-Scheduler">
      <div className='Daily-Scheduler-head'>     
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div> 
        <label>Daily Scheduler</label>
      </div>
      <div className='Daily-Scheduler-body'>
        <div className='vertical-menu'>
        <div className='options'>
          {!props.DivisionId?

            <ScopeManager Prop={"DepartmentId"} setValue={(e)=>setDepartment(e)} Sorting={(val) => null} Clear={null} ShowClear={false} ShowSorting={false}/>

        :null}
      </div>
         <FormDateSelect ReturnVal={(val) => handleDateChange(val)} DateRangeBreak={()=>null} />
        </div>
        <div className='Scheduler-Divisions-box'>
          {DailyQueryByDivision?.DivisionOrderServices?.map((ThisDiv, indexA) =>{ 
            const divisionData = availableTimeSlots?.Divisions?.find(
                (d) => d.DivisionId === ThisDiv?.DivisionId
              );

            return(
            <div className={`Scheduler-Division`}>
              <div className='Name'><div>{ThisDiv.DivisionName}</div></div>
              <div className='Seperator'></div>
              <div className='Column'>
                <div className='time-Spam' key={"time-Spam-"+indexA}>
                {times?.map((item, indexC) => {
                  // 1. Find the target division object from availableTimeSlots.Divisions
   

                  // 2. Check if the current time 'item' (e.g. "18:00") exists in TimeSlots
                  const isTransfer = divisionData?.TimeSlots?.some((slot) => {
                    // Extract HH:mm directly from ISO string (or use dayjs(slot.Start).format("HH:mm"))
                    const slotTime = slot.Start ? slot.Start.substring(11, 16) : "";
                    return slotTime === item;
                  });

                  const isSelected =
                    SelectedTime?.Time === item &&
                    SelectedTime?.DivisionId === ThisDiv?.DivisionId &&
                    SelectedTime?.Date === UserDate;

                  return (
                  <div
                    key={"Day-Time-Blocks-" + indexC}
                    className={`Day-Time-Blocks ${isTransfer ? "IsTransfer" : ""} ${isSelected ? "Selected-Time" : ""}`}
                    onClick={() => {
                      // 1. Build the target time object for clarity
                      const newSelectedTime = {
                        DivisionId: ThisDiv.DivisionId,
                        Time: item,
                        Date: UserDate,
                      };

                      // 2. Execute HTransfer if transfer segment exists
                      if (TransferSegment != null) {
                        HTransfer(
                          UserDate,
                          SelectedSegment,
                          TransferSegment,
                          setTransferSegment,
                          newSelectedTime, // Pass the newly clicked time directly to avoid state delay
                          SetSelectedTime,
                          setAvailableTimeSlots,
                          Department,
                          PrintState,
                          dispatch,
                          apiRequest,
                          setSelectedSegment,
                          setDailyQueryByDivision,
                          setRefresh,
                          refresh
                        );
                      }

                      // 3. Update the state with the selected time
                      SetSelectedTime(newSelectedTime);
                    }}
                  >
                    {item}
                  </div>
                  );
                })}

                  
                </div>


              {ThisDiv.OrderService?.map((Oserv, indexB) =>{
                console.log("Oserv for "+Oserv.Service.Name+" is ===",Oserv)
                return (

                  
                  <div
                    key={indexB}
                    className={`Scheduler-Division-appointment ${Oserv?.Id==SelectedSegment?.Id? "Selected":null} ${TransferSegment?.Id==Oserv?.Id? "Transferable" :null}`}
                    onClick={()=>HSelectSegment(Oserv,setSelectedSegment,setTransferSegment)}
                    style={{
                      height: (Oserv.SegmentDuration - 10) * PX_PER_MINUTE,
                      top: getMinutesFromMidnight(Oserv.SegmentStartDate.split('T')[1]) * PX_PER_MINUTE + 10
                    }}
                    >
                    <div>
                      <span >{Oserv.Service.Name}</span>
                      <span ><time>{Oserv.SegmentStartDate.split('T')[1].substring(0, 5)} {Oserv.Service.DurationMinutes}'</time></span>


                    <span className='Status' >
                        {/* Render the Text */}
                      {ServiceStatuses?.find(status => status[1] === Oserv?.AppointmentStatus)?.[0] || 'Unknown'}
                      {/* Render the Icon */}
                      {(() => {
                        switch (Oserv?.AppointmentStatus) {
                          case 0: return <div className='StatusIcons pending'><MdOutlinePendingActions  /></div>;
                          case 1: return <div className='StatusIcons inprocess'><TbProgressDown /></div>;
                          case 2: return <div className='StatusIcons completed'><GrCompliance /></div>;
                          case 3: return <div className='StatusIcons confirmed'><GiConfirmed /></div>;
                          default: return null;
                        }
                      })()}
                      
                    
                      
                    </span>

                    </div>
                  </div>
                )
              }
              )}
               </div>
              </div>
            )
          })}
        </div>

        
        <div id="Quick-Menu" >
        
            <div className="Quick-Actions">
            <div onClick={()=>HNewCustomer(setActiveTab)}>
              <><IoPersonAddOutline/><div><div><div>New customer</div></div></div></>
            </div>
            {SelectedSegment != null?
            <>
        
              <div onClick={()=>HTransfer(UserDate,SelectedSegment,TransferSegment,setTransferSegment,SelectedTime,SetSelectedTime,setAvailableTimeSlots,Department,PrintState,dispatch,apiRequest,setSelectedSegment,setDailyQueryByDivision,setRefresh,refresh )}>
                <><BiTransfer /><div><div><div>Transfer</div></div></div></>
              </div>
              <div onClick={() => {
                  const nextIndex = (StatusIndex + 1) % ServiceStatuses.length;
                  
                  HProggresion(
                    SelectedSegment,
                    dispatch,
                    apiRequest,
                    setSelectedSegment,
                    ServiceStatuses[StatusIndex] // Uses current index
                  );
                  
                  setStatusIndex(nextIndex); // State stays safely between 0 and (length - 1)
                }}>
        
                {SelectedSegment.AppointmentStatus==0?<><TbProgressHelp /><div><div><div>pending</div></div></div></>:null}
                {SelectedSegment.AppointmentStatus==1?<><TbProgressDown /><div><div><div>In-progress</div></div></div></>:null}
                {SelectedSegment.AppointmentStatus==2?<><TbProgressCheck /><div><div><div>Completed</div></div></div></>:null}
                {SelectedSegment.AppointmentStatus==3?<><TbProgressX /><div><div><div>Canceled</div></div></div></>:null}
              </div>

              <div onClick={()=>(PrintState(),setActiveTab(2))}>
                <TbShoppingBag />
              </div>
            </>
            :null}
            </div>
        </div>
        


      </div>
    </div>
  </div>
  :null}
      {ActiveTab==1  && Department!=null?


          <NewCustomer 
          Title="Create a customer and an order"
          ChangeSelection={()=>setActiveTab(0)}
          DepartmentId ={Department}
          CreateOrder ={true}
          NewCustomer={()=>null}
          />
      :null}
      {ActiveTab==2?
          <OrdersMasterManager Customer = {SelectedSegment.Order.CustomerId} ChangeSelection={()=>setActiveTab(0)}/>
      :null}
  </>
);
}

const HSelectSegment=(seg,setSelectedSegment,setTransferSegment)=>{
  console.log(" Selected seg == ",seg)
  setSelectedSegment(seg)
  setTransferSegment(null)
}
const HNewCustomer=(setActiveTab)=>{

  setActiveTab(1)
}



//HTransfer(UserDate,seg,TransferSegment,setTransferSegment,SelectedTime,SetSelectedTime,setAvailableTimeSlots,DepartmentId,PrintState,dispatch,apiRequest,setSelectedSegment,setDailyQueryByDivision )
const HTransfer=(UserDate,seg,TransferSegment,setTransferSegment,SelectedTime,SetSelectedTime,setAvailableTimeSlots,DepartmentId,PrintState,dispatch,apiRequest,setSelectedSegment,setDailyQueryByDivision,setRefresh,refresh   )=>{
  console.clear()
  console.log("SelectedTime===",SelectedTime)
    console.log("TransferSegment===",TransferSegment)
    console.log("seg===",seg)
  setTransferSegment(seg)
  
console.log("UserDate===",UserDate)
TransferSlotsPerDate(UserDate,seg,setAvailableTimeSlots,SetSelectedTime,apiRequest,dispatch)




  if(TransferSegment != null && seg != null && SelectedTime != null)
    dispatch( 
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | HTransfer.SUpdate",
        url: "api/OrderServices/SUpdate",
        method: "PUT",
        body: {
          OrderServiceId: seg.Id,
          DivisionId: SelectedTime.DivisionId,
          StartDate: new Date(`${SelectedTime.Date.split('T')[0]}T${SelectedTime.Time}:00Z`),
          DepartmentId: DepartmentId
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
           setDailyQueryByDivision(Response.data)
           setRefresh(refresh+1)
          setSelectedSegment(null)
          setTransferSegment(null)
          SetSelectedTime(null)
        })





}

// TransferSlotsPerDate(UserDate,seg,setAvailableTimeSlots,SetSelectedTime,apiRequest,dispatch)

const TransferSlotsPerDate =(UserDate,seg,setAvailableTimeSlots,SetSelectedTime,apiRequest,dispatch)=>{


        dispatch(
        apiRequest({
          flatten: true,
          name: "DailyScheduler.jsx | TransferSlotsPerDate",
          url: "api/OrderServices/GetTransferAvailabilityPerDivision",
          method: "POST",
          body: {
              StartDate:UserDate ,
              OrderServiceId: seg.Id},
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==> 444",Response)
          setAvailableTimeSlots(Response.data)
          SetSelectedTime(null)
        })

}




const HProggresion=(seg,dispatch,apiRequest,setSelectedSegment,ServiceStatuse)=>{
  if(seg != null)
    dispatch( 
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | HProggresion.ToggleServiceStatus",
        url: "api/OrderServices/SUpdateServiceStatus",
        method: "PUT",
        body: {
          OrderServiceId: seg.Id,
          ServiceStatus: ServiceStatuses
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
         
          setSelectedSegment(null)
        })
}



const getMinutesFromMidnight = (timeStr) => {
  if(timeStr==null) return 0;
  const [hours, minutes] = timeStr?.split(':').map(Number);
  return (hours * 60) + minutes;
};
