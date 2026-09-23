import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,setCurrentViewSU,setDepartmentSU } from '../../../Redux/features/ApiReducer';
import { DepartmentCarousel  } from '../CarouselSelect/DepartmentCarousel';

import UserAccount from './UserAccount';
import UserBookings from './UserBookings';
import UserCards from './UserCards';
import UserChildren from './UserChildren';
import UserDocuments from './UserDocuments';
import UserOrders from './UserOrders';
import UserRentals from './UserRentals';
import UserScanner from './UserScanner';
import UserWallet from './UserWallet';



export default function UserHome() { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  return (
      <>
      {Api.CurrentViewSU>=10 && Api.CurrentViewSU<15?
        <UserAccount />
      :null}
      {Api.CurrentViewSU>=15 && Api.CurrentViewSU<20?
         <UserOrders/> 
      :null}
      {Api.CurrentViewSU>=20 && Api.CurrentViewSU<25?
        <UserRentals/>
      :null}
      {Api.CurrentViewSU>=25 && Api.CurrentViewSU<30?
        <UserBookings/>
      :null}
      {Api.CurrentViewSU>=30 && Api.CurrentViewSU<35?
          <UserScanner/>
      :null}
      {Api.CurrentViewSU>=35 && Api.CurrentViewSU<40?
       <UserWallet/>
      :null}
      {Api.CurrentViewSU>=40 && Api.CurrentViewSU<45?
        <UserCards/> 
      :null}
      {Api.CurrentViewSU>=45 && Api.CurrentViewSU<50?
        <UserChildren/> 
      :null}
      {Api.CurrentViewSU>=50 && Api.CurrentViewSU<55?
         <UserDocuments/>
      :null}
      
    </>
  );

}


