import React, { useState,useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,ResetMsg} from '../../Redux/features/ApiReducer';

import { MdOutlineClear } from "react-icons/md";
import { RiSortAlphabetAsc } from "react-icons/ri";
export default function DynamicInput(props) { 
const Api = useSelector((state) => state.Api); 
const dispatch = useDispatch(); 

// Sorting


const [Value, setValue] = useState(props.ElValue);
const [HasCleared, setHasCleared] = useState(false);
const [IsSorting, setIsSorting] = useState(true);
const fileInputRef = useRef(null);
// useEffect(() => {
//   setValue(props.ElValue)
// }, [props.ElValue]);
  useEffect(() => {
    // If it's a file, we only store the name for the UI label
    if (props.type === "file") {
      setValue(props.ElValue instanceof File ? props.ElValue.name : props.ElValue);
    } else {
      setValue(props.ElValue);
    }
  }, [props.ElValue, props.type]);
const handleSortClick = () => {
  const newValue = !IsSorting;
  setIsSorting(newValue);
  props.Sorting(newValue);
};
// useEffect(() => {
//   if(props.Clear>=0){
//     setValue("")
//     setHasCleared(false)
//   }
// }, [props.Clear]);
useEffect(() => {
    if (props.Clear >= 0) {
      setValue("");
      // setHasCleared(false)
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [props.Clear]);
console.log("props==",props)
console.log("IsSorting==",IsSorting)
console.log("11-Value==",Value)
console.log("11-props.ElValue==",props.ElValue)
console.log("11-HasCleared==",HasCleared)
console.log("props.Clear==",props.Clear)
console.log("props.Clear.type==",typeof(props.Clear))
const handleChange = (e) => {
    if (props.type === "file") {
      const file = e.target.files[0];
      setValue(file ? file.name : ""); 
      props.setValue(file); // Send actual File object to UniversalEditor
    } else {
      const val = e.target.value;
      setValue(val);
      props.setValue(val);
    }
  };
const handleClearAction = () => {
    setValue("");
    props.setValue(props.type === "file" ? null : "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  return (
    <div id='DynamicInput' className={props.type}>
    {Value && Value!="" || Value==0 ?<div className='Floating-Label'>{props.placeholder}</div>:null}


    {props.type !== "file" ?
    <>
    {/* <label>{props.placeholder}</label> */}
    <input
        ref={fileInputRef}
        className={props.IsRequired && Value==""?"Required FPInput":"FPInput"}
        type={props.type}
        placeholder={props.placeholder}
        // value={Value && Value!=""?Value:HasCleared?props.ElValue:""}
        // File inputs must not have a 'value' prop
        value={Value}
        // onChange={(e) => {setValue(e.target.value),props.setValue(e.target.value)}}
        onChange={handleChange}
    />
    </>
    :
        // <input
        // ref={fileInputRef}
        // className={props.IsRequired && Value==""?"Required FPInput":"FPInput"}
        // type={props.type}
        // placeholder={props.placeholder}
        // // value={Value && Value!=""?Value:HasCleared?props.ElValue:""}
        // // File inputs must not have a 'value' prop
        // {...(props.type !== "file" ? { value: Value || "" } : {})}
        // // onChange={(e) => {setValue(e.target.value),props.setValue(e.target.value)}}
        // onChange={handleChange}
        // />

        <div class="file-upload">
          <input 
          ref={fileInputRef}
          type="file" id="file-input"
          className={props.IsRequired && Value==""?"Required FPInput hidden-input":"FPInput hidden-input"}
          onChange={handleChange}
          />
          <label for="file-input" class="custom-file-button">
            <span className={Value!=null && Value!=""?"HasFile":null}>Choose Image</span>
            {Value!=null && Value!=""?<span>{Value}</span>:null}
          </label>
        </div>
    }

    {props.Clear>=0?
    <div className='Field-Actions'>
      <div onClick={handleClearAction}><MdOutlineClear /></div>
      {props.type !== "file" && (
      <div  onClick={handleSortClick}><RiSortAlphabetAsc /></div>
      )}
    </div>
    :null}
    </div>
  );

}