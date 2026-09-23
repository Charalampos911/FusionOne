import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,ResetMsg} from '../../Redux/features/ApiReducer';

      // <FormButton text={"Login"} onClick={()=>HLogin()}/>

export default function FormButton({text,onClick}) { 

  return (
    <button className="form-button" onClick={()=>onClick()} >
    {text}
    </button>
  )

}
