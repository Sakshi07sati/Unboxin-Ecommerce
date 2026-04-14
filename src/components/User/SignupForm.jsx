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

import { registerUser } from "../../global_redux/features/auth/authApi";
import toast from "react-hot-toast";

const SignupForm = ({ setStep }) => {
  const handleSignup = async (e) => {
    e.preventDefault();

    const data = {
      username: e.target.username.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      password: e.target.password.value,
    };

      try {
    const res = await registerUser(data);

    // 🔥 IMPORTANT: backend should send this flag
    if (res.data.otpRequired) {
      localStorage.setItem("email", data.email);
      toast.success("OTP sent to your email/phone");
      setStep("otp");
    }

      
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Signup failed. Please try again.");
    }
  };
  

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Create Account</h2>
        <p className="text-sm text-gray-500 mt-2">Sign up to get the best of Beauty & Wellness</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
          <input 
            name="username" 
            placeholder="Enter your name" 
            required
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
          <input 
            name="email" 
            type="email"
            placeholder="name@example.com" 
            required
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
          />
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
          <input 
            name="phone" 
            placeholder="Mobile number" 
            required
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#e80071] transition-colors text-sm"
          />
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          className="w-full bg-[#e80071] hover:bg-[#c60061] text-white font-bold py-3 rounded-sm mt-4 transition-all duration-200 shadow-md active:scale-[0.98]"
        >
          REGISTER
        </button>

        <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
          By continuing, you agree to Nykaa's <span className="underline italic cursor-pointer">Terms & Conditions</span> and <span className="underline italic cursor-pointer">Privacy Policy.</span>
        </p>

         <div className="pt-6 text-center border-t border-gray-50">
          <p className="text-sm text-gray-600">
            Existing User?{' '}
            <span 
              onClick={() => setStep("login")} 
              className="text-[#e80071] font-bold cursor-pointer hover:underline ml-1"
            >
              LOGIN
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;