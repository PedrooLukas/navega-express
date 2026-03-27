"use client";

import { Button } from "@/components/ui/Button";
import { Ticket, Download, Share2, Ship, Calendar, Clock, User, CreditCard, CheckCircle2, Armchair } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

function BilheteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bilheteRef = useRef<HTMLDivElement>(null);

  const passagemId = searchParams.get("passagemId") || `TKT-${Date.now()}`;
  const nome = searchParams.get("nome") || "Cliente";
  const cpf = searchParams.get("cpf") || "";
  const origem = searchParams.get("origem") || "Origem";
  const destino = searchParams.get("destino") || "Destino";
  const data = searchParams.get("data") || new Date().toLocaleDateString("pt-BR");
  const horario = searchParams.get("horario") || "12:00";
  const embarcacao = searchParams.get("embarcacao") || "Embarcação";
  const valor = Number(searchParams.get("valor")) || 0;
  const seats = searchParams.get("seats") || "";

  const codigoBilhete = `PROJETI-${passagemId}-${Date.now().toString(36).toUpperCase()}`;

  const qrCodeData = JSON.stringify({
    codigo: codigoBilhete,
    passagemId,
    nome,
    cpf,
    origem,
    destino,
    data,
    horario,
    embarcacao,
    valor,
    seats,
    emitidoEm: new Date().toISOString(),
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha Passagem - Projeti",
          text: `Passagem de ${origem} para ${destino} - ${data} ${horario}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    }
  };

  return (
    <main className="flex flex-col min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-[#001845] via-[#0a2463] to-[#3a0ca3]">
      <div className="container mx-auto max-w-2xl">
        {/* Header de Sucesso */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="font-[family-name:var(--font-rajdhani)] text-4xl font-bold text-white mb-2">
            Compra Realizada!
          </h1>
          <p className="text-white/80 font-[family-name:var(--font-nunito-sans)]">
            Sua passagem foi gerada com sucesso
          </p>
        </div>

        {/* Bilhete */}
        <div ref={bilheteRef} className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none">
          {/* Cabeçalho do Bilhete */}
          <div className="bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ship className="h-8 w-8" />
                <div>
                  <h2 className="font-[family-name:var(--font-rajdhani)] text-2xl font-bold">PROJETI</h2>
                  <p className="text-sm text-white/80">Passagem Fluvial</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Código</p>
                <p className="font-mono font-bold">{codigoBilhete.slice(-12)}</p>
              </div>
            </div>
          </div>

          {/* Corpo do Bilhete */}
          <div className="p-6">
            {/* Rota */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-dashed border-gray-200">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 mb-1">ORIGEM</p>
                <p className="font-[family-name:var(--font-rajdhani)] text-xl font-bold text-gray-800">{origem}</p>
              </div>
              <div className="flex-shrink-0 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-[#0ea5e9] to-[#3a0ca3]"></div>
                  <Ship className="h-6 w-6 text-[#3a0ca3]" />
                  <div className="w-16 h-0.5 bg-gradient-to-l from-[#0ea5e9] to-[#3a0ca3]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div>
                </div>
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-gray-500 mb-1">DESTINO</p>
                <p className="font-[family-name:var(--font-rajdhani)] text-xl font-bold text-gray-800">{destino}</p>
              </div>
            </div>

            {/* Informações */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">PASSAGEIRO</p>
                  <p className="font-semibold text-gray-800">{nome}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">CPF</p>
                  <p className="font-semibold text-gray-800">{cpf || "---"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">DATA</p>
                  <p className="font-semibold text-gray-800">{data}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">HORÁRIO</p>
                  <p className="font-semibold text-gray-800">{horario}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2">
                <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                  <Ship className="h-5 w-5 text-[#0ea5e9]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">EMBARCAÇÃO</p>
                  <p className="font-semibold text-gray-800">{embarcacao}</p>
                </div>
              </div>

              {seats && (
                <div className="flex items-center gap-3 col-span-2">
                  <div className="w-10 h-10 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center">
                    <Armchair className="h-5 w-5 text-[#0ea5e9]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">POLTRONA(S)</p>
                    <p className="font-semibold text-gray-800">{seats}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divisor com cortes */}
            <div className="relative py-4">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-[#001845] via-[#0a2463] to-[#3a0ca3] rounded-full"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-gradient-to-br from-[#001845] via-[#0a2463] to-[#3a0ca3] rounded-full"></div>
              <div className="border-t-2 border-dashed border-gray-200"></div>
            </div>

            {/* QR Code e Valor */}
            <div className="flex items-center justify-between pt-4">
              <div className="bg-white p-3 rounded-xl border-2 border-gray-100 shadow-sm">
                <QRCodeSVG 
                  value={qrCodeData}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-xs text-gray-500 text-center mt-2">Escaneie para validar</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">VALOR PAGO</p>
                <p className="font-[family-name:var(--font-rajdhani)] text-4xl font-bold text-[#0ea5e9]">
                  R$ 50.00
                </p>
                <div className="mt-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  CONFIRMADO
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé do Bilhete */}
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-xs text-gray-500">
              Apresente este bilhete no embarque. Válido apenas com documento de identificação.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Emitido em: {new Date().toLocaleString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-8 print:hidden">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex-1 py-6 text-lg bg-white/10 border-2 border-white/30 text-white hover:bg-white/20"
          >
            <Download className="mr-2 h-5 w-5" />
            Baixar PDF
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 py-6 text-lg bg-white/10 border-2 border-white/30 text-white hover:bg-white/20"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Compartilhar
          </Button>
        </div>

        {/* Botão Voltar */}
        <div className="mt-4 print:hidden">
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white font-bold py-6 rounded-xl shadow-lg font-[family-name:var(--font-montserrat)]"
          >
            Voltar para Início
          </Button>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 bg-white/10 rounded-xl p-6 print:hidden">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Informações Importantes
          </h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>• Chegue ao local de embarque com pelo menos 30 minutos de antecedência</li>
            <li>• Apresente um documento de identificação com foto</li>
            <li>• Esta passagem é pessoal e intransferível</li>
            <li>• Em caso de dúvidas, entre em contato pelo nosso suporte</li>
          </ul>
        </div>
      </div>

      {/* Estilos de Impressão */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          main {
            background: white !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}

export default function BilhetePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#001845] via-[#0a2463] to-[#3a0ca3]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <BilheteContent />
    </Suspense>
  );
}
