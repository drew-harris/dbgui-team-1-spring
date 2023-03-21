import { useMutation } from "react-query";
import axios from "axios";

const signupDoctor = async (data: {
  username: string;
  email: string;
  password: string;
  practice: string;
  firstName: string;
  lastName: string;
  location: string;
}) => {
  const response = await axios.post("http://localhost:8000/doctor/signup", data);
  return response.data;
};

const signinDoctor = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post("http://localhost:3000/doctor/signin", data);
  return response.data;
};

export const useAuth = () => {
  const signupMutation = useMutation(signupDoctor);
  const signinMutation = useMutation(signinDoctor);

  return { signupMutation, signinMutation };
};
