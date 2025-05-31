import React, { useState } from "react";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import { onRegisterUserRoute, UPLOAD_RESUME_ROUTE } from "@/utils/ApiRoutes";
import { motion } from "framer-motion";
import { FiUpload, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "@/components/common/PhoneInput";

const OnboardingStepper = () => {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: "",
    about: "",
    skills: [],
    resume: null,
    profileImage: userInfo?.profileImage || "/default_avatar.png",
    userType: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !formData.skills.includes(newSkill)) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
        }));
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const steps = [
    {
      title: "Welcome to PocketCV",
      description: "Choose your role",
      icon: "👋",
    },
    {
      title: "Profile Information",
      description: "Your Profile Details",
      icon: "👤",
    },
    {
      title: "Resume",
      description: "Upload your resume",
      icon: "📄",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }

      // Just store the file in state without uploading
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.userType !== "";
      case 1:
        return (
          formData.name !== "" &&
          formData.email !== "" &&
          formData.phone?.length === 10
        );
      case 2:
        return true; // Resume is optional
      default:
        return false;
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (formData.userType === "") {
          toast.error("Please select your role");
          return false;
        }
        return true;
      case 1:
        if (!formData.name || !formData.email) {
          toast.error("Name and email are required");
          return false;
        }
        if (!formData.phone || formData.phone.length !== 10) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
        return true;
      case 2:
        return true; // Resume is optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      // Process skills into an array
      const processedSkills = formData.skills;

      const userData = {
        email: formData.email,
        name: formData.name,
        about: formData.about,
        phoneNumber: formData.phone,
        userType: formData.userType,
        profilePicture: formData.profileImage,
        skills: processedSkills,
      };

      const response = await axios.post(onRegisterUserRoute, userData);

      if (response.data.success) {
        const userId = response.data.user.id;

        // Update user info in context
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: response.data.user,
        });

        // Save to localStorage
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));

        // If resume exists, upload it and then redirect
        if (formData.resume) {
          const resumeFormData = new FormData();
          resumeFormData.append("resume", formData.resume);
          resumeFormData.append("userId", userId);

          try {
            const resumeResponse = await axios.post(
              UPLOAD_RESUME_ROUTE,
              resumeFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("Resume response:", resumeResponse);
            toast.success(resumeResponse.data.message);
          } catch (error) {
            console.error("Resume upload error:", error);
            toast.error("Resume upload failed, but registration successful");
          }
        } else {
          toast.success("Registration successful!");
        }

        // Redirect to /app in both cases
        router.push("/app");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8 p-8 max-w-2xl mx-auto"
          >
            <div className="text-center space-y-4">
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-3xl md:text-4xl font-bold text-primary-strong mb-2"
              >
                Welcome to PocketCV
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-secondary mb-6"
              >
                Your gateway to professional success
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-md"
            >
              <h3 className="text-xl text-primary-strong font-medium mb-6 text-center">
                Looking for?
              </h3>
              <div className="flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, userType: "jobseeker" }));
                    setCurrentStep(1);
                  }}
                  className={`w-full p-4 rounded-xl text-left relative overflow-hidden group
                                        ${
                                          formData.userType === "jobseeker"
                                            ? "bg-blue-600 text-white"
                                            : "bg-white hover:bg-blue-50 text-gray-800"
                                        } 
                                        border-2 border-blue-200 hover:border-blue-300 transition-all duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">👔</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Job Seeker</h4>
                      <p
                        className={`text-sm ${
                          formData.userType === "jobseeker"
                            ? "text-blue-100"
                            : "text-gray-600"
                        }`}
                      >
                        Find your dream job and showcase your skills
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, userType: "business" }));
                    setCurrentStep(1);
                  }}
                  className={`w-full p-4 rounded-xl text-left relative overflow-hidden group
                                        ${
                                          formData.userType === "business"
                                            ? "bg-green-600 text-white"
                                            : "bg-white hover:bg-green-50 text-gray-800"
                                        } 
                                        border-2 border-green-200 hover:border-green-300 transition-all duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">💼</span>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Business</h4>
                      <p
                        className={`text-sm ${
                          formData.userType === "business"
                            ? "text-green-100"
                            : "text-gray-600"
                        }`}
                      >
                        Find talented professionals for your company
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-input-background border border-secondary/20 text-primary-strong placeholder-secondary/70 focus:ring-2 focus:ring-icon-green focus:border-icon-green transition-all duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg bg-input-background border border-secondary/20 text-primary-strong"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }));
                  }}
                  required
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
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Skills
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 min-h-[42px] p-2 rounded-lg bg-input-background border border-secondary/20">
                    {formData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-[#1a73e8] text-white rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-200 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillInputKeyDown}
                      className="flex-1 min-w-[120px] bg-transparent text-primary-strong placeholder-secondary/70 focus:outline-none"
                      placeholder={formData.skills.length === 0 ? "Type a skill and press Enter" : "Add another skill"}
                    />
                  </div>
                  <p className="text-xs text-secondary">
                    Press Enter or use comma to add a skill
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
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
                      <span className="font-medium">
                        {formData.resume.name}
                      </span>
                    </motion.div>
                  ) : (
                    <>
                      <FiUpload className="w-12 h-12 mx-auto mb-4 text-icon-green" />
                      <p className="text-lg font-medium text-primary-strong">
                        Upload your resume (PDF)
                      </p>
                      <p className="text-sm text-secondary">
                        Maximum file size: 5MB
                      </p>
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
                  {formData.resume ? "Change File" : "Select File"}
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-conversation-panel-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-strong mb-4">
            {steps[currentStep].icon} {steps[currentStep].title}
          </h1>
          <p className="text-lg text-secondary">
            {steps[currentStep].description}
          </p>
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
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      index <= currentStep
                        ? "border-icon-green bg-icon-green text-primary-strong shadow-lg shadow-[rgba(0,168,132,0.2)]"
                        : "border-secondary bg-panel-header-background text-secondary"
                    }`}
                  >
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
                    <div
                      className={`h-0.5 transition-all duration-300 ${
                        index < currentStep ? "bg-icon-green" : "bg-secondary"
                      }`}
                    />
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
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
              currentStep === 0
                ? "text-secondary cursor-not-allowed"
                : "text-primary-strong hover:bg-input-background"
            }`}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 shadow-lg ${isStepValid() 
              ? 'text-primary-strong bg-icon-green hover:bg-icon-green/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-icon-green' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
