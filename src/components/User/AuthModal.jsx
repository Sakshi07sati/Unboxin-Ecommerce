import { useSelector, useDispatch } from "react-redux";
import { setStep, toggleModal } from "../../global_redux/features/auth/authSlice";
import LoginModal from "../User/LoginModal";
import SignupForm from "../User/SignupForm";
import OtpForm from "../User/OtpForm";
import ForgotPassword from "../User/ForgotPassword";
import ForgotOtpVerify from "../User/ForgotOtpVerify";
import ResetPassword from "../User/ResetPassword";

const AuthModal = () => {
  const { step, isModalOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!isModalOpen) return null;

  const handleClose = () => {
    dispatch(setStep("login"));
    dispatch(toggleModal(false));
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl p-10 relative border border-gray-100 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="mt-2">
          {step === "login" && <LoginModal onClose={handleClose} />}
          {step === "signup" && <SignupForm />}
          {step === "otp" && <OtpForm />}
          {step === "forgot-password" && <ForgotPassword />}
          {step === "forgot-otp" && <ForgotOtpVerify />}
          {step === "reset-password" && <ResetPassword />}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;