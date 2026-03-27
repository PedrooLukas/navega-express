"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "OPERADOR" | "CLIENTE";
  minRole?: "ADMIN" | "OPERADOR" | "CLIENTE";
}

const roleHierarchy = {
  ADMIN: 3,
  OPERADOR: 2,
  CLIENTE: 1,
};

export function ProtectedRoute({ children, requiredRole, minRole }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        router.push("/");
        return;
      }

      if (minRole && user) {
        const userLevel = roleHierarchy[user.role] || 0;
        const requiredLevel = roleHierarchy[minRole];
        if (userLevel < requiredLevel) {
          router.push("/");
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, minRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  if (minRole && user) {
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[minRole];
    if (userLevel < requiredLevel) {
      return null;
    }
  }

  return <>{children}</>;
}
