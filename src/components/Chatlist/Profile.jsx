import { useStateProvider } from "@/context/StateContext";
import { UPLOAD_RESUME_ROUTE, GET_USER_INFO } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { reducerCases } from "@/context/constants";
import imgCross from '../../../public/close.png';

function Profile() {
    const [{ userInfo }, dispatch] = useStateProvider();
    const [resumeUploading, setResumeUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const fileInputRef = useRef(null);
    
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${GET_USER_INFO}/${userInfo.id}`);
                if (response.data.success) {
                    setProfileData(response.data.user);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                setLoading(false);
            }
        };

        if (userInfo?.id) {
            fetchUserInfo();
        }
    }, [userInfo?.id]);

    const handleResumeUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            setResumeUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userInfo.id);

            const response = await axios.post(UPLOAD_RESUME_ROUTE, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const updatedUserInfo = {
                    ...userInfo,
                    resume: response.data.url
                };
                dispatch({
                    type: reducerCases.SET_USER_INFO,
                    userInfo: updatedUserInfo
                });
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            }
        } catch (error) {
            console.error("Error uploading resume:", error);
            alert('Failed to upload resume');
        } finally {
            setResumeUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-panel-header-background">
                <div className="text-primary-strong">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-panel-header-background h-screen text-primary-strong overflow-auto">
            <div className="flex items-center justify-between px-4 py-3 bg-panel-header-background">
                <div className="text-xl font-bold">Profile</div>
                <Image src={imgCross} alt="Close" className="w-6 h-6 cursor-pointer" />
            </div>

            <div className="p-4 space-y-6">
                {/* Profile Picture and Name */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                        <img 
                            src={profileData?.profilePicture} 
                            alt={profileData?.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold">{profileData?.name}</h2>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-secondary">Email</label>
                        <div className="text-primary-strong">{profileData?.email}</div>
                    </div>

                    <div>
                        <label className="text-sm text-secondary">Phone Number</label>
                        <div className="text-primary-strong">{profileData?.phoneNumber || "Not provided"}</div>
                    </div>

                    <div>
                        <label className="text-sm text-secondary">About</label>
                        <div className="text-primary-strong">{profileData?.about || "Not provided"}</div>
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="text-sm text-secondary">Skills</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {profileData?.skills?.map((skill, index) => (
                                <div
                                    key={index}
                                    className="px-3 py-1 bg-[#1a73e8] text-white rounded-full text-sm"
                                >
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resume */}
                    <div>
                        <label className="text-sm text-secondary">Resume</label>
                        <div className="mt-2 space-y-2">
                            {profileData?.resume ? (
                                <div className="flex items-center justify-between">
                                    <a 
                                        href={profileData.resume} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[#1a73e8] hover:underline"
                                    >
                                        View Resume
                                    </a>
                                </div>
                            ) : (
                                <div className="text-secondary">No resume uploaded</div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleResumeUpload}
                                accept=".pdf"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={resumeUploading}
                                className="px-4 py-2 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] transition-colors w-full"
                            >
                                {resumeUploading ? "Uploading..." : "Upload New Resume"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;