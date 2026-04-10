import { useDispatch } from "react-redux";
import { loginUser } from "../../global_redux/features/auth/authApi";
import { authSuccess } from "../../global_redux/features/auth/authSlice";
import toast from "react-hot-toast";

const LoginForm = ({ setStep }) => {
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await loginUser({ email, password });
      dispatch(authSuccess(res.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>

      <p onClick={() => setStep("signup")}>New user? Signup</p>
    </form>
  );
};

export default LoginForm;