import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ImageLightbox } from "../Widgets/ImageLightbox"; // Import isolated popup component

export const PPServiceCarousel = ({ services = [], onClosePopUp }) => {
  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  // Active image index per card: { [itemId]: index }
  const [activeImageIndexes, setActiveImageIndexes] = useState({});

  // Lightbox modal state: null or { item: serviceObject, index: number }
  const [lightboxState, setLightboxState] = useState(null);

  // Card image navigation
  const handleNextImage = (e, itemId, totalImages) => {
    e.stopPropagation();
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

  // Open Lightbox
  const openLightbox = (e, item, index) => {
    e.stopPropagation();
    setLightboxState({ item, index });
  };

  // Sync index back to card when changed inside lightbox
  const handleLightboxIndexChange = (newItemId, newIndex) => {
    setActiveImageIndexes((prev) => ({ ...prev, [newItemId]: newIndex }));
  };
console.log("PopUp.services======",services)
  return (
    <>
      {/* Popup Backdrop */}
      <div className="blur" onClick={() => onClosePopUp()}>
        <button
          type="button"
          className="lightbox-close-btn"
          onClick={() => onClosePopUp()}
        >
          <span>&times;</span>
        </button>
      </div>

      {/* Main Services Cards Gallery */}
      <div className="org-gallery-container fullscreen popup">
        <div className="org-grid">
          {services?.map((item) => {
            const isSelected = false;
            const currentImgIndex = activeImageIndexes[item.Id] || 0;
            const currentImage = item.Images?.[currentImgIndex];
            const fullImageUrl = currentImage
              ? `${Api.Imagehost}${currentImage.Url.toLowerCase()}`
              : null;

            return (
              <div
                key={item.OnlineCode}
                className={`org-card ${isSelected ? "selected" : ""}`}
              >
                {/* Image Gallery Header */}
                <div className="org-image-wrapper">
                  {currentImage ? (
                    <img
                      src={fullImageUrl}
                      alt={currentImage.Name || item.Name}
                      className="org-image zoomable"
                      onClick={(e) => openLightbox(e, item, currentImgIndex)}
                    />
                  ) : (
                    <div className="org-image-placeholder">
                      No Image Available
                    </div>
                  )}

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
                        className="nav-btn prev"
                        onClick={(e) =>
                          handlePrevImage(e, item.Id, item.Images.length)
                        }
                      >
                        &#10094;
                      </button>
                      <button
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

                {/* Organization Info Body */}
                <div className="org-card-body" onClick={() => onClosePopUp()}>
                  <div className="org-header">
                    <h3 className="org-name">{item.Name}</h3>
                    <p className="org-description">{item.Description}</p>
                  </div>

                  {/* Image Details Caption */}
                  {currentImage?.Description && (
                    <p className="image-caption">
                      📸 <i>{currentImage.Description}</i>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Isolated Fullscreen Lightbox Modal --- */}
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
    </>
  );
};