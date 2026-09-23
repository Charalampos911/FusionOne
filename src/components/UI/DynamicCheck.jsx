import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { MdOutlineClear } from "react-icons/md";
import { RiSortAlphabetAsc } from "react-icons/ri";

import { BiCheckboxSquare } from "react-icons/bi";
import { BiCheckbox } from "react-icons/bi";

export default function DynamicCheck(props) {
  // props.ElValue should be a boolean (true/false)
  const [HasCleared, setHasCleared] = useState(false);
  const [IsSorting, setIsSorting] = useState(true);  
  const [Checked, setChecked] = useState(props.ElValue || null);
console.log("HasCleared==>",HasCleared)
console.log("props==>",props)
console.log("Checked==>",Checked)
console.log("props.ElValue==>",props.ElValue)

  // Sync with parent state (e.g., when a row is selected in the Editor)
  useEffect(() => {
    if(!HasCleared)
    setChecked(!!props.ElValue); // Force to boolean
    setHasCleared(false)
  }, [props.ElValue]);
const handleSortClick = () => {
  const newValue = !IsSorting;
  setIsSorting(newValue);
  props.Sorting(newValue);
};
    // Handle global clear trigger
  useEffect(() => {
    if(props.Clear>=0){
      setChecked(null);
      setHasCleared(false)
    }
  }, [props.Clear]);
  const handleToggle = () => {
    const newValue = !Checked;
    setChecked(newValue);
    props.setValue(newValue);
  };

  return (
    <div id='DynamicInput' className={`DynamicCheckContainer  ${props.Dclass || ""}`} 
    onClick={handleToggle}>
      {/* Label/Placeholder logic consistent with your DynamicInput */}
      
      
      <div 
        className={`CheckSlot  ${props.IsRequired && !Checked ? "Required" : ""}`}
        
      >
        <div className="CheckLabel">{props.placeholder}</div>
        <input
          type="checkbox"
          checked={Checked}
          onChange={handleToggle} 
          className="HiddenCheckbox"
        />
        <div className={`CustomBox ${Checked ? "Checked" : ""}`}>
          {Checked==null? <BiCheckbox />: null}
          
          {Checked==true? <BiCheckboxSquare />: null}
          
          {Checked==false? <BiCheckbox />: null}
        </div>

      </div>
      {props.Clear>=0?
      <div className='Field-Actions'>
        <div onClick={()=>{setChecked(null),props.setValue(null),setHasCleared(true)}}><MdOutlineClear /></div>
        {props.type !== "file" && (
        <div  onClick={handleSortClick}><RiSortAlphabetAsc /></div>
        )}
      </div>
      :null}
    </div>
  );
}