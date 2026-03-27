"use client";

import { Button } from "@/components/ui/Button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ui/Toast";

export default function PassagensPage() {
  const router = useRouter();
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");

  // Pega a data de hoje no formato YYYY-MM-DD
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleOrigemChange = (value: string) => {
    setOrigem(value);
    // Se o destino for igual à nova origem, limpa o destino
    if (destino === value) {
      setDestino("");
    }
  };

  const handleDestinoChange = (value: string) => {
    setDestino(value);
    // Se a origem for igual ao novo destino, limpa a origem
    if (origem === value) {
      setOrigem("");
    }
  };

  const handleBuscar = () => {
    if (!origem || !destino || !data) {
      showToast({
        message: "Por favor, preencha todos os campos!",
        type: "warning",
        duration: 3000
      });
      return;
    }

    if (origem === destino) {
      showToast({
        message: "Origem e destino não podem ser iguais!",
        type: "error",
        duration: 3000
      });
      return;
    }
    
    const params = new URLSearchParams({
      origem,
      destino,
      data
    });
    
    router.push(`/passagens/results?${params.toString()}`);
  };

  return (
    <main className="flex flex-col min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-rajdhani)] text-5xl md:text-6xl font-bold text-white mb-4">
            Encontre sua Viagem
          </h1>
          <p className="font-[family-name:var(--font-nunito-sans)] text-lg text-white/80 max-w-2xl mx-auto">
            Selecione a origem, destino e data para buscar as melhores opções de passagens
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Origem */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 font-[family-name:var(--font-montserrat)]">
                Selecione:
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <select
                  value={origem}
                  onChange={(e) => handleOrigemChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none cursor-pointer font-[family-name:var(--font-nunito-sans)] data-[selected]:text-gray-700"
                >
                  <option value="" disabled hidden>Origem</option>
                  {destino !== "afua" && <option value="afua" className="text-gray-700">Afuá - PA</option>}
                  {destino !== "macapa" && <option value="macapa" className="text-gray-700">Macapá - AP</option>}
                </select>
              </div>
            </div>

            {/* Destino */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 font-[family-name:var(--font-montserrat)]">
                Selecione:
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <select
                  value={destino}
                  onChange={(e) => handleDestinoChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] appearance-none cursor-pointer font-[family-name:var(--font-nunito-sans)] data-[selected]:text-gray-700"
                >
                  <option value="" disabled hidden>Destino</option>
                  {origem !== "afua" && <option value="afua" className="text-gray-700">Afuá - PA</option>}
                  {origem !== "macapa" && <option value="macapa" className="text-gray-700">Macapá - AP</option>}
                </select>
              </div>
            </div>

            {/* Data */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 font-[family-name:var(--font-montserrat)]">
                Selecione:
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  min={getMinDate()}
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] cursor-pointer font-[family-name:var(--font-nunito-sans)]"
                  placeholder="Data"
                />
              </div>
            </div>
          </div>

          {/* Botão Buscar */}
          <div className="flex justify-center">
            <Button
              onClick={handleBuscar}
              size="lg"
              className="bg-gradient-to-r from-[#001845] via-[#0a2463] to-[#0a2463] hover:from-[#000d29] hover:via-[#001845] hover:to-[#001845] text-white font-bold text-lg px-12 py-6 rounded-full shadow-xl transition-all duration-300 font-[family-name:var(--font-montserrat)]"
            >
              Buscar viagens
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Resultados Section (placeholder) */}
        <div className="text-center text-white/60 py-12">
          <p className="text-lg font-[family-name:var(--font-nunito-sans)]">
            Selecione origem, destino e data para ver as viagens disponíveis
          </p>
        </div>
      </div>
    </main>
  );
}
