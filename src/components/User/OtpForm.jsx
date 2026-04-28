
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../global_redux/features/auth/authThunks";
import toast from "react-hot-toast";
import { useRef } from "react";

const OtpForm = () => {
  const dispatch = useDispatch();
  const { otpData, loading } = useSelector((state) => state.auth);

  const inputsRef = useRef([]);

  //  Handle change
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return;

    e.target.value = value;

    // Move to next
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  //  Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  //  Handle paste
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d{6}$/.test(paste)) return;

    paste.split("").forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = char;
      }
    });

    inputsRef.current[5].focus();
  };

  //  Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otp = inputsRef.current.map((input) => input.value).join("");

    console.log("VERIFY DATA:", {
      email: otpData?.email,
      emailOtp: otp,
      phoneOtp: otp,
    });

    const res = await dispatch(
      verifyOtp({
        email: otpData?.email,
        emailOtp: otp,
        phoneOtp: otp,
      })
    );

    if (!res.error) {
      toast.success("Account verified! Please login.");
    } else {
      toast.error(res.payload || "Invalid OTP");
    }
  };

  return (
    <div className="space-y-8 font-['Outfit'] text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Verify OTP
        </h2>
        <p className="text-slate-500 text-sm">
          Enter the 6-digit code sent to <span className="font-semibold text-slate-900">{otpData?.email || "your email"}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* OTP BOXES */}
        <div
          className="flex justify-center gap-3"
          onPaste={handlePaste}
        >
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl font-bold bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
          ))}
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
            <span className="text-pink-600 font-bold cursor-pointer hover:underline">Resend OTP</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default OtpForm;