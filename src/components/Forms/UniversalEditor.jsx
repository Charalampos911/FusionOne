import React, { useState,useRef,useEffect,useMemo  } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest ,ResetMsg,clearJunk} from '../../Redux/features/ApiReducer';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Search from "../../assets/search.png";
import Unsearch from "../../assets/Unsearch.png";
import Create from "../../assets/create.png";
import Update from "../../assets/update.png";
import Delete from "../../assets/delete.png";

import TimeTilePicker from "../NewUI/TimeTilePicker";
import FormDateSelect from "../NewUI/FormDateSelect";
import FormDateTimeCompact from "../NewUI/FormDateTimeCompact";



import { RiFileAddFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaSearchMinus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DynamicInput from "../UI/DynamicInput"
import DynamicSelect from "../UI/DynamicSelect"
import DynamicCheck from "../UI/DynamicCheck"
import DynamicDateSelect from "../UI/DynamicDateSelect"
import DynamicGallerySelect from "../UI/DynamicGallerySelect"
import Messaging from '../../components/NewUI/Messaging';
import ScopeManager from "../UI/ScopeManager";

import ScopeLoader from "./ScopeLoader";
export default function UniversalEditor({ TList, EmptyStruct, TQuery, TCreate, TUpdate, TDelete, ChangeSelection, Title,HasMedia = false }) {
  const dispatch = useDispatch();
  const Api = useSelector((state) => state.Api);

  // --- DYNAMIC STATE ---
  const [formData, setFormData] = useState({}); 
  const [Selected, setSelected] = useState(null);
  const [IsRequired, setIsRequired] = useState(false);
  const [Message, setMessage] = useState(null);
  const [Clear, setClear] = useState(0);
  const [expandedCell, setExpandedCell] = useState(null);
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 30;
// Calculate which rows to show
  const paginatedList = useMemo(() => {
    if (!TList) return [];
    const startIndex = (currentPage - 1) * rowsPerPage;
    return TList.slice(startIndex, startIndex + rowsPerPage);
  }, [TList, currentPage]);

  const totalPages = Math.ceil((TList?.length || 0) / rowsPerPage);
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Check if the click is inside a dropdown container OR the content area
        if (!event.target.closest('.mini-dropdown-container')) {
          setExpandedCell(null);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);





    }, []);
  console.log("TList===>",TList)


  // --- 1. FETCH EMPTY STRUCT ON MOUNT ---
  useEffect(() => {
    dispatch(ResetMsg());
    HEmptyStruct();


    // dispatch(apiRequest({
    //   name: "UniversalEditor | HQuery for fieldKey "+key,
    //   url: relationship[1],
    //   method: "POST",
    //   body: {},
    //   storeIn: relationship[2],
    //   auth: true, tokenRequired: true,
    // }))





  }, []); // Run once on mount

  const HEmptyStruct = () => {
    if(Api.EmptyStruct != null) return;
    setFormData({});
    setIsRequired(false);
    dispatch(apiRequest({
      name: "UniversalEditor | HEmptyStruct",
      url: EmptyStruct.url,
      method: "GET",
      body: null,
      storeIn: EmptyStruct.storeIn, // This stores it in Api.EmptyStruct
      auth: true, 
      tokenRequired: true,
    }))
    .unwrap()
    .then(() => {
      // 2. FETCH ACTUAL DATA ONLY AFTER WE HAVE THE STRUCTURE
      HQuery("777",{});
    });
  };

  // --- 3. DERIVE UI FIELDS FROM THE REDUX-STORED EMPTY STRUCT ---
  const fieldKeys = useMemo(() => {
    // We look specifically at Api.EmptyStruct (the location defined by storeIn)
    const struct = Api[EmptyStruct.storeIn];

    if (!struct) return [];
    
    // Filter out internal database keys we don't want to show as inputs
    return Object.keys(struct).filter(key => key !== 'Id');
  }, [Api, EmptyStruct.storeIn]);

  // Sync state when a user selects a row from the list
  useEffect(() => {
    if (Selected) {
      setFormData(Selected);
    } else {
      setFormData({});
    }
  }, [Selected]);

  // useEffect(() => {
  //   setMessage(Api.NewApiToUserMessage);
  // }, [Api.NewApiToUserMessage]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
