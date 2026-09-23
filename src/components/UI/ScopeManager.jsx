import React, { useState, useEffect, useRef } from 'react';
import ScopeSelect from './ScopeSelect';
import { IoChevronDown } from "react-icons/io5"; // Run: npm install react-icons


//<ScopeManager Prop={key} setValue={(e)=>handleInputChange(key,e)} Sorting={(val) => (HQuery("333",{ [`F${key}`]: val }))} Clear={Clear} ShowClear={false} ShowSorting={false}/>

export default function ScopeManager({ label=null, Prop, setValue, Sorting, Clear,ShowClear=true,ShowSorting=true }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(""); // Stores finalSelection.Name

  // This matches your current prop setup
  const handleValueChange = (finalId) => {
    // You can use this ID to send to your backend or update your form
    console.log("Final Selected ID submitted:", finalId);
    setValue(finalId)
  };
  useEffect(() => {
        setSelectedLabel("")
        setIsModalOpen(false)
  }, [Clear]);
  return (
    <div className="scope-control-container">
      {/* The Select-Like Trigger Button */}
      <label>
        {label?label:Prop}
      </label>
      <button 
        className="scope-control-trigger" 
        onClick={() => setIsModalOpen(true)}
        type="button"
      >
        <span className={`trigger-text ${!selectedLabel ? 'placeholder' : ''}`}>
          {selectedLabel || Prop}
        </span>
        <IoChevronDown className="trigger-arrow" />
      </button>

      {/* The Popup Modal */}
   
        <ScopeSelect 
          isModalOpen={isModalOpen}
          Prop={Prop}
          setValue={handleValueChange}
          setSelectedLabel={setSelectedLabel} // <-- Pass this new setter down
          setIsOpen={setIsModalOpen}          // <-- Pass down to let modal close itself
          Sorting={(val) =>Sorting(val)}
          Clear={(val) => setSelectedLabel("")}
          ShowSorting={ShowSorting}
          ShowClear={ShowClear}
        />

      
    </div>
  );
}
