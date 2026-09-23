import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setDivisionId} from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";

import Editor from "./Editor";
import Creator from "./Creator";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineSegment } from "react-icons/md";
import QuerySelect from "../../../NewUI/QuerySelect";
import FormDateSelect from "../../../NewUI/FormDateSelect";



export default function Scheduler(props) { 
  console.log("props===",props)
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [ActiveTab, setActiveTab] = useState(0);
  const [Segment, setSegment] = useState(null);


  const [Scope, setScope] = useState(true);
  
  const [UserDate, setUserDate] = useState(new Date().toISOString().split('T')[0]);
  const [OpenWeek, setOpenWeek] = useState("A");
 
  const [Establishments, setEstablishments] = useState(null);
  const [Establishment, setEstablishment] = useState(null);

  const [Departments, setDepartments] = useState(null);
  const [Department, setDepartment] = useState(null);

  const [Divisions, setDivisions] = useState(null);
  const [Division, setDivision] = useState(props.DivisionId || null);

  const [DivisionOpenDays, setDivisionOpenDays] = useState(null);

  useEffect(() => {
    dispatch(
      apiRequest({
        name: "Divisions.Overview.jsx | useEffect",
        url: "api/DivisionOpenDays/OpenMonthByWeeks",
        method: "POST",
        body: {Month:UserDate,DivisionId: Division},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap()
    .then((Response) => {
        setDivisionOpenDays(Response.data)
    })

   }, [Division,UserDate,ActiveTab]);

const handleDateChange = (val) => {
  // Convert the string "2026-01-21" into a Date Object
  const dateObj = new Date(val);
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

const PX_PER_MINUTE = 1;
const HEdit=(seg)=>{
  setActiveTab(1)
  setSegment(seg)
}
const HNew=(seg)=>{
  setActiveTab(2)
  setSegment(seg)
}



  useEffect(() => {
    dispatch(
      apiRequest({
        flatten: true,
        name: "Employees.Scheduler.jsx | Establishments",
        url: Api.Relationships[1][1],
        method: "POST",
        body: {OrganizationId: Api.Token.OrganizationId},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
           setEstablishments(Response.data)
        })
   }, []);

  useEffect(() => {
    if(Establishment==null) return;
    dispatch(
      apiRequest({
        flatten: true,
        name: "Employees.Scheduler.jsx | departments",
        url: Api.Relationships[2][1],
        method: "POST",
        body: {EstablishmentId: Establishment},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
           setDepartments(Response.data)
        })
   }, [Establishment]);


  useEffect(() => {
    if(Department==null) return;
    dispatch(
      apiRequest({
        flatten: true,
        name: "Employees.Scheduler.jsx | useEffect",
        url: Api.Relationships[3][1],
        method: "POST",
        body: {DepartmentId: Department},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
           setDivisions(Response.data)
        })
   }, [Department]);













return (
  <>
  {ActiveTab==0?
  <div id="Solo-Scheduler-container">
    <div className="Solo-Scheduler">
      <div className='Solo-Scheduler-head'>     
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div> 
        <label>{props.DivisionName? 'Operations for '+props.DivisionName : 'Operations Scheduler'}</label>
      </div>
      <div className='Scheduler-box'>
        <div className='vertical-menu'>
        <div className='options'>
          {!props.DivisionId?
          <>
          <div className='Scope-button' onClick={()=>setScope(!Scope)}>{Scope?<MdOutlineSegment /> :<RxHamburgerMenu/>}</div>
          
          <div className={`Scope-select `}>
            {Scope?
            <>
            <QuerySelect 
              isDynamic={true}
              optionsArray={Establishments? Establishments:[]}
              placeholder="Establishments"
              setValue={(val) => setEstablishment(val.Id)}
              zIndex={4}
            />

            <QuerySelect 
              isDynamic={true}
              optionsArray={Departments? Departments:[]}
              placeholder="Departments"
              setValue={(val) => setDepartment(val.Id)}
              zIndex={3}
            />
            </>
            :null}

        <QuerySelect 
          isDynamic={true}
          optionsArray={Divisions? Divisions:[]}
          placeholder="Division"
          setValue={(val) => (setDivision(val.Id),setScope(false))}
          zIndex={2}
        />
        </div>
        </>
        :null}
      </div>
         <FormDateSelect ReturnVal={(val) => handleDateChange(val)}/>
          
        </div>
      <div className='Scheduler-week-box'>
        {DivisionOpenDays?.map((item, indexA) =>{ 
          var ThisWeek = item;
          const formatDateParts = (isoDate) => {
            const date = new Date(isoDate);

            const dayName = date.toLocaleDateString('en-US', {
              weekday: 'long',
            });
            const formattedDate = date
              .toLocaleDateString('en-GB') // dd/mm/yyyy
              .replace(/\//g, '-');        // dd-mm-yyyy
            return { dayName, formattedDate };
          };
          return(
          <div className={`Scheduler-week ${OpenWeek!=Weeks[indexA]?"Hidden":Weeks[indexA]}`}>
            {ThisWeek?.map((dayItem, indexB) =>{
            const { dayName, formattedDate } = formatDateParts(dayItem.Date);
              return (
              <div className='Week-days' key={"Week-days-"+indexB}>
                <div className="Week-days-names" key={"Week-days-names-"+indexB} >
                  <div>{dayName}</div>
                  <div>{formattedDate}</div>
                </div>
                <div className='Week-days-Open-time-Spam' key={"Week-days-Open-time-Spam-"+indexB}>
                  {times?.map((item, indexC) =>
                  <div className='Day-Time-Blocks' key={"Day-Time-Blocks-"+indexC}>
                    {item}
                  </div>
                  )}
                </div>
                <div className='Week-days-Open-times '>
                  <div>
                  {dayItem?.Entries?.map((seg, i) => (
                    <>
                     {!seg.IsUndeclared?
                      <div
                        key={i}
                        className='Open-times-Block Open'
                        onClick={()=>HEdit(seg)}
                        style={{
                          height: (seg.durationMinutes - 10) * PX_PER_MINUTE,
                          top: getMinutesFromMidnight(seg.StartDate.split('T')[1]) * PX_PER_MINUTE
                        }}
                        >
                        <div>
                          <span style={{fontWeight:'bold'}}>OPEN</span>
                          <span style={{fontWeight:'bold'}}>From:</span>
                          <span>{seg.StartDate.split('T')[1]}</span>
                          <span style={{fontWeight:'bold'}}>until:</span>
                          <span>{seg.EndDate.split('T')[1]}</span>
                        </div>
                      </div>
                   :
                     <div
                        key={i}
                        className='Open-times-Block Availability'
                        onClick={()=>HNew(seg)}
                        style={{
                          height: (seg.durationMinutes - 10) * PX_PER_MINUTE ,
                          top: getMinutesFromMidnight(seg.StartDate.split('T')[1]) * PX_PER_MINUTE
                        }}
                        >
                        <div>
                          <span style={{fontWeight:'bold'}}>CLOSED</span>
                          <span style={{fontWeight:'bold'}}>From:</span>
                          <span>{seg.StartDate.split('T')[1]}</span>
                          <span style={{fontWeight:'bold'}}>until:</span>
                          <span>{seg.EndDate.split('T')[1]}</span>
                        </div>
                      </div>
                  }
                  </>

                  ))}
                  </div>
                </div>
              </div>
              )
            }
            )}
            </div>
          )
        })}
      </div>
    </div>
    </div>
  </div>
  :null}
      {ActiveTab==1?
      <Editor ChangeSelection={()=> setActiveTab(0)} Segment={Segment}/>
      :null}
      {ActiveTab==2?
      <Creator ChangeSelection={()=> setActiveTab(0)} Segment={Segment}/>
      :null}
  </>
);
}

const getMinutesFromMidnight = (timeStr) => {
  if(timeStr==null) return 0;
  const [hours, minutes] = timeStr?.split(':').map(Number);
  return (hours * 60) + minutes;
};