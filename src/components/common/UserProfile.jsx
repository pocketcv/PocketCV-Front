import React, { useEffect, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import { DOWNLOAD_RESUME_ROUTE, GET_USER_INFO, UPDATE_USER_PROFILE } from "@/utils/ApiRoutes";
import Avatar from "./Avatar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  about: Yup.string()
    .trim()
    .max(500, 'About section must be less than 500 characters')
    .nullable(),
  skills: Yup.array()
    .of(
      Yup.string()
        .trim()
        .min(2, 'Each skill must be at least 2 characters')
        .max(30, 'Each skill must be less than 30 characters')
        .matches(/^[a-zA-Z0-9\s\+\#\.]+$/, 'Skills can only contain letters, numbers, spaces, and +#.')
    )
    .min(1, 'At least one skill is required')
    .test('unique-skills', 'Duplicate skills are not allowed', (skills) => {
      if (!skills) return true;
      return new Set(skills).size === skills.length;
    }),
  type: Yup.string()
    .oneOf(['jobseeker', 'business'], 'Invalid account type')
    .required('Account type is required')
});

// Allowed resume file types
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UserProfile({ user, onClose }) {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [resume, setResume] = useState(null);

  const isOwnProfile = userInfo?.id === user?.id;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${GET_USER_INFO}/${user?.id}`);
        if (response.data.success) {
          setProfileData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (user?.id) {
      fetchUserInfo();
    }
  }, [user?.id]);



  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);

      // Trim all string values
      const trimmedValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = value.trim();
        } else if (Array.isArray(value)) {
          acc[key] = value.map(item => typeof item === 'string' ? item.trim() : item);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

      // Validate skills
      if (trimmedValues.skills) {
        const skillErrors = [];
        trimmedValues.skills.forEach((skill, index) => {
          if (skill.length < 2) skillErrors.push(`Skill ${index + 1} is too short`);
          if (skill.length > 30) skillErrors.push(`Skill ${index + 1} is too long`);
          if (!/^[a-zA-Z0-9\s\+\#\.]+$/.test(skill)) {
            skillErrors.push(`Skill ${index + 1} contains invalid characters`);
          }
        });
        if (skillErrors.length > 0) {
          setFieldError('skills', skillErrors.join(', '));
          return;
        }
      }

      // Prepare data object
      const updateData = {
        ...trimmedValues,
        userId: user?.id,
      };

      // Remove any null or undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === null || updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { data } = await axios.post(UPDATE_USER_PROFILE, updateData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (data.success) {
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: data.user,
        });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from the server
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setFieldError(field, message);
        });
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setSubmitting(false);
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
            <Formik
              initialValues={{
                name: profileData?.name || '',
                email: profileData?.email || '',
                phoneNumber: profileData?.phoneNumber || '',
                about: profileData?.about || '',
                skills: profileData?.skills || [],
                type: profileData?.type || 'jobseeker'
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {(formik) => (
                <Form className="space-y-6">
                  {/* Name */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Name</h4>
                    {isEditing ? (
                      <div>
                        <Field
                          type="text"
                          name="name"
                          disabled={true}
                          placeholder="Your name"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800">{profileData?.name}</p>
                    )}
                  </div>

                  {/* User Type */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Account Type
                    </h4>
                    {isEditing ? (
                      <select
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                        disabled
                      >
                        <option value="jobseeker">Job Seeker</option>
                        <option value="business">Business</option>
                      </select>
                    ) : (
                      <p className="text-gray-800 capitalize">
                        {profileData?.type || "Job Seeker"}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Phone Number
                    </h4>
                    {isEditing ? (
                      <Field name="phoneNumber">
                        {({ field, form }) => (
                          <div>
                            <PhoneInput
                              country={'in'}
                              value={field.value}
                              onChange={(phone) => form.setFieldValue('phoneNumber', phone)}
                              inputClass="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                              containerClass="w-full"
                              buttonClass="rounded-l-lg"
                            />
                            <ErrorMessage
                              name="phoneNumber"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        )}
                      </Field>
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
                      <div>
                        <Field
                          as="textarea"
                          name="about"
                          placeholder="Tell us about yourself"
                          rows="3"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none resize-none"
                        />
                        <ErrorMessage
                          name="about"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800">
                        {profileData?.about || "No description provided"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Email</h4>
                    <p className="text-gray-800">{profileData?.email}</p>
                  </div>

                  {/* Skills */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {(isEditing ? formik.values.skills : profileData?.skills)?.map(
                        (skill, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 px-3 py-1 bg-[#1a73e8] text-white rounded-full text-sm"
                          >
                            {skill}
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newSkills = formik.values.skills.filter(s => s !== skill);
                                  formik.setFieldValue('skills', newSkills);
                                }}
                                className="ml-1 hover:text-red-200"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                    {isEditing && (
                      <input
                        type="text"
                        placeholder="Add skill (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            const newSkill = e.target.value.trim();
                            if (!formik.values.skills.includes(newSkill)) {
                              formik.setFieldValue('skills', [...formik.values.skills, newSkill]);
                            }
                            e.target.value = '';
                          }
                        }}
                        className="flex-1 min-w-[150px] p-2 border border-gray-300 rounded-lg focus:border-[#1a73e8] focus:outline-none"
                      />
                    )}
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
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-lg transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
