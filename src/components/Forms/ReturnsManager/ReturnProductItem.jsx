import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, ResetMsg } from '../../../Redux/features/ApiReducer';
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuCircleMinus } from "react-icons/lu";

// --- SUB-COMPONENT: INDIVIDUAL ROW COMPONENT ---
export default function ReturnProductItem({ item, initialQty, onQtyChange }) {
  // Each row manages its own internal quantity value
  const [currentReturnQty, setCurrentReturnQty] = useState(initialQty);

  // Keep state synchronized if parent collection fundamentally resets
  useEffect(() => {
    setCurrentReturnQty(initialQty);
  }, [initialQty]);

  const handleIncrement = () => {
    if (currentReturnQty < item.Quantity) {
      const nextQty = currentReturnQty + 1;
      setCurrentReturnQty(nextQty);
      onQtyChange(item.Id, nextQty);
    }
  };

  const handleDecrement = () => {
    if (currentReturnQty > 0) {
      const nextQty = currentReturnQty - 1;
      setCurrentReturnQty(nextQty);
      onQtyChange(item.Id, nextQty);
    }
  };

  const handleInputChange = (val) => {
    const parsed = parseInt(val, 10);
    const validatedValue = isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), item.Quantity);
    
    setCurrentReturnQty(validatedValue);
    onQtyChange(item.Id, validatedValue);
  };

  return (
    <div className='Item OrderProduct'>
      <div>
        <div><span>Name:</span> <strong>{item.Product.Name}</strong></div>
        <div><span>Category:</span> {item.Product.ProductCategory.Name}</div>
        <div><span>Purchased Qty:</span> {item.Quantity}</div>
      </div>
      
      <div className='Actions'>
        <span>Unit Price:</span> <span>{item.Product.Price} €</span>
        
        {/* Return Quantity Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            className={currentReturnQty <= 0 ? "disabled" : ""}
            onClick={handleDecrement}
            style={{ cursor: 'pointer' }}
          >
            <LuCircleMinus />
          </div>
          
          <input 
            type="number"
            value={currentReturnQty} 
            onChange={(e) => handleInputChange(e.target.value)}
            style={{ width: '50px', textAlign: 'center' }}
          />
          
          <div 
            className={currentReturnQty >= item.Quantity ? "disabled" : ""}
            onClick={handleIncrement}
            style={{ cursor: 'pointer' }}
          >
            <IoMdAddCircleOutline />
          </div>
        </div>
        
        <span>Refund Total:</span> 
        <strong>{(item.Product.Price * currentReturnQty).toFixed(2)} €</strong>
      </div>
    </div>
  );
}
