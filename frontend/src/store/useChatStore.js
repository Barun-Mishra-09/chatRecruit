import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  groups: [], // NEW: Group state
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/otherUsers");

      // Assume backend provides `groups` and `otherUsers`
      set({ users: res.data.otherUsers || [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/sendMessage/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.newMessage] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Message send failed");
    }
  },

  sendingMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageRelevant =
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id;

      if (!isMessageRelevant) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsendingMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // ✅ NEW: Create group logic
  createGroup: async (groupName, members) => {
    try {
      const res = await axiosInstance.post("/groups/createGroup", {
        groupName,
        members,
      });

      const newGroup = res.data.group;

      set((state) => ({
        groups: [...state.groups, newGroup],
      }));

      toast.success("Group created successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create group");
    }
  },

  // for getting groups for a user
  getGroups: async () => {
    const { user } = useAuthStore.getState();

    if (!user?._id) return;

    try {
      const res = await axiosInstance.get(`/groups/${user._id}`);

      set({ groups: res.data.groups || [] });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch or get groups"
      );
    }
  },
}));
