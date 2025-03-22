import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import EmojiPicker from "emoji-picker-react";
import dynamic from "next/dynamic";
import PhotoPicker from "../common/PhotoPicker";

const CaptureAudio = dynamic(() => import("@/components/common/CaptureAudio"), {
  ssr: false,
});

export default function MessageBar() {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [grabImage, setGrabImage] = useState(false);
  const [{ socket, currentChatUser, userInfo }, dispatch] = useStateProvider();
  const emojiPickerRef = useRef(null);

  console.log(userInfo, currentChatUser,'check here ansh ????');
  
  const photoPickerOnChange = async (e) => {
    const file = e.target.files[0];
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!storedUserInfo?.id) {
        console.error("No user ID found in localStorage");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: storedUserInfo.id,
          to: currentChatUser.id,
        },
      });

      console.log("Image message sent with user ID:", storedUserInfo.id);

      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser.id,
          from: storedUserInfo.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (err) {
      console.error("Error sending image message:", err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!storedUserInfo?.id) {
        console.error("No user ID found in localStorage");
        return;
      }
      
      setMessage("");
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser.id,
        from: storedUserInfo.id,
        message,
      });
      socket.current.emit("send-msg", {
        to: currentChatUser.id,
        from: storedUserInfo.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prevMessage) => (prevMessage += emoji.emoji));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open" && 
          emojiPickerRef.current && 
          !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    setMessage("");
  }, [currentChatUser]);

  useEffect(() => {
    if (grabImage) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = () => {
        setTimeout(() => {
          setGrabImage(false);
        }, 1000);
      };
    }
  }, [grabImage]);

  return (
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      {!showAudioRecorder ? (
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-600 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5 rounded-full transition-colors"
              title="Emoji"
              onClick={handleEmojiModal}
              id="emoji-open"
            >
              <BsEmojiSmile className="text-xl" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4 z-40" ref={emojiPickerRef}>
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick} 
                  theme="light"
                  width={320}
                  height={400} 
                />
              </div>
            )}
            {/* <button
              className="p-2 text-gray-600 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5 rounded-full transition-colors"
              title="Attach file"
              onClick={() => setGrabImage(true)}
            >
              <ImAttachment className="text-xl" />
            </button> */}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            className={`p-2 rounded-full transition-colors ${
              message.trim()
                ? "text-[#1a73e8] hover:bg-[#1a73e8]/5"
                : "text-gray-600 hover:text-[#1a73e8] hover:bg-[#1a73e8]/5"
            }`}
            onClick={message.trim() ? sendMessage : () => setShowAudioRecorder(true)}
            title={message.trim() ? "Send message" : "Record audio"}
          >
            {message.trim() ? (
              <MdSend className="text-xl" />
            ) : (
              <FaMicrophone className="text-xl" />
            )}
          </button>
        </div>
      ) : (
        <CaptureAudio hide={setShowAudioRecorder} />
      )}
      {grabImage && <PhotoPicker onChange={photoPickerOnChange} />}
    </div>
  );
}
