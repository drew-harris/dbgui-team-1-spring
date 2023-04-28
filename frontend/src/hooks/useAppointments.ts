// src/hooks/useAppointments.ts
import {
  useMutation,
  useQueryClient,
  useQuery,
  MutationFunction,
} from "react-query";
import apiClient from "../utils/apiClient";
import { ToastSuccess, ToastError } from "../components/toast/toast";
import { API_URL } from "../utils/url";

export interface AppointmentData {
  id: string;
  time: Date;
  createdAt: Date;
  approved: boolean;
  reason: string;
  patientId: string;
  patient: {
    firstName: string;
    lastName: string;
  };
  doctorId: string;
  doctor: {
    firstName: string;
    lastName: string;
  };
  isPlaceholder: boolean;
  status: "Pending" | "Approved" | "Rejected" | "Empty";
}

type UpdateAppointmentFn = MutationFunction<
  AppointmentData,
  { appointmentId: string; appointmentData: Partial<AppointmentData> }
>;

export const useAppointments = (doctorId: string) => {
  const queryClient = useQueryClient();

  const getAppointments = async (): Promise<AppointmentData[]> => {
    const { data } = await apiClient.get<AppointmentData[]>(
      `/appointments?doctorId=${doctorId}`
    );
    return data;
  };

  const createAppointment = async (
    appointment: Omit<
      AppointmentData,
      "id" | "createdAt" | "approved" | "doctor" | "patient"
    >
  ): Promise<AppointmentData> => {
    const { data } = await apiClient.post<AppointmentData>(
      API_URL + "/appointments/doctor",
      appointment
    );
    return data;
  };

  const cancelAppointment = async (
    appointmentId: string
  ): Promise<{ success: true }> => {
    const { data } = await apiClient.delete<{ success: true }>(
     API_URL +  `/appointments/${appointmentId}`
    );
    return data;
  };

  const approveAppointment = async (
    appointmentId: string
  ): Promise<AppointmentData> => {
    const { data } = await apiClient.put<AppointmentData>(
      API_URL + `/appointments/${appointmentId}/approve`
    );
    return data;
  };

  const rejectAppointment = async (
    appointmentId: string
  ): Promise<AppointmentData> => {
    const { data } = await apiClient.put<AppointmentData>(
      `${API_URL}/appointments/${appointmentId}/reject`
    );
    return data;
  };

  const updateAppointment: UpdateAppointmentFn = async ({
    appointmentId,
    appointmentData,
  }) => {
    const { data } = await apiClient.put<AppointmentData>(
      `${API_URL}/appointments/${appointmentId}`,
      appointmentData
    );
    return data;
  };

  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useQuery("appointments", getAppointments);

  const mutationOptions = (operation: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries("appointments");
      ToastSuccess(`${operation} successful`);
    },
    onError: (error: Error) => {
      ToastError(`${operation} failed: ${error.message}`);
    },
  });

  const createAppointmentMutation = useMutation(
    createAppointment,
    mutationOptions("Create Appointment")
  );
  const cancelAppointmentMutation = useMutation(
    cancelAppointment,
    mutationOptions("Cancel Appointment")
  );
  const approveAppointmentMutation = useMutation(
    approveAppointment,
    mutationOptions("Approve Appointment")
  );
  const rejectAppointmentMutation = useMutation(
    rejectAppointment,
    mutationOptions("Reject Appointment")
  );
  const updateAppointmentMutation = useMutation(
    updateAppointment,
    mutationOptions("Update Appointment")
  );

  return {
    appointments,
    isLoading,
    error,
    refetch,
    createAppointment: createAppointmentMutation.mutate,
    cancelAppointment: cancelAppointmentMutation.mutate,
    approveAppointment: approveAppointmentMutation.mutate,
    rejectAppointment: rejectAppointmentMutation.mutate,
    updateAppointment: updateAppointmentMutation.mutate,
  };
};
