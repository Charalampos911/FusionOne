import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";


{/*
        <FormsSelect
          ElValue={Department.Id}
          placeholder={"Department"}
          FlatArray={Departments}
          ReturnVal={(val)=>setDepartment(val)}
          EntityFetcher={true}
        />
*/}

export default function FormsSelect({zIndex=0,ElValue,placeholder,FlatArray,ReturnVal,EntityFetcher=false}) {
  const [Value, setValue] = useState(ElValue || "");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
console.log("FlatArray=======",FlatArray)
   const options =  [];
    if (Array.isArray(FlatArray)) {
      for (let i = 0; i < FlatArray.length; i ++) {
        options.push({ 
          Id: FlatArray[i].Id, 
          Name: FlatArray[i].Name 
        });
      }
    }
    console.log("options=======",options)
  useEffect(() => {
    setValue(ElValue);
  }, [ElValue,FlatArray]);

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
    setValue(val.Id);
    ReturnVal(EntityFetcher?val:val.Id);
    setIsOpen(false);
  };

  const displayLabel = options.find(opt => String(opt.Id).toLocaleLowerCase() === String(Value).toLocaleLowerCase())?.Name
                    || options.find(opt => String(opt.Id).toLocaleLowerCase() === String(Value).toLocaleLowerCase())?.LastName
                    || Value;

console.log("displayLabel==>",displayLabel)
console.log("options==>",options)
console.log("Value==>",Value)

  return (
    <div id="FormsSelect" ref={dropdownRef} style={{ zIndex }}>
    <div className="cont" onClick={() => setIsOpen(!isOpen)}>
       {Value ? <div className="floating-label">{placeholder}</div> : null}
      
      <div 
        className="box"
        
      >
        <span className={`selected ${Value ? 'placeholder' : ''}`}>
          {Value ? displayLabel : `${placeholder}`}
        </span>
        <div className="arrow">{isOpen ? '▲' : '▼'}</div>
      </div>

    </div>
    {isOpen && (
      <div class="list">
        <ul>
          {options.map((opt, index) => (
          <li 
            key={index} 
            onClick={() => handleSelect(opt)}
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


