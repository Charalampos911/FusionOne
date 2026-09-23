import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, ResetMsg } from '../../../Redux/features/ApiReducer';
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuCircleMinus } from "react-icons/lu";
import ReturnProductItem from "./ReturnProductItem";
export default function OrderProducts({ SelectedOrder, ActiveTab, onReturnChange, selectedProducts }) {
  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  const [orderProducts, setOrderProducts] = useState([]);
  const [returnQuantities, setReturnQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch products associated with the order
  useEffect(() => {
    dispatch(ResetMsg());
    setLoading(true);

    dispatch(
      apiRequest({
        name: "OrderProducts.jsx | Fetch",
        url: "api/OrderProducts/Query",
        method: "POST",
        body: { OrderId: SelectedOrder.Id },
        auth: true,
        tokenRequired: true,
        storeIn: null
      })
    )
      .unwrap()
      .then((Response) => {
        setOrderProducts(Response.data);
        
        // Build initial object tree matching current active parent values if they exist
        const initialReturns = {};
        Response.data.forEach(item => {
          // Check if parent state already tracks a pre-existing quantity for this product match
          const existingItem = selectedProducts?.find(p => p.OrderProductId.toString() === item.Id.toString());
          initialReturns[item.Id] = existingItem ? existingItem.QuantityToReturn : 0;
        });
        setReturnQuantities(initialReturns);
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));

  }, [ActiveTab, SelectedOrder, dispatch]);

  // Handle value updates bubbles arriving up from individual child rows
  const handleRowQtyChange = (itemId, newQty) => {
    const nextState = {
      ...returnQuantities,
      [itemId]: newQty
    };
    
    setReturnQuantities(nextState);

    // Filter, package, and safely pass unified collection up to parent state manager
    const selectedReturns = Object.keys(nextState)
      .filter(id => nextState[id] > 0)
      .map(id => {
        const originalItem = orderProducts.find(item => item.Id.toString() === id.toString());
        return {
          OrderProductId: id,
          QuantityToReturn: nextState[id],
          Product: originalItem?.Product || null
        };
      });

    if (typeof onReturnChange === 'function') {
      onReturnChange(selectedReturns);
    }
  };

  if (loading) return <div>Loading order items...</div>;

  return (
    <div id="OrderProducts">
      {orderProducts && orderProducts.map((item) => (
        <ReturnProductItem 
          key={item.Id}
          item={item}
          initialQty={returnQuantities[item.Id] || 0}
          onQtyChange={handleRowQtyChange}
        />
      ))}
    </div>
  );
}