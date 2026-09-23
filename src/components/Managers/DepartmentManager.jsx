import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,clearJunk } from '../../Redux/features/ApiReducer';

import Overview from '../Forms/DepartmentManager/Overview';
import DepartmentEditor from '../Forms/DepartmentManager/DepartmentEditor';
import DepartmentOnlineProfile from '../Forms/DepartmentManager/DepartmentOnlineProfile';
import EmployeesEditor from '../Forms/DepartmentManager/EmployeesEditor';
import EmployeesWorkDaysScheduler from '../Forms/DepartmentManager/EmployeeWorkDaysScheduler/Scheduler';
import EmployeesWorkDaysEditor from '../Forms/DepartmentManager/EmployeesWorkDaysEditor';
import EmployeeOnlineProfile from '../Forms/DepartmentManager/EmployeeOnlineProfile';

import SpecialsEditor from '../Forms/DepartmentManager/SpecialsEditor';
import SpecialsOperationsDaysScheduler from '../Forms/DepartmentManager/SpecialsOperationsDaysScheduler/Scheduler';
import SpecialOperationsDaysEditor from '../Forms/DepartmentManager/SpecialOperationsDaysEditor';



// import GlobalOperationHours from '../Forms/DepartmentManager/GlobalOperationHours';


export default function DepartmentManager(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [activeTab, setActiveTab] = useState(0);
const HChange = (num) => {
  dispatch(clearJunk())
  setActiveTab(num)
};
console.clear()
console.log("Api.Token.Roles[0]!=Admin ==>",Api.Token.Roles[0]!="Admin")
console.log("Api.Token.Roles[0]!=GeneralManager ==>",Api.Token.Roles[0]!="GeneralManager")
  if(Api.Token.Roles[0]!="Admin" && Api.Token.Roles[0]!="GeneralManager") return;
  return (
    <>
        {activeTab==0?
         <div className="DirectionPage">
        <div className="Directions">
          <div className="DButton" onClick={() => HChange(1)}>Overview</div>
          <div className="DButton" onClick={() => HChange(2)}>Department Editor</div>
          <div className="DButton" onClick={() => HChange(3)}>Department Online profile</div>
          <div className="DButton" onClick={() => HChange(4)}>Employees Editor</div>
          <div className="DButton" onClick={() => HChange(5)}>Employee Work Days Scheduler</div>
          <div className="DButton" onClick={() => HChange(6)}>Employee Work Days Editor</div>
          <div className="DButton" onClick={() => HChange(7)}>Employee Online profile</div>
          {/* NEW */}
          <div className="DButton" onClick={() => HChange(8)}>Specials Editor</div>
          <div className="DButton" onClick={() => HChange(9)}>Special Operations Days Scheduler</div>
          <div className="DButton" onClick={() => HChange(10)}>Special Operations Days Editor</div>


        </div>
        </div>
        :null}
        {activeTab==1? <Overview ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==2? <DepartmentEditor ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==3? <DepartmentOnlineProfile ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==4? <EmployeesEditor ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==5? <EmployeesWorkDaysScheduler ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==6? <EmployeesWorkDaysEditor ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==7? <EmployeeOnlineProfile ChangeSelection={()=> HChange(0)}/> :null}
        {/* NEW */}
        {activeTab==8? <SpecialsEditor ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==9? <SpecialsOperationsDaysScheduler ChangeSelection={()=> HChange(0)}/> :null}
        {activeTab==10? <SpecialOperationsDaysEditor ChangeSelection={()=> HChange(0)}/> :null}
    </>
  );

}


