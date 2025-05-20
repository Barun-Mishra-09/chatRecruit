import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import Avatar_Image from "../components/Images/Avatar_blank_img.jpg";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  // use the things from the useChatStore
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    sendingMessages,
    unsendingMessages,
  } = useChatStore();

  // authUser from useAuthStore
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    // call the sendMessages from useChatStore.js
    sendingMessages();

    // now call the unsendingMessages in return statement
    return () => unsendingMessages();
  }, [selectedUser._id, getMessages, sendingMessages, unsendingMessages]);

  // useEffect for the automatically Lastscroll
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <ChatHeader />

      {/* For showing all the messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || Avatar_Image
                      : selectedUser.profilePic || Avatar_Image
                  }
                  alt="profile_pic"
                />
              </div>
            </div>
            {/* showing chat time */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* now for message like image and text */}
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === authUser._id ? "chat-bubble-accent" : ""
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="image"
                  className="sm:max-w-[200px] rounded-md
                mb-2 "
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
