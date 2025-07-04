import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AdminProvider } from './context/AdminContext'; //  Import Admin Context

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdminProvider> {/*  Wrap your app with AdminProvider */}
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AdminProvider>
    </BrowserRouter>
  </StrictMode>
);
