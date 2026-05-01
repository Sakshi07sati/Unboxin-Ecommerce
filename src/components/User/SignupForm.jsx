import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../global_redux/features/auth/authThunks";
import { setStep } from "../../global_redux/features/auth/authSlice";
import toast from "react-hot-toast";

const SignupForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleSignup = async (e) => {
    e.preventDefault();

    const data = {
      username: e.target.username.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      password: e.target.password.value,
    };

    const res = await dispatch(registerUser(data));

    if (!res.error) {
      console.log("Email OTP:", res.payload?.emailOtp);
      console.log("Phone OTP:", res.payload?.phoneOtp);
      toast.success(`Email OTP: ${res.payload?.emailOtp}`);
      setTimeout(() => {
        toast.success(`Phone OTP: ${res.payload?.phoneOtp}`);
      }, 1000);
    } else {
      toast.error(res.payload || "Signup failed");
    }
  };

  return (
    <div className="space-y-2 font-['Outfit']">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold  text-slate-900">
          Create Account
        </h2>
        <p className="text-slate-500 text-sm">
          Join us for a premium shopping experience
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-2">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400  ml-1">Full Name</label>
            <input
              name="username"
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none  focus:border-pink-500 transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none  focus:border-pink-500 transition-all text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input
              name="phone"
              placeholder="+1 234 567 890"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none  focus:border-pink-500 transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none  focus:border-pink-500 transition-all text-sm"
            />
          </div>
        </div>

        <button
          className="w-full bg-primary text-white py-3 rounded-2xl font-bold hover:bg-pink-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200 mt-2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Creating Account...
            </span>
          ) : "CREATE ACCOUNT"}
        </button>

        <div className="pt-2 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <span
              onClick={() => dispatch(setStep("login"))}
              className="text-pink-600 font-bold cursor-pointer hover:underline ml-1"
            >
              Login
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;