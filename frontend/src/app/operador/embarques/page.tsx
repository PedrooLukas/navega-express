"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Ship, Plus, Search, Calendar } from "lucide-react";

interface Embarque {
  id: number;
  dataHora: string;
  preco: number;
  assentosDisp: number;
  status: string;
  embarcacao: { id: number; nome: string };
  rota: { id: number; origem: string; destino: string };
  _count: { passagens: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function EmbarquesPage() {
  const { token } = useAuth();
  const [embarques, setEmbarques] = useState<Embarque[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEmbarques();
  }, [token, statusFilter, page]);

  const fetchEmbarques = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`${API_URL}/api/operador/embarques?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEmbarques(data.embarques);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar embarques:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AGENDADO: "bg-blue-100 text-blue-700",
      EM_ANDAMENTO: "bg-yellow-100 text-yellow-700",
      CONCLUIDO: "bg-green-100 text-green-700",
      CANCELADO: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
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
          <h1 className="text-3xl font-bold text-gray-800">Embarques</h1>
          <p className="text-gray-600 mt-1">Gerencie os embarques</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:bg-[#0284c7] transition-colors">
          <Plus className="h-5 w-5" />
          Novo Embarque
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
          >
            <option value="">Todos os status</option>
            <option value="AGENDADO">Agendado</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Rota</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Embarcação</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Data/Hora</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Preço</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Ocupação</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {embarques.map((embarque) => (
                <tr key={embarque.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-lg flex items-center justify-center">
                        <Ship className="h-5 w-5 text-[#0ea5e9]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {embarque.rota.origem} → {embarque.rota.destino}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{embarque.embarcacao.nome}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(embarque.dataHora).toLocaleString("pt-BR")}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    R$ {embarque.preco.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {embarque._count.passagens}/{embarque.assentosDisp + embarque._count.passagens}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(embarque.status)}`}>
                      {embarque.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {embarques.length} de {pagination.total} embarques
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
