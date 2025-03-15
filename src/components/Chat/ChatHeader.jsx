import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

export default function ChatHeader() {
  const [{ userInfo, currentChatUser, onlineUsers }, dispatch] =
    useStateProvider();

  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX - 50, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Exit",
      callBack: async () => {
        setIsContextMenuVisible(false);
        dispatch({ type: reducerCases.SET_EXIT_CHAT });
      },
    },
  ];

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "audio",
        roomId: Date.now(),
      },
    });
  };

  return (
    <div className="px-6 py-4 flex justify-between items-center bg-white">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar type="sm" image={currentChatUser?.profilePicture} name={currentChatUser?.name} />
          {onlineUsers.includes(currentChatUser?.id) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium">{currentChatUser?.name}</span>
          <span className="text-sm text-gray-500">
            {onlineUsers.includes(currentChatUser?.id) ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleVoiceCall}
          className="p-2 text-gray-600 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5 rounded-full transition-colors"
        >
          <MdCall className="text-xl" />
        </button>
        <button 
          onClick={handleVideoCall}
          className="p-2 text-gray-600 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5 rounded-full transition-colors"
        >
          <IoVideocam className="text-xl" />
        </button>
        <button 
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
          className="p-2 text-gray-600 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5 rounded-full transition-colors"
        >
          <BiSearchAlt2 className="text-xl" />
        </button>
        <button 
          onClick={(e) => showContextMenu(e)}
          id="context-opener"
          className="p-2 text-gray-600 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5 rounded-full transition-colors"
        >
          <BsThreeDotsVertical className="text-xl" />
        </button>
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
    </div>
  );
}
