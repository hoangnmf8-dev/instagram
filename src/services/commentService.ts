import { httpRequest } from "./httpRequest";

export const getPostComment = async (id: string) => {
  try {
    const response = await httpRequest.get(`/api/posts/${id}/comments?limit=20`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const likeComment = async (postId: string, commentId: string) => {
  try {
    const response = await httpRequest.post(`/api/posts/${postId}/comments/${commentId}/like`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const unLikeComment = async (postId: string, commentId: string) => {
  try {
    const response = await httpRequest.delete(`/api/posts/${postId}/comments/${commentId}/like`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const createComment = async (payload: any) => {
  try {
    const response = await httpRequest.post(`/api/posts/${payload.postId}/comments`, payload.payload);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const deleteComment = async (postId: string, commentId: string) => {
  try {
    const response = await httpRequest.delete(`/api/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getRepliesComment = async (postId: string, commentId: string) => {
  try {
    const response = await httpRequest.get(`/api/posts/${postId}/comments/${commentId}/replies`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const createRepliesComment = async (postId: string, commentId: string, payload: string) => {
  try {
    const response = await httpRequest.post(`/api/posts/${postId}/comments/${commentId}/replies`, payload);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const editComment = async (postId: string, commentId: string, payload: any) => {
  try {
    const response = await httpRequest.patch(`/api/posts/${postId}/comments/${commentId}`, payload);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}