import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import QuerySelect from "../../NewUI/QuerySelect";
import DepartmentOperationHours from "./DepartmentOperationHours"

import DepartmentEmployeeHours from "./DepartmentEmployeeHours"

import DepartmentSpecialsHours from "./DepartmentSpecialsHours"
import AddNewTenantForm from "./../../../CryptoPayments/CP_Components/AddNewTenantForm"
import FormsSelect from '../../NewUI/FormsSelect';

export default function Overview(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [Activetab, setActivetab] = useState(0);
  const [Establishments, setEstablishments] = useState(null);
  const [Establishment, setEstablishment] = useState(null);
  const [Departments, setDepartments] = useState(null);
  const [Department, setDepartment] = useState(null);

  var EmptyGUID = '00000000-0000-0000-0000-000000000000';
  // 1. Helper to treat EmptyGUID as null
  const getValidId = (id, tokenId) => {
    const validTokenId = tokenId !== EmptyGUID ? tokenId : null;
    return id ?? validTokenId; 
  };

  const establishmentId = getValidId(Api.EstablishmentId, Api.Token.EstablishmentId);

  // 2. Build the body dynamically
  const Body = {
    ...(establishmentId && { EstablishmentId: establishmentId }),
  };

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
return (
  <div id="Departments">

      {Activetab==0?
      <>
      <div className="Overview">
        <div className='Overview-head'>     
          <div className="ChangeSelection" onClick={() => props.ChangeSelection()}>
            <FaArrowLeft />
          </div> 
          <label><span>Department overview</span></label>
        </div>
        <QuerySelect 
          isDynamic={true}
          optionsArray={Establishments? Establishments:[]}
          placeholder="Establishments"
          setValue={(val) => setEstablishment(val)}
          zIndex={1}
        />
        {Departments?
        <FormsSelect
          ElValue={Department?.Id}
          placeholder={"Department"}
          FlatArray={Departments}
          ReturnVal={(val)=>setDepartment(val)}
          EntityFetcher={true}
        />:<div className='BeforeMessage'>Select an establishment...</div>}

      {Department?
      <div className='override-options'>
      <div className='direction-btn' onClick={() => setActivetab(1)}>Department-wide operation hours override</div>
      <div className='direction-btn' onClick={() => setActivetab(2)}>Department-wide employee hours override</div>
      <div className='direction-btn' onClick={() => setActivetab(3)}>Department-wide specials hours override</div>
      <div className='direction-btn' onClick={() => setActivetab(4)}>Setup this department for crypto payments</div>
      </div>
      :null}
      </div>

      </>
      :null}
      {Activetab==1?
        <DepartmentOperationHours Department={Department} ChangeSelection={() => setActivetab(0)}/>
      :null}
      {Activetab==2?
        <DepartmentEmployeeHours Department={Department} ChangeSelection={() => setActivetab(0)}/>
      :null}
      {Activetab==3?
        <DepartmentSpecialsHours Department={Department} ChangeSelection={() => setActivetab(0)}/>
      :null}
      {Activetab==4?
        <AddNewTenantForm OrganizationId ={Api.Token.OrganizationId} Department={Department} ChangeSelection={() => setActivetab(0)}/>
      :null}


    </div>
);

}


