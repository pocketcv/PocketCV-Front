import React, { useEffect, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import { DOWNLOAD_RESUME_ROUTE, GET_USER_INFO, UPDATE_USER_PROFILE } from "@/utils/ApiRoutes";
import Avatar from "./Avatar";

export default function UserProfile({ user, onClose }) {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedUser, setEditedUser] = useState({
    ...user,
    type: user.type || "jobseeker",
  });
  const [resume, setResume] = useState(null);

  const isOwnProfile = userInfo?.id === user?.id;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${GET_USER_INFO}/${user?.id}`);
        if (response.data.success) {
          setProfileData(response.data.user);
          setEditedUser((prev) => ({
            ...prev,
            ...response.data.user,
          }));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (user?.id) {
      fetchUserInfo();
    }
  }, [user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(editedUser).forEach((key) => {
        if (key === "skills" && Array.isArray(editedUser[key])) {
          formData.append(key, JSON.stringify(editedUser[key]));
        } else {
          formData.append(key, editedUser[key]);
        }
      });
      if (resume) {
        formData.append("resume", resume);
      }

      const { data } = await axios.post(UPDATE_USER_PROFILE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.status) {
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: data.user,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setEditedUser((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const newSkill = e.target.value.trim();
      if (!editedUser.skills?.includes(newSkill)) {
        setEditedUser((prev) => ({
          ...prev,
          skills: [...(prev.skills || []), newSkill],
        }));
      }
      e.target.value = "";
    }
  };

  const downloadResume = async () => {
    try {
      const payload = {
        userId: userInfo.id
      }

      const response = await axios.post(`${DOWNLOAD_RESUME_ROUTE}`, payload);
      console.log(response);
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data.resume]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'resume.pdf');
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
            <div className="flex gap-2">
              {isOwnProfile && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-[#1a73e8] hover:bg-[#1a73e8]/5 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <Avatar
                type="xl"
                image={
                  profileData?.profilePicture ||
                  user.profilePicture ||
                  user.profileImage
                }
                name={profileData?.name || user.name}
                setImage={
                  isEditing
                    ? (newImage) =>
                        setEditedUser((prev) => ({
                          ...prev,
                          profilePicture: newImage,
                        }))
                    : undefined
                }
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {profileData?.name || user.name}
            </h3>
            <p className="text-gray-600">{profileData?.email || user.email}</p>
          </div>

          <div className="space-y-4">
            {/* User Type */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Account Type
              </h4>
              {isEditing ? (
                <select
                  name="userType"
                  value={editedUser.userType || "jobseeker"}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                >
                  <option value="jobseeker">Job Seeker</option>
                  <option value="business">Business</option>
                </select>
              ) : (
                <p className="text-gray-800 capitalize">
                  {profileData?.userType || "Job Seeker"}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Phone Number
              </h4>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedUser.phoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                />
              ) : (
                <p className="text-gray-800">
                  {profileData?.phoneNumber || "Not provided"}
                </p>
              )}
            </div>

            {/* About */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">About</h4>
              {isEditing ? (
                <textarea
                  name="about"
                  value={editedUser.about || ""}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none resize-none"
                />
              ) : (
                <p className="text-gray-800">
                  {profileData?.about || "No description provided"}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedUser.skills : profileData?.skills)?.map(
                  (skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-[#1a73e8] text-white rounded-full text-sm"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleSkillRemove(skill)}
                          className="ml-1 hover:text-red-200"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                )}
                {isEditing && (
                  <input
                    type="text"
                    placeholder="Add skill (press Enter)"
                    onKeyPress={handleSkillAdd}
                    className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Resume</h4>
              <div>
                {profileData?.resume ? (
                  <p 
                    className="text-[#1a73e8] cursor-pointer hover:underline"
                    onClick={downloadResume}
                  >
                    Download Resume
                  </p>
                ) : (
                  <p className="text-gray-600">No resume uploaded</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
