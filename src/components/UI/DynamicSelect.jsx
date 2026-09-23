import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../Redux/features/ApiReducer';

import { MdOutlineClear } from "react-icons/md";
import { RiSortAlphabetAsc } from "react-icons/ri";
export default function DynamicSelect(props) {
  const dispatch = useDispatch();
  const Api = useSelector((state) => state.Api);
  console.log("DynamicSelect.props=",props)
  // const options = Api[props.storeIn] || [];

  const options = props.storeIn && Api[props.storeIn] || [];
  if (Array.isArray(props.optionsArray) && props.storeIn == null) {
    for (let i = 0; i < props.optionsArray.length; i += 2) {
      options.push({ 
        Id: props.optionsArray[i]+"", 
        Name: props.optionsArray[i + 1] 
      });
    }
  }else{
    
  }
    if (Array.isArray(props.FlatArray) && props.storeIn == null) {
    for (let i = 0; i < props.FlatArray.length; i ++) {
      options.push({ 
        Id: props.FlatArray[i]+"", 
        Name: props.FlatArray[i] 
      });
    }
  }else{
    
  }


  const [Value, setValue] = useState(props.ElValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const [IsSorting, setIsSorting] = useState(true);
  const dropdownRef = useRef(null);
  const handleSortClick = () => {
    const newValue = !IsSorting;
    setIsSorting(newValue);
    props.Sorting(newValue);
  };

  useEffect(() => {
    if (options.length === 0 && props.url) {
      dispatch(apiRequest({
        name:"DynamicSelect | useEffect",
        url: props.url,
        method: "POST",
        body: {}, 
        storeIn: props.storeIn ,
        auth: true,
        tokenRequired: true,
      }));
    }
  }, [props.url, props.storeIn]);

  useEffect(() => {
    setValue(props.ElValue || "");
  }, [props.ElValue]);

  useEffect(() => {
    if(props.url==null){
      if (Array.isArray(props.FlatArray)){
        setValue(props.ElValue[0]);
      }else{
        setValue(-1);
      }
    }else{
      setValue("");
    }
  }, [props.Clear]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    setValue(val);
    props.setValue(val);
    setIsOpen(false);
  };

  const displayLabel = options.find(opt => String(opt.Id).toLocaleLowerCase() === String(Value).toLocaleLowerCase())?.Name
                    || options.find(opt => String(opt.Id).toLocaleLowerCase() === String(Value).toLocaleLowerCase())?.LastName
                    || Value;

console.log("displayLabel==>",displayLabel)
console.log("options==>",options)
console.log("Value==>",Value)
console.log("props==>",props)
console.log("optionsArray==>",props.optionsArray)
  return (
    <div id="dynamic-select" ref={dropdownRef}>
    <div className={`dynamic-select`} >
       {Value ? <div className="floating-label">{props.placeholder}</div> : null}
      
      <div 
        className={`select-box ${props.IsRequired && Value? 'required' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`selected-value ${Value ? 'placeholder' : ''}`}>
          {Value ? displayLabel : `${props.placeholder}`}
        </span>
        <div className="arrow">{isOpen ? '▲' : '▼'}</div>

      </div>



    </div>
    {props.Clear>=0?
      <div className='Field-Actions'>
        <div onClick={()=>{setValue(""); props.setValue("");}}><MdOutlineClear /></div>
        {props.type !== "file" && (
        <div  onClick={handleSortClick}><RiSortAlphabetAsc /></div>
        )}
      </div>
    :null}
    {isOpen && (
      <div id="options-list">
        <ul className="options-list">
          {options.map((opt, index) => (
          <li 
            key={index} 
            onClick={() => handleSelect(opt.Id)}
            className={Value && String(opt.Id) === String(Value) ? 'selected' : ''}
          >
            {opt.Name || opt.LastName || opt.Id}
          </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
}


