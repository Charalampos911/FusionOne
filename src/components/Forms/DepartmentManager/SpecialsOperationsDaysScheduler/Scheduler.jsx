import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import Editor from "./Editor";
import Creator from "./Creator";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineSegment } from "react-icons/md";
import QuerySelect from "../../../NewUI/QuerySelect";
import FormDateSelect from "../../../NewUI/FormDateSelect";

export default function Scheduler(props) { 
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

  const [Specials, setSpecials] = useState(null);
  const [Special, setSpecial] = useState(null);

  const [SpecialDays, setSpecialDays] = useState(null);

  useEffect(() => {
    if (Special == null) {
      setSpecialDays(null);
      return;
    }

    dispatch(
      apiRequest({

        name: "Specials.Scheduler.jsx | useEffect",
        url: "api/SpecialOperationsDays/SpecialOperationsMonthByWeeks",
        method: "POST",
        body: { Month: UserDate, SpecialId: Special },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap()
      .then((Response) => {
        setSpecialDays(Response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch special operations month:", err);
      });
  }, [Special, UserDate, ActiveTab, dispatch]);

  const handleDateChange = (val) => {
    const dateObj = new Date(val);
    setUserDate(val);
    const day = dateObj.getDate();
    const weekIndex = Math.ceil(day / 7) - 1;
    const selectedWeek = Weeks[Math.min(weekIndex, Weeks.length - 1)];
    setOpenWeek(selectedWeek);
  };

  var totalDays = SpecialDays?.reduce((acc, week) => acc + (week?.length || 0), 0) || 0;
  var Weeks = totalDays > 28 ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C', 'D'];
  const times = [];

  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0');
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }

  const PX_PER_MINUTE = 1;
  const HEdit = (seg) => {
    setActiveTab(1);
    setSegment(seg);
  };
  const HNew = (seg) => {
    setActiveTab(2);
    setSegment(seg);
  };

  useEffect(() => {
    dispatch(
      apiRequest({
        flatten: true,
        name: "Specials.Scheduler.jsx | Establishments",
        url: Api.Relationships[1][1],
        method: "POST",
        body: { OrganizationId: Api.Token.OrganizationId },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap()
      .then((Response) => {
        setEstablishments(Response.data);
        setDepartments(null);
        setSpecials(null);
      });
  }, [dispatch, Api.Relationships, Api.Token.OrganizationId]);

  useEffect(() => {
    if (Establishment == null) return;
    dispatch(
      apiRequest({
        flatten: true,
        name: "Specials.Scheduler.jsx | departments",
        url: Api.Relationships[2][1],
        method: "POST",
        body: { EstablishmentId: Establishment },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap()
      .then((Response) => {
        setDepartments(Response.data);
        setSpecials(null);
      });
  }, [Establishment, dispatch, Api.Relationships]);

  useEffect(() => {
    if (Department == null) return;
    dispatch(
      apiRequest({
        flatten: true,
        name: "Specials.Scheduler.jsx | useEffect",
        url: Api.Relationships[45][1],
        method: "POST",
        body: { DepartmentId: Department },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap()
      .then((Response) => {
        setSpecials(Response.data);
        setSpecialDays(null);
      });
  }, [Department, dispatch, Api.Relationships]);

  // Safe time extractor for StartDate / EndDate ISO strings
  const formatTimeString = (isoString) => {
    if (!isoString) return '';
    const timePart = isoString.includes('T') ? isoString.split('T')[1] : isoString;
    return timePart.substring(0, 5); // Return HH:mm format
  };

  return (
    <>
      {ActiveTab === 0 ? (
        <div id="Solo-Scheduler-container">
          <div className="Solo-Scheduler">
            <div className='Solo-Scheduler-head'> 
              <div className="ChangeSelection" onClick={() => props.ChangeSelection()}>
                <FaArrowLeft />
              </div> 
              <label>Special Operations Days Scheduler</label>
            </div>
            <div className='Scheduler-box'>
              <div className='vertical-menu'>
                <div className='options'>
                  <div className='Scope-button' onClick={() => setScope(!Scope)}>
                    {Scope ? <MdOutlineSegment /> : <RxHamburgerMenu />}
                  </div>
                  <div className={`Scope-select `}>
                    {Scope ? (
                      <>
                        <QuerySelect 
                          isDynamic={true}
                          optionsArray={Establishments ? Establishments : []}
                          placeholder="Establishments"
                          setValue={(val) => setEstablishment(val?.Id)}
                          zIndex={4}
                        />

                        <QuerySelect 
                          isDynamic={true}
                          optionsArray={Departments ? Departments : []}
                          placeholder="Departments"
                          setValue={(val) => setDepartment(val?.Id)}
                          zIndex={3}
                        />
                      </>
                    ) : null}

                    <QuerySelect 
                      isDynamic={true}
                      optionsArray={Specials ? Specials : []}
                      placeholder="Special"
                      setValue={(val) => {
                        setSpecial(val?.Id);
                        setScope(false);
                      }}
                      zIndex={2}
                    />
                  </div>
                </div>
                <FormDateSelect ReturnVal={(val) => handleDateChange(val)}/>
              </div>

              <div className='Scheduler-week-box'>
                {SpecialDays?.map((item, indexA) => { 
                  var ThisWeek = item;
                  const formatDateParts = (isoDate) => {
                    const date = new Date(isoDate);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const formattedDate = date
                      .toLocaleDateString('en-GB')
                      .replace(/\//g, '-');
                    return { dayName, formattedDate };
                  };

                  return (
                    <div 
                      key={"week-" + indexA} 
                      className={`Scheduler-week ${OpenWeek !== Weeks[indexA] ? "Hidden" : Weeks[indexA]}`}
                    >
                      {ThisWeek?.map((dayItem, indexB) => {
                        const { dayName, formattedDate } = formatDateParts(dayItem.Date);
                        return (
                          <div className='Week-days' key={"Week-days-" + indexB}>
                            <div className="Week-days-names" key={"Week-days-names-" + indexB}>
                              <div>{dayName}</div>
                              <div>{formattedDate}</div>
                            </div>
                            <div className='Week-days-Open-time-Spam' key={"Week-days-Open-time-Spam-" + indexB}>
                              {times?.map((item, indexC) => (
                                <div className='Day-Time-Blocks' key={"Day-Time-Blocks-" + indexC}>
                                  {item}
                                </div>
                              ))}
                            </div>
                            <div className='Week-days-Open-times '>
                              <div>
                                {dayItem?.Entries?.map((seg, i) => (
                                  <React.Fragment key={`entry-${indexA}-${indexB}-${i}`}>
                                    {!seg.IsUndeclared ? (
                                      <div
                                        className='Open-times-Block Open'
                                        onClick={() => HEdit(seg)}
                                        style={{
                                          height: Math.max(0, (seg.durationMinutes - 10)) * PX_PER_MINUTE,
                                          top: getMinutesFromMidnight(formatTimeString(seg.StartDate)) * PX_PER_MINUTE
                                        }}
                                      >
                                        <div>
                                          <span style={{ fontWeight: 'bold' }}>From:</span>
                                          <span>{formatTimeString(seg.StartDate)}</span>
                                          <span style={{ fontWeight: 'bold' }}>until:</span>
                                          <span>{formatTimeString(seg.EndDate)}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className='Open-times-Block Availability'
                                        onClick={() => HNew(seg)}
                                        style={{
                                          height: Math.max(0, (seg.durationMinutes - 10)) * PX_PER_MINUTE,
                                          top: getMinutesFromMidnight(formatTimeString(seg.StartDate)) * PX_PER_MINUTE
                                        }}
                                      >
                                        <div>
                                          <span style={{ fontWeight: 'bold' }}>CLOSED</span>
                                          <span style={{ fontWeight: 'bold' }}>From:</span>
                                          <span>{formatTimeString(seg.StartDate)}</span>
                                          <span style={{ fontWeight: 'bold' }}>until:</span>
                                          <span>{formatTimeString(seg.EndDate)}</span>
                                          <span>{seg.Notes}</span>
                                        </div>
                                      </div>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {ActiveTab === 1 ? (
        <Editor ChangeSelection={() => setActiveTab(0)} Segment={Segment} />
      ) : null}
      
      {ActiveTab === 2 ? (
        <Creator ChangeSelection={() => setActiveTab(0)} Segment={Segment} />
      ) : null}
    </>
  );
}

const getMinutesFromMidnight = (timeStr) => {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return (hours * 60) + minutes;
};