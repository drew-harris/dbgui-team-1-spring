import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../utils/useAuth";

function Signup() {
  const [role, setRole] = useState("Patient");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [practice, setPractice] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState(1);

  const { signupMutation } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Check for empty required fields
    const requiredFields = [
      { value: username, label: "Username" },
      { value: email, label: "Email" },
      { value: password, label: "Password" },
      { value: confirmPassword, label: "Confirm Password" },
    ];

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (role === "Doctor" && step === 2) {
      requiredFields.push(
        { value: firstName, label: "First Name" },
        { value: lastName, label: "Last Name" },
        { value: practice, label: "Practice" },
        { value: location, label: "Location" }
      );
    }

    const emptyField = requiredFields.find((field) => !field.value);

    if (emptyField) {
      toast.error(`${emptyField.label} is required`);
      return;
    }

    if (role === "Doctor" && step === 1) {
      setStep(2);
    } else {
      const signUpData = {
        username,
        email,
        password,
        practice,
        firstName,
        lastName,
        location,
      };
      try {
        const response = await signupMutation.mutateAsync(signUpData);
        console.log(response);
        // Redirect to the doctor's dashboard or perform any other action after successful signup
      } catch (error) {
        toast.error(
          error.response.data.message || "An error occurred while signing up"
        );
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSetRole = (role: string) => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setPractice("");
    setLocation("");
    setRole(role);
    setStep(1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-200">
      <div className="w-full max-w-md rounded-lg border border-blue-300 bg-white">
        <div className="flex">
          <button
            onClick={() => handleSetRole("Patient")}
            className={`w-1/2 rounded-tl-md p-2 text-white ${
              role === "Patient" ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => handleSetRole("Doctor")}
            className={`w-1/2 rounded-tr-md p-4 text-white ${
              role === "Doctor" ? "bg-blue-500" : "bg-blue-300"
            }`}
          >
            Doctor
          </button>
        </div>
        <div className="m-6">
          <h1 className="mb-4 text-2xl font-bold">Sign up as {role}</h1>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  className="mb-4 w-full rounded border p-2"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
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
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="mb-4 w-full rounded border p-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 text-xs text-blue-500"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </>
            )}
            {role === "Doctor" && step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  className="mb-4 w-full rounded border p-2"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="mb-4 w-full rounded border p-2"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Practice"
                  className="mb-4 w-full rounded border p-2"
                  value={practice}
                  onChange={(e) => setPractice(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="mb-4 w-full rounded border p-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </>
            )}
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 text-white"
            >
              {role === "Patient"
                ? "Create Account"
                : `Create Account (${step}/2)`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
