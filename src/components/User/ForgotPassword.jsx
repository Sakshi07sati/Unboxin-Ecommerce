import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStep, setOtpData } from '../../global_redux/features/auth/authSlice';
import { forgotPassword } from '../../global_redux/features/auth/authThunks';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [mobile, setMobile] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobile) {
      toast.error('Please enter your mobile number');
      return;
    }

    const res = await dispatch(forgotPassword({ phone: mobile }));
    if (!res.error) {
      toast.success('OTP sent to your mobile number');
    } else {
      toast.error(res.payload || 'Something went wrong');
    }
  };

  return (
    <div className="space-y-6 font-['Outfit']">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Forgot Password</h2>
        <p className="text-slate-500 text-sm">Enter your mobile number to receive an OTP</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-pink-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <input
              type="tel"
              placeholder="Enter your mobile number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-medium text-slate-900"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Sending...
            </span>
          ) : "SEND OTP"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => dispatch(setStep('login'))}
            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
