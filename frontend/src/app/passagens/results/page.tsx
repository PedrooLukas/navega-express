"use client";

import { Button } from "@/components/ui/Button";
import { Ship, MapPin, Clock, Calendar, Users, Bed, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { showToast } from "@/components/ui/Toast";

function ResultadosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const origem = searchParams.get("origem") || "";
  const destino = searchParams.get("destino") || "";
  const data = searchParams.get("data") || "";

  // Simula verificação de autenticação (em produção, virá do contexto de auth)
  const isLoggedIn = true; // Mude para true para testar logado

  const getCityName = (code: string) => {
    if (code === "afua") return "Afuá - AP";
    if (code === "macapa") return "Macapá - AP";
    return code;
  };

  const handleReservar = (viagemId: number) => {
    if (!isLoggedIn) {
      showToast({
        message: "Por favor, faça login para reservar passagens!",
        type: "warning",
        duration: 4000
      });
      return;
    }

    // Se estiver logado, vai para a página de reserva
    router.push(`/passagens/booking?viagemId=${viagemId}&origem=${origem}&destino=${destino}&data=${data}`);
  };

  // Dados mockados das viagens
  const viagens = [
    {
      id: 1,
      tipo: "navio",
      navio: "F/B LEÃO DO MARAJÓ",
      rating: 4.5,
      precoOriginal: 60.00,
      preco: 50.00,
      desconto: 10,
      vagasDisponiveis: 25,
      horarioPartida: "10:00",
      horarioChegada: "14:00",
      duracao: "4h0m",
      dataViagem: "14/10",
      portoOrigem: "Terminal Hidroviário - AP",
      portoDestino: "Terminal Hidroviário - PA",
      embarcacao: "F/B LEÃO DO MARAJÓ",
      passageiros: 26,
      ocupacao: "4% ocupação",
      acomodacoes: {
        redes: 45,
        redesDisponiveis: 20,
        suites: 3,
        suitesDisponiveis: 3,
        suitesInfo: [
          "+ 3 suítes disponíveis",
          "+ 2 passageiros por suíte"
        ]
      },
      condicoes: "+ Contagem baseada em passageiros não passagem!",
      diasOperacao: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    },
    {
      id: 2,
      tipo: "lancha",
      navio: "EXPRESSO MARAJÓ",
      rating: 4.7,
      precoOriginal: 60.00,
      preco: 50.00,
      desconto: 10,
      vagasDisponiveis: 15,
      horarioPartida: "14:00",
      horarioChegada: "16:00",
      duracao: "2h",
      dataViagem: "14/10",
      portoOrigem: "Terminal Hidroviário - AP",
      portoDestino: "Terminal Hidroviário - PA",
      embarcacao: "EXPRESSO MARAJÓ",
      passageiros: 12,
      ocupacao: "20% ocupação",
      acomodacoes: {
        poltronas: 60,
        poltronasDisponiveis: 48
      },
      condicoes: "+ Não possui acomodações de rede, apenas poltronas",
      diasOperacao: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    }
  ];

  return (
    <main className="flex flex-col min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <Link href="/passagens">
            <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para busca
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-rajdhani)] text-4xl md:text-5xl font-bold text-white mb-2">
              Viagens Disponíveis
            </h1>
            <p className="font-[family-name:var(--font-nunito-sans)] text-lg text-white/80">
              {getCityName(origem)} → {getCityName(destino)} • {data}
            </p>
          </div>
        </div>

        {/* Lista de viagens */}
        <div className="space-y-6">
          {viagens.map((viagem) => (
            <div key={viagem.id} className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Header do card */}
              <div className="bg-gradient-to-r from-[#001845] to-[#0a2463] p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-2 rounded-xl">
                      <Ship className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-bold text-white whitespace-nowrap">
                          {viagem.navio}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          viagem.tipo === "navio" 
                            ? "bg-blue-500 text-white" 
                            : "bg-orange-500 text-white"
                        }`}>
                          {viagem.tipo === "navio" ? "NAVIO" : "LANCHA"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400 text-sm">★ {viagem.rating}</span>
                        <span className="text-white/60 text-sm">
                          {viagem.tipo === "navio" ? "Viagem longa • Redes e Suítes" : "Viagem rápida • Poltronas"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right self-end md:self-auto">
                    <p className="text-white/60 text-sm line-through">R$ {viagem.precoOriginal.toFixed(2)}</p>
                    <p className="font-[family-name:var(--font-rajdhani)] text-4xl font-bold text-white">
                      R$ {viagem.preco.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {viagem.desconto}% OFF
                      </span>
                      <Button size="sm" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold">
                        PIX à vista
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conteúdo do card */}
              <div className="p-6">
                {/* Vagas disponíveis */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-semibold font-[family-name:var(--font-nunito-sans)]">
                    {viagem.vagasDisponiveis} vagas disponíveis
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  {/* Partida */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-semibold text-sm">Partida</span>
                    </div>
                    <p className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-gray-900">
                      {viagem.horarioPartida}
                    </p>
                    <p className="text-gray-600 text-sm font-[family-name:var(--font-nunito-sans)] mt-1">
                      {getCityName(origem)}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{viagem.portoOrigem}</p>
                  </div>

                  {/* Duração */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-3 rounded-full mb-2">
                      <Ship className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-gray-600 font-semibold font-[family-name:var(--font-nunito-sans)]">
                      ⏱ {viagem.duracao}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500 text-sm">{viagem.dataViagem}</span>
                    </div>
                  </div>

                  {/* Chegada */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-semibold text-sm">Chegada</span>
                    </div>
                    <p className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-gray-900">
                      {viagem.horarioChegada}
                    </p>
                    <p className="text-gray-600 text-sm font-[family-name:var(--font-nunito-sans)] mt-1">
                      {getCityName(destino)}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{viagem.portoDestino}</p>
                  </div>
                </div>

                {/* Informações da embarcação */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Ship className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-700 font-[family-name:var(--font-montserrat)] text-sm whitespace-nowrap">
                      Embarcação: {viagem.embarcacao}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: viagem.ocupacao }}></div>
                    </div>
                    <span className="text-sm text-gray-600">{viagem.ocupacao}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{viagem.condicoes}</p>
                </div>

                {/* Acomodações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Redes - apenas para navios */}
                  {viagem.tipo === "navio" && viagem.acomodacoes.redes && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Bed className="h-5 w-5 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-purple-700 font-[family-name:var(--font-montserrat)]">
                              Redes
                            </span>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                              {viagem.acomodacoes.redesDisponiveis} de {viagem.acomodacoes.redes} disponíveis
                            </span>
                          </div>
                          <p className="text-sm text-purple-600">1 pessoa por rede • Acomodação individual</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suítes - apenas para navios */}
                  {viagem.tipo === "navio" && viagem.acomodacoes.suites && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Bed className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-blue-700 font-[family-name:var(--font-montserrat)]">
                              Suítes
                            </span>
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {viagem.acomodacoes.suitesDisponiveis} disponíveis
                            </span>
                          </div>
                          <div className="space-y-1">
                            {viagem.acomodacoes.suitesInfo?.map((info, idx) => (
                              <p key={idx} className="text-sm text-blue-600">{info}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Poltronas - apenas para lanchas */}
                  {viagem.tipo === "lancha" && viagem.acomodacoes.poltronas && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 md:col-span-2">
                      <div className="flex items-start gap-3">
                        <Bed className="h-5 w-5 text-indigo-600 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-indigo-700 font-[family-name:var(--font-montserrat)]">
                              Poltronas
                            </span>
                            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                              {viagem.acomodacoes.poltronasDisponiveis} de {viagem.acomodacoes.poltronas} disponíveis
                            </span>
                          </div>
                          <p className="text-sm text-indigo-600">Assentos confortáveis tipo poltrona • Sem opção de rede ou suíte</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dias de operação */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-gray-700 font-[family-name:var(--font-montserrat)]">
                      Dias de Operação
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {viagem.diasOperacao.map((dia) => (
                      <div
                        key={dia}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          dia === "Ter"
                            ? "bg-green-500 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {dia}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de reserva */}
                <Button
                  onClick={() => handleReservar(viagem.id)}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white font-bold text-lg py-6 rounded-xl shadow-lg font-[family-name:var(--font-montserrat)]"
                >
                  Reservar Passagem
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Carregando...</div>}>
      <ResultadosContent />
    </Suspense>
  );
}
