import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest} from '../../../Redux/features/ApiReducer';
import { SlSizeFullscreen } from "react-icons/sl";
import { MdArrowCircleLeft } from "react-icons/md";

import {PPServiceCarousel} from "../PopUps/ServiceCarousel"

export default function OnlineSelect({
  IsDiv,
  optionsArray,
  setValue,
  
  placeholder,
  
  preVal = null,
  GoBack
}) {
  const [Val, setVal] = useState(preVal);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [popUp, setPopUp] = useState(null);
  const dispatch = useDispatch(); 

console.log("optionsArray====",optionsArray)
  const dropdownRef = useRef(null);

  // Sync internal state whenever preVal changes from parent
  useEffect(() => {
    setVal(preVal);
  }, [preVal]);

  // Reset search state when options change without clearing preVal
  useEffect(() => {
    setSearchTerm("");
    setIsOpen(false);
  }, [optionsArray]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to extract display text cleanly
  const getDisplayText = (item) => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    return item.Name || item.LastName || item.Id || (Array.isArray(item) ? item[0] : "") || "";
  };

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    const baseOptions = optionsArray || [];
    if (!searchTerm) return baseOptions;

    return baseOptions.filter((opt) => {
      const name = getDisplayText(opt).toString().toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  }, [optionsArray, searchTerm]);

  const handleSelect = (selectedItem) => {
    setVal(selectedItem);
    setIsOpen(false);
    setSearchTerm("");

    if (setValue) {
      setValue(selectedItem);
    }
  };
  const HPopUp = (Item) => {

    dispatch(
      apiRequest({
        name: "Divisionsselect.jsx | useEffect",
        url: IsDiv?"api/ServicesSU/ServicesResponseSU":"api/DivisionsSU/DivisionsResponseSU",
        method: "POST",
        body:{
          DepartmentId: Item.DepartmentId,
          Id: Item.Id,
        },
        auth: false,
        tokenRequired: false,
        storeIn:null
      })
    ).unwrap()
      .then(async (Response) => {
 console.log("Item===",Item);
        console.log("PopUp===",Response.data);
        if(Item?.DurationMinutes){
        setPopUp(Response.data?.Services[0])
        }else{
        setPopUp(Response.data?.Divisions[0])
        }

      })


  };

  return (
        <>
        <div id="OnlineSelect">
          <div className="online-back" onClick={()=>GoBack()}><MdArrowCircleLeft /></div>
          <label>{placeholder}</label>
          <ul className="list" style={{ overflowY: 'auto' }}>
            {IsDiv?null:
            <li style={{ padding: '10px', color: '#999', textAlign: 'center' }} onClick={() => handleSelect(null)}>
                Any division will do...
            </li>
            }
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => (
                <li 
                  key={opt?.Id || index} 
                  className={`${opt === Val ? 'selected' : ''}`}
                >
                  <div>
                    <div  onClick={() => handleSelect(opt)}>{getDisplayText(opt)}</div>
                    <span onClick={() => HPopUp(opt)}><SlSizeFullscreen  /></span>
                  </div>
<div onClick={() => handleSelect(opt)}>
  {IsDiv? (
    <>
      <div>
        {"Duration: " +
          [
            [Math.floor(opt.DurationMinutes / 1440), "d"],
            [Math.floor((opt.DurationMinutes % 1440) / 60), "h"],
            [opt.DurationMinutes % 60, "m"],
          ]
            .filter(([n]) => n)
            .map(([n, u]) => n + u)
            .join(" ")}
      </div>

      <div>{"Price: " + opt.Price}€</div>
    </>
  ) : (
    <>
      <div>{"Capacity: " + opt.Capacity}</div>
      <div>{"Floor: " + opt.FloorNumber}</div>
    </>
  )}
</div>                </li>
              ))
            ) : (
              <li style={{ padding: '10px', color: '#999', textAlign: 'center' }}>
                No results found
              </li>
            )}




          </ul>

        {popUp?<PPServiceCarousel services={[popUp]} onClosePopUp={()=>setPopUp(null)} />:null}
        </div>
            
</>


  );
}