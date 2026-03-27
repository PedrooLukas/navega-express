"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, 
  Ticket, 
  Ship, 
  DollarSign,
  Calendar,
  TrendingUp,
  Clock
} from "lucide-react";

interface DashboardData {
  totais: {
    passageiros: number;
    passagensConfirmadas: number;
    embarques: number;
  };
  hoje: {
    embarques: number;
    passagensVendidas: number;
    valorVendas: number;
  };
  embarquesProximos: Array<{
    id: number;
    dataHora: string;
    preco: number;
    assentosDisp: number;
    status: string;
    embarcacao: { nome: string };
    rota: { origem: string; destino: string };
    _count: { passagens: number };
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function OperadorDashboard() {
  const { token, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/operador/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setError("Erro ao carregar dashboard");
        }
      } catch {
        setError("Erro de conexão");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const stats = [
    {
      title: "Total de Passageiros",
      value: data?.totais.passageiros || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Passagens Confirmadas",
      value: data?.totais.passagensConfirmadas || 0,
      icon: Ticket,
      color: "bg-green-500",
    },
    {
      title: "Total de Embarques",
      value: data?.totais.embarques || 0,
      icon: Ship,
      color: "bg-purple-500",
    },
    {
      title: "Vendas Hoje",
      value: `R$ ${(data?.hoje.valorVendas || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ];

  const todayStats = [
    {
      title: "Embarques Hoje",
      value: data?.hoje.embarques || 0,
      icon: Calendar,
    },
    {
      title: "Passagens Vendidas Hoje",
      value: data?.hoje.passagensVendidas || 0,
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-600 mt-1">
          Aqui está o resumo das operações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#0ea5e9]" />
            Próximos Embarques
          </h2>
          
          {data?.embarquesProximos && data.embarquesProximos.length > 0 ? (
            <div className="space-y-4">
              {data.embarquesProximos.map((embarque) => (
                <div
                  key={embarque.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-lg flex items-center justify-center">
                      <Ship className="h-5 w-5 text-[#0ea5e9]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {embarque.rota.origem} → {embarque.rota.destino}
                      </p>
                      <p className="text-sm text-gray-500">
                        {embarque.embarcacao.nome} • {new Date(embarque.dataHora).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      R$ {embarque.preco.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {embarque._count.passagens}/{embarque.assentosDisp + embarque._count.passagens} lugares
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum embarque agendado
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Resumo de Hoje
          </h2>
          <div className="space-y-4">
            {todayStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#0ea5e9]" />
                    <span className="text-gray-600">{stat.title}</span>
                  </div>
                  <span className="font-bold text-gray-800">{stat.value}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-green-700">Faturamento</span>
              </div>
              <span className="font-bold text-green-700">
                R$ {(data?.hoje.valorVendas || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
