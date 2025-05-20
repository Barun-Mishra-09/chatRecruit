import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

import Avatar_image from "../components/Images/Avatar_blank_img.jpg";
import {
  AlignJustify,
  CircleDotDashedIcon,
  CircleUserRound,
  MessageCircleMore,
  Settings,
} from "lucide-react";
import IconMsgStatus from "../components/IconMsgStatus";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Home = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const { selectedUser } = useChatStore();

  const [activePanel, setActivePanel] = useState("sidebar");
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="flex bg-base-100 rounded-lg shadow-xl w-full max-w-7xl h-[calc(100vh-5rem)]">
          {/* Vertical Icon Menu */}
          <div className="flex flex-col justify-between items-center p-4 border-r border-violet-400">
            <div className="flex flex-col items-center gap-4">
              <AlignJustify className="cursor-pointer hover:text-violet-500" />

              <button onClick={() => setActivePanel("sidebar")} title="Chats">
                <MessageCircleMore className="cursor-pointer hover:text-violet-500" />
              </button>

              <button onClick={() => setActivePanel("status")} title="Status">
                <CircleDotDashedIcon className="cursor-pointer hover:text-violet-500" />
              </button>
            </div>

            {/* Bottom icons */}
            <div className="flex flex-col items-center gap-4">
              <button onClick={() => navigate("/settings")} title="Settings">
                <Settings className="cursor-pointer hover:text-violet-500" />
              </button>
              <button onClick={() => navigate("/profile")} title="Profile">
                <img
                  src={authUser?.profilePic || Avatar_image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-violet-500 transition-all duration-150"
                />
              </button>
            </div>
          </div>

          {/* Main Chat Layout */}
          <div className="flex h-full w-full rounded-lg overflow-hidden">
            {activePanel === "sidebar" ? <Sidebar /> : <IconMsgStatus />}
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
