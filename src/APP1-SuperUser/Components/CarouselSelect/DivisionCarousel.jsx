import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilterBar } from "../Widgets/FilterBar";
import { ImageLightbox } from "../Widgets/ImageLightbox"; // Import isolated popup component

export const DivisionCarousel = ({
  divisions = [],
  onSelect,
  search,
  categories,
  category,
}) => {
  const Api = useSelector((state) => state.Api);
  const dispatch = useDispatch();

  // Store current active image index per division card: { [Id]: imageIndex }
  const [activeImageIndexes, setActiveImageIndexes] = useState({});

  // Lightbox modal state: null or { item: divisionObject, index: number }
  const [lightboxState, setLightboxState] = useState(null);

  // Card navigation handlers
  const handleNextImage = (e, orgCode, totalImages) => {
    e.stopPropagation(); // Prevents triggering division selection
    setActiveImageIndexes((prev) => ({
      ...prev,
      [orgCode]: ((prev[orgCode] || 0) + 1) % totalImages,
    }));
  };

  const handlePrevImage = (e, orgCode, totalImages) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [orgCode]: ((prev[orgCode] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  // Open Lightbox handler
  const openLightbox = (e, item, index) => {
    e.stopPropagation(); // Prevents card selection when clicking the image
    setLightboxState({ item, index });
  };

  // Sync index back to card when changed inside lightbox
  const handleLightboxIndexChange = (itemId, newIndex) => {
    setActiveImageIndexes((prev) => ({ ...prev, [itemId]: newIndex }));
  };

  return (
    <div className="org-gallery-container">
      {/* Modern Slim Filter Bar */}
      <FilterBar
        onSearch={(e) => search(e)}
        categories={categories}
        onCategoryChange={(e) => category(e)}
      />

      <div className="org-grid">
        {divisions?.map((item) => {
          const isSelected = false;
          const currentImgIndex = activeImageIndexes[item.Id] || 0;
          const currentImage = item.Images?.[currentImgIndex];

          return (
            <div
              key={item.Id}
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

              {/* Organization Info Body */}
              <div className="org-card-body">
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
  );
};