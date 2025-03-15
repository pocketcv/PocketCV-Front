import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { calculateTime } from "@/utils/CalculateTime";
import { BsCheckAll, BsCheckLg } from "react-icons/bs";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

const VoiceMessage = dynamic(() => import("@/components/Chat/VoiceMessage"), {
  ssr: false,
});

export default function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const lastMessage = container?.lastElementChild?.lastElementChild?.lastElementChild?.lastElementChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto px-6 py-4" ref={containerRef}>
      <div className="flex flex-col space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.senderId === currentChatUser.id ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] ${
                message.senderId === currentChatUser.id ? "items-start" : "items-end"
              }`}
            >
              {message.type === "text" && (
                <div
                  className={`rounded-2xl px-4 py-2 shadow-sm ${
                    message.senderId === currentChatUser.id
                      ? "bg-gray-100 text-gray-800"
                      : "bg-[#1a73e8] text-white"
                  }`}
                >
                  <p className="text-[15px] break-words leading-tight mb-1">
                    {message.message}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[11px] opacity-70">
                      {calculateTime(message.createdAt)}
                    </span>
                    {message.senderId === userInfo.id && (
                      <span className="ml-1">
                        <MessageStatus messageStatus={message.messageStatus} />
                      </span>
                    )}
                  </div>
                </div>
              )}
              {message.type === "image" && (
                <div className={`rounded-lg overflow-hidden shadow-sm ${
                  message.senderId === currentChatUser.id
                    ? "bg-gray-100"
                    : "bg-[#1a73e8]"
                }`}>
                  <ImageMessage message={message} />
                </div>
              )}
              {message.type === "audio" && (
                <div className={`rounded-lg shadow-sm ${
                  message.senderId === currentChatUser.id
                    ? "bg-gray-100"
                    : "bg-[#1a73e8]"
                }`}>
                  <VoiceMessage message={message} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
