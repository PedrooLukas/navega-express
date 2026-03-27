"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Plus, Clock, Ruler } from "lucide-react";

interface Rota {
  id: number;
  origem: string;
  destino: string;
  duracao: number;
  distancia?: number;
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function RotasPage() {
  const { token } = useAuth();
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRotas();
  }, [token]);

  const fetchRotas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/operador/rotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setRotas(data);
      }
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Rotas</h1>
          <p className="text-gray-600 mt-1">Gerencie as rotas disponíveis</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:bg-[#0284c7] transition-colors">
          <Plus className="h-5 w-5" />
          Nova Rota
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rotas.map((rota) => (
          <div
            key={rota.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#0ea5e9]/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-[#0ea5e9]" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                rota.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}>
                {rota.isActive ? "Ativa" : "Inativa"}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {rota.origem} → {rota.destino}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Duração: {formatDuration(rota.duracao)}</span>
              </div>
              {rota.distancia && (
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  <span>Distância: {rota.distancia} km</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {rotas.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma rota cadastrada</p>
        </div>
      )}
    </div>
  );
}
