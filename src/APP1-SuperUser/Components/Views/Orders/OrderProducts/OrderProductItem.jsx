import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiRequest } from '../../../../../Redux/features/ApiReducer';
import { BiSolidTrashAlt } from 'react-icons/bi';
import { MdOutlinePendingActions, MdShoppingCart } from 'react-icons/md';
import { IoMdCheckboxOutline } from 'react-icons/io';

export default function OrderProductItem({ OProd, currency, departmentId, HRemoveProduct,reload }) {
  const dispatch = useDispatch();
  const customerId = useSelector((state) => state.Api?.Token?.Customer?.Id);

  // Local state per product item
  const [quantity, setQuantity] = useState(OProd.CartQuantity || 0);

  const debounceTimer = useRef(null);
  const pendingQuantity = useRef(quantity);

  const triggerApiUpdate = (newQuantity) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    pendingQuantity.current = newQuantity;

    debounceTimer.current = setTimeout(() => {
      dispatch(
        apiRequest({
          name: "FSProductCarousel | quantityUpdate",
          url: "api/OrderProductsSU/FixedQuantitySU",
          method: "POST",
          body: {
            DepartmentId: departmentId,
            ProductId: OProd.ProductId,
            FixedAmount: pendingQuantity.current,
            CustomerId: customerId,
          },
          auth: true,
          tokenRequired: true,
          storeIn: null,
        })
      )
        .unwrap()
        .then((response) => {
          console.clear();
          console.log("Products update response ===", response.data);
          setQuantity(response.data.CartQuantity);
          reload()
        })
        .catch((error) => console.error("API update failed:", error));
    }, 4000);
  };

  const handleQuantityChange = (e, delta) => {
    e.stopPropagation();
    const newQty = Math.max(0, quantity + delta);
    setQuantity(newQty);
    
    if (newQty === 0) return;
    
    // Total updated amount sending to API
    triggerApiUpdate(newQty + OProd.OrderedQuantity);
  };

  return (
    <div className='Order-product'>
      <div>{OProd.ProductName}</div>
      <div>
        <IoMdCheckboxOutline />{OProd.ServedQuantity} &nbsp; - &nbsp;
        <MdOutlinePendingActions /> {OProd.OrderedQuantity} &nbsp; - &nbsp;
        <MdShoppingCart /> {OProd.CartQuantity} &nbsp; - &nbsp;
        {OProd.Price} {currency}
      </div>
      <BiSolidTrashAlt onClick={() => HRemoveProduct(OProd.Id)} />
      <div className='quantity-stepper'>
        <button
          className="qty-btn decrease"
          onClick={(e) => handleQuantityChange(e, -1)}
        >
          -
        </button>
        <span className="qty-count">{quantity}</span>
        <button
          className="qty-btn increase"
          onClick={(e) => handleQuantityChange(e, 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}