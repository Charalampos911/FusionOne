import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setCurrentViewSU,NavBarInteracted  } from '../../../../Redux/features/ApiReducer';
import { ServiceCarousel  } from '../../CarouselSelect/serviceCarousel';
import { FSServiceCarousel  } from '../../FullScreen/FSServiceCarousel';


export default function ServiceSelect({Dept}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [services, setServices] = useState(null);
  const [service, setService] = useState(null);
  const [categories, setCategories] = useState(null);


  const [search, setSearch] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if(service!=null)
    dispatch(setCurrentViewSU(4))
  }, [service]);

  useEffect(() => {

    if(Api.CurrentViewSU < 3){
          setServices(null)
          setService(null)
    }
    if(Api.CurrentViewSU === 4){
    dispatch(
      apiRequest({
        name: "Servicesselect.jsx | useEffect",
        url: "api/ServicesSU/ServicesResponseSU",
        method: "POST",
        body:{
          DepartmentId: Dept.Id,
          Name: search,
          ServiceCategoryId:category
        },
        auth: true,
        tokenRequired: true,
        storeIn: "ServicesSU"
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("Services===",Response.data);
        setCategories(Response.data.AllCategories)
        setServices(Response.data.Services)

      })
    }
  }, [Api.CurrentViewSU,search,category]);


  useEffect(() => {
    setService(null)
  }, [Api.NavBarSUInteractions]);

  if(services==null) return;
  return (
    <>
      {services!=null && service==null && Dept!=null?
      <ServiceCarousel services={services} onSelect = {(w) => setService(w)} search={(e)=>setSearch(e)} categories={categories} category={(e)=>setCategory(e)}/>
      :
      
      <FSServiceCarousel department={Dept}  services={[service]}  GoBack={()=>setService(null)} Browse={()=>setService(null)}/>}


    </>
  );

}


