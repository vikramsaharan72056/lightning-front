import { NavLink } from "react-router-dom";
import CloseIcon from "../assets/CloseIcon";
import React from "react";

const Sidebar = ({ isOpen, isMobile, onClose }) => {
  return (
    <React.Fragment>
     
      <aside
        className={`fixed top-0 left-0 w-72 h-screen bg-white p-4 shadow-md z-50 transform transition-transform ${
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        }`}
      >
        {isMobile && (
          <button className="absolute top-4 right-4 text-[#292742]" onClick={onClose}>
            <CloseIcon/>
          </button>
        )}

        <h1 className="text-[#8a8a8a] uppercase font-bold text-sm mb-4">Main Menu</h1>
        <nav>
          <ul className="space-y-3">
            {[
              { to: "/dashboard", label: "Dashboard", icon: "home-2", hoverIcon: "home" },
              { to: "/", label: "Purchase Plan", icon: "purchase-plan-2", hoverIcon: "purchase-plan" },
              { to: "/deposit-balance", label: "Deposit Balance", icon: "topup-2", hoverIcon: "topup" },
              { to: "/invoices", label: "Invoices", icon: "invoices-2", hoverIcon: "invoices" },
             
            ].map((item) => (
              <li key={item.to}>
              <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 py-2.5 rounded-md text-[#292742] font-medium text-base ${
                  isActive ? "bg-[#e5f4ff] text-[#292742]" : "hover:bg-[#e5f4ff]"
                }`
              }
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={`https://lightningproxies.net/assets/images/sidebar-iconsV2/${
                      isActive ? item.hoverIcon : item.icon
                    }.svg`}
                    alt={item.label}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </React.Fragment>
  );
};

export default Sidebar;
