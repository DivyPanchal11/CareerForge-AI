import React from "react";
import { defaultPhotoSettings } from "../../context/ResumeContext";

/**
 * Renders the candidate's profile photo honoring Shape, Border, Grayscale B&W, and Pan/Zoom framing.
 *
 * @param {object} props
 * @param {string} props.photo - Image data URL or src
 * @param {object} props.photoSettings - Profile photo configuration
 * @param {string} props.primaryColor - Theme accent/primary color for the ring
 * @param {number} props.sizeOverride - Optional diameter override in px
 * @param {string} props.className - Extra CSS classes
 */
export function PhotoDisplay({
  photo,
  photoSettings = {},
  primaryColor = "#000000",
  sizeOverride,
  className = "",
  style = {},
}) {
  if (!photo) return null;

  const settings = {
    ...defaultPhotoSettings,
    ...photoSettings,
  };

  const size = sizeOverride || settings.size || 64;

  // 1. Shape: Circle, Rounded Square, or Square
  let borderRadius = "50%";
  if (settings.shape === "rounded") {
    borderRadius = "18%"; // Smooth modern rounded square
  } else if (settings.shape === "square") {
    borderRadius = "0px";
  }

  // 2. Border Width & Ring Color
  const borderWidth = settings.borderWidth !== undefined ? settings.borderWidth : 2;
  let borderColor = primaryColor;
  if (settings.borderColor === "neutral") {
    borderColor = "#E5E7EB";
  } else if (settings.borderColor === "white") {
    borderColor = "#FFFFFF";
  } else if (settings.borderColor && settings.borderColor !== "primary") {
    borderColor = settings.borderColor;
  }

  // 3. Pan, Zoom & Grayscale Filter
  const zoom = settings.zoom || 1;
  const panX = settings.panX || 0;
  const panY = settings.panY || 0;
  const filter = settings.grayscale ? "grayscale(100%) contrast(105%)" : "none";

  return (
    <div
      className={`shrink-0 overflow-hidden select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        borderWidth: `${borderWidth}px`,
        borderStyle: borderWidth > 0 ? "solid" : "none",
        borderColor: borderWidth > 0 ? borderColor : "transparent",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <img
        src={photo}
        alt="Profile"
        className="w-full h-full object-cover block pointer-events-none"
        style={{
          transform: `scale(${zoom}) translate(${panX}%, ${panY}%)`,
          transformOrigin: "center center",
          filter,
          transition: "transform 0.05s ease-out, filter 0.2s ease-in-out",
        }}
        draggable={false}
      />
    </div>
  );
}

export default PhotoDisplay;
