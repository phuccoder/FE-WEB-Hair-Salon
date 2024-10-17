import api from "../config/axios/api";
import { ComboRequest } from "../model/Combo";

export const comboApi = {
  getCombo: async () => {
    try {
      const response = await api.get("combos");
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  createCombo: async (data: ComboRequest) => {
    try {
      const response = await api.post("combos/create-combo", data);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  getDetailCombo: async (id: number) => {
    try {
      const response = await api.get(`combos/get-combo-by-id/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  updateCombo: async (id: number, data: ComboRequest) => {
    try {
      const response = await api.put(`combos/update-combo/${id}`, data);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  deleteCombo: async (id: number) => {
    try {
      const response = await api.delete(`combos/delete-combo/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
};