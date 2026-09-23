import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest,setCurrentViewSU,NavBarInteracted  } from '../../../../Redux/features/ApiReducer';
import { ProductCarousel  } from '../../CarouselSelect/ProductCarousel';
import { FSProductCarousel  } from '../../FullScreen/FSProductCarousel';

export default function ProductSelect({Dept}) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 
  const [Products, setProducts] = useState(null);
  const [Product, setProduct] = useState(null);

  useEffect(() => {
    if(Product!=null)
    dispatch(setCurrentViewSU(5))
  }, [Product]);

  useEffect(() => {
    if(Api.CurrentViewSU < 3){
          setProducts(null)
          setProduct(null)
    }
    if(Api.CurrentViewSU === 5){
    setProduct(null)
    dispatch(
      apiRequest({
        name: "Productsselect.jsx | useEffect",
        url: "api/ProductsSU/ProductsResponseSU",
        method: "POST",
        body:{
          DepartmentId: Dept.Id
        },
        auth: true,
        tokenRequired: true,
        storeIn: "ProductsSU"
      })
    ).unwrap()
      .then(async (Response) => {

        console.log("Products===",Response.data);
        setProducts(Response.data)

      })
    }
  }, [Api.CurrentViewSU]);

  useEffect(() => {
    setProduct(null)
  }, [Api.NavBarSUInteractions]);

  if(Products==null) return;
  return (
    <>
      {Product==null && Dept!=null?
      <ProductCarousel Products={Products} onSelect = {(w) => setProduct(w)} />
      :<FSProductCarousel Products={[Product]} onSelect = {(w) => setProduct(w)} Dept={Dept}/>}
    </>
  );

}


