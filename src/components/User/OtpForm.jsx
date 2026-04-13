// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { verifyOTP } from "../../global_redux/features/auth/authApi";
// import { authSuccess } from "../../global_redux/features/auth/authSlice";
// import toast from "react-hot-toast";

// const OtpForm = ({ onClose, setStep, loginOtpData, isLoginOtp }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleOTP = async (e) => {
//     e.preventDefault();

//     const otp = e.target.otp.value;
//     const email = isLoginOtp && loginOtpData ? loginOtpData.email : localStorage.getItem("email");

//     try {
//       const res = await verifyOTP({ email, otp });
//       dispatch(authSuccess(res.data));
//       localStorage.setItem("token", res.data.token);
//       toast.success(isLoginOtp ? "Login complete" : "Signup complete");

//       // Role-based redirect
//       const role = res.data.user?.role;
//       if (role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/");
//       }

//       onClose && onClose();
//       setStep && setStep("login");
//     } catch {
//       toast.error("Invalid OTP");
//     }
//   };

//   return (
//     <form onSubmit={handleOTP}>
//       <input name="otp" placeholder="Enter OTP" />
//       <button>Verify</button>
//     </form>
//   );
// };

// export default OtpForm;


import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOTP } from "../../global_redux/features/auth/authApi";
import { authSuccess } from "../../global_redux/features/auth/authSlice";
import toast from "react-hot-toast";

const OtpForm = ({ onClose, setStep, loginOtpData, isLoginOtp }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOTP = async (e) => {
    e.preventDefault();

    const otp = e.target.otp.value;
    const email = isLoginOtp && loginOtpData ? loginOtpData.email : localStorage.getItem("email");

    try {
      const res = await verifyOTP({ email, otp });
      dispatch(authSuccess(res.data));
      localStorage.setItem("token", res.data.token);
      toast.success(isLoginOtp ? "Login complete" : "Signup complete");

      const role = res.data.user?.role;
      navigate(role === "admin" ? "/admin" : "/");

      onClose && onClose();
      setStep && setStep("login");
    } catch {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      {/* Icon/Illustration Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fff0f6] rounded-full mb-4">
          <svg className="w-8 h-8 text-[#e80071]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Verify OTP</h2>
        <p className="text-sm text-gray-500 mt-2">
          Sent to <span className="font-semibold text-gray-700">{loginOtpData?.email || "your device"}</span>
        </p>
      </div>

      <form onSubmit={handleOTP} className="space-y-6">
        {/* OTP Input */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">
            Enter 6-Digit Code
          </label>
          <input 
            name="otp" 
            type="text"
            maxLength="6"
            placeholder="0 0 0 0 0 0" 
            required
            className="w-full text-center text-2xl tracking-[0.5em] font-light border-b-2 border-gray-200 focus:outline-none focus:border-[#e80071] transition-all py-2 placeholder:text-gray-200"
          />
        </div>

        {/* Verify Button */}
        <button 
          type="submit"
          className="w-full bg-[#e80071] hover:bg-[#c60061] text-white font-bold py-3 rounded-sm mt-4 transition-all duration-200 shadow-md active:scale-[0.98] uppercase tracking-widest text-xs"
        >
          VERIFY & PROCEED
        </button>

        {/* Resend Options */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            Didn't receive the code?{' '}
            <button 
              type="button"
              className="text-[#e80071] font-bold hover:underline cursor-pointer"
            >
              RESEND OTP
            </button>
          </p>
        </div>

        {/* Back Link */}
        <div 
          onClick={() => setStep(isLoginOtp ? "login" : "signup")}
          className="text-center text-[11px] text-gray-400 cursor-pointer hover:text-gray-600 transition-colors mt-2"
        >
          ← Change Email or Phone
        </div>
      </form>
    </div>
  );
};

export default OtpForm;