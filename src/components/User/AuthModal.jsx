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