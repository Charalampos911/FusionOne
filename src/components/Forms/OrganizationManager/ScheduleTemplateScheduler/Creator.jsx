import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import { getTimesFlat,getDayNumbers,getMinuteDifference} from '../../../../utils/DatesTimesPhasm';

import DynamicInput from '../../../UI/DynamicInput'
import DynamicCheck from '../../../UI/DynamicCheck'
 
export default function Creator(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  console.log("props=====2",props)
  var Seg = props.Segment;
  
  const [UserDayNumber, setUserDayNumber] = useState(Seg.DayNumber); 
  const [UserTimeFrom, setUserTimeFrom] = useState(Seg.SwiftStart?.slice(0,5));
  const [UserTimeUntil, setUserTimeUntil] = useState(Seg.SwiftEnd?.slice(0,5));

  const [BreakStart, setBreakStart] = useState(Seg.BreakStart?.slice(0,5)); 
  const [BreakMinutes, setBreakMinutes] = useState(Seg.BreakMinutes);

  const [IsOffDay, setIsOffDay] = useState(Seg.IsOffDay);

  const [UserActionsCount, setUserActionsCount] = useState(0);

  const [Dates, setDates] = useState(null);
  const [Times, setTimes] = useState(null);
  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [RevealD, setRevealD] = useState(false);
  const [RevealE, setRevealE] = useState(false);
  const [Message, setMessage] = useState(null);

  useEffect(() => {
      const dates =getDayNumbers();
      const times = getTimesFlat(Seg.SwiftStart,Seg.SwiftEnd,false);

      setDates(dates)
      setTimes(times)
      
    }, [UserTimeFrom,BreakStart,UserTimeUntil]);

  useEffect(() => {
    if(UserActionsCount>0)
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
const refD = useRef(null);
const refE = useRef(null);
// 2. Link refs to your "setReveal" states
useOutsideClick(refA, () => setRevealA(false));
useOutsideClick(refB, () => setRevealB(false));
useOutsideClick(refD, () => setRevealD(false));
useOutsideClick(refE, () => setRevealE(false));
const HCreate=()=>{
    // Difference in minutes
    const diffInMinutes = getMinuteDifference(
      Array.isArray(UserTimeFrom) ? UserTimeFrom[1] : UserTimeFrom
      ,
      Array.isArray(UserTimeUntil) ? UserTimeUntil[1] : UserTimeUntil
      
    )
    setUserActionsCount(UserActionsCount+1)
    if(BreakStart==null || BreakMinutes==null)
      { 
        setMessage({Mood:false,msg:"Must fill up the break fields"});
        return;
      }
    dispatch(
      apiRequest({
        name: "ScheduleTemplateDays.creator.jsx | HCreate",
        url: "api/ScheduleTemplateDays/SCreate",
        method: "POST",
        body: {
          DayNumber:props.Segment.DayNumber,
          SwiftStart:Array.isArray(UserTimeFrom) ? UserTimeFrom[1] : UserTimeFrom, 
          WorkMinutes:diffInMinutes,
          BreakStart:Array.isArray(BreakStart) ? BreakStart[1] : BreakStart ,
          BreakMinutes:BreakMinutes,
          IsOffDay:IsOffDay,
          ScheduleTemplateId:props.ScheduleTemplate
          },
        auth: true,
        tokenRequired: true,
        storeIn: "ScheduleTemplateDays"
      })
    )   .unwrap() // Waits for the thunk to resolve successfully
    .then((data) => {
        props.ChangeSelection()
    })
}

return (
    <div id="DateTimeEditor" className="Operations">
        <div className='Operations-head'>     
          <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div> 
          <label>Work Days Creator</label>
        </div>

        <div className="Fields">
        <div className='Horizontal'>
        {
          // Date Start
        }
        <div id="VerticalPicker" className='Date Start' ref={refA}>
          <div>
            <div className='Current'>
              <labe>Day number</labe>
              <div>{UserDayNumber}</div> 
            </div>

          </div>
        </div>
        {
          // IsOffDay
        }
        <DynamicCheck 
          key={0}
          placeholder={"Off-Day"}
          IsRequired={false}
          ElValue={IsOffDay} 
          Clear={-1}
          setValue={(val) => setIsOffDay(val)}
          Sorting={(val) => null}
        />
        
        </div>





        <div className='Horizontal'>
       {
          // Time Start
        }
        <div id="VerticalPicker" className='Time Start' ref={refB}>
          <div onClick={()=>setRevealB(!RevealB)}>
            <div className='Current'>
              <labe>Time Start</labe>
              <div>{Array.isArray(UserTimeFrom) ? UserTimeFrom[1] : UserTimeFrom}</div>
            </div>

          </div>
          {RevealB?
          <div className='Spectrum' style={{zIndex:"4"}}>
            {Times?.map((item, index) => {

              return(
              <div onClick={()=>{setUserTimeFrom(item),setRevealB(false)}}>{item[1]}</div>
              )
            })}
          </div>
          :null}
        </div>
        {
          // Time End
        }
        <div id="VerticalPicker" className='TimeEnd' ref={refD}>
          <div onClick={()=>setRevealD(!RevealD)}>
            <div className='Current'>
              <labe>Time End</labe>
              <div>{Array.isArray(UserTimeUntil) ? UserTimeUntil[1] : UserTimeUntil}</div>
            </div>

          </div>
          {RevealD?
          <div className='Spectrum' style={{zIndex:"4"}}>
            {Times?.map((item, index) => {

              return(
              <div onClick={()=>{setUserTimeUntil(item),setRevealD(false)}}>{item[1]}</div>
              )
            })}
          </div>
          :null}
        </div>
        </div>
        
        <div className='Horizontal'>
        {
          // Break Start
        }
        <div id="VerticalPicker" className='Date Start' ref={refE}>
          <div onClick={()=>setRevealE(!RevealE)}>
            <div className='Current'>
              <labe>Break Start</labe>
              <div>{Array.isArray(BreakStart) ? BreakStart[1] : BreakStart}</div>
            </div>

          </div>
          {RevealE?
          <div className='Spectrum' style={{zIndex:"5"}}>
            {Times?.map((item, index) => {

              return(
              <div onClick={()=>{setBreakStart(item),setRevealE(false)}}>{item[1]}</div>
              )
            })}
          </div>
          :null}
        </div>
        {
          // Break duration
        }
        <DynamicInput 
          key={0}
          type={'number'} 
          IsRequired={false} 
          placeholder={"Break duration"} 
          ElValue={BreakMinutes} 
          Clear={-1} 
          setValue={(val) => setBreakMinutes(val)}
          Sorting={(val) => null}
        />

        </div>

        <div className={`Actions`} >
          <div className={`Submit Create`}  onClick={()=>HCreate()}>
            Create
          </div>
        </div>
        {Message?.msg && (
          <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
            {Message.msg}
          </span>
        )}
        </div>
      </div>
);

}