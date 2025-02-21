import React from "react";
import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "../services/trainerService";

export default function AuthGuard({ children }) {
  return isUserLoggedIn() ? children : <Navigate to="/login" />;
}
