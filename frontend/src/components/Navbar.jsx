import React from "react";
import Logo from "../components/Images/chat_logo.png";
import { Link } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-gray-900 fixed w-full top-0 z-40 backdrop-blur-lg ">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* For Left section  */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              {/* Advanced animations */}

              <div
                className="h-14 w-14 rounded-full overflow-hidden m-2 animated-logo 
        bg-gradient-to-br from-[#0066ff] via-[#7d3aff] to-[#ff2e8b] p-1 mt-7"
              >
                <img
                  src={Logo}
                  alt="logo"
                  className="h-full w-full object-fill rounded-full"
                />
              </div>
              <h1 className="text-lg font-bold">Chatrecruit</h1>
            </Link>
          </div>

          {/* For Right section div */}
          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn btn-sm gap-2 ">
              <Settings className="size-5 " />
              <span className="hidden sm:inline text-base">Settings</span>
            </Link>

            {/* For profile and Logout button */}
            {/* If the user is authenticated then profile and logout */}
            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline text-base">Profile</span>
                </Link>

                {/* For Logout */}
                <div className="flex items-center justify-center  px-3 py-2">
                  <button
                    className="flex gap-2 items-center  rounded-2xl cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="size-5 text-red-500" />
                    <span className="hidden sm:inline text-red-500">
                      Logout
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
