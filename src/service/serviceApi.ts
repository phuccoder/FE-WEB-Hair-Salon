import api from "../config/axios/api";

export const serviceApi = {
  getAllServic: async () => {
    try {
      const response = await api.get("services-management");
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  addServiceToCombo: async (comboID: number, serviceID: number) => {
    try {
      const response = await api.post(
        `combos-management/add-service-to-combo/${comboID}/${serviceID}`,
      );
      return response.data
    } catch (error: any) {
      throw error.response.data
    }
  },
};
