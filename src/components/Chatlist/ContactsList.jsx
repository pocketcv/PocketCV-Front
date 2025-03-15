import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2, BiUserPlus } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";

function ContactsList() {
  const [{}, dispatch] = useStateProvider();
  const [allContacts, setAllContacts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!filteredData[key].length) {
          delete filteredData[key];
        }
      });
      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
        setSearchContacts(users);
      } catch (err) {
        console.error(err);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiArrowBack className="text-xl" />
          </button>
          <h2 className="text-lg font-medium text-gray-900">New Chat</h2>
        </div>
        <button className="p-2 text-[#6B7DFF] hover:bg-[#6B7DFF]/5 rounded-full transition-colors">
          <BiUserPlus className="text-xl" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <BiSearchAlt2 className="text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search contacts"
            className="w-full bg-[#EEF0F8] text-gray-700 placeholder-gray-500 text-sm py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6B7DFF]/20 transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(searchContacts).map(([initialLetter, userList]) => (
          <div key={Date.now() + initialLetter}>
            <div className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {initialLetter}
            </div>
            {userList.map((contact) => (
              <ChatLIstItem
                data={contact}
                isContactPage={true}
                key={contact.id}
              />
            ))}
          </div>
        ))}

        {/* Empty State */}
        {Object.keys(searchContacts).length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <BiUserPlus className="text-4xl mb-4 text-gray-400" />
            <p className="text-center text-sm">No contacts found</p>
            <p className="text-center text-xs text-gray-400 mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsList;
