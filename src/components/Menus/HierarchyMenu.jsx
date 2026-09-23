import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setDevice } from '../../Redux/features/ThemeReducer';

import { isMobile } from 'react-device-detect';
import { RxHamburgerMenu } from "react-icons/rx";

// Assets imports
import OrgIcon from "../../assets/Organization.png";
import CustIcon from "../../assets/Customers.png";
import EstIcon from "../../assets/Establishment.png";
import DeptIcon from "../../assets/Department.png";
import DivIcon from "../../assets/Divisions.png";
import InvIcon from "../../assets/Inventory.png";
import ProdIcon from "../../assets/Products.png";
import SectIcon from "../../assets/Sectors.png";
import ServIcon from "../../assets/Services.png";
import SuppIcon from "../../assets/Supplies.png";
import OrderIcon from "../../assets/Orders.png";
import rentalIcon from "../../assets/rental.png";
import userIcon from "../../assets/user.png";

import OrgIconWhite from "../../assets/Organization-white.png";
import CustIconWhite from "../../assets/Customers-white.png";
import EstIconWhite from "../../assets/Establishment-white.png";
import DeptIconWhite from "../../assets/Department-white.png";
import DivIconWhite from "../../assets/Divisions-white.png";
import InvIconWhite from "../../assets/Inventory-white.png";
import ProdIconWhite from "../../assets/Products-white.png";
import SectIconWhite from "../../assets/Sectors-white.png";
import ServIconWhite from "../../assets/Services-white.png";
import SuppIconWhite from "../../assets/Supplies-white.png";
import OrderIconWhite from "../../assets/Orders-white.png";
import rentalIconWhite from "../../assets/rental-white.png";
import userIconWhite from "../../assets/user-white.png";

export default function HierarchyMenu(props) {
  const Api = useSelector((state) => state.Api);
  const Theme = useSelector((state) => state.Themes.current);
  const Device = useSelector((state) => state.Themes.device);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDevice(isMobile));
  }, [dispatch]);

  const [selection, setSelection] = useState(0);
  const [show, setShow] = useState(false);

  // Extract user roles safely
  const userRoles = Api?.Token?.Roles || [];
  const isLightMode = Theme === "white-blue" || Theme === "white-green";
  const isCreate = Api?.Organization == null;

  const menuItems = [
    { label: "Organization", icon: OrgIcon, iconW: OrgIconWhite, access: ["Admin"] },
    { label: "Customers", icon: CustIcon, iconW: CustIconWhite, access: ["Admin", "GeneralManager", "DepartmentManager", "InventoryClerk"] },
    { label: "Establishments", icon: EstIcon, iconW: EstIconWhite, access: ["Admin"] },
    { label: "Departments", icon: DeptIcon, iconW: DeptIconWhite, access: ["Admin", "GeneralManager"] },
    { label: "Divisions", icon: DivIcon, iconW: DivIconWhite, access: ["Admin", "GeneralManager"] },
    { label: "Orders", icon: OrderIcon, iconW: OrderIconWhite, access: ["Admin", "GeneralManager", "DepartmentManager"] },
    { label: "Inventories", icon: InvIcon, iconW: InvIconWhite, access: ["Admin", "GeneralManager"] },
    { label: "Sectors", icon: SectIcon, iconW: SectIconWhite, access: ["Admin", "GeneralManager"] },
    { label: "Services", icon: ServIcon, iconW: ServIconWhite, access: ["Admin", "GeneralManager"] },
    { label: "Products", icon: ProdIcon, iconW: ProdIconWhite, access: ["Admin", "GeneralManager", "InventoryClerk"] },
    { label: "Supplies", icon: SuppIcon, iconW: SuppIconWhite, access: ["Admin", "GeneralManager", "InventoryClerk"] },
    { label: "Rentals", icon: rentalIcon, iconW: rentalIconWhite, access: ["Admin", "GeneralManager", "InventoryClerk"] },
    { label: "User", icon: userIcon, iconW: userIconWhite, access: ["Admin"] }
  ];

  const handleSelect = (index) => {
    setSelection(index);
    if (props.setHierarchyTab) {
      props.setHierarchyTab(index);
    }
    if (Device) {
      setShow(false);
    }
  };

  const renderMenuItems = () => {
    return menuItems.map((item, index) => {
      // If organization is not created yet, only allow the Organization tab (index 0)
      if (isCreate && index !== 0) return null;

      // Check if user has permission for this item
      const hasAccess = item.access.some((role) => userRoles.includes(role));
      if (!hasAccess) return null;

      const iconSrc = isLightMode ? item.iconW : item.icon;

      return (
        <div
          key={index}
          className={selection === index ? "selected" : ""}
          onClick={() => handleSelect(index)}
        >
          <img src={iconSrc} alt={item.label} />
          {item.label}
        </div>
      );
    });
  };

  const selectedItem = menuItems[selection] || menuItems[0];
  const headerIcon = isLightMode ? selectedItem.iconW : selectedItem.icon;
  console.log("Device==",Device)
  return (
    <>
      {Device ? (
        <>
          <div className="Left-burger" onClick={() => setShow(!show)}>
            <RxHamburgerMenu />
            <img src={headerIcon} alt="menu active icon" />
          </div>

          <div id="HierarchyMenu" className="Mobile">
            <div className={`Options ${show ? 'show' : 'hide'}`}>
              {renderMenuItems()}
            </div>
          </div>
        </>
      ) : (
        <div id="HierarchyMenu" className="Desktop">
          <div className="custom-scroll">
            {renderMenuItems()}
          </div>
        </div>
      )}
    </>
  );
}