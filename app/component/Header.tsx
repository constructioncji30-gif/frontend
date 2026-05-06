import React from "react";
import Logo from "./Logo";

const Header: React.FC = () => {
  return (
   <header className="bg-white h-8 py-1 flex items-center shadow-md px-4">
  {/* Logo Section */}
  <div className="flex items-center w-40 md:w-44 border-r border-border pr-2 md:pr-4">
    <Logo />
  </div>

  {/* Inventory Name */}
  <div className="flex-1 flex items-center ml-2 md:ml-4">
    <p className="text-lg md:text-xl font-bold">CAMP DATA</p>
  </div>

  {/* User Section */}
  <div className="flex items-center space-x-2 md:space-x-4">
    <span className="text-xs md:text-sm">Welcome, Admin</span>
    <button className="bg-danger px-2 py-1 md:px-3 md:py-1 rounded hover:bg-dangerHover text-white text-xs md:text-sm">
      Logout
    </button>
  </div>
</header>
);
};

export default Header;
