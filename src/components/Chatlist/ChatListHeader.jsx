import React, { useState, useRef, useEffect } from "react";
import { useStateProvider } from "@/context/StateContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import Avatar from "../common/Avatar";
import UserProfile from "../common/UserProfile";

export default function ChatListHeader() {
  const [{ userInfo, userContacts }, dispatch] = useStateProvider();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
    router.push("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div 
            className="cursor-pointer" 
            onClick={() => setShowProfile(true)}
          >
            <Avatar 
              type="sm" 
              image={userInfo?.profileImage || userInfo?.profilePicture} 
              name={userInfo?.name}
            />
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-medium text-gray-900">Business Chat</h2>
            <p className="text-xs text-gray-500">{userContacts?.length || 0} members</p>
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            title="Menu"
          >
            <BsThreeDotsVertical />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <BiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showProfile && (
        <UserProfile 
          user={userInfo} 
          onClose={() => setShowProfile(false)} 
        />
      )}
    </>
  );
}
