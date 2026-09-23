import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../Redux/features/ApiReducer';
import Clear from '../../assets/clear.png';
import Sorting from '../../assets/sorting.png';
import { RxValue } from 'react-icons/rx';


{/* 
  <FormsSelectFetch
    key={0}
    ElValue={value}
    placeholder={placeholder}
    url={url}
    ReturnVal={(val) => setEstablishmentId(val)}
       FormSize={false}
       EntityFetcher={false}
  /> 
*/}

export default function FormsSelectFetch({zIndex=0,key,ElValue,placeholder,url,ReturnVal,FormSize=false,EntityFetcher=false}) {
  const dispatch = useDispatch();
  const Api = useSelector((state) => state.Api);

  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [Value, setValue] = useState(ElValue || "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (options.length === 0 && url) {
      dispatch(apiRequest({
        name:"FormsSelectFetch | useEffect",
        url: url,
        method: "POST",
        body: {}, 
        storeIn: null,
        auth: true,
        tokenRequired: true,
      }))
      .unwrap() // Waits for the thunk to resolve successfully
        .then((Response) => {
          console.log("Response==>",Response)
           setOptions(Response.data)
        })
      ;
    }
  }, [url]);

  useEffect(() => {
    setValue(ElValue || "");
  }, [ElValue]);

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
    <div id="FormsSelectFetch" ref={dropdownRef} key={key} className={FormSize?"FormSize":null} style={{zIndex}}>
    <div className="cont"  onClick={() => setIsOpen(!isOpen)}>
       {Value ? <div className="floating-label">{placeholder}</div> : null}
      <div 
        className={`box ${Value ? 'placeholder' : ''}`}
      >
      <span className="selected">
        {Value ? displayLabel : `${placeholder}`}
      </span>
      {/* <div className="arrow">{isOpen ? '▲' : '▼'}</div> */}

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


