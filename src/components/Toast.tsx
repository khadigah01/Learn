import React from 'react';
import { ToastContainer as ReactToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { language } = useApp();

  return (
    <ReactToastifyContainer
      position={language === 'ar' ? 'top-left' : 'top-right'}
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={language === 'ar'}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      stacked
    />
  );
};
