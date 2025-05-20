import React from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Avatar_image from "../components/Images/Avatar_blank_img.jpg";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="rounded-full size-13 relative ">
              <img
                src={selectedUser.profilePic || Avatar_image}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-bold">{selectedUser.fullName}</h3>
            <p className="text-sm text-gray-300">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button  */}
        <button
          onClick={() => setSelectedUser(null)}
          className=" p-2 hover:bg-gray-700 rounded-full cursor-pointer bg-gray-800"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