// Helper to find if a field has a relationship defined in Api.Relationships
  const getRelationship = (key) => {
    if (!Api.Relationships) return null;
    // Relationships is an array of arrays: [key, url, storeIn]
    return Api.Relationships.find(rel => rel[0] === key);
  };
  // --- CRUD ACTIONS ---

  const HQuery = (from, formData ) => {
  console.log("formData===>",formData)
  // return;
  setCurrentPage(1);
    dispatch(apiRequest({
      name: "UniversalEditor | HQuery "+from,
      url: TQuery.url,
      method: "POST",
      body: formData,
      storeIn: TQuery.storeIn,
      auth: true, tokenRequired: true,
    }));
  };

  const HNew = () => {

    console.clear()
    console.log("formData==>",formData)


    const isFormValid = fieldKeys.every(key => {
      // 1. Skip validation if the key is "Url"
      if (key === "Url") return true; 

      // 2. Perform standard validation for all other keys
      return (
        formData[key] !== undefined && 
        formData[key] !== null && 
        formData[key] !== ""
      );
    });
    if (!isFormValid) {
      setIsRequired(true);
      setMessage({ msg: "All fields are required", Mood: false });
      return;
    }
    const { File, ...otherData } = formData;
    dispatch(apiRequest({
      name: "UniversalEditor | HNew",
      url: TCreate.url,
      method: "POST",
      // body: formData,
       body: otherData,
      storeIn: TCreate.storeIn,
      auth: true, 
      tokenRequired: true,
      isForm: HasMedia,
      mediaFiles: (HasMedia && File) ? [File] : []
    })).unwrap().then(() => {
      setSelected(null);
      setFormData({});
    });
  };

  const HUpdate = () => {



    if (!Selected) return;

    const { File, ...otherData } = formData;
    console.log("File===",File)
    console.log("otherData===",otherData)
    dispatch(apiRequest({
      name: "UniversalEditor | HUpdate",
      url: TUpdate.url,
      method: "PUT",
      // body: { ...formData, Id: Selected.Id },
      body: { ...otherData, Id: Selected.Id },
      storeIn: TUpdate.storeIn,
      auth: true, 
      tokenRequired: true,
      isForm: HasMedia,
      mediaFiles: (HasMedia && File) ? [File] : []
    }));
  };

  const HDelete = () => {
    if (!Selected) return;
    dispatch(apiRequest({
      name: "UniversalEditor | HDelete",
      url: TDelete.url,
      method: "DELETE",
      body: { Id: Selected.Id },
      storeIn: TDelete.storeIn,
      auth: true, tokenRequired: true,
    })).unwrap().then(() => {
      setSelected(null);
      setFormData({});
      setClear(c => c + 1);
    });
  };
  return (
    <div id='Editor'>
      <div className='subCategory'>
        <div className="ChangeSelection" onClick={ChangeSelection}><FaArrowLeft /></div>
        <div className='subCategoryTitle'>{Title}</div>
        <div className='ScopeLoader'><ScopeLoader/></div>
      </div>

      <div id="EditView" >
        {/* Only render the grid if we have successfully loaded the field schema */}
        {fieldKeys.length > 0 ? (
          <div className="QueryList PC Minimal">
            <div className="QueryListHeader">
              <div className='QueryListHeaderItem QueryListActions'>
                <div onClick={() => ( setFormData({}), HQuery("111",{}),setClear(c => c + 1) )}> <FaSearchMinus /></div>
                <div onClick={()=>HQuery("222",formData)}><FaSearch /></div>
                {TUpdate.url!=null?<div onClick={HUpdate} ><MdEdit/></div>:null}
                {TCreate.url!=null?<div onClick={HNew}> <RiFileAddFill /></div>:null}
                {TDelete.url!=null?<div onClick={HDelete}> <MdDelete /></div>:null}

              </div>
            </div>

            <div className='QueryListInputs'>
              <div className='Index'>No</div>
              {fieldKeys.map(key => {
                const relationship = getRelationship(key);
                
                // 1. Determine the value type from the EmptyStruct
                const structValue = Api[EmptyStruct.storeIn][key];
                const valueType = typeof structValue;

                // 2. Handle Relationships (Selects)
                if (relationship) {


                  
                  return (
                    // <DynamicSelect 
                    //   key={key}
                    //   IsRequired={IsRequired}
                    //   placeholder={key}
                    //   url={relationship[1]}
                    //   optionsArray={null}
                    //   storeIn={relationship[2]}
                    //   ElValue={formData[key] || ""}
                    //   setValue={(val) => handleInputChange(key, val)}
                    //   Sorting={(val) => (HQuery("333",{ [`F${key}`]: val }))}
                    //   Clear={Clear}
                    // />
                    <ScopeManager Prop={key} setValue={(e)=>handleInputChange(key,e)} Sorting={(val) => (HQuery("333",{ [`F${key}`]: val }))} Clear={Clear} />
                  );
                }





                if (Array.isArray(structValue)) {
                    return (
                    <DynamicSelect 
                      key={key}
                      IsRequired={IsRequired}
                      placeholder={key}
                      url={null}
                      optionsArray={structValue}
                      storeIn={null}
                      ElValue={formData[key] || ""}
                      setValue={(val) => handleInputChange(key, Number(val))}
                      Sorting={(val) => (HQuery("441",{ [`F${key}`]: val }))}
                      Clear={Clear}
                    />

          
                    
                    );
                  }
                // 3. Handle Booleans (Checkboxes)
                if (valueType === 'boolean') {
                  return (
                    <DynamicCheck 
                      key={key}
                      placeholder={key}
                      IsRequired={IsRequired}
                      ElValue={formData[key]} 
                      Clear={Clear}
                      setValue={(val) => handleInputChange(key, val)}
                      Sorting={(val) => (HQuery("442",{ [`F${key}`]: val }))}
                    />
                  );
                }

                // 4. Handle Dates and Times (Strings with specific formats)
                if (valueType === 'string') {

                  // 1. IsDateTime: Matches YYYY-MM-DD followed by T or space, then the time
                  // This will catch your "2027-01-01T23:00:00" example
                  const isDateTime = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/.test(structValue)

                  if (isDateTime) {
                    return (
                      <>
                        <FormDateTimeCompact ReturnVal={(val) => handleInputChange(key,val)} PreSelectedDate={formData[key]}/>
                      </>
                    );
                  }

                  // 2. IsDateOnly: Matches YYYY-MM-DD exactly
                  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(structValue);


                  if (isDateOnly) {
                    return (
                      <>
                        <FormDateSelect ReturnVal={(val) => handleInputChange(key,val)} PreSelectedDate={formData[key]}/>
                      </>
                    );
                  }

                  // 3. IsTimeOnly: Matches HH:mm:ss exactly
                  const isTimeOnly = /^\d{2}:\d{2}:\d{2}$/.test(structValue);

                  if (isTimeOnly) {
                    return (
                      <>
                      <TimeTilePicker 
                        title={key}
                        ElValue={formData[key] ?? ""} 
                     
                        Clear={Clear}
                        ReturnVal={(val) => handleInputChange(key, val)}
          
                        Sorting={(val) => HQuery("443",{ [`F${key}`]: val })}
                           IsDynamic={true}
                      />
                      </>
                    );
                  }
                }
                if (HasMedia && key === "File") {
                  return (
                    <DynamicInput 
                      key={key}
                      type="file" 
                      IsRequired={IsRequired} 
                      placeholder="Upload File" 
                      ElValue={formData[key] ?? ""} 
                      Clear={Clear} 
                      setValue={(val) => handleInputChange(key, val)}
                      Sorting={() => {}} 
                    />
                  );
                }
                // 5. Default: Handle Numbers and standard Text Strings
                return (
                  <DynamicInput 
                    key={key}
                    type={valueType === 'number' ? 'number' : 'text'} 
                    IsRequired={IsRequired} 
                    placeholder={key} 
                    ElValue={formData[key] ?? ""} 
                    Clear={Clear} 
                    setValue={(val) => handleInputChange(key, val)}
                    Sorting={(val) => (HQuery("666",{ [`F${key}`]: val }))}
                  />
                );
              })}
            </div>
            <div className='paginatedList'>
            {paginatedList?.map((item, index) => {
                const displayIndex = ((currentPage - 1) * rowsPerPage) + index + 1;
                return (
                    <div
                        key={item.Id || index}
                        className={Selected?.Id === item.Id ? "selected QueryListItem" : "QueryListItem"}
                        onClick={() => { setSelected(item); dispatch(ResetMsg()); setIsRequired(false); }}
                    >
                        <div><div>{displayIndex}</div></div>
                        {fieldKeys.map(key => {
                            const rawValue = item[key];
                            const structValue = Api[EmptyStruct.storeIn][key];
                            const relationship = getRelationship(key);
                            
                            if (relationship) {
                                const storeName = relationship[2];

                                console.log("relationship 444444 === ",relationship)

                                const relatedData = Api[storeName];
                                
                                const relatedObject = Array.isArray(relatedData)
                                    ? relatedData.find(obj => obj.Id === rawValue)
                                    : null;
                              if(storeName=="Timezones"){
                              console.clear()
                              console.log("storeName===",storeName)
                              console.log("relatedData===",relatedData)
                              console.log("relatedObject===",relatedObject)
                              console.log("relationship===",relationship)
                              console.log(" Array.isArray(relatedData)===", Array.isArray(relatedData))
                              console.log("rawValue===",rawValue)
                              console.log("fieldKeys===",fieldKeys)
                              console.log("key===",key)
                              console.log("item===",item)
                              console.log("item[key]===",item[key])
                              console.log("paginatedList===",paginatedList)
                               
                              }
                              // return;
                                const cellId = `${index}-${key}`;
                                const isExpanded = expandedCell === cellId;
                                return (
                                    <div
                                        key={key}
                                        className="mini-dropdown-container"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                             setSelected(item)
                                            setExpandedCell(isExpanded ? null : cellId);
                                        }}
                                    >
                                        <div className="dropdown-label">
                                            {relatedObject ? relatedObject.Name || relatedObject.LastName : (
                                              // rawValue
                                              "executable macro"
                                              || "N/A")}
                                        </div>
                                        {isExpanded && (
                                            <div className="dropdown-content" 
                                            onClick={(e) =>  e.stopPropagation()} 
                                            style={{ cursor: 'text' }}>
                                                {relatedObject ? relatedObject.Id : 
                                                storeName
                                                // rawValue
                                                }
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            if (Array.isArray(structValue)) {
                                const valIndex = structValue.indexOf(rawValue);
                                const label = (valIndex !== -1 && structValue[valIndex + 1])
                                    ? structValue[valIndex + 1]
                                    : rawValue;
                                return <div key={key}>{label?.toString()}</div>;
                            }

                            return (
                                <div key={key}>
                                    {rawValue !== null && rawValue !== undefined ? rawValue.toString() : ""}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
            </div>
                {/* --- PAGINATION UI --- */}
                {totalPages > 1 && (
                    <div className="PaginationBar">
                        <div 
                            className={currentPage  === 1? "Page LastPage" : "Page"}
                            disabled={currentPage === 1} 
                            onClick={() => currentPage  > 1? setCurrentPage(prev => prev - 1):null}
                            style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: 'none' }}
                        >
                            <FaChevronLeft />
                        </div>
                        
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        
                        <div 
                            className={currentPage === totalPages ? "Page LastPage" : "Page"}
                            disabled={currentPage === totalPages} 
                            onClick={() =>currentPage < totalPages ?setCurrentPage(prev => prev + 1):null}
                            style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: 'none' }}
                        >
                            <FaChevronRight />
                        </div>
                    </div>
                )}
          </div>
        ) : (
          <div className="Loading">Loading Schema...</div>
        )}
        <Messaging ParentMessage={Message} IsLocal={false}/>
        
      </div>
    </div>
  );
}