import { registerUser } from "../../global_redux/features/auth/authApi";
import toast from "react-hot-toast";

const SignupForm = ({ setStep }) => {
  const handleSignup = async (e) => {
    e.preventDefault();

    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      password: e.target.password.value,
    };

    try {
      await registerUser(data);
      toast.success("OTP sent");
      setStep("otp");
    } catch {
      toast.error("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <input name="phone" placeholder="Phone" />
      <input name="password" type="password" placeholder="Password" />
      <button>Signup</button>
    </form>
  );
};

export default SignupForm;