import React, { useState } from "react";
import Image from "next/image";
import RegistrationInput from "@/components/common/RegistrationInput";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CHECK_USER_ROUTE, onRegisterUserRoute } from "@/utils/ApiRoutes";
import axios from "axios";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters')
    .required('First Name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters')
    .required('Last Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .required('Phone Number is required')
    .min(10, 'Phone number is too short')
    .max(20, 'Phone number is too long'),
});

export default function Register() {
  // Job / Business
  const [lookingFor, setLookingFor] = useState("job");
  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const router = useRouter()

  const checkUser = async (email) => {
    const { data } = await axios.post(CHECK_USER_ROUTE, {
      email,
    });

    console.log(data,'data  ansh ????');
    

    // if (!data.status) {
    //   dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
    //   dispatch({
    //     type: reducerCases.SET_USER_INFO,
    //     userInfo: {
    //       name,
    //       email,
    //       profileImage,
    //       status: "Available",
    //     },
    //   });
    //   router.push("/onboarding");
    // } else {
      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          profileImage: data.data.profilePicture,
          status: data.data.about,
        },
      });

      localStorage.setItem("userInfo", JSON.stringify(data.data.email))
      router.push("/");
    // }
  }

  return (
    <div className="flex justify-between">
      {/* Logo and Logo Title */}
      <div className="bg-green-200 shadow-lg shadow-green-500 w-1/2 h-[100vh] flex items-center justify-center">
        <div>
          <Image
            src="/chatbot.png"
            alt="whatsapp-gif"
            height={300}
            width={300}
          />
          <h1 className="text-left mt-5 text-3xl ml-4">
            Be a part of the <br />
            <span className="text-green-500 font-semibold">Group</span>
          </h1>
        </div>
      </div>

      {/* Register Form */}
      <div className="w-1/2 mt-8 flex items-center justify-center">
        <div>
          <h1 className="text-center text-2xl">
            Register <span className="text-green-600">Now !</span>
          </h1>
          <div className="px-20 pt-5">
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  setSubmitting(true);
                  // Handle form submission
                  const formData = {
                    name: `${values.firstName} ${values.lastName}`,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    userType: lookingFor
                  };

                  const { data } = await axios.post(onRegisterUserRoute, formData);

                  if (data.success) {
                    toast.success('Registration successful!');
                    await checkUser(values.email);
                  } else {
                    toast.error(data.message || 'Registration failed');
                  }
                } catch (error) {
                  console.error('Registration error:', error);
                  toast.error(error.response?.data?.message || 'Registration failed');
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {() => (
                <Form>
                  <div className="flex w-full">
                    <div className="w-full mr-5">
                      <Field
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        component={RegistrationInput}
                      />
                    </div>
                    <div className="w-full">
                      <Field
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        component={RegistrationInput}
                      />
                    </div>
                  </div>

                  <Field
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    component={RegistrationInput}
                  />

                  <div className="mb-4">
                    <Field name="phoneNumber">
                      {({ field, form }) => (
                        <div>
                          <PhoneInput
                            country={'in'}
                            value={field.value}
                            onChange={(phone) => form.setFieldValue('phoneNumber', phone)}
                            inputClass="w-full p-2 border rounded-lg focus:border-green-500 outline-none"
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
                  </div>

                  {/* Skill column */}
                  <label className="text-xs text-gray-500 -top-2 mt-2 bg-white px-1">
                    Explain us about yourself
                  </label>
                  <div className="flex text-sm">
                    <div
                      className={`${
                        lookingFor === "business"
                          ? "border border-green-400"
                          : ""
                      } w-28 text-center rounded-md py-1 cursor-pointer mr-2 ${
                        lookingFor === "job" ? "bg-green-500 text-white" : ""
                      }`}
                      onClick={() => setLookingFor("job")}
                    >
                      Job Seaker
                    </div>
                    <div
                      className={`${
                        lookingFor === "job" ? "border border-green-400" : ""
                      } w-28 text-center rounded-md py-1 cursor-pointer mr-2 ${
                        lookingFor === "business"
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                      onClick={() => setLookingFor("business")}
                    >
                      Business
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="float-right mt-5 bg-green-500 text-white px-4 py-2 rounded outline-none"
                  >
                    Register
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
