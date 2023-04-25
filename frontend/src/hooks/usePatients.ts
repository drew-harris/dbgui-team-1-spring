// src/hooks/usePatients.ts
// import { Patient } from "@prisma/client";
import { useMutation, useQueryClient, useQuery } from "react-query";
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
  const queryClient = useQueryClient();

  const getPatients = async (): Promise<PatientData[]> => {
    const { data } = await apiClient.get<PatientData[]>("/patients");
    return data;
  };

  const searchPatients = async (query: string): Promise<PatientData[]> => {
    const { data } = await apiClient.get<PatientData[]>(
      `/patients/search?query=${query}`
    );
    return data;
  };

  const {
    data: patients,
    isLoading,
    error,
    refetch,
  } = useQuery("patients", getPatients);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries("patients");
    },
  };

  const searchPatientsMutation = useMutation(searchPatients, mutationOptions);

  return {
    patients,
    isLoading,
    error,
    refetch,
    searchPatients: searchPatientsMutation.mutate,
  };
};
