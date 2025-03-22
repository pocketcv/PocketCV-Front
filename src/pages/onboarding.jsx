import React, { useEffect } from "react";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import OnboardingStepper from "@/components/Onboarding/OnboardingStepper";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function OnBoarding() {
  const router = useRouter();
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    // Only redirect if there's no user info at all
    if (!userInfo?.email) router.push("/");
  }, [userInfo, router]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <OnboardingStepper />
    </>
  );
}