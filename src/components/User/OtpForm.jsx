
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
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-6">
        Enter the 6-digit code sent to your email
      </p>

      <form onSubmit={handleSubmit}>
        {/* OTP BOXES */}
        <div
          className="flex justify-center gap-3 mb-6"
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
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:border-pink-600"
            />
          ))}
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-md font-bold hover:bg-pink-700 transition"
        >
          {loading ? "Verifying..." : "VERIFY"}
        </button>
      </form>
    </div>
  );
};

export default OtpForm;