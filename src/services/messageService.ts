import { httpRequest } from "./httpRequest";

export const getConversations = async ({pageParam = 0}) => {
  try {
    const response = await httpRequest.get(`/api/messages/conversations`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const markAsReadMessage = async (messageId: string) => {
  try {
    const response = await httpRequest.put(`/api/messages/messages/${messageId}/read`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getMessageInConversation = async (messageId: string) => {
  try {
    const response = await httpRequest.get(`/api/messages/conversations/${messageId}/messages`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getOrCreateConversation = async (userId: string) => {
  try {
    const response = await httpRequest.post(`/api/messages/conversations`, {
      userId
    });
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const sendTextMessage = async (payload: any) => {
  try {
    const response = await httpRequest.post(`/api/messages/messages`, payload);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const sendImageMessage = async (payload: FormData) => {
  try {
    const response = await httpRequest.post(`/api/messages/messages`, payload);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}
