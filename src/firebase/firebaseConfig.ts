import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCRVuHFtiY8h4269v1a-T4nHMKLhsC-t_0",
  authDomain: "trekbuddy-72b01.firebaseapp.com",
  projectId: "trekbuddy-72b01",
  storageBucket: "trekbuddy-72b01.appspot.com",
  messagingSenderId: "512827597054",
  appId: "1:512827597054:web:a01e3ff2f07534446c85af",
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

