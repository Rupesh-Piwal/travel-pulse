import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import MapWrapper from "../map-wrapper";

interface MapBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  days: any[];
  flatActivities?: any[];
  activeActivityIndex?: number | null;
}

export default function MapBottomSheet({
  isOpen,
  onClose,
  days,
  flatActivities,
  activeActivityIndex,
}: MapBottomSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[130] h-[75vh] bg-white rounded-t-3xl overflow-hidden shadow-2xl flex flex-col"
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 150 || velocity.y > 500) {
                onClose();
              }
            }}
          >
            {/* Header / Drag Handle */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md absolute top-0 left-0 right-0 z-10 border-b border-zinc-100">
              <div className="w-12 h-1.5 bg-zinc-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-4" />
              <h2 className="text-lg font-semibold text-zinc-900 mt-2">Trip Map</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 bg-zinc-100 rounded-full mt-2 active:scale-95 transition-transform"
              >
                <X className="w-5 h-5 text-zinc-600" />
              </button>
            </div>

            {/* Map Content */}
            <div className="flex-1 w-full h-full relative pt-16">
              <MapWrapper
                days={days}
                flatActivities={flatActivities}
                activeActivityIndex={activeActivityIndex}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
