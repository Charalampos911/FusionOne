import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../Redux/features/ApiReducer';

export default function UpdatePage(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  
  const [CountryType, setCountryType] = useState(0);
  const [GunControlType, setGunControlType] = useState(0);
  const [AllianceType, setAllianceType] = useState(0);


  const ReadyToInitiate=(CountryType,GunControlType,AllianceType)=>{

    dispatch(
      apiRequest({
        flatten: false,
        name:"NationInitiationForm.jsx | InitiateNation",
        url: 'api/CryptoNations/InitiateNation/'+Api.CurrentCountry.Id,
        method: 'PUT',
        body: [
          {
            initiateTheTypeOf:"GovType",
            setItsClassTo: CountryType[0],
          },
          {
            initiateTheTypeOf: "GunControl",
            setItsClassTo: GunControlType[0], 
          },
          {
            initiateTheTypeOf: "Alliance",
            setItsClassTo: AllianceType[0], 
          }
        ],
        auth: true,
        tokenRequired: true,
        storeIn: "InitiateNation", // Specify where to store the response

      })
    );
  }
  useEffect(() => {
    if(GuardA){
      dispatch(
        apiRequest({
          flatten: true,
          name:"NationInitiationForm.jsx | NationsWithQuery",
          url: 'api/CryptoNations/NationsWithQuery?filterOn=&filterQuery=&pageNumber=1&pageSize=1000',
          method: 'GET',
          body: null,
          auth: true,
          tokenRequired: true,
          storeIn: 'Nations' // Specify where to store the response
        })
      );
    }
    
   }, [Api.InitiateNation]);
   useEffect(() => {
    if(GuardB){
      dispatch(
        apiRequest({
          flatten: true,
          name:"NationInitiationForm.jsx | FullNation",
          url: 'api/CryptoNations/FullNation/'+Api.CurrentCountry.Id,
          method: 'GET',
          body: null,
          auth: true,
          tokenRequired: true,
          storeIn: 'CurrentCountry' // Specify where to store the response
        })
      );
    }
 }, [Api.Nations]);
  return (
    <div className=''>
        UpdatePage component
    </div>
  );

}


