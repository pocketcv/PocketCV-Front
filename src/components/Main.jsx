import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import Chat from "@/components/Chat/Chat";
import ChatList from "@/components/Chatlist/ChatList";
import { firebaseAuth } from "../utils/FirebaseConfig";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import Empty from "./Empty";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingCall from "./common/IncomingCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import SearchMessages from "./Chat/SearchMessages";
import BrandingPage from "./BrandingPage/BrandingPage";

export default function Main() {
  const [
    {
      userInfo,
      currentChatUser,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
      messageSearch,
      userContacts,
    },
    dispatch,
  ] = useStateProvider();
  const router = useRouter();
  const socket = useRef();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);

  // Initialize user data from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const parsedUserInfo = JSON.parse(storedUserInfo);
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: parsedUserInfo
      });
    } else {
      setRedirectLogin(true);
    }
  }, []);

  useEffect(() => {
    if (redirectLogin) router.push("/");
  }, [redirectLogin]);

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) {
        setRedirectLogin(true);
        return;
      }
      
      if (!userInfo && currentUser?.email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email: currentUser.email,
        });
        
        if (!data.status) {
          router.push("/");
          return;
        }

        const userData = {
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          profileImage: data.data.profilePicture,
          status: data.data.about,
        };

        localStorage.setItem("userInfo", JSON.stringify(userData));
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: userData,
        });
      }
    });

    return () => unsubscribe();
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
      });

      socket.current.on("mark-read-recieve", ({ id, recieverId }) => {
        dispatch({
          type: reducerCases.SET_MESSAGES_READ,
          id,
          recieverId,
        });
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("voice-call-rejected", () => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: undefined,
        });
        dispatch({
          type: reducerCases.SET_VOICE_CALL,
          voiceCall: undefined,
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("video-call-rejected", () => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: undefined,
        });
        dispatch({
          type: reducerCases.SET_VIDEO_CALL,
          videoCall: undefined,
        });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
      );
      dispatch({ type: reducerCases.SET_MESSAGES, messages });
    };
    if (
      currentChatUser &&
      userContacts.findIndex((contact) => contact.id === currentChatUser.id) !==
        -1
    ) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-[#f8f9fa] to-white">
      {incomingVoiceCall && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <IncomingCall />
        </div>
      )}
      {incomingVideoCall && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <IncomingVideoCall />
        </div>
      )}
      {videoCall && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <VoiceCall />
        </div>
      )}
      {messageSearch && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <SearchMessages />
        </div>
      )}
      <div className="grid grid-cols-main h-full w-full">
        <ChatList />
        {currentChatUser ? <Chat /> : <Empty />}
      </div>
    </div>
  );
}
