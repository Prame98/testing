import React, { createContext, useContext, useState } from "react";
import AlertModal from "../element/AlertModal";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertProps, setAlertProps] = useState({
    isModalOpen: false,
    message: "",
    goPage: null,
  });

  const showAlert = ({ message, goPage }) => {
    setAlertProps({ isModalOpen: true, message, goPage });
  };

  const hideAlert = () => {
    setAlertProps({ isModalOpen: false, message: "", goPage: null });
  };

  return (
    <AlertContext.Provider value={{ alertProps, showAlert, hideAlert }}>
      {children}
      <AlertModal
        isModalOpen={alertProps.isModalOpen}
        setIsModalOpen={hideAlert}
        message={alertProps.message}
        goPage={alertProps.goPage}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
