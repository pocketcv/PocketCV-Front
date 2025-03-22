import React, { useEffect } from "react";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import OnboardingStepper from "@/components/Onboarding/OnboardingStepper";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function OnBoarding() {
  const router = useRouter();
  const [{ userInfo, newUser }] = useStateProvider();

  console.log(userInfo, "onboarding");

  useEffect(() => {
    // Redirect if no user info or if user is not new
    if (!userInfo?.email || !newUser) {
      router.push("/");
    }
  }, [userInfo, newUser, router]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <OnboardingStepper />
    </>
  );
}