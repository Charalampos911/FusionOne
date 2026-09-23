import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearOpenTemplateDays } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import FormsSelectFetch from "../../../NewUI/FormsSelectFetch"
import FormDateSelect from "../../../NewUI/FormDateSelect"
import Editor from "./Editor";
import Creator from "./Creator";

export default function Scheduler(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [ActiveTab, setActiveTab] = useState(0);
  const [Segment, setSegment] = useState(null);
  const [OpenTemplate, setOpenTemplate] = useState(null);
  const [UserDate, setUserDate] = useState(new Date().toISOString().split('T')[0]);
  const [OpenWeek, setOpenWeek] = useState("A");
  useEffect(() => {

    dispatch(clearOpenTemplateDays());
    if(OpenTemplate==null)return;
    
    dispatch(
      apiRequest({
        flatten: true,
        name: "OpenTemplate.Scheduler.jsx | OpenTemplateDays",
        url: "api/OpenTemplateDays/OpenMonthByWeeks",
        method: "POST",
        body: {OpenTemplateId: OpenTemplate},
        auth: true,
        tokenRequired: true,
        storeIn: "OpenTemplateDays"
      })
    )
   }, [OpenTemplate,UserDate,ActiveTab]);

const handleDateChange = (val) => {
  // Convert the string "2026-01-21" into a Date Object
  const dateObj = new Date(val);
  setUserDate(val);
  // Get the day of the month (21)
  const day = dateObj.getDate();
  // Calculate the index (1-7=0, 8-14=1, 15-21=2, 22-28=3, 29+=4)
  const weekIndex = Math.ceil(day / 7) - 1;
  // Safely pick the week from your array
  const selectedWeek = Weeks[Math.min(weekIndex, Weeks.length)];
  setOpenWeek(selectedWeek);
};

var totalDays = Api.OpenTemplateDays?.reduce((acc, week) => acc + (week?.length || 0), 0) || 0;
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
        <label>Open Template days Scheduler</label>
      </div>
      <div className='Scheduler-box'>
        <div className='vertical-menu'>
          <FormsSelectFetch 
            key={0}
            placeholder="Open Template"
            url={Api.Relationships[31][1]}
            ElValue={OpenTemplate}
            ReturnVal={(val) => (setOpenTemplate(val), handleDateChange(UserDate))}
          />

          <FormDateSelect ReturnVal={(val) => handleDateChange(val)}/>
        </div>
      <div className='Scheduler-week-box'>
        {Api.OpenTemplateDays!=null && Api.OpenTemplateDays?.map((item, indexA) =>{ 
          var ThisWeek = item;

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
                          height: (seg.DurationMinutes - 10) * PX_PER_MINUTE,
                          top: getMinutesFromMidnight(seg.StartTime) * PX_PER_MINUTE
                        }}
                        >
                        <div>
                          <span>Day: {seg.DayNumber}</span>
                          <span style={{fontWeight:'bold'}}>From:</span>
                          <span>{seg.StartTime}</span>
                          <span style={{fontWeight:'bold'}}>until:</span>
                          <span>{seg.EndTime}</span>
                        </div>
                      </div>
                      :
                      <div
                        key={i}
                        className='Open-times-Block Availability'
                        onClick={()=>HNew(seg)}
                        style={{
                          height: (seg.DurationMinutes - 10) * PX_PER_MINUTE ,
                          top: getMinutesFromMidnight(seg.StartTime) * PX_PER_MINUTE
                        }}
                        >
                        <div>
                          <span>CLOSED</span>
                          <span>Day: {seg.DayNumber}</span>
                          <span style={{fontWeight:'bold'}}>From:</span>
                          <span>{seg.StartTime}</span>
                          <span style={{fontWeight:'bold'}}>until:</span>
                          <span>{seg.EndTime}</span>
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
      <Editor OpenTemplate={OpenTemplate} ChangeSelection={()=> setActiveTab(0)} Segment={Segment}/>
      :null}
      {ActiveTab==2?
      <Creator  OpenTemplate={OpenTemplate} ChangeSelection={()=> setActiveTab(0)} Segment={Segment}/>
      :null}
  </>
);
}

const getMinutesFromMidnight = (timeStr) => {
  if(timeStr==null) return 0;
  const [hours, minutes] = timeStr?.split(':').map(Number);
  return (hours * 60) + minutes;
};