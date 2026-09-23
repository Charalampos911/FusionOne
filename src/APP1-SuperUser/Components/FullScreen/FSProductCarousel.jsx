import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiRequest } from "../../../Redux/features/ApiReducer";
import Messaging from '../../../components/NewUI/Messaging';
import { MdOutlinePendingActions } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdShoppingCart } from "react-icons/md";


export const FSProductCarousel = ({ Products = [], onSelect, Dept }) => {
  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  const product = Products[0]; // Component now expects a single product context
  const productId = product?.Id;

  const [currentProductStatus, setCurrentProductStatus] = useState({Quantity:0});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [orderMinQty, setOrderMinQty] = useState(0);
  const [Message, setMessage] = useState("");



  const debounceTimer = useRef(null);
  const pendingQuantity = useRef(0);
  useEffect(() => {
    if(Api.NewApiToUserMessage.msg!="Success")
    setMessage(Api.NewApiToUserMessage);
  }, [Api.NewApiToUserMessage]);
  // Fetch initial product data on mount / product change
  useEffect(() => {
    if (!productId) return;

    dispatch(
      apiRequest({
        name: "FSProductCarousel | quantityUpdate",
        url: "api/OrderProductsSU/DetailedSingleProductSU",
        method: "POST",
        body: {
          DepartmentId: Dept?.Id,
          ProductId: productId,
          CustomerId: Api?.Token?.Customer?.Id,
        },
        auth: true,
        tokenRequired: true,
        storeIn: null,
      })
    )
      .unwrap()
      .then((response) => {
        console.clear();
        console.log("Product detail response ===", response.data);
        setCurrentProductStatus(response.data);
        
        setQuantity(response.data?.CartQuantity);
        setOrderMinQty(response.data?.ServedQuantity)
      })
      .catch((error) => console.error("Initial load failed:", error));
  }, [productId, Dept?.Id, Api?.Token?.Customer?.Id, dispatch]);

  const handleNextImage = (e, totalImages) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrevImage = (e, totalImages) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const triggerApiUpdate = (newQuantity) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    pendingQuantity.current = newQuantity;
  console.log("newQty2===",newQuantity)
    debounceTimer.current = setTimeout(() => {
      dispatch(
        apiRequest({
          name: "FSProductCarousel | quantityUpdate",
          url: "api/OrderProductsSU/FixedQuantitySU",
          method: "POST",
          body: {
            DepartmentId: Dept?.Id,
            ProductId: productId,
            FixedAmount: pendingQuantity.current,
            CustomerId: Api?.Token?.Customer?.Id,
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
          setCurrentProductStatus(response.data);

          setQuantity(response.data.CartQuantity);
          setOrderMinQty(response.data.ServedQuantity)


        })
        .catch((error) => console.error("API update failed:", error));
    }, 4000);
  };

  const handleQuantityChange = (e, delta) => {
    e.stopPropagation();
    const newQty = Math.max(0, quantity + delta);
    // if(newQty < orderMinQty){       
    //    setMessage({
    //       Name:"handleQuantityChange",
    //       Origin:"FSProductCarousel ",
    //       Mood:false,
    //       msg:`Min amount is the served. Min ${orderMinQty}`
    //     }) 
    //     }else{
    setQuantity(newQty);
    console.clear()
    console.log("newQty===",newQty)
      console.log("currentProductStatus?.OrderedQuantity===",currentProductStatus?.OrderedQuantity)
       console.log("!currentProductStatus?.OrderedQuantity===",!currentProductStatus?.OrderedQuantity)
    if(newQty==0)return;
    if(!currentProductStatus?.OrderedQuantity){
        newQty+currentProductStatus.OrderedQuantity
    }

    triggerApiUpdate(newQty);
        // }
  };

  if (!product) return null;

  const images = product.Images || [];
  const currentImage = images[activeImageIndex];

  return (
    <div className="org-gallery-container fullscreen">
      <div className="org-grid">
        <div
          className="org-card selected"
          onClick={() => onSelect && onSelect(product)}
        >
          {/* Image Gallery Header */}
          <div className="org-image-wrapper">
            {currentImage ? (
              <img
                src={`${Api?.Imagehost || ""}${currentImage.Url.toLowerCase()}`}
                alt={currentImage.Name || product.Name}
                className="org-image"
              />
            ) : (
              <div className="org-image-placeholder">No Image Available</div>
            )}

            {/* Selection Badge */}
            <div className="selected-badge">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Selected
            </div>

            {/* Gallery Navigation Overlay */}
            {images.length > 1 && (
              <>
                <button
                  className="nav-btn prev"
                  onClick={(e) => handlePrevImage(e, images.length)}
                >
                  &#10094;
                </button>
                <button
                  className="nav-btn next"
                  onClick={(e) => handleNextImage(e, images.length)}
                >
                  &#10095;
                </button>

                {/* Dots indicator */}
                <div className="image-dots">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${idx === activeImageIndex ? "active" : ""}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Body Details */}
          <div className="org-card-body">
            <div className="org-header">
              <h3 className="org-name">{product.Name}</h3>
              <p className="org-description">{product.Description}</p>
            </div>

            {currentImage?.Description && (
              <p className="image-caption">
                📸 <i>{currentImage.Description}</i>
              </p>
            )}
            <>
            {currentProductStatus?
           
            <div className="quantity-controls-wrapper">
              { currentProductStatus?.Quantity === 0 ? (
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => handleQuantityChange(e, 1)}
                >
                  Add to cart
                </button>
              ) : (
                <div className="quantity-stepper">
                   <div><IoMdCheckboxOutline />{String(currentProductStatus.ServedQuantity).padStart(2, '0')} - <MdOutlinePendingActions /> {String(currentProductStatus.OrderedQuantity).padStart(2, '0')} - <MdShoppingCart  /> {String(currentProductStatus.CartQuantity).padStart(2, '0')}</div>
                  &nbsp;&nbsp;&nbsp;
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
                
              )}
            </div>
            :""}
            </>
          </div>
          
        </div>
      </div>
      <Messaging ParentMessage={Message} IsLocal={true}/>
    </div>
  );
};