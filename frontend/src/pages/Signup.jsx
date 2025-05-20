import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  LockIcon,
  LucideMessagesSquare,
  Mail,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import SignUp_Right_Sidebar from "../components/Images/signUp_Rights_Sidebar.jpg";
import toast from "react-hot-toast";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    // For check all the field fullName, email or password is correctly defined or not
    if (!formData.fullName.trim()) return toast.error("FullName is required");

    if (!formData.email.trim()) return toast.error("Email is required");

    // check email logic for correct pattern
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid Email Format");

    // for password
    if (!formData.password) return toast.error("Password is required");

    if (formData.password.length < 6)
      return toast.error("Password must be atleast 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success == true) {
      signup(formData);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 fixed bg-black">
      {/* Left sidebar */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:mt-[35px]">
        <div className="w-full max-w-md space-y-4">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className="rounded-full p-3 shadow-xl bg-gradient-to-br 
  from-[#0066ff] via-[#5e3cff] via-[#a033ff] via-[#d12bff] to-[#ff2e8b] animate-bounce "
              >
                <LucideMessagesSquare size={50} className="text-white" />
              </div>

              <h2 className="text-2xl font-bold mt-4 mb-0 text-[#0066ff]">
                Create Account
              </h2>
              <p className="text-base text-[#ff2e8b] mt-1">
                Get Started with your free account
              </p>
            </div>
          </div>

          {/* Now for form  */}
          <div className="border border-violet-500 shadow-md shadow-violet-500 p-5 rounded-2xl">
            <h1 className="text-2xl text-center text-[#0066ff] font-bold">
              Sign <span className="text-[#ff2e8b] ml-[-5px]">up</span>
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6 ">
              {/* for fullName */}
              <div className="form-control ">
                <label className="label mb-2">
                  <span className="label-text  text-pink-500 font-bold">
                    FullName
                  </span>
                </label>
                <label className="flex items-center border border-violet-400 px-3 py-2 rounded-md focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-400">
                  <div className="text-white mr-2">
                    <User />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="bg-transparent outline-none text-white w-full peer cursor-pointer"
                  />
                </label>
              </div>
              {/* for email */}
              <div className="form-control ">
                <label className="label mb-2 text-pink-500 font-bold">
                  Email
                </label>
                <label className="flex items-center border border-violet-400 px-3 py-2 rounded-md focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500">
                  <div className="text-white mr-2">
                    <Mail />
                  </div>
                  <input
                    type="email"
                    placeholder="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-transparent outline-none text-white w-full peer cursor-pointer"
                  />
                </label>

                {/* This will be RED if input is invalid */}
                <p className="mt-1 ml-1 text-sm text-red-500 peer-invalid:block hidden">
                  Must be 3 to 30 characters
                  <br />
                  Only letters, numbers or dash
                </p>
              </div>

              <div className="form-control">
                <label className="label mb-2 text-pink-500 font-bold">
                  Password
                </label>
                <label className="relative flex items-center border border-violet-400 px-3 py-2 rounded-md focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500">
                  <div className="text-white mr-2">
                    <LockIcon />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="bg-transparent outline-none text-white w-full peer cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </label>

                <p className="mt-1 ml-1 text-sm text-red-500 peer-invalid:block hidden">
                  Must be more than 8 characters, including:
                  <br />
                  - At least one number
                  <br />
                  - One lowercase letter
                  <br />- One uppercase letter
                </p>
              </div>

              {/* for create accont button */}
              <button
                type="submit"
                className="bg-gradient-to-br 
  from-[#0066ff] via-[#5e3cff] via-[#a033ff] via-[#d12bff] to-[#ff2e8b] p-2 w-full text-base font-bold rounded-xl cursor-pointer"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" /> Loading..
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base text-pink-600 mt-2 font-semibold">
                Already have an account?
                <Link to="/login" className="link link-info p-2">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
      </div>
      <div className=" rounded-xl h-[450px] w-[580px] mt-35 ml-44 border border-violet-400 shadow-xl shadow-violet-300 ">
        <img
          src={SignUp_Right_Sidebar}
          alt="right sidebar"
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default Signup;
