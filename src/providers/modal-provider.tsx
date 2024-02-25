"use client";

import { User } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

interface DataType {
  user?: User;
}

interface ModalContextProps {
  isOpen: boolean;
  data: DataType;
  onOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState<React.ReactNode>(null);
  const [data, setData] = useState({});

  useEffect(function () {
    setHasMounted(true);
  }, []);

  async function onOpen(
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) {
    setIsOpen(true);
    if (fetchData) {
      setData({ ...data, ...(await fetchData()) });
    }
    setOpenModal(modal);
  }
  function onClose() {
    setIsOpen(false);
    setOpenModal("");
  }
  if (!hasMounted) {
    return null;
  }

  return (
    <ModalContext.Provider value={{ isOpen, data, onOpen, onClose }}>
      {children}
      {openModal}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
