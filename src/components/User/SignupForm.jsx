// import { registerUser } from "../../global_redux/features/auth/authApi";
// import toast from "react-hot-toast";

// const SignupForm = ({ setStep }) => {
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const data = {
//       name: e.target.name.value,
//       email: e.target.email.value,
//       phone: e.target.phone.value,
//       password: e.target.password.value,
//     };

//     try {
//       await registerUser(data);
//       toast.success("OTP sent");
//       setStep("otp");
//     } catch {
//       toast.error("Signup failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSignup}>
//       <input name="name" placeholder="Name" />
//       <input name="email" placeholder="Email" />
//       <input name="phone" placeholder="Phone" />
//       <input name="password" type="password" placeholder="Password" />
//       <button>Signup</button>
//     </form>
//   );
// };

// export default SignupForm;

// import { registerUser } from "../../global_redux/features/auth/authApi";
// import toast from "react-hot-toast";

// const SignupForm = ({ setStep }) => {
//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const data = {
//       username: e.target.username.value,
//       email: e.target.email.value,
//       phone: e.target.phone.value,
//       password: e.target.password.value,
//     };

//       try {
//     const res = await registerUser(data);

   
//     if (res.data.otpRequired) {
//       localStorage.setItem("email", data.email);
//       toast.success("OTP sent to your email/phone");
//       setStep("otp");
//     }

      
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//       toast.error("Signup failed. Please try again.");
//     }
//   };
  

//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//       {/* Header Section */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Create Account</h2>
//         <p className="text-sm text-gray-500 mt-2">Sign up to get the best of Beauty & Wellness</p>
//       </div>

//       <form onSubmit={handleSignup} className="space-y-5">
//         {/* Name Field */}
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
//           <input 
//             name="username" 
//             placeholder="Enter your name" 
//             required
//             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
//           />
//         </div>

//         {/* Email Field */}
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
//           <input 
//             name="email" 
//             type="email"
//             placeholder="name@example.com" 
//             required
//             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
//           />
//         </div>

//         {/* Phone Field */}
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
//           <input 
//             name="phone" 
//             placeholder="Mobile number" 
//             required
//             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
//           />
//         </div>

//         {/* Password Field */}
//         <div>
//           <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
//           <input 
//             name="password" 
//             type="password" 
//             placeholder="••••••••" 
//             required
//             className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
//           />
//         </div>

//         {/* Action Button */}
//         <button 
//           type="submit"
//           className="w-full bg-[#e80071] hover:bg-[#c60061] text-white font-bold py-3 rounded-sm mt-4 transition-all duration-200 shadow-md active:scale-[0.98]"
//         >
//           REGISTER
//         </button>

//         <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
//           By continuing, you agree to Nykaa's <span className="underline italic cursor-pointer">Terms & Conditions</span> and <span className="underline italic cursor-pointer">Privacy Policy.</span>
//         </p>

//          <div className="pt-6 text-center border-t border-gray-50">
//           <p className="text-sm text-gray-600">
//             Existing User?{' '}
//             <span 
//               onClick={() => setStep("login")} 
//               className="text-[#e80071] font-bold cursor-pointer hover:underline ml-1"
//             >
//               LOGIN
//             </span>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SignupForm;


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
      console.log(" Phone OTP:", res.payload?.phoneOtp);
      toast.success(`Email OTP: ${res.payload?.emailOtp}`);
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