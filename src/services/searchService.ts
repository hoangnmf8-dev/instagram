import { httpRequest } from "./httpRequest";

export const searchUser = async (param: string) => {
  try {
    const response = await httpRequest.get(`/api/users/search?q=${param}`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}