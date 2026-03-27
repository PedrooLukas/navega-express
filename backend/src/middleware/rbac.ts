import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

type Role = "ADMIN" | "OPERADOR" | "CLIENTE";

const roleHierarchy: Record<Role, number> = {
  ADMIN: 3,
  OPERADOR: 2,
  CLIENTE: 1,
};

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ 
        error: "Acesso negado",
        message: `Requer uma das seguintes roles: ${allowedRoles.join(", ")}`
      });
      return;
    }

    next();
  };
}

export function requireMinRole(minRole: Role) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }

    const userRole = req.user.role as Role;
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[minRole];

    if (userLevel < requiredLevel) {
      res.status(403).json({ 
        error: "Acesso negado",
        message: `Requer nível mínimo: ${minRole}`
      });
      return;
    }

    next();
  };
}
