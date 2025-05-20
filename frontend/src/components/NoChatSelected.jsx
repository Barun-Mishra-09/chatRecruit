import { Lock, MessageCircleMore } from "lucide-react";
import React from "react";

const NoChatSelected = () => {
  return (
    <div className="h-screen w-full flex flex-col mt-50">
      <div className="flex items-center justify-center  text-gray-600 animate-bounce ">
        <MessageCircleMore size={70} />
      </div>

      <div className="flex flex-col items-center justify-center mt-9">
        <h2 className="text-2xl text-blue-500 font-bold ">
          Welcome to Chatrecruit!
        </h2>
        <p className="text-sm text-violet-400 font-semibold mt-5 ">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>

      <div className="flex items-center justify-center mt-44 text-gray-400  ">
        <Lock size={14} />
        <span className="p-2 text-sm ">End-to-end encrypted</span>
      </div>
    </div>
  );
};

export default NoChatSelected;
