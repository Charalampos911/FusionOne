import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import { getTimesFlat, getMinuteDifference } from '../../../../utils/DatesTimesPhasm';

import DynamicInput from '../../../UI/DynamicInput';
import DynamicCheck from '../../../UI/DynamicCheck';

export default function Editor(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const Seg = props.Segment;

  const DatesOrg = (TargetDate) => {
    if (!TargetDate) return null;
    const OrgDate = TargetDate.split('T');
    OrgDate[1] = OrgDate[1] ? OrgDate[1].slice(0, 5) : "00:00";
    OrgDate.push(TargetDate);
    return OrgDate;
  };

  const [UserDateFrom, setUserDateFrom] = useState(DatesOrg(Seg?.StartDate)); 
  const [UserDateUntil, setUserDateUntil] = useState(DatesOrg(Seg?.EndDate));

  const [BreakStart, setBreakStart] = useState(DatesOrg(Seg?.BreakStart || Seg?.StartDate)); 
  const [BreakMinutes, setBreakMinutes] = useState(Seg?.BreakMinutes ?? 0);

  const [Notes, setNotes] = useState(Seg?.Notes ?? ""); 
  const [IsOffDay, setIsOffDay] = useState(Seg?.IsOffDay ?? false);

  const [UserActionsCount, setUserActionsCount] = useState(0);

  const [Times, setTimes] = useState(null);
  const [RevealA, setRevealA] = useState(false);
  const [RevealB, setRevealB] = useState(false);
  const [RevealC, setRevealC] = useState(false);
  const [RevealE, setRevealE] = useState(false);
  const [IsDeleted, setIsDeleted] = useState(false);
  const [Message, setMessage] = useState(null);

  useEffect(() => {
    if (!Seg?.StartDate) return;

    dispatch(
      apiRequest({
        name: "SpecialOperationsDaysSchedulerEditor.jsx | useEffect",
        url: "api/SpecialOperationsDays/SpecialOperationsBlockUpdateMargins",
        method: "POST",
        body: {
          Month: Seg.StartDate,
          TargetBlockId: Seg.Id,
          SpecialId: Seg.SpecialId
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
    })
    .catch((err) => {
      console.error("Failed to fetch margins:", err);
    });
  }, [Seg, dispatch]);

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
  const refC = useRef(null);
  const refE = useRef(null);

  useOutsideClick(refA, () => setRevealA(false));
  useOutsideClick(refB, () => setRevealB(false));
  useOutsideClick(refC, () => setRevealC(false));
  useOutsideClick(refE, () => setRevealE(false));

  const HUpdate = () => {
    if (!UserDateFrom || !UserDateUntil) return;

    const diffInMinutes = getMinuteDifference(
      UserDateFrom[1],
      UserDateUntil[1]
    );

    setUserActionsCount(UserActionsCount + 1);

    if (BreakStart == null || BreakMinutes == null) { 
      setMessage({ Mood: false, msg: "Must fill up the break fields" });
      return;
    }

    dispatch(
      apiRequest({
        name: "SpecialOperationsDaysSchedulerEditor.jsx | SUpdate",
        url: "api/SpecialOperationsDays/SUpdate",
        method: "PUT",
        body: {
          Id: Seg.Id,
          WorkDate: UserDateFrom[2],
          WorkMinutes: diffInMinutes,
          BreakStart: BreakStart[2],
          BreakMinutes: BreakMinutes,
          Notes: Notes,
          IsOffDay: IsOffDay,
          SpecialId: props.Segment.SpecialId
        },
        auth: true,
        tokenRequired: true,
        storeIn: "SpecialOperationsDays"
      })
    );
  };

  const HDelete = () => {
    dispatch(
      apiRequest({
        name: "SpecialOperationsDaysSchedulerEditor.jsx | HDelete",
        url: "api/SpecialOperationsDays/SHardDelete",
        method: "DELETE",
        body: { Id: props.Segment.Id },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap()
    .then(() => {
      setIsDeleted(true);
      setUserActionsCount(UserActionsCount + 1);
    });
  };

  return (
    <div id="DateTimeEditor" className="Operations">
      <div className='Operations-head'>     
        <div className="ChangeSelection" onClick={() => props.ChangeSelection()}><FaArrowLeft /></div> 
        <label>Special Operations Days Editor</label>
      </div>

      {!IsDeleted ? (
        <div className="Fields">
          <div className='Horizontal'>
            {/* Date Start */}
            <div id="VerticalPicker" className='Date Start' ref={refA} style={{ width: 308 }}>
              <div>
                <div className='Current'>
                  <label>Date Start</label>
                  <div>{UserDateFrom?.[0]}</div> 
                </div>
              </div>
            </div>
          </div>

          <div className='Horizontal'>
            {/* Time Start */}
            <div id="VerticalPicker" className='Time Start' ref={refB}>
              <div onClick={() => setRevealB(!RevealB)}>
                <div className='Current'>
                  <label>Time Start</label>
                  <div>{UserDateFrom?.[1]}</div> 
                </div>
              </div>
              {RevealB ? (
                <div className='Spectrum' style={{ zIndex: "4" }}>
                  {Times?.map((item, index) => (
                    <div 
                      key={index} 
                      onClick={() => {
                        setUserDateFrom(DatesOrg(`${UserDateFrom[0]}T${item[1]}:00`));
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
            <div id="VerticalPicker" className='Date End' ref={refC}>
              <div onClick={() => setRevealC(!RevealC)}>
                <div className='Current'>
                  <label>Time End</label>
                  <div>{UserDateUntil?.[1]}</div> 
                </div>
              </div>
              {RevealC ? (
                <div className='Spectrum' style={{ zIndex: "5" }}>
                  {Times?.map((item, index) => (
                    <div 
                      key={index} 
                      onClick={() => {
                        setUserDateUntil(DatesOrg(`${UserDateUntil[0]}T${item[1]}:00`));
                        setRevealC(false);
                      }}
                    >
                      {item[1]}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className='Horizontal'>
            {/* Break Start */}
            <div id="VerticalPicker" className='Date Start' ref={refE}>
              <div onClick={() => setRevealE(!RevealE)}>
                <div className='Current'>
                  <label>Break Start</label>
                  <div>{BreakStart?.[1]}</div> 
                </div>
              </div>
              {RevealE ? (
                <div className='Spectrum' style={{ zIndex: "5" }}>
                  {Times?.map((item, index) => (
                    <div 
                      key={index} 
                      onClick={() => {
                        setBreakStart(DatesOrg(`${BreakStart[0]}T${item[1]}:00`));
                        setRevealE(false);
                      }}
                    >
                      {item[1]}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Break duration */}
            <DynamicInput 
              key={0}
              type={'number'} 
              IsRequired={false} 
              placeholder={"Break duration"} 
              ElValue={BreakMinutes ?? ""} 
              Clear={-1} 
              setValue={(val) => setBreakMinutes(val)}
              Sorting={() => null}
            />
          </div>

          <div className='Horizontal'>
            {/* IsOffDay */}
            <DynamicCheck 
              key={0}
              placeholder={"IsOffDay"}
              IsRequired={false}
              ElValue={IsOffDay} 
              Clear={-1}
              setValue={(val) => setIsOffDay(val)}
              Sorting={() => null}
            />

            {/* Notes */}
            <DynamicInput 
              key={0}
              type={'text'} 
              IsRequired={false} 
              placeholder={"Notes"} 
              ElValue={Notes ?? ""} 
              Clear={-1} 
              setValue={(val) => setNotes(val)}
              Sorting={() => null}
            />
          </div>

          <div className="Actions">
            <div className="Submit" onClick={() => HUpdate()}>
              Update
            </div>
            <div className="Delete" onClick={() => HDelete()}>
              Delete
            </div>
          </div>

          {Message?.msg && (
            <span style={{ color: Message?.Mood ? "darkgreen" : "darkred" }}>
              {Message.msg}
            </span>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "green", margin: "20px 0" }}>DELETED</div>
      )}
    </div>
  );
}