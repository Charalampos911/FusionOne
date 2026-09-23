
import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
// Components
import  Auth  from '../components/Auth';
import  ContentManager  from '../components/ContentManager';
import FormButton from '../components/NewUI/FormButton';
function CMS_Admin() {
  const Api = useSelector((state) => state.Api);
  const navigate = useNavigate();
  return (
    <>
      <title>Fusion one</title>
      {Api.Token == null?
        <Auth/> // Login page for either register an Admin or Logi-in a user
        :
        <ContentManager/> // After login-in, redirect to the CMS-CLIENTS
      }
        <div className='targeted-apps'>
        <label>- PERSONEL APPS -</label>
        <FormButton text={"SUPER USER"} onClick={() => navigate('/superuser')} />

        <FormButton text={"HOUSING"} onClick={() => navigate('/housing')} />

        <FormButton text={"HOUSE KEEPING"} onClick={() => navigate('/housekeeping')} />

        <FormButton text={"SALES"} onClick={() => navigate('/sales')} />

        <FormButton text={"MOBILE ORDERING"} onClick={() => navigate('/mobileordering')} />
        <FormButton text={"ORDER PREPPING"} onClick={() => navigate('/orderprepping')} />

        <FormButton text={"INVENTORY MANAGING"} onClick={() => navigate('/inventorymanaging')} />

        <FormButton text={"TRANSPORTATION"} onClick={() => navigate('/transportation')} />

        <FormButton text={"PRIVATE SERVICES"} onClick={() => navigate('/privateservices')} />

        <FormButton text={"QUICK CHECKOUT"} onClick={() => navigate('/quickcheckout')} />
        </div>
      
    </>
  );
}
export default CMS_Admin;