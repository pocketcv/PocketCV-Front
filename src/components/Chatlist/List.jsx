import React, { useEffect, useState } from "react";
import ChatLIstItem from "./ChatLIstItem";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import { BiArchiveIn, BiBell, BiGroup, BiUserPlus } from "react-icons/bi";
import { RiInboxArchiveLine } from "react-icons/ri";

export default function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] = useStateProvider();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    try {
      const getContacts = async () => {
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      };
      if (userInfo?.id) {
        getContacts();
      }
    } catch (err) {
      console.error(err);
    }
  }, [userInfo]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleContactsClick = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  };

  const hasContacts = (filteredContacts?.length > 0 || userContacts?.length > 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-2 py-1 gap-1">
        <button
          onClick={() => handleTabChange('all')}
          className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeTab === 'all'
              ? 'bg-[#EEF0F8] text-[#6B7DFF]'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange('unread')}
          className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeTab === 'unread'
              ? 'bg-[#EEF0F8] text-[#6B7DFF]'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Unread
        </button>
      </div>

      <div className={`flex-1 ${hasContacts ? 'overflow-y-auto' : 'flex items-center justify-center'}`}>
        {hasContacts ? (
          <>
            {/* Pinned Section */}
            <div className="px-4 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pinned</h3>
              {(filteredContacts?.length > 0 ? filteredContacts : userContacts)
                .filter(contact => contact.isPinned)
                .map((contact) => (
                  <ChatLIstItem data={contact} key={contact.id} />
                ))}
            </div>

            {/* Recent Section */}
            <div className="px-4 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Recent</h3>
              {(filteredContacts?.length > 0 ? filteredContacts : userContacts)
                .filter(contact => !contact.isPinned)
                .map((contact) => (
                  <ChatLIstItem data={contact} key={contact.id} />
                ))}
            </div>
          </>
        ) : (
          <div className="text-center p-8">
            <BiGroup className="text-4xl mb-4 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-400 mt-1">
              <button 
                onClick={handleContactsClick}
                className="text-[#6B7DFF] hover:underline focus:outline-none"
              >
                Start a new chat
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-2 border-t border-gray-200">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <RiInboxArchiveLine className="text-xl" />
        </button>
        <button 
          onClick={handleContactsClick}
          className="p-2 text-[#6B7DFF] hover:bg-[#6B7DFF]/5 rounded-lg transition-colors"
          title="New chat"
        >
          <BiUserPlus className="text-xl" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <BiBell className="text-xl" />
        </button>
      </div>
    </div>
  );
}
