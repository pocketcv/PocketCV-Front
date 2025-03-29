import React from "react";
import { BiMessageDetail } from "react-icons/bi";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function Empty() {
  const [{userInfo}, dispatch] = useStateProvider();

  console.log(userInfo , 'logged in user information');

  const handleStartChat = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F9FB]">
      <div className="flex flex-col items-center max-w-md text-center px-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#6B7DFF]/10 mb-6">
          <BiMessageDetail className="text-3xl text-[#6B7DFF]" />
        </div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Start a conversation</h2>
        <p className="text-gray-500 mb-8">
          Connect with your team through instant messaging. Start a new chat to begin sharing ideas and collaborating.
        </p>
        <button
          onClick={handleStartChat}
          className="px-6 py-2.5 bg-[#6B7DFF] text-white rounded-lg hover:bg-[#6B7DFF]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B7DFF]/20"
        >
          New Chat
        </button>
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400">
          Your messages are end-to-end encrypted
        </p>
      </div>
    </div>
  );
}

export default Empty;
