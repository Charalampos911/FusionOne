import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import OnlineDateAndTimeWidget from "../Widgets/OnlineDateAndTimeWidget";
import { MdArrowCircleLeft } from "react-icons/md";
import { ImageLightbox } from "../Widgets/ImageLightbox"; // Import isolated popup component

export const FSServiceCarousel = ({ department, services = [], GoBack, Browse }) => {
  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  // Store current active image index per card: { [Id]: imageIndex }
  const [activeImageIndexes, setActiveImageIndexes] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [service, setService] = useState(null);

  // Lightbox modal state: null or { item: serviceObject, index: number }
  const [lightboxState, setLightboxState] = useState(null);

  // Card image navigation handlers
  const handleNextImage = (e, itemId, totalImages) => {
    e.stopPropagation(); // Prevents card selection / navigation
    setActiveImageIndexes((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (e, itemId, totalImages) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  // Open Lightbox handler
  const openLightbox = (e, item, index) => {
    e.stopPropagation(); // Prevents triggering card select events
    setLightboxState({ item, index });
  };

  // Sync index back to card when changed inside lightbox
  const handleLightboxIndexChange = (itemId, newIndex) => {
    setActiveImageIndexes((prev) => ({ ...prev, [itemId]: newIndex }));
  };



  return (
    <>
      {activeTab === 0 ? (
        <div className="fs-gallery-container fullscreen">
          {/* <h2 className="fs-gallery-title">FusionOne Services</h2> */}
          <div className="fs-grid">
            {services?.map((item) => {
              const isSelected = true;
              const currentImgIndex = activeImageIndexes[item.Id] || 0;
              const currentImage = item.Images?.[currentImgIndex];

              return (
                <div
                  key={item.Id}
                  className={`fs-card ${isSelected ? "selected" : ""}`}
                >
                  {/* Image Gallery Header */}
                  <div className="fs-image-wrapper">
                    {currentImage ? (
                      <img
                        src={`${Api.Imagehost}${currentImage.Url.toLowerCase()}`}
                        alt={currentImage.Name || item.Name}
                        className="fs-image zoomable"
                        onClick={(e) => openLightbox(e, item, currentImgIndex)}
                      />
                    ) : (
                      <div className="fs-image-placeholder">
                        No Image Available
                      </div>
                    )}
                   <div className="online-back" onClick={() => GoBack()}>
                      <MdArrowCircleLeft />
                    </div>
                    {/* Selection Badge */}
                    {isSelected && (
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
                    )}

                    {/* Gallery Navigation Overlay */}
                    {item.Images?.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="nav-btn prev"
                          onClick={(e) =>
                            handlePrevImage(e, item.Id, item.Images.length)
                          }
                        >
                          &#10094;
                        </button>
                        <button
                          type="button"
                          className="nav-btn next"
                          onClick={(e) =>
                            handleNextImage(e, item.Id, item.Images.length)
                          }
                        >
                          &#10095;
                        </button>

                        {/* Dots indicator */}
                        <div className="image-dots">
                          {item.Images.map((_, idx) => (
                            <span
                              key={idx}
                              className={`dot ${
                                idx === currentImgIndex ? "active" : ""
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Service Info Body */}
                  <div className="fs-card-body">
                    <div className="fs-header">
                      <h3 className="fs-name">{item.Name}</h3>
                      <p className="fs-description">{item.Description}</p>
                    </div>

                    {/* Image Details Caption */}
                    {currentImage?.Description && (
                      <p className="image-caption">
                        📸 <i>{currentImage.Description}</i>
                      </p>
                    )}

                    {/* Next Step / Process Button */}
                    <div
                      className="online-proccess-button"
                      onClick={() => (setService(item), setActiveTab(1))}
                    >
                      Next
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- Fullscreen Lightbox Carousel Modal --- */}
          {lightboxState && (
            <ImageLightbox
              item={lightboxState.item}
              initialIndex={lightboxState.index}
              imageHost={Api.Imagehost}
              onClose={() => setLightboxState(null)}
              onIndexChange={(newIndex) =>
                handleLightboxIndexChange(lightboxState.item.Id, newIndex)
              }
            />
          )}
        </div>
      ) : (
        /* --- Date & Time Booking Widget --- */
        <OnlineDateAndTimeWidget
          service={service}
          customer={Api?.Token?.Customer?.Id}
          department={department}
          GoBack={() => setActiveTab(0)}
          Browse={()=>Browse()}
        />
      )}
    </>
  );
};