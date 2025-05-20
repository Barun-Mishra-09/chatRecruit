import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

// get io from socket.io-client
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:8000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  onlineUsers: [],
  // create a state as socket initiallly null
  socket: null,

  // create a function for  checkAuth
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data.user });
      // when we refresh our page or checking user then also connect it with socket server
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // for signup logic
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/register", data);

      set({ authUser: res.data });
      toast.success(res.data.message);

      // after successfull signup let's connect it with socket server
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // For login logic
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success(res.data.message);
      // after successfull login let's connect it with socket
      get().connectSocket();
      return true;
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // for logout we don't need a state so we simply add the logic
  logout: async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success(res.data.message);
      // after successfull logout we must disconnect our socket server
      get().disconnectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  // For updating Profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Pic Updated Sucessfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Applying socket so we use the connectSocket function
  connectSocket: () => {
    // first validation like is user is present or if the user is already connected then simply return otherwise connect it to the socket server
    const { authUser } = get();

    if (!authUser || get().socket?.connected) {
      return;
    }

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    // for successfully disconnect we should set the socket variable to the socket state
    set({ socket: socket });

    // now call the events getOnlineUsers with the help of the socket.on
    socket.on("getOnlineUsers", (userIds) => {
      // update the state
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
