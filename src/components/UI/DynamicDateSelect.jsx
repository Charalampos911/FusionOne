import React, { useState, useEffect } from 'react';
import ClearIcon from '../../assets/clear.png';
import SortingIcon from '../../assets/sorting.png';

export default function DynamicDateSelect(props) {
    // type will be either "date" or "time" passed from UniversalEditor
    const { type, placeholder, ElValue, IsRequired, setValue, Sorting, Clear } = props;

    const [value, setLocalValue] = useState(ElValue || "");
    const [isSorting, setIsSorting] = useState(true);

    // Sync with parent state changes
    useEffect(() => {
        setLocalValue(ElValue || "");
    }, [ElValue]);

    // Handle global clear trigger
    useEffect(() => {
        setLocalValue("");
    }, [Clear]);

    // Handle internal change
    const handleChange = (e) => {
        const val = e.target.value;
        setLocalValue(val);
        setValue(val);
    };

    // Handle Sorting toggle
    const toggleSorting = () => {
        const nextSort = !isSorting;
        setIsSorting(nextSort);
        Sorting(nextSort);
    };

    const handleClear = () => {
        setLocalValue("");
        setValue("");
    };

    return (
        <div id="dynamic-select" className="rounded-select-container 2">
            <div className="dynamic-select">
                {/* Floating Label: Matches your logic (show if value exists) */}
                {value ? <div className="floating-label">{placeholder}</div> : null}

                <div className={`select-box ${IsRequired && !value ? 'required' : ''}`}>
                    <input
                        type={type} // "date" or "time"
                        value={value}
                        onChange={handleChange}
                        className="dynamic-date-input"
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            width: '100%',
                            color: value ? 'inherit' : '#999'
                        }}
                    />
                </div>
                {Clear!=false?
                <div className='Field-Actions'>
                    <div className='clear ActionIcon' onClick={handleClear}>
                        <img src={ClearIcon} alt="Clear" />
                    </div>
                    <div 
                        className={`sorting ActionIcon ${isSorting ? '' : 'disabled'}`} 
                        onClick={toggleSorting}
                    >
                        <img src={SortingIcon} alt="Sort" />
                    </div>
                </div>
                :null}
            </div>
        </div>
    );
}