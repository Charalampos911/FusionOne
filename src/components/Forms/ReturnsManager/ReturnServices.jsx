import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { apiRequest, ResetMsg } from '../../../Redux/features/ApiReducer';

export default function OrderServices({ SelectedOrder, ActiveTab, onReturnChange }) {
  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  const [orderServices, setOrderServices] = useState(SelectedOrder.OrderServices);
  // Tracks selected service IDs for refund: { [orderServiceId]: boolean }
  const [selectedRefunds, setSelectedRefunds] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch the current order services
  useEffect(() => {
    // dispatch(ResetMsg());
    // setLoading(true);

    // dispatch(
    //   apiRequest({
    //     name: "OrderServices.jsx | Fetch",
    //     url: "api/OrderServices/Query",
    //     method: "POST",
    //     body: { OrderId: SelectedOrder.Id },
    //     auth: true,
    //     tokenRequired: true,
    //     storeIn: null
    //   })
    // )
    //   .unwrap()
    //   .then((Response) => {
    //     setOrderServices(Response.data);
        
    //     // Initialize all service refund statuses to false
    //     const initialSelection = {};
    //     Response.data.forEach(item => {
    //       initialSelection[item.Id] = false;
    //     });
    //     setSelectedRefunds(initialSelection);
    //   })
    //   .catch((err) => console.error("Failed to load services:", err))
    //   .finally(() => setLoading(false));

  }, [ActiveTab, SelectedOrder, dispatch]);

  // Packages selection updates and pushes them up to the parent
  const updateParent = (updatedSelection) => {
    const selectedServices = Object.keys(updatedSelection)
      .filter(itemId => updatedSelection[itemId] === true)
      .map(itemId => {
        const originalItem = orderServices.find(item => item.Id.toString() === itemId.toString());
        return {
          OrderServiceId: itemId,
          RefundService: true,
          Service: originalItem?.Service || null // Useful meta-data for the parent's totals/summaries
        };
      });

    if (typeof onReturnChange === 'function') {
      onReturnChange(selectedServices);
    }
  };

  // Toggle selection on item click or checkbox change
  const handleToggleSelect = (itemId) => {
    const nextState = {
      ...selectedRefunds,
      [itemId]: !selectedRefunds[itemId]
    };
    setSelectedRefunds(nextState);
    updateParent(nextState);
  };

  if (loading) return <div>Loading order services...</div>;

  return (
    <div id="OrderServices">
      <div className="OrderList">
        {orderServices && orderServices.map((item) => {
          const isSelected = !!selectedRefunds[item.Id];

          return (
            <div
              key={item.Id}
              className={`Item OrderService ${isSelected ? "Selected" : ""}`}
              onClick={() => handleToggleSelect(item.Id)}
              style={{

              }}
            >
              <div>
                <div>
                  <span>Name:</span> <strong>{item.Service.Name}</strong>
                </div>
                <div>
                  <span>Description:</span> <span>{item.Service.Description}</span>
                </div>
                <div>
                  <span>Scheduled:</span>{' '}
                  <span>
                    {item.StartDate?.split('T')[0]} @ {item.StartDate?.split('T')[1]?.slice(0, 5)}
                  </span>
                </div>
              </div>

              <div className="Actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div>
                  <span>Duration:</span> <span>{item.Service.DurationMinutes}'</span>
                </div>
                <div>
                  <span>Price:</span> <strong>{item.Service.Price} €</strong>
                </div>
                
                {/* Visual Checkbox Indicator */}
                {/* <div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Controlled via container div's onClick
                    style={{ transform: 'scale(1.3)', cursor: 'pointer' }}
                  />
                </div>/ */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}