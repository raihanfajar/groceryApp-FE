"use client";

import { motion, AnimatePresence } from "framer-motion";

type ConfirmationModalProps = {
  isOpen: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmationModal = ({
  isOpen,
  itemName,
  onCancel,
  onConfirm,
}: ConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // Latar belakang semi-transparan
          className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
          onClick={onCancel} // Tutup modal jika klik di luar
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            // Box konten modal
            className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()} // Cegah penutupan saat klik di dalam modal
          >
            <h3 className="text-lg font-bold">Delete Item</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">&quot;{itemName}&quot;</span> from
              cart ?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="btn btn-ghost">
                No
              </button>
              <button onClick={onConfirm} className="btn btn-error">
                Yes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
