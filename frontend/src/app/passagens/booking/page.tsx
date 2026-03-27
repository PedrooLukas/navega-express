"use client";

import { Button } from "@/components/ui/Button";
import { Ship, MapPin, Clock, Calendar, Users, Tag, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function ReservaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viagemId = searchParams.get("viagemId") || "";
  const origem = searchParams.get("origem") || "";
  const destino = searchParams.get("destino") || "";
  const [numPassageiros, setNumPassageiros] = useState(1);
  const [tipoAcomodacao, setTipoAcomodacao] = useState("");

  const getCityName = (code: string) => {
    if (code === "afua") return "Afuá - PA";
    if (code === "macapa") return "Macapá - AP";
    return code;
  };

  // Dados mockados da viagem (em produção virá do backend)
  const viagem = {
    id: 1,
    tipo: viagemId === "2" ? "lancha" : "navio",
    navio: viagemId === "2" ? "EXPRESSO MARAJÓ" : "F/B LEÃO DO MARAJÓ",
    origem: getCityName(origem),
    destino: getCityName(destino),
    horarioPartida: viagemId === "2" ? "14:00" : "10:00",
    horarioChegada: viagemId === "2" ? "16:00" : "16:06",
    duracao: viagemId === "2" ? "2h" : "6h6m",
    data: "31 de outubro de 2025",
    portoOrigem: "Porto Porto do Oiapó - AP",
    portoDestino: viagemId === "2" ? "Porto Central - PA" : "Porto Leão - PA",
    embarcacao: viagemId === "2" ? "EXPRESSO MARAJÓ" : "F/B LEÃO DO MARAJÓ",
    capacidade: viagemId === "2" ? 60 : 26,
    vagasDisponiveis: viagemId === "2" ? 15 : 25,
    jaReservados: viagemId === "2" ? 0 : 0,
    precoPorPessoa: viagemId === "2" ? 50.00 : 50.00,
    precoOriginal: viagemId === "2" ? 60.00 : 60.00,
    tiposAcomodacao: viagemId === "2" 
      ? [{ tipo: "Poltrona", disponiveis: 48 }]
      : [
          { tipo: "Rede", disponiveis: 20 },
          { tipo: "Suíte", disponiveis: 3, passageirosPorSuite: 2 }
        ]
  };

  const calcularTotal = () => {
    const total = viagem.precoPorPessoa * numPassageiros;
    
    // Aplicar descontos por idade (mockado)
    // Em produção, isso será calculado com base nas idades reais dos passageiros
    
    return total;
  };

  const handleReservar = () => {
    if (viagem.tipo === "lancha") {
      // Para lanchas, vai para seleção de assentos
      router.push(`/passagens/seats?viagemId=${viagem.id}&origem=${origem}&destino=${destino}&numPassageiros=${numPassageiros}`);
    } else {
      // Para navios, vai direto para checkout
      router.push(`/passagens/checkout?viagemId=${viagem.id}&origem=${origem}&destino=${destino}&numPassageiros=${numPassageiros}`);
    }
  };

  return (
    <main className="flex flex-col min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <Link href={`/passagens/results?origem=${origem}&destino=${destino}&data=2025-10-31`}>
            <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para resultados
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-[family-name:var(--font-rajdhani)] text-3xl md:text-4xl font-bold text-white">
              {viagem.origem} → {viagem.destino}
            </h1>
            <span className={`text-xs font-bold px-3 py-1 rounded ${
              viagem.tipo === "navio" 
                ? "bg-blue-500 text-white" 
                : "bg-orange-500 text-white"
            }`}>
              {viagem.tipo === "navio" ? "NAVIO" : "LANCHA/EXPRESSO"}
            </span>
          </div>
          <p className="font-[family-name:var(--font-nunito-sans)] text-lg text-white/80 text-left">
            {viagem.navio} • Embarcação
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
                    {/* Header com preço */}
                    <div className="bg-gradient-to-r from-[#001845] to-[#0a2463] p-6 text-center">
                      <p className="text-white/80 text-sm mb-1">Preço por pessoa</p>
                      <p className="font-[family-name:var(--font-rajdhani)] text-5xl font-bold text-white">
                        R$ {viagem.precoPorPessoa.toFixed(2)}
                      </p>
                    </div>
          <div className="p-6">
            {/* Tipo de acomodação - INFORMATIVO */}
            <div className="mb-6">
              <label className="text-gray-700 font-bold mb-3 font-[family-name:var(--font-montserrat)] flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#0ea5e9]" />
                Tipo de Acomodação
              </label>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 font-semibold mb-2 font-[family-name:var(--font-nunito-sans)]">
                  {viagem.tipo === "navio" ? "Rede" : "Poltrona"}
                </p>
                <p className="text-blue-600 text-sm">
                  {viagem.tipo === "navio" 
                    ? "Acomodação individual em rede • 1 pessoa por passagem"
                    : "Assento individual tipo poltrona • 1 pessoa por passagem"}
                </p>
                {viagem.tipo === "navio" && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600">
                      Opções disponíveis: {viagem.tiposAcomodacao.map(a => `${a.tipo} (${a.disponiveis})`).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes da viagem */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-800 mb-4 font-[family-name:var(--font-montserrat)]">
                Detalhes da Viagem
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 font-[family-name:var(--font-montserrat)]">
                      {viagem.horarioPartida}
                    </p>
                    <p className="text-sm text-gray-600">{viagem.data}</p>
                    <p className="text-sm text-gray-500">{viagem.portoOrigem}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-6">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">Duração: {viagem.duracao}</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 font-[family-name:var(--font-montserrat)]">
                      {viagem.horarioChegada}
                    </p>
                    <p className="text-sm text-gray-600">{viagem.data}</p>
                    <p className="text-sm text-gray-500">{viagem.portoDestino}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div>
                <div className="mb-2">
                  <p className="text-green-700 font-semibold font-[family-name:var(--font-montserrat)]">
                    Disponibilidade:
                  </p>
                  <p className="text-green-600 text-sm">
                    Todas as {viagem.vagasDisponiveis} vagas disponíveis
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Embarcação: {viagem.embarcacao}</p>
                  <p className="text-gray-600 text-sm">Capacidade Total: {viagem.capacidade} passageiros</p>
                  <p className="text-gray-600 text-sm">Já Reservados: {viagem.jaReservados} passageiros</p>
                </div>
              </div>
            </div>

            {/* Regras de desconto */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-blue-800 mb-3 font-[family-name:var(--font-montserrat)] flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Regras de Desconto
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Crianças 0-5 anos:</p>
                    <p className="text-blue-600 text-sm">Passagem gratuita (sempre aplicável)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Crianças 6-10 anos:</p>
                    <p className="text-blue-600 text-sm">Meia passagem (50% desconto)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Idosos 60+ anos:</p>
                    <p className="text-blue-600 text-sm">Meia passagem (50% desconto)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-1" />
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Pessoas com Deficiência:</p>
                    <p className="text-blue-600 text-sm">Tarifa integral (regra não ativada)</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-600">
                  * Os descontos são aplicados automaticamente baseados na data de nascimento informada
                </p>
                <p className="text-xs text-blue-600">
                  * Para PcD, marque a opção correspondente no formulário de passageiros
                </p>
                <p className="text-xs text-blue-600">
                  * Descontos não são cumulativos - será aplicado o melhor desconto disponível
                </p>
                <p className="text-xs text-blue-600">
                  * Limites de gratuidade são por embarcação/data/viagem
                </p>
              </div>
            </div>

            {/* Reservar passagem */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 font-[family-name:var(--font-montserrat)]">
                Reservar Passagem
              </h3>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Número de passageiros
                </label>
                <select
                  value={numPassageiros}
                  onChange={(e) => setNumPassageiros(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none focus:border-[#0ea5e9]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} Passageiro{num > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-xl">
                <div>
                  <p className="text-gray-600 text-sm">Valor total</p>
                  <p className="text-gray-400 text-xs line-through">R$ {(viagem.precoOriginal * numPassageiros).toFixed(2)}</p>
                </div>
                <p className="font-[family-name:var(--font-rajdhani)] text-4xl font-bold text-[#0ea5e9]">
                  R$ {calcularTotal().toFixed(2)}
                </p>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                {viagem.vagasDisponiveis} vagas disponíveis • 1 pessoa por passagem
              </p>

              <Button
                onClick={handleReservar}
                size="lg"
                className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white font-bold text-lg py-6 rounded-xl shadow-lg font-[family-name:var(--font-montserrat)]"
              >
                Reservar agora →
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                * Os preços incluem impostos e taxas
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ReservaPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Carregando...</div>}>
      <ReservaContent />
    </Suspense>
  );
}
