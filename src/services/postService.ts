import { httpRequest } from "./httpRequest";

const LIMIT = 20;

export const getPostsNewfeed = async ({pageParam = 0}) => {
  try {
    const response = await httpRequest.get(`/api/posts/feed?limit=${LIMIT}&offset=${pageParam}`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const likePost = async (id: string) => {
  try {
    const response = await httpRequest.post(`/api/posts/${id}/like`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const unLikePost = async (id: string) => {
  try {
    const response = await httpRequest.delete(`/api/posts/${id}/like`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const savePost = async (id: string) => {
  try {
    const response = await httpRequest.post(`/api/posts/${id}/save`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const unSavePost = async (id: string) => {
  try {
    const response = await httpRequest.delete(`/api/posts/${id}/save`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getPostNewsFeedDetail = async (id: string) => {
  try {
    const response = await httpRequest.get(`/api/posts/${id}`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

