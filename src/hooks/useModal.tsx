import { useState, useCallback } from "react";
import Modal from "@/components/messages/Modal/Modal";

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  ModalWrapper: React.FC<{ children: React.ReactNode }>;
}

export const useModal = (): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const ModalWrapper: React.FC<{ children: React.ReactNode }> = useCallback(
    ({ children }) => {
      if (!isOpen) return null;

      return (
        <Modal isOpen={isOpen} onClose={closeModal}>
          {children}
        </Modal>
      );
    },
    [isOpen, closeModal],
  );

  return { isOpen, openModal, closeModal, ModalWrapper };
};
