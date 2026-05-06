import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStep, setOtpData } from '../../global_redux/features/auth/authSlice';
import { verifyForgotPasswordOtp } from '../../global_redux/features/auth/authThunks';
import toast from 'react-hot-toast';

const ForgotOtpVerify = () => {
  const dispatch = useDispatch();
  const { otpData, loading } = useSelector((state) => state.auth);
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
// ... existing code ...
  };

  const handleKeyDown = (e, index) => {
// ... existing code ...
  };

  const handlePaste = (e) => {
// ... existing code ...
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = inputsRef.current.map((input) => input?.value || "").join("");

    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    const res = await dispatch(verifyForgotPasswordOtp({ 
      phone: otpData?.phone, 
      otp: otpValue 
    }));

    if (!res.error) {
      toast.success("OTP verified!");
      // Step update is handled in authSlice fulfilled case
    } else {
      toast.error(res.payload || "Invalid OTP");
    }
  };

  return (
    <div className="space-y-6 font-['Outfit'] text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Verify OTP
        </h2>
        <p className="text-slate-500 text-sm">
          Enter the 6-digit code sent to {otpData?.phone || "your mobile"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-left block w-full ml-1">OTP Code</label>
          <div
            className="flex justify-center gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {[...Array(6)].map((_, index) => (
              <input
                key={`otp-${index}`}
                type="text"
                maxLength="1"
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
              />
            ))}
          </div>
        </div>

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
          ) : "VERIFY & PROCEED"}
        </button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => dispatch(setStep('forgot-password'))}
            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Change Mobile Number
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotOtpVerify;
