import React from "react";
import ChatContainer from "@/components/Chat/ChatContainer";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBar from "@/components/Chat/MessageBar";

export default function Chat() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200">
        <ChatHeader />
      </div>
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-white">
        <ChatContainer />
      </div>
      <div className="border-t border-gray-200 bg-white">
        <MessageBar />
      </div>
    </div>
  );
}
