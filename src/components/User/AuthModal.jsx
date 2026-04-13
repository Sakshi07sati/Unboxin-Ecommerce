import { useState } from "react";

import LoginModal from "../User/LoginModal";
import SignupForm from "../User/SignupForm";
import OtpForm from "../User/OtpForm";
import React from "react";

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("login");
  const [loginOtpData, setLoginOtpData] = useState(null); // for login OTP

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40">
      <div className="bg-white p-6 rounded w-[400px]">
        <button onClick={onClose} className="float-right">X</button>

        {step === "login" && <LoginModal setStep={setStep} setLoginOtpData={setLoginOtpData} />}
        {step === "signup" && <SignupForm setStep={setStep} />}
        {step === "otp" && <OtpForm setStep={setStep} onClose={onClose} />}
        {step === "login-otp" && loginOtpData && (
          <OtpForm setStep={setStep} onClose={onClose} loginOtpData={loginOtpData} isLoginOtp />
        )}
      </div>
    </div>
  );
};

export default AuthModal;