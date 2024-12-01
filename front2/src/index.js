import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./index.css";
import { RecoilRoot } from 'recoil';
import { AlertProvider } from "./components/common/AlertContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
     <AlertProvider>
      <App />
    </AlertProvider>
  </RecoilRoot>
);

reportWebVitals();
