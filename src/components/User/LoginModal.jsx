import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../global_redux/features/auth/authApi";
import { authSuccess } from "../../global_redux/features/auth/authSlice";
import toast from "react-hot-toast";

const LoginForm = ({ setStep, setLoginOtpData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    // try {
    //   const res = await loginUser({ email, password });
      
    //   if (res.data.otpRequired) {
    //     setLoginOtpData({ email });
    //     toast.success("OTP sent to your email/phone");
    //     setStep("login-otp");
    //     return;
    //   }

    // MOCK LOGIN (since backend not ready)

// Step 1: simulate user exists
try{
if (email && password) {

  // Step 2: generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  localStorage.setItem("otp", otp);
  localStorage.setItem("email", email);
  localStorage.setItem("otpExpiry", Date.now() + 60000);

  console.log(" Login OTP:", otp);

  // Step 3: move to OTP screen
  setLoginOtpData({ email });
  toast.success("OTP sent to your email/phone");
  setStep("login-otp");
  return;
}

      
      dispatch(authSuccess(res.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      
      const role = res.data.user?.role;
      navigate(role === "admin" ? "/admin" : "/");
      
    } catch (err) {
      if (err?.response?.data?.error === "User not found") {
        setLoginError("No account found. Please sign up.");
      } else {
        setLoginError("Invalid email or password.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      {/* Tab/Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Login</h2>
        <p className="text-sm text-gray-500 mt-2">To discover your beauty favorites</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email Field */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">
            Email Address / Phone
          </label>
          <input 
            name="email" 
            type="text"
            required
            placeholder="Enter Email or Phone" 
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm placeholder:text-gray-300"
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">
              Password
            </label>
            <span className="text-[10px] font-semibold text-[#e80071] cursor-pointer hover:underline">
              Forgot?
            </span>
          </div>
          <input 
            name="password" 
            type="password" 
            required
            placeholder="••••••••" 
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm placeholder:text-gray-300"
          />
        </div>

        {/* Error Message */}
        {loginError && (
          <div className="bg-red-50 text-red-500 text-xs p-3 rounded border border-red-100 animate-pulse">
            {loginError}
          </div>
        )}

        {/* Login Button */}
        <button 
          type="submit"
          className="w-full bg-[#e80071] hover:bg-[#c60061] text-white font-bold py-3 rounded-sm mt-4 transition-all duration-200 shadow-md active:scale-[0.98] uppercase tracking-widest text-xs"
        >
          Login
        </button>

        {/* Footer Link */}
        <div className="pt-6 text-center border-t border-gray-50">
          <p className="text-sm text-gray-600">
            New to our store?{' '}
            <span 
              onClick={() => setStep("signup")} 
              className="text-[#e80071] font-bold cursor-pointer hover:underline ml-1"
            >
              REGISTER
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;