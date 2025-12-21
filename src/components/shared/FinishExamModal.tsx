"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface FinishExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FinishExamModal: React.FC<FinishExamModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // No need to prevent scroll - we'll just dim the background
  // This keeps scrollbar in place and prevents layout shift

  if (!shouldRender) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <>
      {/* Overlay - dims background but keeps scrollbar visible */}
      <div
        className={`fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        style={{ 
          // Allow scrolling in background, but make it less prominent
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Modal */}
        <div
          className={`bg-primaryCard rounded-lg shadow-xl w-full max-w-md transition-all duration-300 ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-borderBg">
            <h2 className="text-xl sm:text-2xl font-bold text-primaryText">
              Are you sure you want to submit your answers?
            </h2>
            <button
              onClick={onClose}
              className="text-primaryText/60 hover:text-primaryText transition-colors p-1 rounded-md hover:bg-primaryBg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-base sm:text-lg text-primaryText/70 leading-relaxed mb-6">
              Once submitted, you won't be able to change them. Please
              double-check your responses before confirming.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 sm:py-3 rounded-md bg-primaryBg border border-borderBg text-primaryText font-semibold hover:bg-primaryBg/80 transition-colors text-sm sm:text-base"
              >
                No
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 sm:py-3 rounded-md bg-primaryColor text-white font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinishExamModal;

