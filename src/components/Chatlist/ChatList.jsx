import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import List from "./List";
import SearchBar from "./SearchBar";
import ContactsList from "./ContactsList";
import { useStateProvider } from "@/context/StateContext";
import Profile from "./Profile";

export default function ChatList() {
  const [pageType, setPageType] = useState("default");
  const [{ contactsPage, profilePage }] = useStateProvider();

  useEffect(() => {
    if (contactsPage) { 
      setPageType("all-contacts");
    } else if (profilePage) {
      setPageType("profile")
    } else {
      setPageType("default");
    }
  }, [contactsPage, profilePage]);

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB] border-r border-gray-200 w-[300px] min-w-[300px]">
      <div className="flex-none">
        <ChatListHeader />
      </div>
      <div className="flex-none px-4 py-2">
        <SearchBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        {pageType === "default" && <List />}
        {pageType === "all-contacts" && <ContactsList />}
        {pageType === "profile" && <Profile />}
      </div>
    </div>
  );
}
