"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, DollarSign, Ticket, Calendar, Download } from "lucide-react";

interface Venda {
  id: number;
  valorPago: number;
  formaPagamento: string;
  createdAt: string;
  passageiro: { nome: string };
  embarque: { rota: { origem: string; destino: string } };
}

interface ResumoVendas {
  totalVendas: number;
  valorTotal: number;
  porFormaPagamento: Array<{
    formaPagamento: string;
    _sum: { valorPago: number | null };
    _count: number;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function RelatoriosPage() {
  const { token } = useAuth();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [resumo, setResumo] = useState<ResumoVendas | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    fetchRelatorio();
  }, [token]);

  const fetchRelatorio = async () => {
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append("dataInicio", dataInicio);
      if (dataFim) params.append("dataFim", dataFim);

      const response = await fetch(`${API_URL}/api/operador/relatorios/vendas?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setVendas(data.vendas);
        setResumo(data.resumo);
      }
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setLoading(true);
    fetchRelatorio();
  };

  const getPaymentColor = (method: string) => {
    const colors: Record<string, string> = {
      PIX: "bg-[#00D689]",
      DINHEIRO: "bg-yellow-500",
      CARTAO: "bg-purple-500",
    };
    return colors[method] || "bg-gray-500";
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
          <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análise de vendas e faturamento</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7]"
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Vendas</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {resumo?.totalVendas || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Ticket className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Faturamento Total</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                R$ {(resumo?.valorTotal || 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ticket Médio</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                R$ {resumo && resumo.totalVendas > 0 
                  ? (resumo.valorTotal / resumo.totalVendas).toFixed(2) 
                  : "0.00"}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimas Vendas</h2>
          <div className="space-y-4">
            {vendas.slice(0, 10).map((venda) => (
              <div
                key={venda.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{venda.passageiro.nome}</p>
                  <p className="text-sm text-gray-500">
                    {venda.embarque.rota.origem} → {venda.embarque.rota.destino}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    R$ {venda.valorPago.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(venda.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Por Forma de Pagamento</h2>
          <div className="space-y-4">
            {resumo?.porFormaPagamento.map((item) => (
              <div key={item.formaPagamento} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{item.formaPagamento}</span>
                  <span className="font-semibold text-gray-800">
                    R$ {(item._sum.valorPago || 0).toFixed(2)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPaymentColor(item.formaPagamento)} rounded-full`}
                    style={{
                      width: `${resumo.valorTotal > 0 
                        ? ((item._sum.valorPago || 0) / resumo.valorTotal * 100) 
                        : 0}%`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item._count} vendas</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
