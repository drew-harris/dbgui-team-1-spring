// src/hooks/useDoctors.ts
import { useMutation, useQueryClient, useQuery } from "react-query";
import apiClient from "../utils/apiClient";
import { ToastSuccess, ToastError } from "../components/toast/toast";

export interface DoctorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  practice: string;
  location: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
}

export const useDoctor = (doctorId: string) => {
  const queryClient = useQueryClient();

  const getDoctor = async (): Promise<DoctorData> => {
    const { data } = await apiClient.get<DoctorData[]>(
      "/doctors?id=" + doctorId
    );
    return data[0];
  };

  const searchDoctors = async (query: string): Promise<DoctorData[]> => {
    const { data } = await apiClient.get<DoctorData[]>(
      `/doctors/search?query=${query}`
    );
    return data;
  };

  const updateDoctor = async (
    updatedDoctorData: Partial<DoctorData>
  ): Promise<DoctorData> => {
    const { data } = await apiClient.put<DoctorData>(
      "/doctors",
      updatedDoctorData
    );
    return data;
  };

  const {
    data: doctor,
    isLoading,
    error,
    refetch,
  } = useQuery("doctors", getDoctor);

  const mutationOptions = (operation: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries("doctors");
      ToastSuccess(`${operation} successful`);
    },
    onError: (error: Error) => {
      ToastError(`${operation} failed: ${error.message}`);
    },
  });

  const updateDoctorMutation = useMutation(
    updateDoctor,
    mutationOptions("Update Doctor")
  );

  const searchDoctorsMutation = useMutation(
    searchDoctors,
    mutationOptions("Search Doctors")
  );

  return {
    doctor,
    isLoading,
    error,
    refetch,
    searchDoctors: searchDoctorsMutation.mutate,
    updateDoctor: updateDoctorMutation.mutate,
  };
};
