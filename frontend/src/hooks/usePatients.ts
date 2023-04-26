// src/hooks/usePatients.ts
import { useQuery } from "react-query";
import apiClient from "../utils/apiClient";

export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  doctorId: string;
}

export const usePatients = () => {
  const getPatients = async (): Promise<PatientData[]> => {
    const { data } = await apiClient.get<PatientData[]>("/patients");
    return data;
  };

  const {
    data: patients,
    isLoading,
    error,
    refetch,
  } = useQuery("patients", getPatients);

  return {
    patients,
    isLoading,
    error,
    refetch,
  };
};
