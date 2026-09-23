import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,ResetMsg} from '../../../Redux/features/ApiReducer';
import QuerySelect from "../../NewUI/QuerySelect";
import Messaging from '../../NewUI/Messaging';
export default function AssignEmployeeOrderService({OrderService,ChangeSelection}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [Message, setMessage] = useState(null);
  const [PrevEmployee, setPrevEmployee] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [availableEmployees, setAvailableEmployees] = useState(null);

  useEffect(() => {
    dispatch(ResetMsg())
  }, []);

  useEffect(() => {
      if(OrderService.AttendingEmployee!=null)
      dispatch(
        apiRequest({
          name: "AssignEmployeeOrderService.jsx | Query",
          url: "api/Employees/Query",
          method: "POST",
          body: {
            Id: OrderService.AttendingEmployee
          },
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap()
      .then((res) => {
         console.log("OrderService 3222==>", OrderService);
        console.log("Employees 2323===", res);
        setPrevEmployee(res.data[0]);
      })



      dispatch(
        apiRequest({
          name: "AssignEmployeeOrderService.jsx | GetAvailableEmployeesForOrderService",
          url: "api/OrderServices/GetAvailableEmployeesForOrderService",
          method: "PUT",
          body: {
            OrderServiceId: OrderService.Id
          },
          auth: true,
          tokenRequired: true,
          storeIn: null
        })
      ).unwrap()
      .then((res) => {
        console.log("res==>", res);
         console.log("Employees 555===", res);
        setAvailableEmployees(res.data);
      })
    
      
   }, []);

  useEffect(() => {
    if(Api.NewApiToUserMessage.msg != "Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);




return (
<div className='Intergrated AssignEmployee'>
      <label>Current: {PrevEmployee!=null? PrevEmployee.FirstName +" "+ PrevEmployee.LastName:"-None-"}</label>
      <QuerySelect 
        isDynamic={true}
        optionsArray={availableEmployees}
        placeholder="Available employees*"
        setValue={(val) => setEmployee(val!=null?val:null)}
      />


      {employee?
      <div className="DirectBook" onClick={()=>TryAssignEmployee(employee,OrderService,dispatch,apiRequest,ChangeSelection)}>ASSIGN</div> 
      :null}
      <Messaging ParentMessage={Message} IsLocal={true}/>
</div>

);
}



const TryAssignEmployee =(employee, OrderService,dispatch,apiRequest,ChangeSelection)=>{
  const body = {
    OrderServiceId: OrderService.Id,
    AttendingEmployee: employee.Id
  };

  dispatch(
    apiRequest({
      name: "AssignEmployeeOrderService.jsx | TryAssignEmployee",
      url: "api/OrderServices/AssignAttendingEmployee",
      method: "PUT",
      body: body,
      auth: true,
      tokenRequired: true,
      storeIn: "OrderServices"
    })
  ).unwrap() 
    .then((Res) => {
      console.log("AssignAttendingEmployee==>",Res)
      ChangeSelection()
    })



  
};