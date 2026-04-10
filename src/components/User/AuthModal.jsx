import { useState } from "react";
import LoginModal from "../User/LoginModal";
import SignupForm from "../User/SignupForm";
import OtpForm from "../User/OtpForm";

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState("login");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/40">
      <div className="bg-white p-6 rounded w-[400px]">
        <button onClick={onClose} className="float-right">X</button>

        {step === "login" && <LoginModal setStep={setStep} />}
        {step === "signup" && <SignupForm setStep={setStep} />}
        {step === "otp" && <OtpForm setStep={setStep} onClose={onClose} />}
      </div>
    </div>
  );
};

export default AuthModal;