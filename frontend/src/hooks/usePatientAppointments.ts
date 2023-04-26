// src/hooks/usePatientAppointments.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import apiClient from "../utils/apiClient";
import { AppointmentData } from "./useAppointments";
import { ToastSuccess, ToastError } from "../components/toast/toast";

export const usePatientAppointments = (patientId: string) => {
  const queryClient = useQueryClient();

  const getPatientAppointments = async (): Promise<AppointmentData[]> => {
    const { data } = await apiClient.get<AppointmentData[]>(
      `/appointments?patientId=${patientId}`
    );
    return data;
  };

  const addAppointment = async (
    appointment: Omit<
      AppointmentData,
      "id" | "createdAt" | "approved" | "doctor" | "patient"
    > & {
      isPlaceholder: boolean;
      status: string;
    }
  ): Promise<AppointmentData> => {
    const { data } = await apiClient.post<AppointmentData>(
      "/appointments",
      appointment
    );
    return data;
  };

  const cancelAppointment = async (
    appointmentId: string
  ): Promise<{ success: true }> => {
    const { data } = await apiClient.delete<{ success: true }>(
      `/appointments/${appointmentId}`
    );
    return data;
  };

  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useQuery("patientAppointments", getPatientAppointments);

  const mutationOptions = (operation: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries("patientAppointments");
      ToastSuccess(`${operation} successful`);
    },
    onError: (error: Error) => {
      ToastError(`${operation} failed: ${error.message}`);
    },
  });

  const addAppointmentMutation = useMutation(
    addAppointment,
    mutationOptions("Add Appointment")
  );
  const cancelAppointmentMutation = useMutation(
    cancelAppointment,
    mutationOptions("Cancel Appointment")
  );

  return {
    appointments,
    isLoading,
    error,
    refetch,
    addAppointment: addAppointmentMutation.mutate,
    cancelAppointment: cancelAppointmentMutation.mutate,
  };
};
