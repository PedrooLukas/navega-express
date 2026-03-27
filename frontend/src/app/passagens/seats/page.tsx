"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, Ship } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function SeatsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viagemId = searchParams.get("viagemId") || "";
  const origem = searchParams.get("origem") || "";
  const destino = searchParams.get("destino") || "";
  const numPassageiros = Number(searchParams.get("numPassageiros")) || 1;

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const occupiedSeats = [3, 7, 15, 22, 45, 67, 89, 102, 145, 178, 201, 234, 267, 289];

  const totalSeats = 300;
  const seatsPerRow = 8;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);

  const getCityName = (code: string) => {
    if (code === "afua") return "Afuá - PA";
    if (code === "macapa") return "Macapá - AP";
    return code;
  };

  const toggleSeat = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length < numPassageiros) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const getSeatStatus = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return "occupied";
    if (selectedSeats.includes(seatNumber)) return "selected";
    return "available";
  };

  const getSeatStyle = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-gray-400 cursor-not-allowed text-gray-600";
      case "selected":
        return "bg-[#0ea5e9] text-white cursor-pointer hover:bg-[#0284c7]";
      default:
        return "bg-white border-2 border-gray-300 text-gray-700 cursor-pointer hover:border-[#0ea5e9] hover:bg-blue-50";
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length !== numPassageiros) {
      alert(`Por favor, selecione ${numPassageiros} assento(s)`);
      return;
    }

    const seatsParam = selectedSeats.sort((a, b) => a - b).join(",");
    router.push(`/passagens/checkout?viagemId=${viagemId}&origem=${origem}&destino=${destino}&numPassageiros=${numPassageiros}&seats=${seatsParam}`);
  };

  const renderRow = (rowIndex: number) => {
    const startSeat = rowIndex * seatsPerRow + 1;
    const seats = [];

    for (let i = 0; i < 2; i++) {
      const seatNum = startSeat + i;
      if (seatNum <= totalSeats) {
        const status = getSeatStatus(seatNum);
        seats.push(
          <button
            key={seatNum}
            onClick={() => toggleSeat(seatNum)}
            disabled={status === "occupied"}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-t-xl font-bold text-xs md:text-sm transition-all ${getSeatStyle(status)}`}
          >
            {seatNum}
          </button>
        );
      }
    }

    seats.push(<div key="corridor1" className="w-6 md:w-10" />);

    for (let i = 2; i < 6; i++) {
      const seatNum = startSeat + i;
      if (seatNum <= totalSeats) {
        const status = getSeatStatus(seatNum);
        seats.push(
          <button
            key={seatNum}
            onClick={() => toggleSeat(seatNum)}
            disabled={status === "occupied"}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-t-xl font-bold text-xs md:text-sm transition-all ${getSeatStyle(status)}`}
          >
            {seatNum}
          </button>
        );
      }
    }

    seats.push(<div key="corridor2" className="w-6 md:w-10" />);

    for (let i = 6; i < 8; i++) {
      const seatNum = startSeat + i;
      if (seatNum <= totalSeats) {
        const status = getSeatStatus(seatNum);
        seats.push(
          <button
            key={seatNum}
            onClick={() => toggleSeat(seatNum)}
            disabled={status === "occupied"}
            className={`w-10 h-10 md:w-12 md:h-12 rounded-t-xl font-bold text-xs md:text-sm transition-all ${getSeatStyle(status)}`}
          >
            {seatNum}
          </button>
        );
      }
    }

    return seats;
  };

  return (
    <main className="flex flex-col min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-[#001845] via-[#0a2463] to-[#3a0ca3]">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <Link href={`/passagens/booking?viagemId=${viagemId}&origem=${origem}&destino=${destino}`}>
            <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          </Link>
          <h1 className="font-[family-name:var(--font-rajdhani)] text-4xl font-bold text-white mb-2">
            Escolha seus Assentos
          </h1>
          <p className="text-white/80 font-[family-name:var(--font-nunito-sans)]">
            {getCityName(origem)} → {getCityName(destino)}
          </p>
          <p className="text-white/60 text-sm mt-1">
            Selecione {numPassageiros} assento(s) • {selectedSeats.length} selecionado(s)
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-t-lg"></div>
              <span className="text-sm text-gray-600">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0ea5e9] rounded-t-lg"></div>
              <span className="text-sm text-gray-600">Selecionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-400 rounded-t-lg"></div>
              <span className="text-sm text-gray-600">Ocupado</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#001845] to-[#0a2463] rounded-xl p-4 mb-6 text-center">
            <Ship className="h-8 w-8 text-white mx-auto mb-2" />
            <p className="text-white font-bold font-[family-name:var(--font-montserrat)]">FRENTE DA EMBARCAÇÃO</p>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[400px] flex flex-col items-center gap-2">
              {Array.from({ length: totalRows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-1">
                  <span className="w-8 text-right text-xs text-gray-400 mr-2">
                    {rowIndex + 1}
                  </span>
                  {renderRow(rowIndex)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-6 text-sm text-gray-500">
            <span>← Janela</span>
            <span>Corredor</span>
            <span>Corredor</span>
            <span>Janela →</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-600 text-sm">Assentos selecionados:</p>
              <p className="font-bold text-lg text-gray-800">
                {selectedSeats.length > 0 
                  ? selectedSeats.sort((a, b) => a - b).join(", ") 
                  : "Nenhum assento selecionado"}
              </p>
            </div>
            <Button
              onClick={handleContinue}
              disabled={selectedSeats.length !== numPassageiros}
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white font-bold px-12 py-6 rounded-xl shadow-lg font-[family-name:var(--font-montserrat)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar →
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SeatsPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Carregando...</div>}>
      <SeatsContent />
    </Suspense>
  );
}
