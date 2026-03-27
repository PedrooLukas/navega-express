"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Plus, Search, Phone, Mail } from "lucide-react";

interface Passageiro {
  id: number;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function PassageirosPage() {
  const { token } = useAuth();
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPassageiros();
  }, [token, page]);

  const fetchPassageiros = async () => {
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");
      if (search) params.append("search", search);

      const response = await fetch(`${API_URL}/api/operador/passageiros?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPassageiros(data.passageiros);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar passageiros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPassageiros();
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
          <h1 className="text-3xl font-bold text-gray-800">Passageiros</h1>
          <p className="text-gray-600 mt-1">Gerencie os passageiros cadastrados</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0ea5e9] text-white px-4 py-2 rounded-lg hover:bg-[#0284c7] transition-colors">
          <Plus className="h-5 w-5" />
          Novo Passageiro
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7]"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Passageiro</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">CPF</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Contato</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passageiros.map((passageiro) => (
                <tr key={passageiro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#0ea5e9] font-bold">
                          {passageiro.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">{passageiro.nome}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono">
                    {formatCPF(passageiro.cpf)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {passageiro.telefone && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Phone className="h-4 w-4" />
                          {passageiro.telefone}
                        </div>
                      )}
                      {passageiro.email && (
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail className="h-4 w-4" />
                          {passageiro.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(passageiro.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {passageiros.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum passageiro encontrado
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {passageiros.length} de {pagination.total} passageiros
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
