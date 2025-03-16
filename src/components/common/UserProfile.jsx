import React, { useState } from 'react';
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from 'axios';
import { UPDATE_USER_PROFILE } from '@/utils/ApiRoutes';
import Avatar from './Avatar';

export default function UserProfile({ user, onClose }) {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    type: user.type || "Job Seeker"
  });
  const [resume, setResume] = useState(null);

  const isOwnProfile = userInfo?.id === user?.id;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(editedUser).forEach(key => {
        formData.append(key, editedUser[key]);
      });
      if (resume) {
        formData.append('resume', resume);
      }

      const { data } = await axios.post(UPDATE_USER_PROFILE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.status) {
        dispatch({ 
          type: reducerCases.SET_USER_INFO, 
          userInfo: data.user 
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            <div className="mb-4">
              <Avatar 
                type="xl" 
                image={user.profilePicture || user.profileImage} 
                name={user.name}
                setImage={isEditing ? (newImage) => setEditedUser(prev => ({ ...prev, profilePicture: newImage })) : undefined}
              />
            </div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="text-xl font-semibold text-gray-800 text-center border-b border-gray-300 focus:border-[#1a73e8] focus:outline-none px-2 py-1"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            )}
            <p className="text-gray-600">{user.email}</p>
          </div>

          <div className="space-y-4">
            {isOwnProfile && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Account Type</h4>
                {isEditing ? (
                  <select
                    name="type"
                    value={editedUser.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                  >
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Business">Business</option>
                  </select>
                ) : (
                  <p className="text-gray-800">{editedUser.type}</p>
                )}
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
              {isEditing ? (
                <input
                  type="text"
                  name="status"
                  value={editedUser.status || ''}
                  onChange={handleInputChange}
                  placeholder="Set your status"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                />
              ) : (
                <p className="text-gray-800">{user.status || "No status set"}</p>
              )}
            </div>

            {isOwnProfile && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Resume</h4>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#1a73e8]/10 file:text-[#1a73e8]
                        hover:file:bg-[#1a73e8]/20"
                    />
                    {resume && (
                      <p className="text-sm text-gray-600">Selected: {resume.name}</p>
                    )}
                    {user.resume && !resume && (
                      <p className="text-sm text-gray-600">Current: {user.resume}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {user.resume ? (
                      <>
                        <p className="text-gray-800">Resume uploaded</p>
                        <a 
                          href={user.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#1a73e8] hover:underline"
                        >
                          View
                        </a>
                      </>
                    ) : (
                      <p className="text-gray-800">No resume uploaded</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isEditing && (
              <div className="flex justify-end gap-2 pt-4">
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
