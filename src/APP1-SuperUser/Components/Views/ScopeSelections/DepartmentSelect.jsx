import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,setCurrentViewSU,setDepartmentSU,NavBarInteracted } from '../../../../Redux/features/ApiReducer';
import { DepartmentCarousel  } from '../../CarouselSelect/DepartmentCarousel';

import DivisionsSelect from './DivisionSelect';
import EmployeeSelect from './EmployeeSelect';
import ProductSelect from './ProductSelect';
import PermaProductSelect from './PermaProductSelect';
import ServiceSelect from './ServiceSelect';




export default function DepartmentSelect({EstabId,onlineStatus}) { 
  const Api = useSelector((state) => state.Api); 
  const currentViewSU = useSelector((state) => state.Api.CurrentViewSU);
  const dispatch = useDispatch(); 
  const [departments, setDepartments] = useState(null);
  const [department, setDepartment] = useState(null);
console.log("onlineStatus-DepartmentSelect===>",onlineStatus)
console.log("currentViewSU===",currentViewSU)
  useEffect(() => {
    if(department!=null)
    dispatch(setCurrentViewSU(3))
  }, [department]);

  useEffect(() => {


    if(currentViewSU < 2){
          setDepartments(null)
          setDepartment(null)
          dispatch(setDepartmentSU(null))
    }

    if(currentViewSU === 1){
    dispatch(
      apiRequest({
        name: "departmentselect.jsx | useEffect",
        url: "api/DepartmentsSU/DepartmentsResponseSU",
        method: "POST",
        body:{
          EstablishmentId: EstabId
        },
        auth: true,
        tokenRequired: true,
        storeIn: "DepartmentsSU"
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("departments===",Response.data);
        setDepartments(Response.data)

      })
    }

  }, [currentViewSU]);


if(!onlineStatus?.HasImages){return null}


  return (
    <>
      {departments!=null && department==null?
      <DepartmentCarousel departments={departments} onSelect = {(w) => (setDepartment(w),   dispatch(setDepartmentSU(w)))} 
      />
      :null}

      {department?
      <>
      {Api.CurrentViewSU==3 && onlineStatus?.Departments?.find(e => e.DepartmentId === department.Id).HasDivisionImages?
        <DivisionsSelect Dept={department} 
        />
      :null}
      {Api.CurrentViewSU==4 && onlineStatus?.Departments?.find(e => e.DepartmentId === department.Id).HasServiceImages?
        <ServiceSelect Dept={department}/>
      :null}
      {Api.CurrentViewSU==5 && onlineStatus?.Departments?.find(e => e.DepartmentId === department.Id).HasProductImages?
        <ProductSelect Dept={department}/>
      :null}
      {Api.CurrentViewSU==6 && onlineStatus?.Departments?.find(e => e.DepartmentId === department.Id).HasEmployeeImages?
        <EmployeeSelect Dept={department}/>
      :null}
      {Api.CurrentViewSU==7 && onlineStatus?.Departments?.find(e => e.DepartmentId === department.Id).HasPermaProductImages?
        <PermaProductSelect Dept={department}/>
      :null}
      </>
      :null}

  
      
    </>
  );

}


