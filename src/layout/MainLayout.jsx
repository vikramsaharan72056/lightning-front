import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import MenuImage from "../assets/MenuImage";
import Navbar from "../components/Navbar";


const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(false); 
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex bg-gray-200 relative">
     
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <MenuImage />
        </button>
      )}

      
      <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />

      
      <main
        className={`flex-1 p-6 overflow-auto transition-all ${
          isMobile && isSidebarOpen ? "opacity-90" : "opacity-100"
        } ${!isMobile ? "ml-64" : "mt-15"}`}
      >
        {isMobile && <Navbar />}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
