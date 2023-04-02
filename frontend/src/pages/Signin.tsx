import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useLogin } from "../utils/useAuth";
import { useNavigate } from "react-router-dom";
import { setJwt } from "../utils/jwt";
import { getJwt } from "../utils/jwt";

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
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <button className="absolute top-4 left-4 text-white" onClick={() => getJwt()}>Get JWT</button>
      <button className="absolute top-4 right-4 text-white" onClick={() => setJwt("")}>Clear JWT</button>
      <div className="bg-white rounded-lg w-full max-w-md border border-blue-300">
        <div className="flex">
          <button
            onClick={() => setRole("Patient")}
            className={`w-1/2 p-2 text-white rounded-tl-md ${
              role === "Patient" ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setRole("Doctor")}
            className={`w-1/2 p-4 text-white rounded-tr-md ${
              role === "Doctor" ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            Doctor
          </button>
        </div>
        <div className="m-6">
          <h1 className="text-2xl font-bold mb-4">Sign in as {role}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 mb-4 border rounded"
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
              className="w-full p-2 mb-4 text-white bg-blue-500 rounded"
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