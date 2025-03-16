import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

export default function Avatar({ type, image, setImage, name }) {
  const [hover, setHover] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [grabImage, setGrabImage] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map(word => word[0]).join("").toUpperCase();
  };

  const shouldShowInitials = !image || image === "/default_avatar.png" || image === "undefined";
  const initials = shouldShowInitials ? getInitials(name) : "";

  const contextMenuOptions = [
    {
      name: "Take Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setShowCapturePhoto(true);
      },
    },
    {
      name: "Choose from Library",
      callBack: () => {
        setIsContextMenuVisible(false);
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Upload Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setGrabImage(true);
      },
    },
    {
      name: "Remove Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setImage("/default_avatar.png");
      },
    },
  ];

  useEffect(() => {
    if (grabImage) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setGrabImage(false);
      };
    }
  }, [grabImage]);

  useEffect(() => {
    const handleClick = () => {
      if (!isFirstRun) {
        setIsContextMenuVisible(false);
        setIsFirstRun(true);
      } else setIsFirstRun(false);
    };
    if (isContextMenuVisible) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [isContextMenuVisible, isFirstRun]);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  const photoPickerOnChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    }, 100);
  };

  const renderAvatar = (size) => {
    const sizeClasses = {
      sm: "h-10 w-10 text-sm",
      lg: "h-14 w-14 text-lg",
      xl: "h-60 w-60 text-4xl"
    };

    if (shouldShowInitials) {
      return (
        <div className={`flex items-center justify-center bg-[#1E1F24] text-white rounded-full ${sizeClasses[size]}`}>
          {initials}
        </div>
      );
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center bg-gray-100`}>
        <img 
          src={image} 
          alt="avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default_avatar.png";
          }}
          className="h-full w-full object-cover" 
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && renderAvatar("sm")}
        {type === "lg" && renderAvatar("lg")}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 rounded-full flex items-center justify-center flex-col text-center gap-2 ${
                hover ? "visible" : "hidden"
              }`}
              id="context-opener"
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              />
              <span
                className=""
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              >
                Change <br /> Profile <br /> Photo
              </span>
            </div>
            <div className="flex items-center justify-center">
              {renderAvatar("xl")}
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {grabImage && <PhotoPicker onChange={photoPickerOnChange} />}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {showCapturePhoto && (
        <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />
      )}
    </>
  );
}
