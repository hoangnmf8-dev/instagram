import { create } from 'zustand'

interface Token {
  accessToken: string, 
  refreshToken: string
}

interface User {
  _id: string,
  email: string,
  username: string,
  fullName: string,
  isVerified: string,
  createdAt: string
}

interface Auth {
  token: Token | null,
  isAuthenticated: boolean,
  user: User | null,
  setUser: <T>(value: T) => void,
  setToken: <T>(value: T) => void
}

const getJSON = (key: string) => {
  const data = localStorage.getItem(key);
  if(!data) return null;
  try {
    return JSON.parse(data);
  } catch(error) {
    return null;
  }
}


export const useAuth = create<Auth>((set) => ({
  token: getJSON("token") || null,
  user: getJSON("user") || null,
  setUser: (user: User) => {
    if(!user) {
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({
      user
    })
  },
  setToken: (token: Token) => {
    if(!token) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", JSON.stringify(token));
    }
    set({
      token
    })
  },
}))