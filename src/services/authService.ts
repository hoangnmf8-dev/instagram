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
  try {
    const response = await httpRequest.post("/api/auth/login", payload);
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const register = async (payload: PayloadRegister) => {
  try {
    const response = await httpRequest.post("/api/auth/register", payload);
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const verifyEmail = async (slug: string) => {
  try {
    const response = await httpRequest.post(`/api/auth/verify-email/${slug}`)
    return response.data;
  } catch(error) {
    console.log("🚀 ~ verifyEmail ~ error:", error)
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const resendEmail = async (payload: PayloadResendEmail) => {
  try {
    const response = await httpRequest.post(`/api/auth/resend-verification-email`, payload);
    return response.data;
  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const forgotPassword = async(payload: PayloadResendEmail) => {
  try {
    const response = await httpRequest.post("/api/auth/forgot-password", payload);
    return response.data;
  } catch(error) {
    const errorMessage = response.response.data.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}

export const resetPassword = async(payload: PayloadResetPassword, token: string) => {
  try {
    const response = await httpRequest.post(`/api/auth/reset-password/${token}`, payload);
    return response.data;

  } catch(error) {
    const errorMessage = error?.response?.data?.message || "An unexpected error occurred";
    throw new Error(errorMessage);
  }
}