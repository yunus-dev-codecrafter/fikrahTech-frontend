import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeSidebar = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-100"> {/* Light gray background for the main content area */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={closeSidebar}
        currentPage="layout"
      />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
