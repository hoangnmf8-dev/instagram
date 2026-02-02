import { httpRequest } from "./httpRequest";

export const followUser = async (userId: string) => {
  try {
    const response = await httpRequest.post(`/api/follow/${userId}/follow`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const unFollowUser = async (userId: string) => {
  try {
    const response = await httpRequest.delete(`/api/follow/${userId}/follow`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getFollowers = async (userId: string) => {
  try {
    const response = await httpRequest.get(`/api/follow/${userId}/followers`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getFollowing = async (userId: string) => {
  try {
    const response = await httpRequest.get(`/api/follow/${userId}/following`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}