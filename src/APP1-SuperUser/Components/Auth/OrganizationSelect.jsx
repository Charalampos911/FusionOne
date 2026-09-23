import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest  } from '../../../Redux/features/ApiReducer';
import { OrganizationCarousel } from '../CarouselSelect/OrganizationCarousel';
export default function OrganizationSelect({organization,setOrganization}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [organizations, setOrganizations] = useState(null);
  useEffect(() => {
    console.clear()
    console.log("organization===",organization)
    if(organizations==null)
    dispatch(
      apiRequest({
        name: "OrganizationSelect.jsx | useEffect",
        url: "api/OrganizationsSU/QueryOnlineRegistration",
        method: "GET",
        auth: false,
        tokenRequired: false,
        storeIn: null
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("Organizations===",Response.data);
        setOrganizations(Response.data)

      })
  }, []);

  return (
    
      <OrganizationCarousel organizations={organizations} selectedOrgCode = {organization} onSelectOrg = {(w) => setOrganization(w)} />
    
  );

}


