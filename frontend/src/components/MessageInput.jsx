import {
  Camera,
  FileText,
  Images,
  Mic,
  Paperclip,
  Send,
  Smile,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const sendMessages = useChatStore((state) => state.sendMessages);
  const selectedUser = useChatStore((state) => state.selectedUser);

  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const optionsRef = useRef();
  const emojiPickerRef = useRef(null); // Added ref for emoji picker

  // Handle emoji selection
  const handleEmoji = (emojiData) => {
    console.log("Emoji selected:", emojiData); // Added for debugging
    setText((prevText) => {
      const updatedText = prevText + (emojiData.emoji || ""); // Fallback for safety
      console.log("Updated text:", updatedText); // Added for debugging
      return updatedText;
    });
    setShowEmojiPicker(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close emoji picker if clicked outside
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        !e.target.closest('[data-tip="Emoji"]')
      ) {
        setShowEmojiPicker(false);
      }

      // Close attachment menu if clicked outside
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target) &&
        !e.target.closest('[data-tip="Attach"]')
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setShowOptions(false);
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) {
      toast.error("Please enter a message or select an image.");
      return;
    }
    if (!selectedUser) {
      toast.error("Please select a user to chat with.");
      return;
    }

    try {
      console.log(
        "Sending message with text:",
        text,
        "and image:",
        imagePreview
      );
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });
      console.log("Message sent successfully");
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="w-full p-3 bg-zinc-900 border-t border-zinc-700 relative mt-15">
      {imagePreview && (
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 relative"
      >
        {/* Emoji Button */}
        <div className="tooltip tooltip-top tooltip-primary" data-tip="Emoji">
          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowOptions(false);
            }}
            className="p-2 rounded-full hover:bg-zinc-700 text-white cursor-pointer"
          >
            <Smile />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-12 left-0 z-[1000]"
          >
            <EmojiPicker
              onEmojiClick={handleEmoji}
              width={300}
              height={350}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}

        {/* Attach Button with Options Menu */}
        <div className="relative" ref={optionsRef}>
          <div
            className="tooltip tooltip-top tooltip-primary"
            data-tip="Attach"
          >
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 rounded-full hover:bg-zinc-700 text-white cursor-pointer"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          {showOptions && (
            <div className="absolute bottom-12 left-0 w-48 bg-zinc-800 text-white shadow-lg rounded-xl p-2 space-y-2 z-[1000]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 hover:bg-zinc-700 w-full px-3 py-2 rounded-md"
              >
                <Images className="w-5 h-5 text-blue-500" />
                <span className="text-blue-500 text-lg">Photos</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 hover:bg-zinc-700 w-full px-3 py-2 rounded-md"
              >
                <Camera className="w-5 h-5 text-red-500" />
                <span className="text-lg text-red-500">Camera</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 hover:bg-zinc-700 w-full px-3 py-2 rounded-md"
              >
                <FileText className="w-5 h-5 text-violet-500" />
                <span className="text-lg text-violet-500">Document</span>
              </button>
            </div>
          )}
        </div>

        {/* Message Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 text-white outline-none focus:border-violet-400 bg-transparent"
          style={{ fontFamily: "Arial, sans-serif", fontSize: "16px" }}
        />

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Send or Mic Button */}
        {text.trim() || imagePreview ? (
          <div
            className="tooltip tooltip-top tooltip-primary"
            data-tip="Send message"
          >
            <button
              type="submit"
              className="p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            className="tooltip tooltip-left tooltip-primary"
            data-tip="Record voice"
          >
            <button
              type="button"
              onClick={() => console.log("Start voice recording...")}
              className="p-2 rounded-full bg-zinc-700 text-white"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
