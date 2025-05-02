import { useState } from "react";
import axios from "axios";

const signIn = async (email, password) => {
  try {
    const response = await axios.post("http://10.0.2.2:5000/signin", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error("SignIn error:", err);
    throw new Error("Giriş başarısız");
  }
};

const signUp = async (email, password) => {
  try {
    const response = await axios.post("http://10.0.2.2:5000/signup", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error("SignUp error:", err);
    throw new Error("Kayıt başarısız");
  }
};

// useAuth hook
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      return result;
    } catch (err) {
      setError(err.message);
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp(email, password);
      return result;
    } catch (err) {
      setError(err.message);
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn: handleSignIn,
    signUp: handleSignUp,
    isLoading,
    error,
  };
};
