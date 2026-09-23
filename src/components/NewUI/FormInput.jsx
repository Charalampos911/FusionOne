import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,ResetMsg} from '../../Redux/features/ApiReducer';

      // <FormInput 
      //   key={0}
      //   type="text" or "file" or "password"
      //   placeholder="Full name"
      //   ElValue={fullName ?? ""} 
      //   ReturnVal={(val) => setFullName(val)}
      // />

export default function FormInput({key,ElValue,type,ReturnVal,placeholder}) { 
const Api = useSelector((state) => state.Api); 
const dispatch = useDispatch(); 

const [Value, setValue] = useState(ElValue);
const fileInputRef = useRef(null);
  useEffect(() => {
    // If it's a file, we only store the name for the UI label
    if (type === "file") {
      setValue(ElValue instanceof File ? ElValue.name : ElValue);
    } else {
      setValue(ElValue);
    }
    console.log("Value = "+ElValue)
  }, [ElValue, type]);
  
const handleChange = (e) => {
    if (type === "file") {
      const file = e.target.files[0];
      setValue(file ? file.name : ""); 
      ReturnVal(file); // Send actual File object to UniversalEditor
    } else {
      const val = e.target.value;
      setValue(val);
      ReturnVal(val);
    }
  };

  return (
    <div id='form-input-cont' className={type}>
    <div className={`Floating-Label ${Value != null && Value != "" ? 'show' : 'hide'}`}>{placeholder}</div>


    {type !== "file" ?
    <>
    <input
        key={key}
        ref={fileInputRef}
        className={"form-input-text"}
        type={type}
        placeholder={placeholder}
        value={Value}
        onChange={handleChange}
    />
    </>
    :
    <div class="form-input-file-cont" key={key}>
      <input 
      
      ref={fileInputRef}
      type="file"
      className={"form-input-file"}
      onChange={handleChange}
      />
      <label for="file-input" class="custom-file-button">
        <span className={Value!=null && Value!=""?"HasFile":null}>Choose Image</span>
        {Value!=null && Value!=""?<span>{Value}</span>:null}
      </label>
    </div>
    }
    </div>
  );

}