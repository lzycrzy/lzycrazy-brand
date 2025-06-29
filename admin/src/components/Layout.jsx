import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (isAuthPage) {
    return (
      <div className="flex h-screen bg-gray-50">
        <main className="h-full w-full">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Full width navbar on top */}
      <Navbar />

      {/* Below navbar: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
