import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getJwt, setJwt } from "../utils/jwt";
import { useLogin } from "../utils/useAuth";

function Signin() {
  const [role, setRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signinMutationDoctor, signinMutationPatient } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Check for empty required fields
    const requiredFields = [
      { value: email, label: "Email" },
      { value: password, label: "Password" },
    ];

    const emptyField = requiredFields.find((field) => !field.value);

    if (emptyField) {
      toast.error(`${emptyField.label} is required`);
      return;
    }
    if (role === "Doctor") {
      try {
        const result = await signinMutationDoctor.mutateAsync({
          email,
          password,
        });
        setJwt(result.jwt);
        navigate("/doctor/dashboard");
        console.log(result);
      } catch (error) {
        toast.error(error.message);
      }
    }
    if (role === "Patient") {
      try {
        const result = await signinMutationPatient.mutateAsync({
          email,
          password,
        });
        setJwt(result.jwt);
        navigate("/patient/dashboard");
        console.log(result);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-200">
      <button
        className="absolute left-4 top-4 text-white"
        onClick={() => getJwt()}
      >
        Get JWT
      </button>
      <button
        className="absolute right-4 top-4 text-white"
        onClick={() => setJwt("")}
      >
        Clear JWT
      </button>
      <div className="w-full max-w-md rounded-lg border border-blue-300 bg-white">
        <div className="flex">
          <button
            onClick={() => setRole("Patient")}
            className={`w-1/2 rounded-tl-md p-2 text-white ${
              role === "Patient" ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setRole("Doctor")}
            className={`w-1/2 rounded-tr-md p-4 text-white ${
              role === "Doctor" ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            Doctor
          </button>
        </div>
        <div className="m-6">
          <h1 className="mb-4 text-2xl font-bold">Sign in as {role}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="mb-4 w-full rounded border p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="mb-4 w-full rounded border p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-xs text-blue-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="submit"
              className="mb-4 w-full rounded bg-blue-500 p-2 text-white"
            >
              Sign In
            </button>
          </form>
          <div className="text-center">
            <p>
              Do not have an account?{" "}
              <a href="/" className="text-blue-500 underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
