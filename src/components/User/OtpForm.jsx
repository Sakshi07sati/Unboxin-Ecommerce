import { useDispatch } from "react-redux";
import { verifyOTP } from "../../global_redux/features/auth/authApi";
import { authSuccess } from "../../global_redux/features/auth/authSlice";
import toast from "react-hot-toast";

const OtpForm = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleOTP = async (e) => {
    e.preventDefault();

    const otp = e.target.otp.value;
    const email = localStorage.getItem("email");

    try {
      const res = await verifyOTP({ email, otp });
      dispatch(authSuccess(res.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Signup complete");
      onClose();
    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <form onSubmit={handleOTP}>
      <input name="otp" placeholder="Enter OTP" />
      <button>Verify</button>
    </form>
  );
};

export default OtpForm;