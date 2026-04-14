// import { useState } from "react";

// import LoginModal from "../User/LoginModal";
// import SignupForm from "../User/SignupForm";
// import OtpForm from "../User/OtpForm";
// import React from "react";

// const AuthModal = ({ isOpen, onClose }) => {
//   const [step, setStep] = useState("login");
//   const [loginOtpData, setLoginOtpData] = useState(null); // for login OTP

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-black/40">
//       <div className="bg-white p-6 rounded w-[400px]">
//         <button onClick={onClose} className="float-right">X</button>

//         {step === "login" && (
//           <LoginModal 
//             setStep={setStep} 
//             setLoginOtpData={setLoginOtpData} 
//           />
//         )}

//       {step === "signup" && (
//   <SignupForm 
//     setStep={setStep} 
//     setLoginOtpData={setLoginOtpData} 
//   />
// )}
//          {step === "otp" && (
//           <OtpForm 
//             setStep={setStep} 
//             onClose={onClose} 
//             loginOtpData={loginOtpData} // ✅ IMPORTANT
//           />
//         )}
//           {step === "login-otp" && loginOtpData && (
//           <OtpForm 
//             setStep={setStep} 
//             onClose={onClose} 
//             loginOtpData={loginOtpData} 
//             isLoginOtp 
//           />
//         )}

//       </div>
//     </div>
//   );
// };

// export default AuthModal;

import { useSelector, useDispatch } from "react-redux";
import { setStep } from "../../global_redux/features/auth/authSlice";
import LoginModal from "../User/LoginModal";
import SignupForm from "../User/SignupForm";
import OtpForm from "../User/OtpForm";

const AuthModal = ({ isOpen, onClose }) => {
  const { step } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setStep("login"));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
  <div className="bg-white w-[400px] rounded-lg shadow-lg p-8 relative">

    {/* Close Button */}
    <button
      onClick={handleClose}
      className="absolute top-4 right-4 text-gray-500 hover:text-black"
    >
      ✕
    </button>

    {step === "login" && <LoginModal onClose={onClose} />}
    {step === "signup" && <SignupForm />}
    {step === "otp" && <OtpForm />}
    
  </div>
</div>
  );
};

export default AuthModal;