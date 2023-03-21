import React, { useState } from "react";

function Signin() {
  const [role, setRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Perform your authentication logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
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
