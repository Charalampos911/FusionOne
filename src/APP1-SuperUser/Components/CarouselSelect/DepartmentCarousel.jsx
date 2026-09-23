import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ImageLightbox } from "../Widgets/ImageLightbox"; // Adjust path to ImageLightbox as needed

export const DepartmentCarousel = ({
  departments = [],
  selectedDepartmentId,
  onSelect,
}) => {
  const Api = useSelector((state) => state.Api);

  // Store active image index per department card: { [deptKey]: index }
  const [activeImageIndexes, setActiveImageIndexes] = useState({});

  // Lightbox modal state: null or { item: departmentObject, index: number }
  const [lightboxState, setLightboxState] = useState(null);

  // Card navigation handlers
  const handleNextImage = (e, deptKey, totalImages) => {
    e.stopPropagation(); // Prevents triggering department selection
    setActiveImageIndexes((prev) => ({
      ...prev,
      [deptKey]: ((prev[deptKey] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (e, deptKey, totalImages) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [deptKey]: ((prev[deptKey] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  // Open Lightbox handler
  const openLightbox = (e, item, index) => {
    e.stopPropagation(); // Prevents department selection when clicking image
    setLightboxState({ item, index });
  };

  // Sync index back to card when changed inside lightbox
  const handleLightboxIndexChange = (deptKey, newIndex) => {
    setActiveImageIndexes((prev) => ({ ...prev, [deptKey]: newIndex }));
  };

  return (
    <div className="org-gallery-container">
      <h2 className="org-gallery-title">DEPARTMENTS</h2>

      <div className="org-grid">
        {departments?.map((item) => {
          const itemKey = item.Id || item.OnlineCode;
          const isSelected = selectedDepartmentId === itemKey;
          const currentImgIndex = activeImageIndexes[itemKey] || 0;
          const currentImage = item.Images?.[currentImgIndex];

          return (
            <div
              key={itemKey}
              className={`org-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(item)}
            >
              {/* Image Gallery Header */}
              <div className="org-image-wrapper">
                {currentImage ? (
                  <img
                    src={`${Api.Imagehost}${currentImage.Url.toLowerCase()}`}
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
                      type="button"
                      className="nav-btn prev"
                      onClick={(e) =>
                        handlePrevImage(e, itemKey, item.Images.length)
                      }
                    >
                      &#10094;
                    </button>
                    <button
                      type="button"
                      className="nav-btn next"
                      onClick={(e) =>
                        handleNextImage(e, itemKey, item.Images.length)
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

              {/* Department Body */}
              <div className="org-card-body">
                <div className="org-header">
                  <h3 className="org-name">{item.Name}</h3>
                  {item.Description && (
                    <p className="org-description">{item.Description}</p>
                  )}
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

      {/* --- Fullscreen Lightbox Carousel Modal --- */}
      {lightboxState && (
        <ImageLightbox
          item={lightboxState.item}
          initialIndex={lightboxState.index}
          imageHost={Api.Imagehost}
          onClose={() => setLightboxState(null)}
          onIndexChange={(newIndex) =>
            handleLightboxIndexChange(
              lightboxState.item.Id || lightboxState.item.OnlineCode,
              newIndex
            )
          }
        />
      )}
    </div>
  );
};