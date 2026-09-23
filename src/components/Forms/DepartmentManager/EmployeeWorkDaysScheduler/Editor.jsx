import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setDivisionId } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import {getTimesFlat, getMinuteDifference, getDayNumbers } from '../../../../utils/DatesTimesPhasm';

import DynamicInput from '../../../UI/DynamicInput'
import DynamicCheck from '../../../UI/DynamicCheck'

export default function Editor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  console.log("props=====",props)
  var Seg = props.Segment;
  console.log("Seg==",Seg)
  const DatesOrg =(TargetDate) =>{
    console.log("TargetDate====",TargetDate)
    if(TargetDate==null) return;
  var OrgDate = TargetDate.split('T')
      OrgDate[1] = OrgDate[1].slice(0,5)
      OrgDate.push(TargetDate)
      return OrgDate;
  }

  const [UserDateFrom, setUserDateFrom] = useState(DatesOrg(Seg.StartDate)); 
  const [UserDateUntil, setUserDateUntil] = useState(DatesOrg(Seg.EndDate));

  const [BreakStart, setBreakStart] = useState(DatesOrg(Seg.BreakStart)); 
  const [BreakMinutes, setBreakMinutes] = useState(Seg.BreakMinutes);

  const [Notes, setNotes] = useState(Seg.Notes); 
  const [IsOffDay, setIsOffDay] = useState(Seg.IsOffDay);

  const [UserActionsCount, setUserActionsCount] = useState(0);

  const [Times, setTimes] = useState(null);
  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [RevealC, setRevealC] = useState(false);
  const [RevealD, setRevealD] = useState(false);
  const [RevealE, setRevealE] = useState(false);
  const [IsDeleted, setIsDeleted] = useState(false);
  const [Message, setMessage] = useState(null);

