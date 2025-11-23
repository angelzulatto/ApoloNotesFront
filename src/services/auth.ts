import api from "./api";
import { LoginRequest, LoginResponse } from "../types";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Toast } from "../components/Toast";
import { showToast } from "./toastService";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", credentials);
  return response.data;
};

export const firebaseLogin = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const firebaseLogout = async (): Promise<void> => {
  await auth.signOut();
};

export const firebaseSignUp = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error(error);
    showToast(error.message, "error");
    throw error;
  }
};

export const firebaseSignUpWithGoogle = async (): Promise<void> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const token = credential.accessToken;
      const user = result.user;
      console.log(token, user);
    }
  } catch (error: any) {
    console.error(error);
    showToast(error.message, "error");
    throw error;
  }
};
