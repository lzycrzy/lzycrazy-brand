import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import Navbar from './Navbar';
import { DesktopSidebar } from './DesktopSidebar';

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - only visible on desktop */}
      {!isAuthPage && (
        <div className="hidden md:block">
          <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white overflow-y-auto">
            {/* Desktop Sidebar Content - Mirrors the Mobile Sidebar */}
            <DesktopSidebar />
          </div>
        </div>
      )}

      {/* Mobile Sidebar - controlled by isSidebarOpen state */}
      {!isAuthPage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
      
      <div
        className={`flex flex-col ${
          !isAuthPage ? 'flex-1' : 'w-full'
        } overflow-hidden`}
      >
        {/* Pass setIsSidebarOpen to Navbar so it can toggle the sidebar */}
        {!isAuthPage && <Navbar setIsSidebarOpen={setIsSidebarOpen} />}
        <main
          className={`${
            !isAuthPage ? 'flex-1 overflow-y-auto p-6' : 'h-full w-full'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
