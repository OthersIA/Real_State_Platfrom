import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const AgentRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      return res.data;
    },
  });

  // ✅ Still loading auth or user data
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  // ✅ Find this user’s role
  const foundUser = users.find((u) => u.email === user?.email);
  const role = foundUser?.role;

  if (!user || role !== "agent") {
    return (
      <Navigate to="/forbidden" state={{ from: location }} replace />
    );
  }

  return children;
};

export default AgentRoute;
