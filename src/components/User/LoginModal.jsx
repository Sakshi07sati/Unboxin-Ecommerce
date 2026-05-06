// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { authSuccess } from "../../global_redux/features/auth/authSlice";
// import toast from "react-hot-toast";

// const LoginForm = ({ setStep, setLoginOtpData }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loginError, setLoginError] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();
//     setLoginError("");

//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     try {
//       if (email && password) {
//         // MOCK LOGIN SIMULATION (Since backend is in development)
//         // Step 1: generate OTP
//         const otp = Math.floor(100000 + Math.random() * 900000);

//         localStorage.setItem("otp", otp);
//         localStorage.setItem("email", email);
//         localStorage.setItem("otpExpiry", Date.now() + 60000);

//         console.log("Login OTP (Mock):", otp);

//         // Step 2: move to OTP screen
//         setLoginOtpData({ email });
//         toast.success("OTP sent to your email/phone");
//         setStep("login-otp");
//       } else {
//         setLoginError("Please enter both email and password.");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setLoginError("An unexpected error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//       <div className="text-center mb-10">
//         <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Login</h2>
//         <p className="text-sm text-gray-500 mt-2">To discover your beauty favorites</p>
//       </div>

//       <form onSubmit={handleLogin} className="space-y-6">
//         <div className="relative">
//           <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">
//             Email Address / Phone
//           </label>
//           <input 
//             name="email" 
//             type="text"
//             required
//             placeholder="Enter Email or Phone" 
//             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm placeholder:text-gray-300"
//           />
//         </div>

//         <div className="relative">
//           <div className="flex justify-between items-center">
//             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">
//               Password
//             </label>
//             <span className="text-[10px] font-semibold text-[#e80071] cursor-pointer hover:underline">
//               Forgot?
//             </span>
//           </div>
//           <input 
//             name="password" 
//             type="password" 
//             required
//             placeholder="••••••••" 
//             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm placeholder:text-gray-300"
//           />
//         </div>

//         {loginError && (
//           <div className="bg-red-50 text-red-500 text-xs p-3 rounded border border-red-100 italic">
//             {loginError}
//           </div>
//         )}

//         <button 
//           type="submit"
//           className="w-full bg-[#e80071] hover:bg-[#c60061] text-white font-bold py-3 rounded-sm mt-4 transition-all duration-200 shadow-md active:scale-[0.98] uppercase tracking-widest text-xs"
//         >
//           Login
//         </button>

//         <div className="pt-6 text-center border-t border-gray-50">
//           <p className="text-sm text-gray-600">
//             New to our store?{' '}
//             <span 
//               onClick={() => setStep("signup")} 
//               className="text-[#e80071] font-bold cursor-pointer hover:underline ml-1"
//             >
//               REGISTER
//             </span>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginUser, forgotPassword } from "../../global_redux/features/auth/authApi";
// import { authSuccess } from "../../global_redux/features/auth/authSlice";
// import toast from "react-hot-toast";

// const LoginModal = ({ setStep }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const [view, setView] = useState("login"); // 'login' or 'forgot'
//   const [loading, setLoading] = useState(false);
//   const [loginError, setLoginError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoginError("");
//     setLoading(true);

//     const identifierValue = e.target.identifier.value; // can be email or phone
//     const password = e.target.password.value;

//     try {
//       // 1. Call API for direct login
//       const res = await loginUser({ email: identifierValue, password });

//       // 2. Check for token in response
//       if (res.data && res.data.token) {
//         // Save to Redux and LocalStorage
//         dispatch(authSuccess(res.data));
//         localStorage.setItem("token", res.data.token);
        
//         toast.success("Login successful!");

//         // // 3. Role-based Navigation
//         // const role = res.data.user?.role;
//         // if (role === "admin") {
//         //   navigate("/admin");
//         // } else {
//         //   navigate("/");
//         // }
//       }
//     } catch (err) {
//       // 4. Handle specific backend errors
//       console.log("Login Error Details:", err.response?.data);
//       const errorMessage = err.response?.data?.message || err.response?.data?.error;

