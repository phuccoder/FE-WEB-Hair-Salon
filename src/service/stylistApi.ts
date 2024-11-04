import api from "../config/axios/api";

export const stylistApi = {
  getAllStylist: async () => {
    try {
      const response = await api.get("stylist-management/all");
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  addStylist: async (data: any) => {
    try {
      const response = await api.post("stylist-management/create-stylist", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  deleteStylist: async (id: number) => {
    try {
      const response = await api.delete(`stylist-management/delete/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  updateStylist: async (id: number, data: any) => {
    try {
      const response = await api.put(`stylist-management/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  getStylistByID: async (id: number) => {
    try {
      const response = await api.get(`stylist-management/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
};
