"use client";
import { FiLogOut, FiUser, FiList, FiPlusCircle, FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';

function NavBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("userID");
    document.cookie = "Token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;";
    router.push("/Pages/login");
  };

  const handleProfile = () => {
    router.push("/Pages/profile");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">TaskManager</h1>
          <button onClick={toggleSidebar} className="p-1 rounded-full text-gray-600 hover:text-indigo-600 focus:outline-none">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <a
            href="/Pages/allTask"
            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={toggleSidebar}
          >
            <FiList className="mr-2" />
            Tasks
          </a>
          <a
            href="/Pages/addTask"
            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={toggleSidebar}
          >
            <FiPlusCircle className="mr-2" />
            Add Task
          </a>
          <button
            onClick={handleProfile}
            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FiUser className="mr-2" />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-indigo-600">TaskManager</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="mr-2 p-1 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none md:hidden"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="/Pages/allTask"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FiList className="mr-2" />
                  Tasks
                </a>
                <a
                  href="/Pages/addTask"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FiPlusCircle className="mr-2" />
                  Add Task
                </a>
                <div className="flex items-center space-x-4 ml-0">
                  <button onClick={handleProfile} className="p-1 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none">
                    <FiUser className="h-5 w-5" />
                  </button>
                  <button onClick={handleLogout} className="p-1 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none">
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;