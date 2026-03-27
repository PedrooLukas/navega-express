"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Ship, 
  Users, 
  Ticket, 
  MapPin, 
  Anchor, 
  BarChart3,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { name: "Dashboard", href: "/operador", icon: LayoutDashboard },
  { name: "Embarques", href: "/operador/embarques", icon: Ship },
  { name: "Passageiros", href: "/operador/passageiros", icon: Users },
  { name: "Passagens", href: "/operador/passagens", icon: Ticket },
  { name: "Rotas", href: "/operador/rotas", icon: MapPin },
  { name: "Embarcações", href: "/operador/embarcacoes", icon: Anchor },
  { name: "Relatórios", href: "/operador/relatorios", icon: BarChart3 },
];

export default function OperadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <ProtectedRoute minRole="OPERADOR">
      <div className="min-h-screen bg-gray-100 flex">
        <aside className="w-64 bg-[#001845] text-white fixed h-full">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold font-[family-name:var(--font-rajdhani)]">
              Navega Afuá
            </h1>
            <p className="text-sm text-white/60 mt-1">Painel do Operador</p>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-[#0ea5e9] text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-2 text-white/70">
              <div className="w-8 h-8 rounded-full bg-[#0ea5e9] flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-white/50">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 mt-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
