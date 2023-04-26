// src/hooks/usePatients.ts
import { useMutation, useQueryClient, useQuery } from "react-query";
import apiClient from "../utils/apiClient";
import { ToastSuccess, ToastError } from "../components/toast/toast";

export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  doctorId: string;
}

export const usePatients = (patientId: string) => {
  const queryClient = useQueryClient();

  const getPatient = async (): Promise<PatientData> => {
    const { data } = await apiClient.get<PatientData>(
      `/patients?id=${patientId}`
    );
    return data[0];
  };

  const updatePatient = async (updatedPatientData: Partial<PatientData>) => {
    await apiClient.put(`/patients/${patientId}`, updatedPatientData);
  };

  const {
    data: patient,
    isLoading,
    error,
    refetch,
  } = useQuery(["patient", patientId], getPatient);

  const mutationOptions = (operation: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries(["patient", patientId]);
      ToastSuccess(`${operation} successful`);
    },
    onError: (error: Error) => {
      ToastError(`${operation} failed: ${error.message}`);
    },
  });

  const updatePatientMutation = useMutation(
    updatePatient,
    mutationOptions("Update Patient")
  );

  return {
    patient,
    isLoading,
    error,
    refetch,
    updatePatient: updatePatientMutation.mutate,
  };
};
