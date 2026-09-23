import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from '../../Redux/features/ApiReducer';

import { MdOutlineClear } from "react-icons/md";
import { RiSortAlphabetAsc } from "react-icons/ri";

export default function ScopeSelect({
  isModalOpen,
  Prop,
  setValue,
  Sorting,
  Clear,
  setSelectedLabel,
  setIsOpen,
  ShowClear,
  ShowSorting
}) {
  const dispatch = useDispatch();
  const Api = useSelector((state) => state.Api);
  const [options, setOptions] = useState([]);

  const [IsSorting, setIsSorting] = useState(true);
  const dropdownRef = useRef(null);

  const handleSortClick = () => {
    const newValue = !IsSorting;
    setIsSorting(newValue);
    if (Sorting) Sorting(newValue);
  };

  // State options lists & selected values
  const [openTemplates, setOpenTemplates] = useState(null);
  const [openTemplate, setOpenTemplate] = useState(null);

  const [scheduleTemplates, setScheduleTemplates] = useState(null);
  const [scheduleTemplate, setScheduleTemplate] = useState(null);

  const [establishments, setEstablishments] = useState(null);
  const [establishment, setEstablishment] = useState(null);

  const [departments, setDepartments] = useState(null);
  const [department, setDepartment] = useState(null);

  const [employees, setEmployees] = useState(null);
  const [employee, setEmployee] = useState(null);

  const [specials, setSpecials] = useState(null);
  const [special, setSpecial] = useState(null);

  const [divisions, setDivisions] = useState(null);
  const [division, setDivision] = useState(null);

  const [inventories, setInventories] = useState(null);
  const [inventory, setInventory] = useState(null);

  const [services, setServices] = useState(null);
  const [service, setService] = useState(null);

  const [sectors, setSectors] = useState(null);
  const [sector, setSector] = useState(null);

  const [products, setProducts] = useState(null);
  const [product, setProduct] = useState(null);

  const [permaProducts, setPermaProducts] = useState(null);
  const [permaProduct, setPermaProduct] = useState(null);

  const [serviceTaxes, setServiceTaxes] = useState(null);
  const [serviceTax, setServiceTax] = useState(null);

  const [productTaxes, setProductTaxes] = useState(null);
  const [productTax, setProductTax] = useState(null);

  const [permaProductTaxes, setPermaProductTaxes] = useState(null);
  const [permaProductTax, setPermaProductTax] = useState(null);

  const [serviceCategories, setServiceCategories] = useState(null);
  const [serviceCategory, setServiceCategory] = useState(null);

  const [supplyCategories, setSupplyCategories] = useState(null);
  const [supplyCategory, setSupplyCategory] = useState(null);

  const [productCategories, setProductCategories] = useState(null);
  const [productCategory, setProductCategory] = useState(null);

  const [permaProductCategories, setPermaProductCategories] = useState(null);
  const [permaProductCategory, setPermaProductCategory] = useState(null);

  const [timeZones, setTimeZones] = useState(null);
  const [timeZone, setTimeZone] = useState(null);

  // Resolves the lowest explicitly selected option to submit as the final scope value
  const getCurrentSelection = () => {
    if (serviceTax) return serviceTax;
    if (productTax) return productTax;
    if (permaProductTax) return permaProductTax;

    if (serviceCategory) return serviceCategory;
    if (supplyCategory) return supplyCategory;
    if (productCategory) return productCategory;
    if (permaProductCategory) return permaProductCategory;
    if (timeZone) return timeZone;

    if (openTemplate) return openTemplate;
    if (scheduleTemplate) return scheduleTemplate;
    if (permaProduct) return permaProduct;
    if (product) return product;
    if (sector) return sector;
    if (service) return service;
    if (inventory) return inventory;
    if (division) return division;
    if (special) return special;
    if (employee) return employee;
    if (department) return department;
    return establishment;
  };

  // --- AUTOMATIC DOWNSTREAM CASCADE RESETS ---
  useEffect(() => {
    setDepartment(null);
    setDepartments(null);
  }, [establishment]);

  useEffect(() => {
    setEmployee(null);
    setEmployees(null);
    setSpecial(null);
    setSpecials(null);
    setDivision(null);
    setDivisions(null);
    setInventory(null);
    setInventories(null);
    setService(null);
    setServices(null);
  }, [department]);

  useEffect(() => {
    setSector(null);
    setSectors(null);
  }, [inventory]);

  useEffect(() => {
    setProduct(null);
    setProducts(null);
    setPermaProduct(null);
    setPermaProducts(null);
  }, [sector]);

  // --- SYNC THE MAIN OPTIONS MATRIX ---
  useEffect(() => {
    let config = [];

    const addEstablishment = ["Establishment", establishments, setEstablishment, establishment];
    const addDepartment = ["Department", departments, setDepartment, department];

    if (Prop === "ServiceCategoryId") {
      config = [["Service category", serviceCategories, setServiceCategory, serviceCategory]];
    } else if (Prop === "SupplyCategoryId") {
      config = [["Supply category", supplyCategories, setSupplyCategory, supplyCategory]];
    } else if (Prop === "ProductCategoryId") {
      config = [["Product category", productCategories, setProductCategory, productCategory]];
    } else if (Prop === "PermaProductCategoryId") {
      config = [["Rental category", permaProductCategories, setPermaProductCategory, permaProductCategory]];
    } else if (Prop === "TimeZoneId") {
      config = [["Time zone", timeZones, setTimeZone, timeZone]];
    } else if (Prop === "ServicesTax") {
      config = [["Services tax", serviceTaxes, setServiceTax, serviceTax]];
    } else if (Prop === "ProductsTax") {
      config = [["Products tax", productTaxes, setProductTaxes, productTax]];
    } else if (Prop === "PermaProductTax") {
      config = [["Rentals tax", permaProductTaxes, setPermaProductTax, permaProductTax]];
    } else if (Prop === "OpenTemplateId") {
      config = [["Open template", openTemplates, setOpenTemplate, openTemplate]];
    } else if (Prop === "ScheduleTemplateId") {
      config = [["Schedule template", scheduleTemplates, setScheduleTemplate, scheduleTemplate]];
    } else if (Prop === "EstablishmentId") {
      config = [addEstablishment];
    } else if (Prop === "DepartmentId") {
      config = [addEstablishment, addDepartment];
    } else if (Prop === "EmployeeId") {
      config = [addEstablishment, addDepartment, ["Employee", employees, setEmployee, employee]];
    } else if (Prop === "SpecialId") {
      config = [addEstablishment, addDepartment, ["Special", specials, setSpecial, special]];
    } else if (Prop === "DivisionId") {
      config = [addEstablishment, addDepartment, ["Division", divisions, setDivision, division]];
    } else if (Prop === "InventoryId") {
      config = [addEstablishment, addDepartment, ["Inventory", inventories, setInventories, inventory]];
    } else if (Prop === "ServiceId") {
      config = [addEstablishment, addDepartment, ["Service", services, setService, service]];
    } else if (Prop === "SectorId") {
      config = [
        addEstablishment,
        addDepartment,
        ["Inventory", inventories, setInventory, inventory],
        ["Sector", sectors, setSector, sector]
      ];
    } else if (Prop === "ProductId") {
      config = [
        addEstablishment,
        addDepartment,
        ["Inventory", inventories, setInventory, inventory],
        ["Sector", sectors, setSector, sector],
        ["Product", products, setProduct, product]
      ];
    } else if (Prop === "PermaProductId") {
      config = [
        addEstablishment,
        addDepartment,
        ["Inventory", inventories, setInventory, inventory],
        ["Sector", sectors, setSector, sector],
        ["PermaProduct", permaProducts, setPermaProduct, permaProduct]
      ];
    }

    setOptions(config);
  }, [
    Prop, timeZones, serviceCategories, supplyCategories, productCategories, permaProductCategories,
    serviceTaxes, productTaxes, permaProductTaxes, openTemplates, scheduleTemplates,
    establishments, departments, employees, specials, divisions, inventories, services,
    sectors, products, permaProducts, serviceCategory, timeZone, supplyCategory,
    productCategory, permaProductCategory, serviceTax, productTax, permaProductTax,
    openTemplate, scheduleTemplate, establishment, department, employee, special,
    division, inventory, service, sector, product, permaProduct
  ]);

  // Helper to safely execute API calls only if the relationship index exists
  const safeGet = (index, setFn, body = {}) => {
    if (Api?.Relationships?.[index]?.[1]) {
      Get(dispatch, apiRequest, Api.Relationships[index][1], setFn, body);
    }
  };

  // --- API DATA FETCH ROUTER (STRICT DEPENDENCY CHAIN) ---
  useEffect(() => {
    // Guard: ensure Redux Api state is loaded before firing requests
    if (!Api?.Relationships) return;

    // Independent Standalone Lookups
    if (Prop === "ServiceCategoryId") {
      safeGet(16, setServiceCategories);
      return;
    }
    if (Prop === "SupplyCategoryId") {
      safeGet(18, setSupplyCategories);
      return;
    }
    if (Prop === "ProductCategoryId") {
      safeGet(13, setProductCategories);
      return;
    }
    if (Prop === "PermaProductCategoryId") {
      safeGet(10, setPermaProductCategories);
      return;
    }
    if (Prop === "TimeZoneId") {
      safeGet(47, setTimeZones);
      return;
    }
    if (Prop === "ServicesTax") {
      safeGet(20, setServiceTaxes);
      return;
    }
    if (Prop === "ProductsTax") {
      safeGet(21, setProductTaxes);
      return;
    }
    if (Prop === "PermaProductTax") {
      safeGet(22, setPermaProductTaxes);
      return;
    }
    if (Prop === "OpenTemplateId") {
      safeGet(31, setOpenTemplates);
      return;
    }
    if (Prop === "ScheduleTemplateId") {
      safeGet(33, setScheduleTemplates);
      return;
    }

    // Step 1: Establishments always load first
    safeGet(1, setEstablishments);

    // Step 2: Departments require an Establishment
    if (Prop !== "EstablishmentId") {
      if (!establishment?.Id) return;
      safeGet(2, setDepartments, { EstablishmentId: establishment.Id });
    }

    // Step 3: Mid-tier options require a Department
    const matchesMiddle = ["EmployeeId", "SpecialId", "DivisionId", "InventoryId", "ServiceId"].includes(Prop);
    if (matchesMiddle) {
      if (!department?.Id) return;
      const body = { DepartmentId: department.Id };

      if (Prop === "EmployeeId") safeGet(29, setEmployees, body);
      if (Prop === "SpecialId") safeGet(45, setSpecials, body);
      if (Prop === "DivisionId") safeGet(3, setDivisions, body);
      if (Prop === "InventoryId") safeGet(6, setInventories, body);
      if (Prop === "ServiceId") safeGet(15, setServices, body);
    }

    // Step 4: Deep-nested items require Inventory and Sector
    if (["SectorId", "ProductId", "PermaProductId"].includes(Prop)) {
      if (!department?.Id) return;

      safeGet(6, setInventories, { DepartmentId: department.Id });

      if (!inventory?.Id) return;
      safeGet(7, setSectors, { InventoryId: inventory.Id });

      if (!sector?.Id) return;

      if (Prop === "ProductId") {
        safeGet(12, setProducts, { SectorId: sector.Id });
      }

      if (Prop === "PermaProductId") {
        safeGet(9, setPermaProducts, { SectorId: sector.Id });
      }
    }
  }, [
    Prop,
    Api?.Relationships,
    establishment,
    department,
    inventory,
    sector
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const handleSaveAndClose = () => {
    const finalSelection = getCurrentSelection();
    if (finalSelection) {
      setValue(finalSelection.Id);
      setSelectedLabel(finalSelection.Name);
    }
    setIsOpen(false);
  };

  const handleResetSelections = () => {
    setServiceTax(null);
    setProductTax(null);
    setPermaProductTax(null);
    setServiceCategory(null);
    setSupplyCategory(null);
    setProductCategory(null);
    setPermaProductCategory(null);
    setTimeZone(null);
    setOpenTemplate(null);
    setScheduleTemplate(null);
    setEstablishment(null);
    setDepartment(null);
    setEmployee(null);
    setSpecial(null);
    setDivision(null);
    setInventory(null);
    setService(null);
    setSector(null);
    setProduct(null);
    setPermaProduct(null);
    if (Clear) Clear();
  };

  // Helper function to handle sorting without React Hooks in JSX
  const formatDataOptions = (dataArr) => {
    if (!dataArr) return [];
    if (!IsSorting) return dataArr;
    return [...dataArr].sort((a, b) => (a.Name || '').localeCompare(b.Name || ''));
  };

  return (
    <>
      {isModalOpen ? (
        <div className="scope-select-overlay">
          <div className="scope-select-popup" ref={dropdownRef}>
            <div className="popup-header">
              <h3>Select Scope Location</h3>
              <div className="header-actions">
                {ShowSorting != null ? (
                  <button className="action-btn" onClick={handleSortClick} title="Toggle Alphabetical Sort">
                    <RiSortAlphabetAsc className={IsSorting ? "active" : ""} />
                  </button>
                ) : null}
                {ShowClear != null ? (
                  <button className="action-btn reset-btn" onClick={handleResetSelections} title="Clear All Selections">
                    <MdOutlineClear />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="popup-body">
              {options &&
                options.map(([label, data, setFunction, currentSelectedValue], index) => {
                  const isPreviousSelected = options
                    .slice(0, index)
                    .every(([, , , selectedVal]) => selectedVal !== null);

                  const sortedData = formatDataOptions(data);

                  return (
                    <div key={label} className="cascade-select-group">
                      <span className="select-label">{label}</span>

                      <div className="custom-select-wrapper">
                        <select
                          disabled={!isPreviousSelected}
                          value={currentSelectedValue ? currentSelectedValue.Id : ""}
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const matchedItem = sortedData.find((item) => String(item.Id) === String(selectedId)) || null;
                            setFunction(matchedItem);
                          }}
                        >
                          <option value="">
                            {isPreviousSelected ? `-- Choose ${label} --` : `-- Select parent level first --`}
                          </option>
                          {sortedData.map((opt) => (
                            <option key={opt.Id} value={opt.Id}>
                              {opt.Name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="popup-footer">
              <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveAndClose}
                disabled={!getCurrentSelection()}
              >
                Apply Scope Selection
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Get(dispatch, apiRequest, url, set, body) {
  dispatch(
    apiRequest({
      name: "DynamicSelect | useEffect",
      url: url,
      method: "POST",
      body: body,
      storeIn: null,
      auth: true,
      tokenRequired: true,
    })
  )
    .unwrap()
    .then((Res) => {
      set(Res?.data);
    });
}