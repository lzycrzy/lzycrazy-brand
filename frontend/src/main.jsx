import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import '../src/components/i18n.jsx';
import 'react-phone-input-2/lib/style.css';
import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
        {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        style={{ zIndex: 9999 }}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!text-sm !md:text-base !rounded-lg !shadow-lg !p-4 !md:p-5 !w-full !max-w-xs md:!max-w-sm !break-words"
          bodyClassName="!text-gray-800"
          style={{ zIndex: 9999 }}
        />

      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
