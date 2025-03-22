import { useStateProvider } from "@/context/StateContext";
import { UPLOAD_RESUME_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { reducerCases } from "@/context/constants";
import imgCross from '../../../public/close.png';

function Profile() {
    const [{ userInfo }, dispatch] = useStateProvider();
    const [resumeUploading, setResumeUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleResumeUpload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // Only allow PDF files
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file');
                return;
            }

            // Max size 5MB
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
                dispatch({
                    type: reducerCases.SET_USER_INFO,
                    userInfo: {
                        ...userInfo,
                        resume: response.data.url 
                    }
                });
                localStorage.setItem('userInfo', JSON.stringify({
                    ...userInfo,
                    resume: response.data.url
                }));
            }
        } catch (error) {
            console.error('Resume upload failed:', error);
            alert(error.response?.data?.message || 'Failed to upload resume. Please try again.');
        } finally {
            setResumeUploading(false);
        }
    };

    return (
        <div className="bg-white h-full">
            <div className="flex justify-between items-center p-4 border-b">
                <h1 className="text-xl font-semibold">Profile</h1>
                <button onClick={() => dispatch({ type: reducerCases.SET_PROFILE_PAGE })}>
                    <Image src={imgCross} alt="Close" className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-4 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-lg font-medium">Resume</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleResumeUpload}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={resumeUploading}
                            className={`px-4 py-2 rounded-lg text-white ${
                                resumeUploading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-[#1a73e8] hover:bg-[#1557b0]'
                            }`}
                        >
                            {resumeUploading ? 'Uploading...' : userInfo?.resume ? 'Update Resume' : 'Upload Resume'}
                        </button>
                        {userInfo?.resume && (
                            <a 
                                href={userInfo.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1a73e8] hover:underline"
                            >
                                View Resume
                            </a>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">
                        Upload your resume in PDF format (max 5MB)
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;