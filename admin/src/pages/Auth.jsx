// src/pages/Auth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import ForgotPassword from '../components/Auth/ForgotPassword';
import instance from '../utils/axios';
//import lzylogo from '../assets/Logo.jpg';

export default function Auth() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [stage, setStage] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
   const [showForgotModal, setShowForgotModal] = useState(false);
  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await instance.post('/admin/login', {
        email: form.email,
        password: form.password,
      });

      // login successful
      if (res.data?.token) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('adminToken', res.data.token);
        setStage('verified');
      } else {
        setStage('error');
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
      setStage('error');
    }
  };

  const goDashboard = () => navigate('/admin');
  const closeError = () => setStage('login');

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f4f5fe]">
      <img
        src="/decor-tree.svg"
        alt=""
        className="pointer-events-none absolute bottom-0 left-6 hidden sm:block"
      />
      <img
        src="/decor-leaf.svg"
        alt=""
        className="pointer-events-none absolute right-6 bottom-0 hidden sm:block"
      />

      <div className="flex w-full max-w-6xl flex-col items-center justify-between px-4 lg:flex-row">
        {/* ------------ brand / illustration (left) ------------ */}
        <div className="mx-auto mt-12 hidden shrink-0 select-none lg:block">
          <img
              src="https://res.cloudinary.com/dci4f6wuc/image/upload/v1751867930/Logo_z1lmdd.jpg"
          // src="/Logo.jpg"
	    //src={lzylogo}
            alt="Lzycrazy logo"
            className="h-80 w-100 bg-transparent"
          />
        </div>

        {/* --------------- form container (right) --------------- */}
        <div className="w-full max-w-md rounded-[20px] bg-white px-8 py-10 shadow-md">
          <h1 className="text-center text-[32px] font-bold tracking-tight text-gray-800">
            Login
          </h1>

          <p className="mt-3 text-2xl font-semibold text-gray-800">
            Welcome to Lzycrazy!
          </p>
          <p className="mb-8 text-xs text-gray-500">
            Please sign-in to your account and start the adventure
          </p>

          {/* ------------------- FORM ------------------- */}
          <form onSubmit={onSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />

              {/* 👁 password-toggle icon slot (optional) */}
              {!showPassword ? (
                <Eye
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={handleShowPassword}
                />
              ) : (
                <EyeOff
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={handleShowPassword}
                />
              )}
            </div>

            <div className="flex justify-end text-xs">
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password…?
              </button>
              {showForgotModal && (
                        <ForgotPassword onClose={() => setShowForgotModal(false)} />
                      )}
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-[10px] text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[.98]"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* ========================== VERIFIED POPUP ====================== */}

      {stage === 'verified' && (
        <Modal>
          <h2 className="mb-6 text-2xl font-bold">Verified</h2>

          <div className="mb-8 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-600">
              {/* checkmark */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-14 w-14 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={goDashboard}
            className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[.97]"
          >
            NEXT
          </button>
        </Modal>
      )}

      {/* ================================================================ */}
      {/* =========================== ERROR POPUP ======================== */}
      {/* ================================================================ */}
      {stage === 'error' && (
        <Modal>
          <h2 className="mb-4 text-2xl font-bold text-red-600">Login Failed</h2>
          <p className="mb-8 text-sm text-gray-600">
            Invalid email or password.
            <br />
            Please try again.
          </p>
          <button
            onClick={closeError}
            className="rounded bg-red-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-[.97]"
          >
            CLOSE
          </button>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- */
/*  Tiny reusable modal component                                       */
/* -------------------------------------------------------------------- */
function Modal({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-brightness-75">
      <div className="w-full max-w-xs rounded-[28px] bg-white px-8 py-10 text-center shadow-xl">
        {children}
      </div>
    </div>
  );
}
