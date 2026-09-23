import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearScheduleTemplateDays } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import DynamicDateSelect from "../../../UI/DynamicDateSelect";
import FormsSelectFetch from "../../../NewUI/FormsSelectFetch"
import FormDateSelect from "../../../NewUI/FormDateSelect"
import Editor from "./Editor";
import Creator from "./Creator";

export default function Scheduler(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [ActiveTab, setActiveTab] = useState(0);
  const [Segment, setSegment] = useState(null);
  const [ScheduleTemplate, setScheduleTemplate] = useState(null);
  const [UserDate, setUserDate] = useState(new Date().toISOString().split('T')[0]);
  const [OpenWeek, setOpenWeek] = useState("A");
  useEffect(() => {
    dispatch(clearScheduleTemplateDays());
    if(ScheduleTemplate==null)return;
    
    dispatch(
      apiRequest({
        name: "ScheduleTemplate.Scheduler.jsx | ScheduleMonthByWeeks",
        url: "api/ScheduleTemplateDays/ScheduleMonthByWeeks",
        method: "POST",
        body: {scheduleTemplateId: ScheduleTemplate},
        auth: true,
        tokenRequired: true,
        storeIn: "ScheduleTemplateDays"
      })
    )
   }, [ScheduleTemplate,UserDate,ActiveTab]);

const handleDateChange = (val) => {
  // Convert the string "2026-01-21" into a Date Object
  console.clear()
  console.log("New date val===",val)
  const dateObj = new Date(val);
    console.log("New date dateObj===",dateObj)
  setUserDate(val);
  // Get the day of the month (21)
  const day = dateObj.getDate();
  // Calculate the index (1-7=0, 8-14=1, 15-21=2, 22-28=3, 29+=4)
  const weekIndex = Math.ceil(day / 7) - 1;
  // Safely pick the week from your array
  const selectedWeek = Weeks[Math.min(weekIndex, Weeks.length)];
  setOpenWeek(selectedWeek);
};

var totalDays = Api.EmployeeWorkDays?.reduce((acc, week) => acc + (week?.length || 0), 0) || 0;
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
return (
  <>
  {ActiveTab==0?
  <div id="Solo-Scheduler-container">
    <div className="Solo-Scheduler">
      <div className='Solo-Scheduler-head'>     
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div> 
        <label>Schedule Template days Scheduler</label>
      </div>
      <div className='Scheduler-box'>
        <div className='vertical-menu'>
          <FormsSelectFetch 
            key={0}
            placeholder="Schedule Template"
            url={Api.Relationships[33][1]}
            ElValue={ScheduleTemplate}
            ReturnVal={(val) => setScheduleTemplate(val)}
          />
          <FormDateSelect ReturnVal={(val) => handleDateChange(val)}/>
          {/* <DynamicDateSelect
            key={1}
            type={"date"} // Passing the mode here
            IsRequired={false}
            placeholder={"Date"}
            ElValue={UserDate ?? ""}
            Clear={false} 
            setValue={(val) => handleDateChange(val)}
            Sorting={(val) =>null}
          /> */}
        </div>
      <div className='Scheduler-week-box'>
        {Api.ScheduleTemplateDays && Api.ScheduleTemplateDays?.map((item, indexA) =>{ 
          var ThisWeek = item;
          // const formatDateParts = (isoDate) => {
          //   const date = new Date(isoDate);

          //   const dayName = date.toLocaleDateString('en-US', {
          //     weekday: 'long',
          //   });
          //   const formattedDate = date
          //     .toLocaleDateString('en-GB') // dd/mm/yyyy
          //     .replace(/\//g, '-');        // dd-mm-yyyy
          //   return { dayName, formattedDate };
          // };
          return(
          <div className={`Scheduler-week ${OpenWeek!=Weeks[indexA]?"Hidden":Weeks[indexA]}`}>
            {ThisWeek && ThisWeek?.map((dayItem, indexB) =>{
            // const { dayName, formattedDate } = formatDateParts(dayItem.Date);
              return (
              <div className='Week-days' key={"Week-days-"+indexB}>
                <div className="Week-days-names" key={"Week-days-names-"+indexB} >
                  <div>{dayItem.DayNumber}</div>
                  {/* <div>{formattedDate}</div> */}
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
                          height: (seg.WorkMinutes + seg.BreakMinutes - 10) * PX_PER_MINUTE,
                          top: getMinutesFromMidnight(seg.SwiftStart) * PX_PER_MINUTE
                        }}
                        >
                        <div>
                          <span>Day: {seg.DayNumber}</span>
                          <span style={{fontWeight:'bold'}}>From:</span>
                          <span>{seg.SwiftStart}</span>
                          <span style={{fontWeight:'bold'}}>until:</span>
                          <span>{seg.SwiftEnd}</span>
                        </div>
                      </div>
                      :
                   <div
                        key={i}
                        className='Open-times-Block Availability'
                        onClick={()=>HNew(seg)}
                        style={{
                          height: (seg.WorkMinutes - 10) * PX_PER_MINUTE ,
                          top: getMinutesFromMidnight(seg.SwiftStart) * PX_PER_MINUTE
                        }}
                        >
                        <div>
                          <span>CLOSED</span>
                          <span>Day: {seg.DayNumber}</span>
                          <span style={{fontWeight:'bold'}}>From:</span>
                          <span>{seg.SwiftStart}</span>
                          <span style={{fontWeight:'bold'}}>until:</span>
                          <span>{seg.SwiftEnd}</span>
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
      <Editor ScheduleTemplate={ScheduleTemplate} ChangeSelection={()=> setActiveTab(0)} Segment={Segment}/>
      :null}
      {ActiveTab==2?
      <Creator  ScheduleTemplate={ScheduleTemplate} ChangeSelection={()=> setActiveTab(0)} Segment={Segment}/>
      :null}
  </>
);
}

const getMinutesFromMidnight = (timeStr) => {
  if(timeStr==null) return 0;
  const [hours, minutes] = timeStr?.split(':').map(Number);
  return (hours * 60) + minutes;
};