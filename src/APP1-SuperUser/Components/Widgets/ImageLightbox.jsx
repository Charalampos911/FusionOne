import React, { useState, useEffect, useCallback } from "react";

export const ImageLightbox = ({
  item,
  initialIndex = 0,
  imageHost = "",
  onClose,
  onIndexChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const images = item?.Images || [];
  const totalImages = images.length;

  // Next image handler
  const handleNext = useCallback(() => {
    if (totalImages <= 1) return;
    const nextIdx = (currentIndex + 1) % totalImages;
    setCurrentIndex(nextIdx);
    if (onIndexChange) onIndexChange(nextIdx);
  }, [currentIndex, totalImages, onIndexChange]);

  // Previous image handler
  const handlePrev = useCallback(() => {
    if (totalImages <= 1) return;
    const prevIdx = (currentIndex - 1 + totalImages) % totalImages;
    setCurrentIndex(prevIdx);
    if (onIndexChange) onIndexChange(prevIdx);
  }, [currentIndex, totalImages, onIndexChange]);

  // Keyboard controls (Arrow keys + Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  if (!item || !images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      {/* Close Button */}
      <button
        type="button"
        className="lightbox-close-btn"
        onClick={onClose}
      >
        <span>&times;</span>
      </button>

      {/* Lightbox Container */}
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-slide">
          {/* Previous Arrow */}
          {totalImages > 1 && (
            <button
              type="button"
              className="lightbox-arrow prev"
              onClick={handlePrev}
            >
              &#10094;
            </button>
          )}

          {/* Active Image */}
          <img
            src={`${imageHost}${currentImage?.Url.toLowerCase()}`}
            alt={currentImage?.Name || item.Name}
          />

          {/* Caption Footer */}
          <div className="lightbox-caption">
            <h4>
              {item.Name}
              <span className="counter">
                ({currentIndex + 1} / {totalImages})
              </span>
            </h4>
            {currentImage?.Description && <p>{currentImage.Description}</p>}
          </div>

          {/* Next Arrow */}
          {totalImages > 1 && (
            <button
              type="button"
              className="lightbox-arrow next"
              onClick={handleNext}
            >
              &#10095;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};