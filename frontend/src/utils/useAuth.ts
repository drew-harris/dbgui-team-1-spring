import { useMutation } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const signupDoctor = async (data: {
  username: string;
  email: string;
  password: string;
  practice: string;
  firstName: string;
  lastName: string;
  location: string;
}) => {
  const response = await axios.post(
    "http://localhost:8000/user/doctor/signup",
    data
  );
  return response.data;
};

const signupPatient = async (data: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const response = await axios.post(
    "http://localhost:8000/user/patient/signup",
    data
  );
  return response.data;
};

export const useSignup = () => {
  const signupMutationDoctor = useMutation(signupDoctor);
  const signupMutationPatient = useMutation(signupPatient);

  return { signupMutationDoctor, signupMutationPatient };
};

const signinDoctor = async (data: { email: string; password: string }) => {
  const response = await axios.post(
    "http://localhost:8000/user/doctor/signin",
    data
  );
  return response.data;
};

const signinPatient = async (data: { email: string; password: string }) => {
  const response = await axios.post(
    "http://localhost:8000/user/patient/signin",
    data
  );
  if (response.status !== 200 ) {
    throw new Error(response.data.error.message || "Something went wrong");
  }
  return response.data;
};

export const useLogin = () => {
  const signinMutationPatient = useMutation(signinPatient, {
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
    // Add use success
  });
  const signinMutationDoctor = useMutation(signinDoctor);

  return { signinMutationPatient, signinMutationDoctor };
};
