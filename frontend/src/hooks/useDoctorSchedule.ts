import { useMutation, useQueryClient, useQuery } from "react-query";
import apiClient from "../utils/apiClient";
import { ToastSuccess, ToastError } from "../components/toast/toast";

export const useDoctorSchedule = (doctorId: string) => {
  const queryClient = useQueryClient();

  const getSchedule = async (): Promise<{ start: number; end: number }> => {
    const { data } = await apiClient.get<{ start: number; end: number }>(
      `/schedules?id=${doctorId}`
    );
    return data;
  };

  const updateSchedule = async (scheduleData: {
    start: number;
    end: number;
  }): Promise<{ start: number; end: number }> => {
    const { data } = await apiClient.post<{ start: number; end: number }>(
      "/schedules",
      scheduleData
    );
    return data;
  };

  const {
    data: schedule,
    isLoading,
    error,
    refetch,
  } = useQuery("schedule", getSchedule);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries("schedule");
      ToastSuccess("Update Schedule successful");
    },
    onError: (error: Error) => {
      ToastError(`Update Schedule failed: ${error.message}`);
    },
  };

  const updateScheduleMutation = useMutation<
    { start: number; end: number },
    unknown,
    { start: number; end: number }
  >(updateSchedule, mutationOptions);

  return {
    schedule,
    isLoading,
    error,
    refetch,
    updateSchedule: updateScheduleMutation.mutate,
  };
};
