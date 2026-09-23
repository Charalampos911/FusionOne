import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,setCurrentViewSU,NavBarInteracted } from '../../../../Redux/features/ApiReducer';
import { DivisionCarousel  } from '../../CarouselSelect/DivisionCarousel';

import { FSDivisionCarousel  } from '../../FullScreen/FSDivisionCarousel';
export default function DivisionsSelect({Dept}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [divisions, setDivisions] = useState(null);
  const [division, setDivision] = useState(null);
  const [categories, setCategories] = useState(null);


  const [search, setSearch] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if(division!=null)
    dispatch(setCurrentViewSU(3))
  }, [division]);

  useEffect(() => {
    console.clear()
    console.log("category="+category)
    console.log("search="+search)

    if(Api.CurrentViewSU < 3){
          setDivisions(null)
          setDivision(null)
    }
    if(Api.CurrentViewSU === 3)
    dispatch(
      apiRequest({
        name: "Divisionsselect.jsx | useEffect",
        url: "api/DivisionsSU/DivisionsResponseSU",
        method: "POST",
        body:{
          DepartmentId: Dept.Id,
          Name: search,
          ServiceCategoryId:category
        },
        auth: true,
        tokenRequired: true,
        storeIn: "DivisionsSU"
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("divisions===",Response.data);
        setCategories(Response.data.AllCategories)
        setDivisions(Response.data.Divisions)

      })
  }, [Api.CurrentViewSU,search,category]);

  useEffect(() => {
    setDivision(null)
  }, [Api.NavBarSUInteractions]);

  if(divisions==null) return;
  return (
    <>
      {divisions!=null && division==null && Dept!=null?
      <DivisionCarousel divisions={divisions} onSelect = {(w) => setDivision(w)} search={(e)=>setSearch(e)} categories={categories} category={(e)=>setCategory(e)}/>
      : <FSDivisionCarousel department={Dept} divisions={[division]} GoBack={()=>setDivision(null)} Browse={()=>setDivision(null)}/>}


    </>
  );

}