useEffect(() => {
  alert("useEffect")
    dispatch(
      apiRequest({
        name: "EmployeeWorkDaysSchedulerEditor.jsx | useEffect",
        url: "api/EmployeeWorkDays/WorkBlockUpdateMargins",
        method: "POST",
        body: {
          Month:Seg.StartDate,
          TargetBlockId: Seg.Id,
          EmployeeId:Seg.EmployeeId
          },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((data) => {
      console.clear()
      console.log("Data 4====",data)
      // setUserTimeFrom(data.data.SwiftStart)
      // setUserTimeUntil(data.data.SwiftEnd)



      const times = getTimesFlat(data.data.StartDate,data.data.EndDate,true);
      console.log("times 4====",times)
      setTimes(times)
    })

    }, []);


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
const refC = useRef(null);
const refD = useRef(null);
const refE = useRef(null);
// 2. Link refs to your "setReveal" states
useOutsideClick(refA, () => setRevealA(false));
useOutsideClick(refB, () => setRevealB(false));
useOutsideClick(refC, () => setRevealC(false));
useOutsideClick(refD, () => setRevealD(false));
useOutsideClick(refE, () => setRevealE(false));

const HUpdate=()=>{
    if(UserDateFrom==null || UserDateUntil==null) return;
    // Difference in minutes
    const diffInMinutes = getMinuteDifference(
      UserDateFrom[1]
      ,
      UserDateUntil[1]
    )
        setUserActionsCount(UserActionsCount+1)
   if(BreakStart==null || BreakMinutes==null)
      { 
        setMessage({Mood:false,msg:"Must fill up the break fields"});
        return;
      }


    dispatch(
      apiRequest({
        name: "EmployeeWorkDaysSchedulerEditor.jsx | SUpdate",
        url: "api/EmployeeWorkDays/SUpdate",
        method: "PUT",
        body: {
          Id: Seg.Id,
          WorkDate:UserDateFrom[2],
          WorkMinutes:diffInMinutes,
          BreakStart:BreakStart[2],
          BreakMinutes:BreakMinutes,
          Notes:Notes,
          IsOffDay:IsOffDay,
          EmployeeId:props.Segment.EmployeeId
          },
        auth: true,
        tokenRequired: true,
        storeIn: "EmployeeWorkDays"
      })
    )




}
const HDelete=()=>{
    dispatch(
      apiRequest({
        name: "EmployeeWorkDaysSchedulerEditor.jsx | HDelete",
        url: "api/EmployeeWorkDays/SHardDelete",
        method: "DELETE",
        body: {Id: props.Segment.Id},
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
  // <>
  // {Times==null?
    <div id="DateTimeEditor" className="Operations">
        <div className='Operations-head'>     
          <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div> 
          <label>Employee Work Days Creator</label>
        </div>
        {!IsDeleted?
        <div className="Fields">
        <div className='Horizontal'>
        {
          // Date Start
        }
        <div id="VerticalPicker" className='Date Start' ref={refA} style={{width:308}}>
          <div>
            <div className='Current'>
              <labe>Date Start</labe>
              <div>{UserDateFrom[0]}</div> 
            </div>
          </div>
        </div>
        </div>

        <div className='Horizontal'>
        {
          // Time Start
        }
        <div id="VerticalPicker" className='Time Start' ref={refB}>
          <div onClick={()=>setRevealB(!RevealB)}>
            <div className='Current'>
              <labe>Time Start</labe>
              <div>{UserDateFrom[1]}</div> 
            </div>

          </div>
          {RevealB?
          <div className='Spectrum' style={{zIndex:"4"}}>
            {Times?.map((item, index) => {
              
              return(
              <div onClick={()=>{setUserDateFrom(DatesOrg(`${UserDateFrom[0]}T${ item[1]}:00`)),setRevealB(false)}}>{item[1]}</div>
              )
            })}
          </div>
          :null}
        </div>

        {
          // Time End
        }
        <div id="VerticalPicker" className='Date End' ref={refC}>
          <div onClick={()=>setRevealC(!RevealC)}>
            <div className='Current'>
              <labe>Time End</labe>
              <div>{UserDateUntil[1]}</div> 
            </div>
          </div>
          {RevealC?
          <div className='Spectrum' style={{zIndex:"5"}}>
            {Times?.map((item, index) => {

              return(
              <div onClick={()=>{setUserDateUntil(DatesOrg(`${UserDateUntil[0]}T${ item[1]}:00`)),setRevealC(false)}}>{item[1]}</div>
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
              <div>{BreakStart[1]}</div> 
            </div>

          </div>
          {RevealE?
          <div className='Spectrum' style={{zIndex:"5"}}>
            {Times?.map((item, index) => {

              return(
              <div onClick={()=>{setBreakStart(DatesOrg(`${BreakStart[0]}T${ item[1]}:00`)),setRevealE(false)}}>{item[1]}</div>
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
          ElValue={BreakMinutes ?? ""} 
          Clear={-1} 
          setValue={(val) => setBreakMinutes(val)}
            Sorting={(val) => null}
        />

        </div>



        <div className='Horizontal'>
        {
          // IsOffDay
        }
        <DynamicCheck 
          key={0}
          placeholder={"IsOffDay"}
          IsRequired={false}
          ElValue={IsOffDay} 
          Clear={-1}
          setValue={(val) => setIsOffDay(val)}
          Sorting={(val) => null}
        />
        {
          // Notes
        }
        <DynamicInput 
          key={0}
          type={'text'} 
          IsRequired={false} 
          placeholder={"Notes"} 
          ElValue={Notes ?? ""} 
          Clear={-1} 
          setValue={(val) => setNotes(val)}
            Sorting={(val) => null}
        />

        </div>


        
        <div className={`Actions`} >
          <div className={`Submit}`}  onClick={()=>HUpdate()}>
            Update
          </div>
          <div className='Delete' onClick={()=>HDelete()}>
            Delete
          </div>
        </div>
        {Message?.msg && (
          <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
            {Message.msg}
          </span>
        )}
        </div>
        :<div style={{textAlign:"center", color:"Green"}}>DELETED</div>}
      </div>
      // :""}
      // </>
);

}