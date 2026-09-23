import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import { getTimesFlat, getMinuteDifference } from '../../../../utils/DatesTimesPhasm';

import DynamicCheck from "../../../UI/DynamicCheck";

export default function Creator(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const Seg = props.Segment;
  
  const [UserDayNumber, setUserDayNumber] = useState(Seg?.DayNumber ?? 1); 
  const [IsOffDay, setIsOffDay] = useState(Seg?.IsOffDay ?? false); 

  // Initialize directly from time strings or fallback to defaults
  const [UserTimeFrom, setUserTimeFrom] = useState(Seg?.StartTime?.slice(0, 5) || "08:00");
  const [UserTimeUntil, setUserTimeUntil] = useState(Seg?.EndTime?.slice(0, 5) || "17:00");
  const [UserActionsCount, setUserActionsCount] = useState(0);

  const [Times, setTimes] = useState(null);
  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [RevealD, setRevealD] = useState(false);
  const [Message, setMessage] = useState(null);

  // Helper to extract HH:mm regardless of whether item is an array or string
  const getTimeString = (timeVal) => {
    if (!timeVal) return "";
    if (Array.isArray(timeVal)) return timeVal[1];
    return timeVal.slice(0, 5);
  };

  useEffect(() => {
    // Rely on OpenTemplate ID and DayNumber (since StartTime/EndTime might be empty for a fresh block)
    if (!props.OpenTemplate) return;
      const times = getTimesFlat(UserTimeFrom, UserTimeUntil, false);


      console.clear()
      console.log("times===",times)
      setTimes(times);


    // dispatch(
    //   apiRequest({
    //     name: "OpenTemplateDaysSchedulerCreator.jsx | useEffect",
    //     url: "api/OpenTemplateDays/BlockUpdateMargins",
    //     method: "POST",
    //     body: {
    //       DayNumber: UserDayNumber,
    //       TargetBlockId: Seg?.Id,
    //       OpenTemplateId: props.OpenTemplate
    //     },
    //     auth: true,
    //     tokenRequired: true,
    //     storeIn: null
    //   })
    // )
    // .unwrap()
    // .then((res) => {
    //   // Handles HH:mm:ss strings (e.g. "00:00:00" to "23:59:00")
    //   const times = getTimesFlat(res.data.StartTime, res.data.EndTime, false);


    //   console.clear()
    //   console.log("res.data===",res.data)
    //   console.log("times===",times)
    //   setTimes(times);
    // })
    // .catch((err) => {
    //   console.error("Failed to fetch margins:", err);
    // });
  }, [UserDayNumber, props.OpenTemplate, Seg?.Id, dispatch]);

  useEffect(() => {
    if (UserActionsCount > 0)
      setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage, UserActionsCount]);

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

  const refA = useRef(null);
  const refB = useRef(null);
  const refD = useRef(null);

  useOutsideClick(refA, () => setRevealA(false));
  useOutsideClick(refB, () => setRevealB(false));
  useOutsideClick(refD, () => setRevealD(false));

  const HCreate = () => {
    const startTimeStr = getTimeString(UserTimeFrom);
    const endTimeStr = getTimeString(UserTimeUntil);

    const diffInMinutes = getMinuteDifference(startTimeStr, endTimeStr);

    setUserActionsCount(UserActionsCount + 1);

    dispatch(
      apiRequest({
        name: "OpenTemplateDaysSchedulerCreator.jsx | HCreate",
        url: "api/OpenTemplateDays/SCreate",
        method: "POST",
        body: {
          DayNumber: Number(UserDayNumber),
          OpenStart: startTimeStr,
          DurationMinutes: diffInMinutes,
          IsOffDay: IsOffDay,
          OpenTemplateId: props.OpenTemplate
        },
        auth: true,
        tokenRequired: true,
        storeIn: "OpenTemplateDays"
      })
    )   .unwrap() // Waits for the thunk to resolve successfully
    .then((data) => {
        props.ChangeSelection()
    })
  };

  return (
    <div id="DateTimeEditor" className="Operations">
      <div className='Operations-head'>     
        <div className="ChangeSelection" onClick={() => props.ChangeSelection()}>
          <FaArrowLeft />
        </div> 
        <label>Open Template Days Scheduler Creator</label>
      </div>

      <div className="Fields">
        <div className='Horizontal'>
          {/* Day Number */}
          <div id="VerticalPicker" className='Date Start' ref={refA}>
            <div>
              <div className='Current'>
                <label>Day Number</label>
                <div>{UserDayNumber}</div> 
              </div>
            </div>
          </div>

          {/* Is Off-Day Checkbox */}
          <DynamicCheck 
            key={0}
            placeholder="Off-Day"
            IsRequired={false}
            ElValue={IsOffDay} 
            Clear={-1}
            setValue={(val) => setIsOffDay(val)}
            Sorting={() => null}
          />
        </div>

        <div className='Horizontal'>
          {/* Time Start */}
          <div id="VerticalPicker" className='Time Start' ref={refB}>
            <div onClick={() => setRevealB(!RevealB)}>
              <div className='Current'>
                <label>Time Start</label>
                <div>{getTimeString(UserTimeFrom)}</div> 
              </div>
            </div>
            {RevealB ? (
              <div className='Spectrum' style={{ zIndex: "4" }}>
                {Times?.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      setUserTimeFrom(item);
                      setRevealB(false);
                    }}
                  >
                    {item[1]}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Time End */}
          <div id="VerticalPicker" className='TimeEnd' ref={refD}>
            <div onClick={() => setRevealD(!RevealD)}>
              <div className='Current'>
                <label>Time End</label>
                <div>{getTimeString(UserTimeUntil)}</div> 
              </div>
            </div>
            {RevealD ? (
              <div className='Spectrum' style={{ zIndex: "4" }}>
                {Times?.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      setUserTimeUntil(item);
                      setRevealD(false);
                    }}
                  >
                    {item[1]}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="Actions">
          <div className="Submit Create" onClick={() => HCreate()}>
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