import React from "react";
import { Navigate } from "react-router-dom";
import StorageService from "@/services/StorageService";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = StorageService.getJwtCookie();
  const userData: any = StorageService.getJwtCookieData(token);

  // Allowed usertypes
  const allowed = ["1", "2", "10"];

  // // No token → redirect to login
  // if (!token) return <Navigate to="/login" replace />;

  // Not allowed → unauthorized
  if (!allowed.includes(String(userData?.usertype))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
