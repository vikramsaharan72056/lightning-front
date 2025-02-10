import { NavLink } from "react-router-dom";
import CloseIcon from "../assets/CloseIcon";

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  return (
    <>
     
      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-white p-5 shadow-md z-50 transform transition-transform ${
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        }`}
      >
       
        {isMobile && (
          <button className="absolute top-4 right-4 text-gray-600" onClick={onClose}>
            <CloseIcon/>
          </button>
        )}

        <h1 className="text-2xl font-bold mb-5">Main Menu</h1>
        <nav>
          <ul className="space-y-4">
            {[
              { to: "/dashboard", label: "Dashboard", icon: "home" },
              { to: "/", label: "Purchase Plan", icon: "purchase-plan" },
              { to: "/deposit-balance", label: "Deposit Balance", icon: "topup-2" },
             
            ].map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600 font-bold" : "hover:bg-gray-200"
                    }`
                  }
                  onClick={onClose} 
                >
                  <img
                    src={`https://lightningproxies.net/assets/images/sidebar-iconsV2/${item.icon}.svg`}
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
