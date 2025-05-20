import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  MessagesSquare as LucideMessagesSquare,
} from "lucide-react";
import Right_sideBar from "../components/Images/Login_light.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const login = useAuthStore((state) => state.login); // ✅ Proper selection
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-[#0d0d0d] text-white">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <div
                className="rounded-full p-3 shadow-xl bg-gradient-to-br 
  from-[#0066ff] via-[#5e3cff] via-[#a033ff] via-[#d12bff] to-[#ff2e8b] animate-bounce"
              >
                <LucideMessagesSquare size={50} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold mt-4 text-[#0066ff]">
                Welcome Back
              </h2>
              <p className="text-[17px] text-[#ff2e8b] mt-1">
                Login to your account
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="border border-violet-500 shadow-md shadow-violet-500 p-5 rounded-2xl">
            <h1 className="text-2xl text-center text-[#0066ff] font-bold">
              Log <span className="text-[#ff2e8b] ml-[-5px]">In</span>
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {/* Email */}
              <div>
                <label className="block mb-2 text-pink-500 font-bold">
                  Email
                </label>
                <div className="flex items-center border border-violet-400 px-3 py-2 rounded-md focus-within:ring-2 focus-within:ring-violet-500">
                  <Mail className="text-white mr-2" />
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-transparent outline-none text-white w-full"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-pink-500 font-bold">
                  Password
                </label>
                <div className="relative flex items-center border border-violet-400 px-3 py-2 rounded-md focus-within:ring-2 focus-within:ring-violet-500">
                  <Lock className="text-white mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="bg-transparent outline-none text-white w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-gradient-to-br from-[#0066ff] via-[#a033ff] to-[#ff2e8b] p-2 w-full text-base font-bold rounded-xl cursor-pointer "
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center justify-center gap-2 ">
                    <Loader2 className="size-5 animate-spin " /> Loading..
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-base text-pink-600 font-semibold">
                Don't have an account?
                <Link to="/signup" className="underline text-blue-500 ml-1">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Optional Image / Illustration) */}
      <div
        className=" rounded-2xl h-[550px] w-[550px] lg:ml-25 lg:mt-35
       border border-violet-400 shadow-xl shadow-violet-300 "
      >
        <img src={Right_sideBar} alt="right sidebar" className=" rounded-2xl" />
      </div>
    </div>
  );
};

export default Login;
