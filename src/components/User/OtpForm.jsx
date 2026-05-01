
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, registerUser } from "../../global_redux/features/auth/authThunks";
import toast from "react-hot-toast";
import { useRef } from "react";

const OtpForm = () => {
  const dispatch = useDispatch();
  const { otpData, loading } = useSelector((state) => state.auth);

  const emailInputsRef = useRef([]);
  const phoneInputsRef = useRef([]);

  // Handle change
  const handleChange = (e, index, type) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    e.target.value = value;

    const refs = type === "email" ? emailInputsRef.current : phoneInputsRef.current;
    if (value && index < 5) {
      refs[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index, type) => {
    const refs = type === "email" ? emailInputsRef.current : phoneInputsRef.current;
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      refs[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e, type) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(paste)) return;
    
    const refs = type === "email" ? emailInputsRef.current : phoneInputsRef.current;
    paste.split("").forEach((char, i) => {
      if (refs[i]) {
        refs[i].value = char;
      }
    });
    refs[5].focus();
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailOtpValue = emailInputsRef.current.map((input) => input?.value || "").join("");
    const phoneOtpValue = phoneInputsRef.current.map((input) => input?.value || "").join("");

    if (emailOtpValue.length < 6 || phoneOtpValue.length < 6) {
      toast.error("Please enter both complete 6-digit OTPs.");
      return;
    }

    console.log("VERIFY DATA:", {
      email: otpData?.email,
      emailOtp: emailOtpValue,
      phoneOtp: phoneOtpValue,
    });

    const res = await dispatch(
      verifyOtp({
        email: otpData?.email,
        emailOtp: emailOtpValue,
        phoneOtp: phoneOtpValue,
      })
    );

    if (!res.error) {
      toast.success("Account verified! Please login.");
    } else {
      toast.error(res.payload || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (!otpData) return;
    const userData = {
      username: otpData.username,
      email: otpData.email,
      phone: otpData.phone,
      password: otpData.password,
    };
    const res = await dispatch(registerUser(userData));
    if (!res.error) {
      toast.success(`Resent Email OTP: ${res.payload?.emailOtp}`);
      setTimeout(() => {
        toast.success(`Resent Phone OTP: ${res.payload?.phoneOtp}`);
      }, 1000);
      
      // Clear inputs
      emailInputsRef.current.forEach(input => { if (input) input.value = ''; });
      phoneInputsRef.current.forEach(input => { if (input) input.value = ''; });
    } else {
      toast.error(res.payload || "Failed to resend OTP");
    }
  };

  return (
    <div className="space-y-6 font-['Outfit'] text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Verify OTP
        </h2>
        <p className="text-slate-500 text-sm">
          Enter the 6-digit codes sent to your email and phone
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* EMAIL OTP BOXES */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left block w-full ml-1">Email OTP</label>
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={(e) => handlePaste(e, "email")}
          >
            {[...Array(6)].map((_, index) => (
              <input
                key={`email-${index}`}
                type="text"
                maxLength="1"
                ref={(el) => (emailInputsRef.current[index] = el)}
                onChange={(e) => handleChange(e, index, "email")}
                onKeyDown={(e) => handleKeyDown(e, index, "email")}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              />
            ))}
          </div>
        </div>

        {/* PHONE OTP BOXES */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left block w-full ml-1">Phone OTP</label>
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={(e) => handlePaste(e, "phone")}
          >
            {[...Array(6)].map((_, index) => (
              <input
                key={`phone-${index}`}
                type="text"
                maxLength="1"
                ref={(el) => (phoneInputsRef.current[index] = el)}
                onChange={(e) => handleChange(e, index, "phone")}
                onKeyDown={(e) => handleKeyDown(e, index, "phone")}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Verifying...
              </span>
            ) : "VERIFY CODE"}
          </button>
          
          <p className="text-sm text-slate-500">
            Didn't receive the code?{" "}
            <span onClick={handleResend} className="text-pink-600 font-bold cursor-pointer hover:underline">Resend OTP</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default OtpForm;