import api from "../config/axios/api";

export const appointmentApi = {
  getAllAppointment: async () => {
    try {
      const response = await api.get("appointment-management/gettAll");
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  getAppointmentById: async (id: number) => {
    try {
      const response = await api.get(`appointment-management/get-by-appointment-id/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  updateAppointment: async (id: number, data: any) => {
    try {
      const response = await api.put(
        `appointment-management/update-appointment/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  cancelAppointment: async (id: number) => {
    try {
      const response = await api.put(
        `appointment-management/cancel-appointment/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  acceptAppointment: async (id: number) => {
    try {
      const response = await api.put(
        `appointment-management/accept-appointment/${id}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
};
