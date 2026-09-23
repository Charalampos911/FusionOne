import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, clearState } from '../../Redux/features/ApiReducer';
import { useParams } from 'react-router-dom';

export default function Auth(props) { 
  const Api = useSelector((state) => state.Api); 
  const dispatch = useDispatch(); 

  const [ActiveTab, setActiveTab] = useState(0);


    return (
        <>AppMain element SALES</>

    )

}