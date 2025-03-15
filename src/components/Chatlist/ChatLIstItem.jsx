import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import { BsPin } from "react-icons/bs";

export default function ChatLIstItem({ data, isContactPage = false }) {
  const [{ userInfo, currentChatUser }, dispatch] = useStateProvider();

  const handleContactClick = () => {
    if (currentChatUser?.id === data?.id) {
      return dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
    }
    if (!isContactPage) {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT_USER,
        user: {
          name: data.name,
          about: data.about,
          profilePicture: data.profilePicture,
          email: data.email,
          id: userInfo.id === data.senderId ? data.recieverId : data.senderId,
        },
      });
    } else {
      dispatch({ type: reducerCases.CHANGE_CURRENT_CHAT_USER, user: data });
      dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
    }
  };

  return (
    <button
      className={`w-full text-left transition-colors ${
        currentChatUser?.id === data.id && !isContactPage
          ? "bg-[#EEF0F8]"
          : "hover:bg-[#F8F9FB]"
      }`}
      onClick={handleContactClick}
    >
      <div className="flex items-center p-3">
        {data?.profilePicture ? (
          <Avatar type="lg" image={data.profilePicture} />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1E1F24] text-white flex items-center justify-center font-medium text-sm">
            {data?.name?.charAt(0)}
          </div>
        )}
        
        <div className="flex-1 min-w-0 ml-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm text-gray-900 truncate pr-2">{data?.name}</h3>
            <div className="flex items-center">
              {data.isPinned && (
                <BsPin className="text-[#6B7DFF] text-sm transform rotate-45" />
              )}
              <span className="text-xs text-gray-400 ml-2">
                {calculateTime(data.createdAt)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center mt-1">
            <p className="text-sm text-gray-500 truncate">
              {isContactPage ? data?.about || "\u00A0" : data.message}
            </p>
            {!isContactPage && data.totalUnreadMessages > 0 && (
              <span className="ml-2 flex-shrink-0 w-5 h-5 bg-[#6B7DFF] text-white text-xs font-medium rounded-full flex items-center justify-center">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
