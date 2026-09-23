import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setCurrentViewSU  } from '../../../../Redux/features/ApiReducer';
import { EstablishmentCarousel } from '../../CarouselSelect/EstablishmentCarousel';
import DepartmentSelect from './DepartmentSelect';
import { Navbar } from '../../Navbar';
import { SiBasicattentiontoken } from "react-icons/si";
import UserHome from '../../UserBadge/UserHome';
export default function EstablishmentSelect({onlineStatus}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [establishments, setEstablishments] = useState(null);
  const [establishment, setEstablishment] = useState(null);

  console.log("onlineStatus===>",onlineStatus)
    console.log("onlineStatus.Establishments===>",onlineStatus?.Establishments)
    console.log("onlineStatus.Establishments.count ===>",onlineStatus?.Establishments?.length )
if(onlineStatus?.Establishments?.length == 0){
  return(
    <div className={"Attention"}> <span><SiBasicattentiontoken /></span> Sorry, no active online setup for any establishment for this organization exists<span><SiBasicattentiontoken /></span></div>
  )

}
  useEffect(() => {
    if(establishment!=null)
    dispatch(setCurrentViewSU(1))
  }, [establishment]);


  useEffect(() => {
    if(  Api.CurrentViewSU === 0)
      setEstablishment(null)
    dispatch(
      apiRequest({
        name: "EstablishmentSelect.jsx | useEffect",
        url: "api/EstablishmentsSU/EstablishmentsResponseSU",
        method: "POST",
        body:{
          ...(Api.Token?.OrganizationId && {  OrganizationId: Api.Token.OrganizationId }),
        },
        auth: true,
        tokenRequired: true,
        storeIn: "EstablishmentsSU"
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("establishments======",Response.data);
        setEstablishments(Response.data)

      })
  }, [Api.CurrentViewSU]);

  return (

    <>
      <Navbar onlineStatus={onlineStatus?.Establishments?.find(e => e.EstablishmentId === establishment?.Id)}/>


      {Api.CurrentViewSU <10?
      <>
      {establishments!=null && establishment==null?
      <EstablishmentCarousel establishments={establishments} onSelect = {(w) => setEstablishment(w)} />
      :null}

      {establishment!=null?
      <DepartmentSelect EstabId={establishment.Id} onlineStatus={onlineStatus?.Establishments?.find(e => e.EstablishmentId === establishment.Id)}/>
      :null}
      </>
      :
      
      <UserHome/>
      
      
      }

    </>
  );

}


