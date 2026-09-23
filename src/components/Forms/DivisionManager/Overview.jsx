import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import Scheduler from "./OperationScheduler/Scheduler";
import QuerySelect from "../../NewUI/QuerySelect";
import FormButton from "../../NewUI/FormButton";


export default function OperationsOverview(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [ActiveTab, setActiveTab] = useState(0);


  const [Establishments, setEstablishments] = useState(null);
  const [Establishment, setEstablishment] = useState(Api.EstablishmentId || null);
  const [Departments, setDepartments] = useState(null);
  const [Department, setDepartment] = useState(Api.DepartmentId || null);
  const [Divisions, setDivisions] = useState(null);
  const [Division, setDivision] = useState(null);


  useEffect(() => {
    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Establishments/Query",
        url: "api/Establishments/Query",
        method: "POST",
        body: {},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setEstablishments(Response.data)
        })
   }, []);

  useEffect(() => {
    if(Establishment==null) return;
    dispatch(
      apiRequest({
        name: "DailyScheduler.DailyQuery.jsx | Departments/Query",
        url: "api/Departments/Query",
        method: "POST",
        body: {EstablishmentId:Establishment.Id},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    ).unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setDepartments(Response.data)
        })
   }, [Establishment]);

  useEffect(() => {
    if(Department==null) return;
    dispatch(
      apiRequest({
        flatten: true,
        name: "Divisions.Overview.jsx | useEffect",
        url: "api/Divisions/Query",
        method: "POST",
        body: {
              EstablishmentId: Establishment.Id ,
              DepartmentId: Department.Id,
        },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
          setDivisions(Response.data)
        })
  }, [Department]);
   



  // 2. Build the body dynamically

  const HDivSelection=(newDiv)=>{
    console.log("newDiv....====",newDiv)
    if(Division?.Id == newDiv?.Id){
      setActiveTab(1)
      setDivision(newDiv)
    }else{
      setDivision(newDiv)
    }
  }

  useEffect(() => {

   }, []);

return (
  <div id="Divisions">
    {ActiveTab==0?
    <div className="Overview">
      <div className='Overview-head'>     
        <div className="ChangeSelection" onClick={()=>props.ChangeSelection()}><FaArrowLeft /></div> 
        <label>Operations overview</label>
      </div>
      <QuerySelect 
        isDynamic={true}
        optionsArray={Establishments? Establishments:[]}
        placeholder="Establishments"
        setValue={(val) => setEstablishment(val)}
        zIndex={2}
      />
      <QuerySelect 
        isDynamic={true}
        optionsArray={Departments? Departments:[]}
        placeholder="Departments"
        setValue={(val) => setDepartment(val)}
        zIndex={1}
      />
      <div className='Tiles-box'>
      {Divisions?.map((item, index) => {
        const isSelected = Division?.Id === item?.Id;
       console.log("Divisions.isSelected=",isSelected)
        const classNames = [
          'Tile',
          item.IsActive ? 'Active' : '',
          isSelected ? 'Selected' : ''
        ].filter(Boolean).join(' ');

        // 2. You must explicitly use 'return' here
        return (
          <div 
            key={item.Id || index} 
            className={`${classNames}`} 
            onClick={() => HDivSelection(item)}
          >
            {item.Name}
          </div>
        );
      })}
      </div>
    {Division?
    <FormButton text={"Operations scheduler"} onClick={()=>setActiveTab(1)}/>
    :null}
    </div>
    :null}
    {ActiveTab==1?
    <div className="Operations-scheduler-view">
      <Scheduler DivisionId={Division?.Id} DivisionName={Division?.Name} ChangeSelection={()=> setActiveTab(0)}/>
    </div>
    :null}
  </div>
);

}


