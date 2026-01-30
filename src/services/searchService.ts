import { httpRequest } from "./httpRequest";
export interface searchHitoryPayload {
  searchedUserId: string,
  searchQuery: string
}

export const searchUser = async (param: string) => {
  try {
    const response = await httpRequest.get(`/api/users/search?q=${param}`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const searchHitory = async (payload: searchHitoryPayload) => {
  try {
    const response = await httpRequest.post(`/api/search-history`, payload);
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getSearchHistory = async () => {
  try {
    const response = await httpRequest.get("/api/search-history");
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const deleteItemHistory = async (id: string) => {
  try {
    const response = await httpRequest.delete(`/api/search-history/${id}`);
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const deleteAllHistory = async (id: string) => {
  try {
    const response = await httpRequest.delete(`/api/search-history`);
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}