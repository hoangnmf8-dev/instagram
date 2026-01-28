import { httpRequest } from "./httpRequest";

export const getProfile = async () => {
  const response = await httpRequest.get("/api/users/profile");
  if(response.name === "AxiosError") {
    const errorMessage = response.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
  return response.data;
}