import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setCurrentViewSU,NavBarInteracted  } from '../../../../Redux/features/ApiReducer';
import { PermaProductCarousel  } from '../../CarouselSelect/PermaProductCarousel';
import { FSPermaProductCarousel  } from '../../FullScreen/FSPermaProductCarousel';

export default function PermaProductSelect({Dept}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [PermaProducts, setPermaProducts] = useState(null);
  const [PermaProduct, setPermaProduct] = useState(null);


  useEffect(() => {
    if(PermaProduct!=null)
    dispatch(setCurrentViewSU(7))
  }, [PermaProduct]);

  useEffect(() => {
    if(Api.CurrentViewSU < 3){
          setPermaProducts(null)
          setPermaProduct(null)
    }
    if(Api.CurrentViewSU === 7){
    setPermaProduct(null)
    dispatch(
      apiRequest({
        name: "PermaProductsselect.jsx | useEffect",
        url: "api/PermaProductsSU/PermaProductsResponseSU",
        method: "POST",
        body:{
          DepartmentId: Dept.Id
        },
        auth: true,
        tokenRequired: true,
        storeIn: "PermaProductsSU"
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("PermaProducts===",Response.data);
        setPermaProducts(Response.data)

      })
    }
  }, [Api.CurrentViewSU]);
  console.clear()
  console.log("Dept===",Dept)
    console.log("PermaProducts===",PermaProducts)
      console.log("PermaProduct===",PermaProduct)

 useEffect(() => {
    setPermaProduct(null)
  }, [Api.NavBarSUInteractions]);


  if(PermaProducts==null) return;
  return (
    <>
      {PermaProduct==null && Dept!=null?
      <PermaProductCarousel PermaProducts={PermaProducts} onSelect = {(w) => setPermaProduct(w)} />
      :<FSPermaProductCarousel department={Dept} PermaProducts={[PermaProduct]} GoBack={()=>setDivision(null)} Browse={()=>setDivision(null)}/>}


    </>
  );

}


