import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBxJI8QjStS2E9H0u-8F8bmpfZsZ2xIfQM",
  authDomain: "first-chat-app-d8582.firebaseapp.com",
  projectId: "first-chat-app-d8582",
  storageBucket: "first-chat-app-d8582.appspot.com",
  messagingSenderId: "758506085193",
  appId: "1:758506085193:web:7baf6febe65bca1e899898"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);