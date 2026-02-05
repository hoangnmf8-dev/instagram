import { httpRequest } from "./httpRequest";

interface ChangePasswordPayload {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}

export const getProfile = async () => {
  try {
    const response = await httpRequest.get("/api/users/profile");
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getUserProfile = async (id: string) => {
  if(!id) return;
  try {
    const response = await httpRequest.get(`/api/users/${id}`);
    return response.data;
  } catch(error) {
    const errorMessage = error.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const editProfile = async(formData: FormData) => { //Thêm kiểu dữ liệu FormData sẽ tự động add header Content-Type: multipart/form-data vào, và trong cấu hình khởi tạo axios không nên để cứng application/json
  try {
    const response = await httpRequest.patch("/api/users/profile", formData);
    return response.data;
  } catch(error) {
    const errorMessage = error.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  try {
    const response = await httpRequest.post("/api/auth/change-password", payload);
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const deleteProfilePicture = async () => {
  try {
    const response = await httpRequest.delete("/api/users/profile/picture");
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const getSuggestedUser = async () => {
  try {
    const response = await httpRequest.get("/api/users/suggested?limit=5");
    return response.data;
  } catch(error) {
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}