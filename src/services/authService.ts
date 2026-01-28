import {httpRequest} from "./httpRequest"

interface PayloadLogin {
  email: string,
  password: string
}

interface PayloadRegister {
 email: string,
 username: string,
 password: string,
 confirmPassword: string,
 fullName: string
}

interface PayloadResendEmail {
  email: string
}

interface PayloadResetPassword {
  password: string,
  confirmPassword: string
}

export const login = async (payload: PayloadLogin) => {
  const response = await httpRequest.post("/api/auth/login", payload);
  return response.data;
}

export const register = async (payload: PayloadRegister) => {
  const response = await httpRequest.post("/api/auth/register", payload);
  if(response.name === "AxiosError") {
    const errorMessage = response.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
  return response.data;
}

export const verifyEmail = async (slug: string) => {
  const response = await httpRequest.post(`/api/auth/verify-email/${slug}`)
  if(response.name === "AxiosError") {
    const errorMessage = response.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
  return response.data;
}

export const resendEmail = async (payload: PayloadResendEmail) => {
  const response = await httpRequest.post(`/api/auth/resend-verification-email`, payload);
  if(response.name === "AxiosError") {
    const errorMessage = response.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
  return response.data;
}

export const forgotPassword = async(payload: PayloadResendEmail) => {
  const response = await httpRequest.post("/api/auth/forgot-password", payload);
  if(response.name === "AxiosError") {
    const errorMessage = response.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
  return response.data;
}

export const resetPassword = async(payload: PayloadResetPassword, token: string) => {
  const response = await httpRequest.post(`/api/auth/reset-password/${token}`, payload);
  if(response.name === "AxiosError") {
    const errorMessage = response.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
  return response.data;
}