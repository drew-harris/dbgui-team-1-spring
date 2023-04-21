import { useMutation } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const signupDoctor = async (data) => {
  const response = await axios.post(
    "http://localhost:8000/user/doctor/signup",
    data
  );
  return response.data;
};

const signupPatient = async (data) => {
  const response = await axios.post(
    "http://localhost:8000/user/patient/signup",
    data
  );
  return response.data;
};

export const useSignup = () => {
  const { updateToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const signupMutationDoctor = useMutation(signupDoctor, {
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
    onSuccess: (data: any) => {
      updateToken(data.jwt);
      navigate("/doctor/dashboard");
    },
  });

  const signupMutationPatient = useMutation(signupPatient, {
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
    onSuccess: (data: any) => {
      updateToken(data.jwt);
      navigate("/patient/doctors");
    },
  });

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
  const { updateToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const signinMutationPatient = useMutation(signinPatient, {
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
    onSuccess: (data: any) => {
      updateToken(data.jwt);
      navigate("/patient/dashboard");
    },
  });

  const signinMutationDoctor = useMutation(signinDoctor, {
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
    onSuccess: (data: any) => {
      updateToken(data.jwt);
      navigate("/doctor/dashboard");
    },
  });

  return { signinMutationPatient, signinMutationDoctor };
};
