import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import axios from 'axios';
import { onBoardUserRoute, UPLOAD_RESUME_ROUTE } from '@/utils/ApiRoutes';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck } from 'react-icons/fi';

const OnboardingStepper = () => {
    const router = useRouter();
    const [{ userInfo }, dispatch] = useStateProvider();
    const [currentStep, setCurrentStep] = useState(0);
    
    const [formData, setFormData] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        phone: '',
        about: '',
        resume: null,
        profileImage: userInfo?.profileImage || '/default_avatar.png'
    });

    const steps = [
        {
            title: 'Profile Information',
            description: 'Your Profile Details',
            icon: '👋'
        },
        {
            title: 'Resume',
            description: 'Upload your resume',
            icon: '📄'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleResumeUpload = async (e) => {
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

        setFormData(prev => ({
            ...prev,
            resume: file
        }));
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('about', formData.about);
            formDataToSend.append('phone', formData.phone);
            formDataToSend.append('image', formData.profileImage);

            const { data: userData } = await axios.post(onBoardUserRoute, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (userData.status) {
                if (formData.resume) {
                    const resumeFormData = new FormData();
                    resumeFormData.append('file', formData.resume);
                    resumeFormData.append('userId', userData.user.id);

                    await axios.post(UPLOAD_RESUME_ROUTE, resumeFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }

                const updatedUserInfo = {
                    ...userData.user,
                    profileImage: formData.profileImage
                };

                dispatch({
                    type: reducerCases.SET_USER_INFO,
                    userInfo: updatedUserInfo
                });

                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                router.push('/app');
            }
        } catch (error) {
            console.error('Error during onboarding:', error);
            alert('Failed to complete onboarding. Please try again.');
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen bg-conversation-panel-background py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary-strong mb-4">
                        {steps[currentStep].icon} {steps[currentStep].title}
                    </h1>
                    <p className="text-lg text-secondary">{steps[currentStep].description}</p>
                </div>

                {/* Stepper Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <motion.div 
                                    className="flex items-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                        index <= currentStep 
                                            ? 'border-icon-green bg-icon-green text-primary-strong shadow-lg shadow-[rgba(0,168,132,0.2)]' 
                                            : 'border-secondary bg-panel-header-background text-secondary'
                                    }`}>
                                        {index <= currentStep ? (
                                            <FiCheck className="w-6 h-6" />
                                        ) : (
                                            <span className="text-lg font-semibold">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-semibold text-primary-strong">
                                            {step.title}
                                        </div>
                                    </div>
                                </motion.div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 mx-4">
                                        <div className={`h-0.5 transition-all duration-300 ${
                                            index < currentStep ? 'bg-icon-green' : 'bg-secondary'
                                        }`} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <motion.div 
                    className="bg-panel-header-background rounded-2xl shadow-xl p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {currentStep === 0 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-secondary/20 text-primary-strong placeholder-secondary/70 focus:ring-2 focus:ring-icon-green focus:border-icon-green transition-all duration-200"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-secondary/20 text-primary-strong"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-secondary/20 text-primary-strong placeholder-secondary/70 focus:ring-2 focus:ring-icon-green focus:border-icon-green transition-all duration-200"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        About
                                    </label>
                                    <input
                                        type="text"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg bg-input-background border border-secondary/20 text-primary-strong placeholder-secondary/70 focus:ring-2 focus:ring-icon-green focus:border-icon-green transition-all duration-200"
                                        placeholder="Tell us about yourself"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-secondary/30 rounded-2xl p-12 transition-all duration-200 hover:border-icon-green hover:bg-input-background">
                                <div className="space-y-4 text-center">
                                    <div className="text-secondary">
                                        {formData.resume ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center space-x-2 text-icon-green"
                                            >
                                                <FiCheck className="w-5 h-5" />
                                                <span className="font-medium">{formData.resume.name}</span>
                                            </motion.div>
                                        ) : (
                                            <>
                                                <FiUpload className="w-12 h-12 mx-auto mb-4 text-icon-green" />
                                                <p className="text-lg font-medium text-primary-strong">Upload your resume (PDF)</p>
                                                <p className="text-sm text-secondary">Maximum file size: 5MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="resume"
                                        accept=".pdf"
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="resume"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-strong bg-icon-green hover:bg-icon-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-icon-green transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
                                    >
                                        {formData.resume ? 'Change File' : 'Select File'}
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={prevStep}
                        className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                            currentStep === 0
                                ? 'text-secondary cursor-not-allowed'
                                : 'text-primary-strong hover:bg-input-background'
                        }`}
                        disabled={currentStep === 0}
                    >
                        Back
                    </button>
                    <button
                        onClick={nextStep}
                        className="px-6 py-3 text-base font-medium rounded-lg text-primary-strong bg-icon-green hover:bg-icon-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-icon-green transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingStepper;
