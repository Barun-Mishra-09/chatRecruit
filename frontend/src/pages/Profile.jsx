import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Avatar_image from "../components/Images/Avatar_blank_img.jpg";
import { Camera, Mail, User2 } from "lucide-react";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const result = reader.result;
      setSelectedImage(result);
      await updateProfile({ profilePic: result });
    };
  };

  return (
    <div className="min-h-screen pt-20 overflow-visible">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-2xl p-6 space-y-8 border border-violet-500 shadow-md shadow-violet-500">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#0066ff]">Profile</h1>
            <p className="mt-2 text-lg text-[#ff2e8b]">
              Your Profile Information
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-39 h-39">
              {/* Animated spinning ring */}
              <div
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    #0066ff,
                    #5e3cff,
                    #a033ff,
                    #d12bff,
                    #ff2e8b,
                    #0066ff
                  )`,
                  animation: "spin 6s linear infinite",
                  borderRadius: "9999px",
                  position: "absolute",
                  top: "-6px",
                  left: "-6px",
                  width: "calc(100% + 12px)",
                  height: "calc(100% + 12px)",
                  zIndex: 10,
                  border: "2px solid transparent",
                }}
              />

              {/* Inner circle to mask center */}
              <div
                style={{
                  backgroundColor: "var(--fallback-b1, #1d232a)",
                  position: "absolute",
                  top: "2px",
                  left: "2px",
                  width: "calc(100% - 4px)",
                  height: "calc(100% - 4px)",
                  borderRadius: "9999px",
                  zIndex: 20,
                }}
              />

              {/* Profile image */}
              <img
                src={selectedImage || authUser.profilePic || Avatar_image}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "9999px",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: 30,
                }}
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  e.target.src = Avatar_image;
                }}
              />

              {/* Upload button */}
              <label
                htmlFor="avatar-photo"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-110 p-2 rounded-full transition-all duration-200 z-40 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="h-5 w-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <p className="text-base text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-base text-pink-500 flex items-center gap-2">
                <User2 className="w-5 h-5" /> Full Name
              </div>
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border border-violet-400 shadow-sm shadow-violet-500">
                {authUser?.fullName}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-base text-pink-500 flex items-center gap-2">
                <Mail className="w-5 h-5" /> Email Address
              </div>
              <div className="px-4 py-2.5 bg-base-200 rounded-lg border border-violet-400 shadow-sm shadow-violet-500 ">
                {authUser?.email}
              </div>
            </div>
          </div>

          {/* Extra Info */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-[#0066ff]">
              Account Information
            </h2>
            <div className="space-y-3 text-base">
              <div className="flex items-center justify-between py-2 border-b border-violet-500">
                <span className="text-[#ff2e8b]">Member Since</span>
                <span className="text-yellow-500">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[#ff2e8b]">Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