//       if (err.status === 404 || errorMessage === "User not found") {
//         setLoginError("Account not found. Please sign up first.");
//       } else if (err.status === 401 || errorMessage === "Invalid credentials") {
//         setLoginError("Invalid email or password.");
//       } else {
//         setLoginError("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     const identifier = e.target.forgotIdentifier.value;
//     setLoading(true);
//     try {
//       await forgotPassword({ email:identifier });
//       toast.success("Password reset instructions sent to your email");
//       setView("login");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Email not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (view === "forgot") {
//     return (
//       <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//         <h2 className="text-xl font-semibold text-gray-800 text-center tracking-tight">Forgot Password?</h2>
//         <p className="text-[11px] text-gray-500 text-center mt-2 mb-8 uppercase tracking-wider">Enter email to reset your password</p>
//         <form onSubmit={handleForgotPassword} className="space-y-6">
//           <div className="relative">
//             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Email</label>
//             <input 
//               name="forgotEmail" 
//               type="email" 
//               required 
//               className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] text-sm transition-colors"
//               placeholder="name@example.com"
//             />
//           </div>
//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-[#e80071] text-white py-3 font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#c60061] transition-all"
//           >
//             {loading ? "SENDING..." : "RESET PASSWORD"}
//           </button>
//           <p onClick={() => setView("login")} className="text-center text-[10px] text-[#e80071] font-bold cursor-pointer mt-4 tracking-widest uppercase hover:underline">
//             Back to Login
//           </p>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//       <div className="text-center mb-10">
//         <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Login</h2>
//         <p className="text-sm text-gray-500 mt-2 font-light">Enter your credentials to continue</p>
//       </div>

//       <form onSubmit={handleLogin} className="space-y-6">
//         <div>
//           <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">
//             Email Address
//           </label>
//           <input 
//             name="identifier" 
//             type="text"
//             required
//             placeholder="Enter your email or phone" 
//             className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
//           />
//         </div>

//         <div>
//           <div className="flex justify-between items-center">
//             <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1">
//               Password
//             </label>
//             <span 
//               onClick={() => setView("forgot")}
//               className="text-[10px] font-bold text-[#e80071] cursor-pointer hover:underline uppercase tracking-tighter"
//             >
//               Forgot?
//             </span>
//           </div>
//           <input 
//             name="password" 
//             type="password" 
//             required
//             placeholder="••••••••" 
//             className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
//           />
//         </div>

//         {loginError && (
//           <div className="bg-red-50 text-red-600 text-[11px] p-3 rounded border border-red-100 font-medium animate-shake">
//             ⚠️ {loginError}
//           </div>
//         )}

//         <button 
//           type="submit"
//           disabled={loading}
//           className={`w-full ${loading ? 'bg-pink-300' : 'bg-[#e80071] hover:bg-[#c60061]'} text-white font-bold py-3.5 rounded-sm mt-4 transition-all shadow-md active:scale-[0.98] uppercase tracking-[0.2em] text-[10px]`}
//         >
//           {loading ? "VERIFYING..." : "LOGIN"}
//         </button>

//         <div className="pt-8 text-center border-t border-gray-50">
//           <p className="text-xs text-gray-500 uppercase tracking-wide">
//             Don't have an account?{' '}
//             <span 
//               onClick={() => setStep("signup")} 
//               className="text-[#e80071] font-bold cursor-pointer hover:underline ml-1"
//             >
//               Register Now
//             </span>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginModal;

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../global_redux/features/auth/authThunks";
import { setStep } from "../../global_redux/features/auth/authSlice";
import toast from "react-hot-toast";

const LoginModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const res = await dispatch(loginUser(data));

    if (!res.error) {
      toast.success("Login successful");
      onClose();
    } else {
      toast.error(res.payload || "Login failed");
    }
  };

  return (
    <div className="space-y-5 font-['Outfit']">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold  text-slate-900">
          Welcome Back
        </h2>
        <p className="text-slate-500 text-sm">
          Login to your account to continue shopping
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400  ml-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none  focus:border-pink-500 transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-400  ">Password</label>
              <span 
                onClick={() => dispatch(setStep("forgot-password"))}
                className="text-[10px] font-bold text-pink-600 cursor-pointer hover:underline uppercase"
              >
                Forgot?
              </span>
            </div>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none  focus:border-pink-500 transition-all text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-center text-xs font-medium border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <button
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold  transition-all active:scale-[0.98] shadow-xl shadow-slate-200 mt-2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Signing in...
            </span>
          ) : "SIGN IN"}
        </button>

        <div className="pt-4 text-center">
          <p className="text-sm text-slate-500">
            Don’t have an account?{" "}
            <span
              onClick={() => dispatch(setStep("signup"))}
              className="text-pink-600 font-bold cursor-pointer hover:underline ml-1"
            >
              Sign Up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;