import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Camera,
  Search,
  SquarePen,
  Users,
  Users2,
  UsersRound,
} from "lucide-react";
import Avatar_image from "../components/Images/Avatar_blank_img.jpg";

const Sidebar = () => {
  const {
    getUsers,
    users,
    groups,
    createGroup,
    getGroups,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    isGroupsLoading,
  } = useChatStore();

  const { onlineUsers, authUser, isCheckingAuth, checkAuth } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [showNextDropdown, setShowNextDropdown] = useState(false);
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    console.log(
      "Sidebar useEffect - authUser:",
      authUser,
      "isCheckingAuth:",
      isCheckingAuth
    );
    checkAuth(); // Explicitly call checkAuth
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && authUser?._id) {
      console.log("Fetching users and groups for user:", authUser._id);
      getUsers();
      getGroups();
    }
  }, [getUsers, getGroups, authUser, isCheckingAuth]);

  const allChats = [...groups, ...users];

  const filteredUsers = allChats.filter((user) => {
    const onlineFilter = user.isGroup
      ? true
      : showOnlineOnly
      ? onlineUsers.includes(user._id)
      : true;
    const searchFilter = user.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return onlineFilter && searchFilter;
  });

  const handleGroupMemberToggle = (userId) => {
    setSelectedGroupMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName || selectedGroupMembers.length < 2) {
      return alert("Enter a group name and select at least 2 members.");
    }

    createGroup(groupName, selectedGroupMembers);

    setGroupName("");
    setSelectedGroupMembers([]);
    setShowGroupDropdown(false);
    setShowNextDropdown(false);
  };

  if (isCheckingAuth) {
    return (
      <h2 className="text-green-500 font-bold">Checking authentication...</h2>
    );
  }

  if (!authUser) {
    return (
      <h2 className="text-red-500 font-bold">Please log in to view groups</h2>
    );
  }

  if (isUsersLoading || isGroupsLoading) {
    return <h2 className="text-green-500 font-bold">Loading...</h2>;
  }

  return (
    <aside className="h-full w-20 lg:w-84 border-r border-violet-300 flex flex-col transition-all duration-200 ml-5">
      <div className="w-full p-2">
        <div className="flex-col-1 items-center justify-center">
          <div className="flex items-center gap-2">
            <Users size={24} className="text-pink-500" />
            <span className="font-bold text-xl hidden lg:block text-blue-500">
              Contacts
            </span>
            <div className="ml-24 relative">
              <div className="dropdown dropdown-start">
                <div tabIndex={0} role="button" className="btn m-1">
                  <SquarePen size={20} />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-50 w-60 p-5 shadow-sm border border-violet-100"
                >
                  <li className="text-xl">Want to add groups?</li>
                  <button
                    onClick={() => setShowGroupDropdown((prev) => !prev)}
                    className="flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UsersRound size={20} className="text-pink-500 mt-4" />
                    <span className="text-base mt-4">New Group</span>
                  </button>
                </ul>
              </div>

              {showGroupDropdown && (
                <div className="absolute top-full mt-2 z-50 bg-gray-800 border border-violet-200 rounded-lg p-3 max-h-64 overflow-y-auto w-64 shadow-lg">
                  <div className="flex items-center justify-center gap-4">
                    <Users2 />
                    <h3 className="text-lg font-semibold mb-2 text-gray-200">
                      Add Members
                    </h3>
                  </div>
                  <div className="relative group w-full mt-3 mb-4">
                    <Search
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search "
                      className="w-full pl-8 pr-1 py-1.5 bg-transparent text-white 
                         placeholder-zinc-400 rounded-lg outline-none 
                         border-t border-l border-r border-gray-600 
                         border-b-5 border-b-violet-500 "
                    />
                  </div>
                  {users.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center gap-2 mb-1 cursor-pointer text-black"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroupMembers.includes(user._id)}
                        onChange={() => handleGroupMemberToggle(user._id)}
                        className="checkbox checkbox-sm text-black bg-gray-500"
                      />
                      <span className="text-white">{user.fullName}</span>
                    </label>
                  ))}
                  <div className="flex items-center justify-between">
                    <button
                      className="btn btn-sm btn-primary mt-2 w-[50%]"
                      onClick={() => {
                        setShowGroupDropdown(false);
                        setShowNextDropdown(true);
                      }}
                    >
                      Next
                    </button>

                    <button
                      onClick={() => setShowGroupDropdown(false)}
                      className="btn btn-sm btn-error w-[35%] mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {showNextDropdown && (
                <div className="absolute top-full mt-2 z-50 bg-gray-900 border border-violet-300 rounded-lg p-4 w-64 shadow-lg">
                  <div className="flex items-center justify-evenly">
                    <Camera />
                    <p className="text-base font-semibold">Add a group icon</p>
                  </div>

                  <div className="mt-5 ">
                    <h2>Provide a group name</h2>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Group name "
                      className="w-full pl-8 pr-1 py-1.5 bg-transparent text-white 
                         placeholder-zinc-400 rounded-lg outline-none 
                         border-t border-l border-r border-gray-600 
                         border-b-5 border-b-green-500 mt-2"
                    />
                  </div>
                  <div className="flex items-center justify-evenly">
                    <button
                      className="btn btn-sm btn-success mt-4 w-[35%]"
                      onClick={handleCreateGroup}
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowNextDropdown(false)}
                      className="btn btn-sm btn-error mt-4 w-[35%]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm border-2 border-purple-500"
              />
              <span className="text-base">Online Only:-</span>
            </label>
            <span className="text-blue-500 font-semibold">
              ({onlineUsers.length - 1} online)
            </span>
          </div>
        </div>

        <div className="relative group w-full mt-3">
          <Search
            className="absolute left-1.5 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full pl-8 pr-1 py-1.5 bg-transparent text-white 
               placeholder-zinc-400 rounded-lg outline-none 
               border-t border-l border-r border-gray-600 
               border-b-5 border-b-violet-500"
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers?.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-gray-900 transition-colors ${
              selectedUser?._id === user._id
                ? "bg-gray-900 ring ring-gray-700"
                : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || Avatar_image}
                alt={user.fullName}
                className="size-13 object-cover rounded-full"
              />
              {!user.isGroup && onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-bold truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {user.isGroup
                  ? "Group"
                  : onlineUsers.includes(user._id)
                  ? "Online"
                  : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <span className="text-center items-center font-bold text-violet-500 text-lg lg:ml-5">
            No Users or Groups Found
          </span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
