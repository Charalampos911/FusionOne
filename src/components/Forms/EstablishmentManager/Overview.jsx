import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../../Redux/features/ApiReducer';
import { FaArrowLeft } from "react-icons/fa";
import FormsSelectFetch from '../../NewUI/FormsSelectFetch';

import GlobalOperationHours from "./EstablishmentOperationHours"
import GlobalEmployeeHours from "./EstablishmentEmployeeHours"

export default function Overview(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [Activetab, setActivetab] = useState(0);
  const [Establishment, setEstablishment] = useState(null);
  const [Establishments, setEstablishments] = useState(null);
  useEffect(() => {
    dispatch(
      apiRequest({
        flatten: true,
        name: "Establishments.Overview.jsx | useEffect",
        url: "api/Establishments/Query",
        method: "POST",
        body: {},
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
    .unwrap() // Waits for the thunk to resolve successfully
    .then((Response) => {
      console.log("Response==>",Response)
        setEstablishments(Response.data)
    })

   }, [dispatch]);

return (
<div id="Establishments">


      {Activetab==0?
      <>
      <div className="Overview">
        <div className='Overview-head'>     
          <div className="ChangeSelection" onClick={() => props.ChangeSelection()}>
            <FaArrowLeft />
          </div> 
          <label><span>Establishment overview</span></label>
        </div>

          <FormsSelectFetch 
            key={0}
            placeholder="Establishment"
            url={Api.Relationships[1][1]}
            ElValue={Establishment?.Id}
            ReturnVal={(val) => setEstablishment(val)}
            FormSize={true}
            EntityFetcher={true}
          />

        {/* <div className='Tiles-box'>
        
        {Establishments?.map((item, index) => {
          // These variables are recalculated every time the component re-renders
          const isSelected = Establishment?.Id === item.Id;
           console.log("isSelected=",isSelected)
           console.log("Establishment.Id=",Establishment?.Id)
           console.log("item.Id=",item.Id)
           console.log(" ")
          const classNames = [
            'Tile',
            item.IsActive ? 'Active' : '',
            isSelected ? 'Selected' : ''
          ].filter(Boolean).join(' ');

          return (
            <div 
              key={item.Id || index} // Better to use item.Id if available
              className={classNames} 
              onClick={() => setEstablishment(item)}
            >
              <span>{item.Name}</span>
            </div>
          );
        })}
        </div>  */}




      {Establishment?
      <div className='override-options'>
      <div className='direction-btn' onClick={() => setActivetab(1)}>Establishment-wide operation hours override</div>
      <div className='direction-btn' onClick={() => setActivetab(2)}>Establishment-wide employee hours override</div>
      </div>
      :null}
      </div>

      </>
      :null}
      {Activetab==1?
        <GlobalOperationHours Establishment={Establishment} ChangeSelection={() => setActivetab(0)} />
      :null}
      {Activetab==2?
        <GlobalEmployeeHours Establishment={Establishment} ChangeSelection={() => setActivetab(0)} />
      :null}
    </div>
);

}


