import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";

export default function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider();

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <BiSearchAlt2 className="text-lg" />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#EEF0F8] text-gray-700 placeholder-gray-500 text-sm py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6B7DFF]/20 focus:bg-[#EEF0F8]/80 transition-colors"
          value={contactSearch}
          onChange={(e) =>
            dispatch({
              type: reducerCases.SET_CONTACT_SEARCH,
              contactSearch: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
