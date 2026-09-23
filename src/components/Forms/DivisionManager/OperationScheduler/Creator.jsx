import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import { getTimesFlat, getMinuteDifference } from '../../../../utils/DatesTimesPhasm';

export default function Creator(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const Seg = props.Segment;

  const DatesOrg = (TargetDate) => {
    if (!TargetDate) return null;
    let OrgDate = TargetDate.split('T');
    OrgDate[1] = OrgDate[1].slice(0, 5);
    OrgDate.push(TargetDate);
    return OrgDate;
  };

  const [UserDateFrom, setUserDateFrom] = useState(DatesOrg(Seg.StartDate)); 
  const [UserDateUntil, setUserDateUntil] = useState(DatesOrg(Seg.EndDate));

  const [UserActionsCount, setUserActionsCount] = useState(0);

  const [Times, setTimes] = useState(null);
  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [Message, setMessage] = useState(null);

  // Fetch expanded boundaries for open gap block
  useEffect(() => {
    dispatch(
      apiRequest({
        name: "DivisionOpenDaysSchedulerCreator.jsx | useEffect",
        url: "api/DivisionOpenDays/OpenDayBlockUpdateMargins",
        method: "POST",
        body: {
          Month: Seg.StartDate.split('T')[0],
          TargetBlockId: Seg.Id,
          DivisionId: Seg.DivisionId
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap()
    .then((data) => {
      const times = getTimesFlat(data.data.StartDate, data.data.EndDate, true);
      setTimes(times);
    });
  }, []);

  useEffect(() => {
    if (UserActionsCount > 0)
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

  const refA = useRef(null);
  const refB = useRef(null);

  useOutsideClick(refA, () => setRevealA(false));
  useOutsideClick(refB, () => setRevealB(false));

  const HCreate = () => {
    if (!UserDateFrom || !UserDateUntil) return;

    const diffInMinutes = getMinuteDifference(
      UserDateFrom[1],
      UserDateUntil[1]
    );

    setUserActionsCount(UserActionsCount + 1);

    dispatch(
      apiRequest({
        name: "DivisionOpenDaysSchedulerCreator.jsx | HCreate",
        url: "api/DivisionOpenDays/SCreate",
        method: "POST",
        body: {
          DivisionId: props.Segment.DivisionId,
          OpenDate: UserDateFrom[2],
          DurationMinutes: diffInMinutes
        },
        auth: true,
        tokenRequired: true,
        storeIn: "DivisionOpenDays"
      })
    );
  };

  return (
    <div id="DateTimeEditor" className="Operations">
      <div className='Operations-head'>     
        <div className="ChangeSelection" onClick={() => props.ChangeSelection()}><FaArrowLeft /></div> 
        <label>Operations Scheduler Creator</label>
      </div>

      <div className="Fields">
        <div className='Horizontal'>
          {/* Date Start */}
          <div id="VerticalPicker" className='Date Start' style={{ width: 308 }}>
            <div>
              <div className='Current'>
                <label>Date Start</label>
                <div>{UserDateFrom[0]}</div> 
              </div>
            </div>
          </div>
        </div>

        <div className='Horizontal'>
          {/* Time Start */}
          <div id="VerticalPicker" className='Date Start' ref={refA}>
            <div onClick={() => setRevealA(!RevealA)}>
              <div className='Current'>
                <label>From:</label>
                <div>{UserDateFrom[1]}</div> 
              </div>
            </div>

            {RevealA ? (
              <div className='Spectrum' style={{ zIndex: "4" }}>
                {Times?.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      setUserDateFrom(DatesOrg(`${UserDateFrom[0]}T${item[1]}:00`));
                      setRevealA(false);
                    }}
                  >
                    {item[1]}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Time End */}
          <div id="VerticalPicker" className='Date End' ref={refB}>
            <div onClick={() => setRevealB(!RevealB)}>
              <div className='Current'>
                <label>Until:</label>
                <div>{UserDateUntil[1]}</div> 
              </div>
            </div>

            {RevealB ? (
              <div className='Spectrum' style={{ zIndex: "5" }}>
                {Times?.map((item, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      setUserDateUntil(DatesOrg(`${UserDateUntil[0]}T${item[1]}:00`));
                      setRevealB(false);
                    }}
                  >
                    {item[1]}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={`Actions`}>
          <div className={`Submit Create`} onClick={() => HCreate()}>
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