import React from 'react';
import { Outlet, useLocation } from 'react-router';
import  Sidebar  from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex h-screen m-0 bg-gray-50">
      {!isAuthPage && <Sidebar />}
      <div
        className={`flex flex-col ${
          !isAuthPage ? 'flex-1' : 'w-full'
        } overflow-hidden`}
      >
        {!isAuthPage && <Navbar />}
        <main
          className={`${
            !isAuthPage ? 'flex-1 overflow-y-auto ' : 'h-full w-full'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
