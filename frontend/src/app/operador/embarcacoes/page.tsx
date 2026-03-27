"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Anchor, Plus, Users } from "lucide-react";

interface Embarcacao {
  id: number;
  nome: string;
  capacidade: number;
  descricao?: string;
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function EmbarcacoesPage() {
  const { token } = useAuth();
  const [embarcacoes, setEmbarcacoes] = useState<Embarcacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmbarcacoes();
  }, [token]);

  const fetchEmbarcacoes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/operador/embarcacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEmbarcacoes(data);
      }
    } catch (error) {
      console.error("Erro ao buscar embarcações:", error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Embarcações</h1>
          <p className="text-gray-600 mt-1">Gerencie as embarcações</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:bg-[#0284c7] transition-colors">
          <Plus className="h-5 w-5" />
          Nova Embarcação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {embarcacoes.map((embarcacao) => (
          <div
            key={embarcacao.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#0ea5e9]/10 rounded-lg flex items-center justify-center">
                <Anchor className="h-6 w-6 text-[#0ea5e9]" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                embarcacao.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}>
                {embarcacao.isActive ? "Ativa" : "Inativa"}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {embarcacao.nome}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Users className="h-4 w-4" />
              <span>Capacidade: {embarcacao.capacidade} passageiros</span>
            </div>

            {embarcacao.descricao && (
              <p className="text-sm text-gray-500">{embarcacao.descricao}</p>
            )}
          </div>
        ))}
      </div>

      {embarcacoes.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Anchor className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma embarcação cadastrada</p>
        </div>
      )}
    </div>
  );
}
