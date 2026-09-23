import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setCurrentViewSU,NavBarInteracted  } from '../../../../Redux/features/ApiReducer';
import { EmployeeCarousel  } from '../../CarouselSelect/EmployeeCarousel';
import { FSEmployeeCarousel  } from '../../FullScreen/FSEmployeeCarousel';
export default function EmployeeSelect({Dept}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [Employees, setEmployees] = useState(null);
  const [Employee, setEmployee] = useState(null);

  useEffect(() => {
    if(Employee!=null)
    dispatch(setCurrentViewSU(6))
  }, [Employee]);


  useEffect(() => {
    if(Api.CurrentViewSU < 3){
          setEmployees(null)
          setEmployee(null)
    }
    if(Api.CurrentViewSU === 6){
    setEmployee(null)
    dispatch(
      apiRequest({
        name: "Employeesselect.jsx | useEffect",
        url: "api/EmployeesSU/EmployeesResponseSU",
        method: "POST",
        body:{
          DepartmentId: Dept.Id
        },
        auth: true,
        tokenRequired: true,
        storeIn: "EmployeesSU"
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("Employees===",Response.data);
        setEmployees(Response.data)

      })
    }
  }, [Api.CurrentViewSU]);

 useEffect(() => {
    setEmployee(null)
  }, [Api.NavBarSUInteractions]);



if(Employees==null) return;
  return (
    <>
      {Employee==null && Dept!=null?
      <EmployeeCarousel Employees={Employees} onSelect = {(w) => setEmployee(w)} />
      :<FSEmployeeCarousel Employees={[Employee]} onSelect = {(w) => setEmployee(w)} />}
    </>
  );

}


