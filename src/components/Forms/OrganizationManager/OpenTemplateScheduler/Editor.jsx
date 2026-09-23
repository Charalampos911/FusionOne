import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setDivisionId } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import { getDatesBetween,getTimesFlat,getDayNumbers,getMinuteDifference } from '../../../../utils/DatesTimesPhasm';


import DynamicCheck  from "../../../UI/DynamicCheck"
import Messaging from "../../../NewUI/Messaging"
export default function Editor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  console.log("props21321312=",props)
  var Seg = props.Segment;
  
  const [UserDayNumber, setUserDayNumber] = useState(Seg.DayNumber); 
  const [IsOffDay, setIsOffDay] = useState(false); 
  
  const [UserTimeFrom, setUserTimeFrom] = useState(Seg.StartTime?.slice(0,5));
  const [UserTimeUntil, setUserTimeUntil] = useState(Seg.EndTime?.slice(0,5));
  const [UserActionsCount, setUserActionsCount] = useState(0);
  const [Dates, setDates] = useState(null);
  const [Times, setTimes] = useState(null);
  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [RevealD, setRevealD] = useState(false);
  const [IsDeleted, setIsDeleted] = useState(false);


useEffect(() => {
    dispatch(
      apiRequest({
        name: "EmployeeWorkDaysSchedulerEditor.jsx | useEffect",
        url: "api/OpenTemplateDays/BlockUpdateMargins",
        method: "POST",
        body: {
          TargetBlockId: props.Segment.Id,
          OpenTemplateId:props.OpenTemplate
          },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((data) => {
      console.log("Data 23====",data)
      const dates =getDayNumbers();

      const times = getTimesFlat(data.data.StartTime,data.data.EndTime=="00:00:00"?"23:59:00":data.data.EndTime,false);
      setDates(dates)
      setTimes(times)
    })

    }, []);


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

// 2. Link refs to your "setReveal" states
useOutsideClick(refA, () => setRevealA(false));
useOutsideClick(refB, () => setRevealB(false));
useOutsideClick(refD, () => setRevealD(false));

const HUpdate=()=>{
    const diffInMinutes = getMinuteDifference(
      Array.isArray(UserTimeFrom) ? UserTimeFrom[1] : UserTimeFrom
      ,
      Array.isArray(UserTimeUntil) ? UserTimeUntil[1] : UserTimeUntil
      
    )
    setUserActionsCount(UserActionsCount+1)
    dispatch(
      apiRequest({
        name: "OpenTemplateDaysSchedulerEditor.jsx | HUpdate",
        url: "api/OpenTemplateDays/SUpdate",
        method: "PUT",
        body: {
          Id:props.Segment.Id,
          DayNumber: UserDayNumber,
          OpenStart: Array.isArray(UserTimeFrom) ? UserTimeFrom[1] : UserTimeFrom,
          DurationMinutes:diffInMinutes,
          IsOffDay:IsOffDay,
          OpenTemplateId:props.OpenTemplate
        },
        auth: true,
        tokenRequired: true,
        storeIn: "OpenTemplateDays"
      })
    )    .unwrap() // Waits for the thunk to resolve successfully
    .then((data) => {
        props.ChangeSelection()
    })



    
}
const HDelete=()=>{
    setUserActionsCount(UserActionsCount+1)
    dispatch(
      apiRequest({
        flatten: false,
        name: "OpenTemplateDaysSchedulerEditor.jsx | HDelete",
        url: "api/OpenTemplateDays/SHardDelete",
        method: "DELETE",
        body: {
          Id:props.Segment.Id
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then(() => {
        setIsDeleted(true)
        setUserActionsCount(UserActionsCount+1)
    })
}
return (
    <div id="DateTimeEditor" className="Operations">
        <div className='Operations-head'>     
          <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div> 
          <label>Operation template Days Editor</label>
        </div>
        {!IsDeleted?
        <div className="Fields">
        <div className='Horizontal'>
        {
          // Date Start
        }
        <div id="VerticalPicker" className='Date Start' ref={refA}>
          <div 
          // onClick={()=>setRevealA(!RevealA)}
            >
            <div className='Current'>
              <labe>Day number</labe>
              <div>{UserDayNumber}</div> 
            </div>

          </div>
        </div>
          <DynamicCheck 
            key={0}
            placeholder="Off-Day"
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
          <div onClick={()=>(console.clear(),console.log("Times==",Times),setRevealB(!RevealB))}>
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


        </div>
        <div className={`Actions`} >
          <div className={`Submit`}  onClick={()=>HUpdate()}>
            Update
          </div>
          <div className={`Submit`}  onClick={()=>HDelete()}>
            Delete
          </div>
        </div>

        <Messaging IsLocal={false}/>
        </div>
        :<div style={{textAlign:"center", color:"Green"}}>DELETED</div>}
      </div>
);

}