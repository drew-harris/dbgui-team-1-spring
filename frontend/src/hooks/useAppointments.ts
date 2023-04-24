// src/hooks/useAppointments.ts
/* eslint-disable no-unused-vars */
import { Doctor, Patient, Appointment } from "@prisma/client";
import { useMutation, useQueryClient, useQuery } from "react-query";
import axios from "axios";
import apiClient from "../utils/apiClient";

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
      "http://localhost:8000/appointments/doctor",
      appointment
    );
    return data;
  };

  const cancelAppointment = async (
    appointmentId: string
  ): Promise<{ success: true }> => {
    const { data } = await apiClient.delete<{ success: true }>(
      `http://localhost:8000/appointments/${appointmentId}`
    );
    return data;
  };

  const approveAppointment = async (
    appointmentId: string
  ): Promise<AppointmentData> => {
    const { data } = await apiClient.put<AppointmentData>(
      `http://localhost:8000/appointments/${appointmentId}/approve`
    );
    return data;
  };

  const rejectAppointment = async (
    appointmentId: string
  ): Promise<AppointmentData> => {
    const { data } = await apiClient.put<AppointmentData>(
      `http://localhost:8000/appointments/${appointmentId}/reject`
    );
    return data;
  };

  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useQuery("appointments", getAppointments);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries("appointments");
    },
  };

  const createAppointmentMutation = useMutation(
    createAppointment,
    mutationOptions
  );
  const cancelAppointmentMutation = useMutation(
    cancelAppointment,
    mutationOptions
  );
  const approveAppointmentMutation = useMutation(
    approveAppointment,
    mutationOptions
  );
  const rejectAppointmentMutation = useMutation(
    rejectAppointment,
    mutationOptions
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
  };
};
