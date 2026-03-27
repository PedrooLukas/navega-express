"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket, Plus, Search } from "lucide-react";

interface Passagem {
  id: number;
  assento?: string;
  status: string;
  valorPago: number;
  formaPagamento: string;
  createdAt: string;
  passageiro: { nome: string; cpf: string };
  embarque: {
    dataHora: string;
    rota: { origem: string; destino: string };
    embarcacao: { nome: string };
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function PassagensPage() {
  const { token } = useAuth();
  const [passagens, setPassagens] = useState<Passagem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPassagens();
  }, [token, statusFilter, page]);

  const fetchPassagens = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`${API_URL}/api/operador/passagens?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPassagens(data.passagens);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar passagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CONFIRMADA: "bg-green-100 text-green-700",
      CANCELADA: "bg-red-100 text-red-700",
      UTILIZADA: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentColor = (method: string) => {
    const colors: Record<string, string> = {
      PIX: "bg-[#00D689]/10 text-[#00D689]",
      DINHEIRO: "bg-yellow-100 text-yellow-700",
      CARTAO: "bg-purple-100 text-purple-700",
    };
    return colors[method] || "bg-gray-100 text-gray-700";
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
          <h1 className="text-3xl font-bold text-gray-800">Passagens</h1>
          <p className="text-gray-600 mt-1">Gerencie as passagens vendidas</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:bg-[#0284c7] transition-colors">
          <Plus className="h-5 w-5" />
          Nova Passagem
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
            <option value="CONFIRMADA">Confirmada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="UTILIZADA">Utilizada</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Passageiro</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Rota</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Data</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Valor</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Pagamento</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passagens.map((passagem) => (
                <tr key={passagem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                        <Ticket className="h-5 w-5 text-[#0ea5e9]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{passagem.passageiro.nome}</p>
                        <p className="text-sm text-gray-500">{passagem.embarque.embarcacao.nome}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {passagem.embarque.rota.origem} → {passagem.embarque.rota.destino}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(passagem.embarque.dataHora).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    R$ {passagem.valorPago.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(passagem.formaPagamento)}`}>
                      {passagem.formaPagamento}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(passagem.status)}`}>
                      {passagem.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {passagens.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhuma passagem encontrada
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {passagens.length} de {pagination.total} passagens
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
