"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface ModalProps {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the element that we want to portal our Modal to
    const root = document.getElementById("modal-root");
    setModalRoot(root);
  }, []);

  if (!isOpen || !modalRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="absolute top-0 left-0 h-screen w-full z-50">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
            <>{children}</>
            <button onClick={onClose} className="absolute top-2 right-2">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-screen w-full bg-gray-500 opacity-80 absolute"></div>
    </div>,
    modalRoot,
  );
};

export default Modal;
