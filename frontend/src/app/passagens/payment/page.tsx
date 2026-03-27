"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, CreditCard, DollarSign, Shield, Check, Loader2, Copy } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { showToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface PagamentoInfo {
  id: string;
  valor: number;
  status: string;
  pixQrCode: string;
  pixCopiaECola: string;
  vencimento: string;
}

interface PassagemInfo {
  id: number;
  status: string;
  valorPago: number;
  passageiro: { nome: string; cpf: string };
  embarque: {
    id: number;
    dataHora: string;
    rota: { origem: string; destino: string };
    embarcacao: { nome: string };
  };
}

function PagamentoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();
  
  const viagemId = searchParams.get("viagemId") || "";
  const embarqueId = searchParams.get("embarqueId") || "";
  const origem = searchParams.get("origem") || "";
  const destino = searchParams.get("destino") || "";
  const numPassageiros = Number(searchParams.get("numPassageiros")) || 1;
  const valorTotal = Number(searchParams.get("valorTotal")) || 0;
  const passageiroNome = searchParams.get("nome") || "";
  const passageiroCpf = searchParams.get("cpf") || "";
  const passageiroEmail = searchParams.get("email") || "";
  const passageiroTelefone = searchParams.get("telefone") || "";
  const seats = searchParams.get("seats") || "";

  const [metodoPagamento, setMetodoPagamento] = useState<"cartao" | "pix">("pix");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [nomePortador, setNomePortador] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [cpfTitular, setCpfTitular] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [pagamentoInfo, setPagamentoInfo] = useState<PagamentoInfo | null>(null);
  const [passagemInfo, setPassagemInfo] = useState<PassagemInfo | null>(null);
  const [verificandoPagamento, setVerificandoPagamento] = useState(false);

  const getCityName = (code: string) => {
    if (code === "afua") return "Afuá - PA";
    if (code === "macapa") return "Macapá - AP";
    return code;
  };

  const viagem = {
    origem: getCityName(origem),
    destino: getCityName(destino),
    data: "31 de outubro de 2025",
    horario: "12:00",
    navio: viagemId === "2" ? "EXPRESSO MARAJÓ" : "F/B LEÃO DO MARAJÓ",
    tipoPassagem: viagemId === "2" ? "Poltrona" : "Rede"
  };

  const passageiros = [
    { nome: passageiroNome || "Cliente", valor: valorTotal / numPassageiros, tarifa: "Tarifa Integral" }
  ];

  const formatarCartao = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .substr(0, 19);
  };

  const formatarValidade = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substr(0, 5);
  };

  const formatarCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const copiarPixCopiaECola = () => {
    if (pagamentoInfo?.pixCopiaECola) {
      navigator.clipboard.writeText(pagamentoInfo.pixCopiaECola);
      showToast({
        message: "Código PIX copiado!",
        type: "success",
        duration: 2000
      });
    }
  };

  const verificarStatusPagamento = useCallback(async () => {
    if (!pagamentoInfo?.id || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/cliente/pagamento/${pagamentoInfo.id}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "RECEIVED" || data.status === "CONFIRMED") {
          showToast({
            message: "Pagamento confirmado! Gerando seu bilhete...",
            type: "success",
            duration: 3000
          });
          
          const params = new URLSearchParams({
            passagemId: passagemInfo?.id?.toString() || "",
            nome: passageiroNome,
            cpf: passageiroCpf,
            origem: viagem.origem,
            destino: viagem.destino,
            data: viagem.data,
            horario: viagem.horario,
            embarcacao: viagem.navio,
            valor: valorTotal.toString(),
            seats,
          });
          
          router.push(`/passagens/bilhete?${params.toString()}`);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    }
  }, [pagamentoInfo?.id, token, passagemInfo?.id, passageiroNome, passageiroCpf, viagem, valorTotal, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (pagamentoInfo && verificandoPagamento) {
      interval = setInterval(verificarStatusPagamento, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pagamentoInfo, verificandoPagamento, verificarStatusPagamento]);

  const handlePagarPix = async (simulado = false) => {
    if (!token) {
      showToast({
        message: "Você precisa estar logado para fazer uma compra",
        type: "error",
        duration: 3000
      });
      router.push("/login");
      return;
    }

    setLoading(true);
    
    const endpoint = simulado ? "/api/cliente/comprar-simulado" : "/api/cliente/comprar";
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          embarqueId: parseInt(embarqueId) || parseInt(viagemId) || 1,
          passageiro: {
            nome: passageiroNome || user?.name || "Cliente",
            cpf: passageiroCpf || "12345678900",
            email: passageiroEmail || user?.email || "cliente@teste.com",
            telefone: passageiroTelefone || "11999999999",
          },
          formaPagamento: "PIX",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPagamentoInfo(data.pagamento);
        setPassagemInfo(data.passagem);
        
        if (simulado) {
          showToast({
            message: "Compra simulada com sucesso! Gerando bilhete...",
            type: "success",
            duration: 3000
          });
          
          setTimeout(() => {
            const params = new URLSearchParams({
              passagemId: data.passagem?.id?.toString() || "SIM-" + Date.now(),
              nome: passageiroNome || "Cliente Teste",
              cpf: passageiroCpf || "000.000.000-00",
              origem: viagem.origem,
              destino: viagem.destino,
              data: viagem.data,
              horario: viagem.horario,
              embarcacao: viagem.navio,
              valor: (data.passagem?.valorPago || valorTotal).toString(),
              seats,
            });
            router.push(`/passagens/bilhete?${params.toString()}`);
          }, 1500);
        } else {
          setVerificandoPagamento(true);
          showToast({
            message: "Cobrança PIX gerada! Escaneie o QR Code para pagar.",
            type: "success",
            duration: 5000
          });
        }
      } else {
        showToast({
          message: data.error || "Erro ao processar pagamento",
          type: "error",
          duration: 5000
        });
        console.error("Erro da API:", data);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      showToast({
        message: "Erro ao conectar com o servidor. Verifique se o backend está rodando.",
        type: "error",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const simularPagamentoConfirmado = () => {
    showToast({
      message: "Simulando pagamento confirmado...",
      type: "success",
      duration: 2000
    });

    const params = new URLSearchParams({
      passagemId: passagemInfo?.id?.toString() || "SIM-" + Date.now(),
      nome: passageiroNome || "Cliente Teste",
      cpf: passageiroCpf || "000.000.000-00",
      origem: viagem.origem,
      destino: viagem.destino,
      data: viagem.data,
      horario: viagem.horario,
      embarcacao: viagem.navio,
      valor: valorTotal.toString(),
      seats,
    });

    setTimeout(() => {
      router.push(`/passagens/bilhete?${params.toString()}`);
    }, 1500);
  };

  const handlePagar = (simulado = false) => {
    if (metodoPagamento === "pix") {
      handlePagarPix(simulado);
    } else {
      if (!numeroCartao || !nomePortador || !validade || !cvv || !cpfTitular) {
        showToast({
          message: "Por favor, preencha todos os campos do cartão!",
          type: "warning",
          duration: 3000
        });
        return;
      }

      showToast({
        message: "Pagamento processado com sucesso!",
        type: "success",
        duration: 3000
      });

      const params = new URLSearchParams({
        passagemId: "CARD-" + Date.now(),
        nome: passageiroNome || nomePortador,
        cpf: passageiroCpf || cpfTitular,
        origem: viagem.origem,
        destino: viagem.destino,
        data: viagem.data,
        horario: viagem.horario,
        embarcacao: viagem.navio,
        valor: valorTotal.toString(),
        seats,
      });

      setTimeout(() => {
        router.push(`/passagens/bilhete?${params.toString()}`);
      }, 2000);
    }
  };

  return (
    <main className="flex flex-col min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-[#001845] via-[#0a2463] to-[#3a0ca3]">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/passagens/checkout?viagemId=${viagemId}&origem=${origem}&destino=${destino}&numPassageiros=${numPassageiros}`}>
            <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar para informações dos passageiros
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo da Compra */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 font-[family-name:var(--font-montserrat)]">
                Resumo da Compra
              </h3>

              {/* Detalhes da Viagem */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm mb-3">Detalhes da Viagem</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <strong>Rota:</strong> {viagem.origem} → {viagem.destino}
                  </p>
                  <p className="text-gray-600">
                    <strong>Data:</strong> {viagem.data}
                  </p>
                  <p className="text-gray-600">
                    <strong>Horário:</strong> {viagem.horario}
                  </p>
                  <p className="text-gray-600">
                    <strong>Embarcação:</strong> {viagem.navio}
                  </p>
                  <p className="text-gray-600">
                    <strong>Tipo de Passagem:</strong> {viagem.tipoPassagem}
                  </p>
                </div>
              </div>

              {/* Passageiros */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm mb-3">Passageiros</h4>
                {passageiros.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-start mb-2">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">{p.nome}</p>
                      <p className="text-gray-500 text-xs">{p.tarifa}</p>
                    </div>
                    <p className="font-semibold text-gray-800">R$ {p.valor.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-semibold">Total</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Valor Total</span>
                  <span className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-[#0ea5e9]">
                    R$ {valorTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Descontos aplicados conforme regras de idade/PcD
                </p>
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-6 w-6 text-[#0ea5e9]" />
                <h3 className="font-bold text-gray-800 text-xl font-[family-name:var(--font-montserrat)]">
                  Pagamento
                </h3>
              </div>

              {/* Forma de Pagamento */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-4">Forma de Pagamento</h4>
                <div className="grid grid-cols-2 gap-4">
                  {/* Cartão de Crédito */}
                  <button
                    onClick={() => setMetodoPagamento("cartao")}
                    className={`border-2 rounded-2xl p-6 text-center transition-all ${
                      metodoPagamento === "cartao"
                        ? "border-[#0ea5e9] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className={`h-8 w-8 mx-auto mb-2 ${
                      metodoPagamento === "cartao" ? "text-[#0ea5e9]" : "text-gray-400"
                    }`} />
                    <p className={`font-semibold ${
                      metodoPagamento === "cartao" ? "text-[#0ea5e9]" : "text-gray-700"
                    }`}>
                      Cartão de Crédito
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Até 12x sem juros</p>
                  </button>

                  {/* PIX */}
                  <button
                    onClick={() => setMetodoPagamento("pix")}
                    className={`border-2 rounded-2xl p-6 text-center transition-all ${
                      metodoPagamento === "pix"
                        ? "border-[#0ea5e9] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <DollarSign className={`h-8 w-8 mx-auto mb-2 ${
                      metodoPagamento === "pix" ? "text-[#0ea5e9]" : "text-gray-400"
                    }`} />
                    <p className={`font-semibold ${
                      metodoPagamento === "pix" ? "text-[#0ea5e9]" : "text-gray-700"
                    }`}>
                      PIX
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Instantâneo</p>
                  </button>
                </div>
              </div>

              {/* Formulário de Cartão */}
              {metodoPagamento === "cartao" && (
                <div className="space-y-4">
                  {/* Número do Cartão */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Número do Cartão <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={numeroCartao}
                      onChange={(e) => setNumeroCartao(formatarCartao(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                    />
                  </div>

                  {/* Nome do Portador */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Nome do Portador <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nomePortador}
                      onChange={(e) => setNomePortador(e.target.value.toUpperCase())}
                      placeholder="NOME COMO NO CARTÃO"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9] uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Validade */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">
                        Validade <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={validade}
                        onChange={(e) => setValidade(formatarValidade(e.target.value))}
                        placeholder="MM/AA"
                        maxLength={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 3))}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>
                  </div>

                  {/* CPF do Titular */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      CPF do Titular <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cpfTitular}
                      onChange={(e) => setCpfTitular(formatarCPF(e.target.value))}
                      placeholder="035.588.582-47"
                      maxLength={14}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                    />
                  </div>

                  {/* Pagamento à Vista */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Pagamento à Vista</p>
                      <p className="text-green-600 text-sm">1x de R$ {valorTotal.toFixed(2)} sem juros</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagamento PIX */}
              {metodoPagamento === "pix" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  {!pagamentoInfo ? (
                    <>
                      <DollarSign className="h-16 w-16 mx-auto mb-4 text-[#0ea5e9]" />
                      <p className="font-semibold text-gray-800 mb-2">Pagamento via PIX</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Clique em &quot;Pagar com PIX&quot; para gerar o QR Code ou use a compra simulada para testar
                      </p>
                      <div className="bg-white rounded-xl p-4 mb-4">
                        <p className="text-xs text-gray-500">Valor a pagar:</p>
                        <p className="font-[family-name:var(--font-rajdhani)] text-2xl font-bold text-[#0ea5e9]">
                          R$ {valorTotal.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePagar(true)}
                        disabled={loading}
                        className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold disabled:opacity-50 transition-colors"
                      >
                        {loading ? "Processando..." : "Compra Simulada (Teste)"}
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Use a compra simulada para testar o fluxo completo sem pagamento real
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-800 mb-4">Escaneie o QR Code para pagar</p>
                      
                      {pagamentoInfo.pixQrCode && (
                        <div className="bg-white rounded-xl p-4 mb-4 inline-block">
                          <img 
                            src={`data:image/png;base64,${pagamentoInfo.pixQrCode}`}
                            alt="QR Code PIX"
                            className="w-48 h-48 mx-auto"
                          />
                        </div>
                      )}

                      <div className="bg-white rounded-xl p-4 mb-4">
                        <p className="text-xs text-gray-500 mb-2">Ou copie o código PIX:</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={pagamentoInfo.pixCopiaECola || ""}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 truncate"
                          />
                          <button
                            onClick={copiarPixCopiaECola}
                            className="p-2 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7]"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 mb-4">
                        <p className="text-xs text-gray-500">Valor a pagar:</p>
                        <p className="font-[family-name:var(--font-rajdhani)] text-2xl font-bold text-[#0ea5e9]">
                          R$ {pagamentoInfo.valor?.toFixed(2) || valorTotal.toFixed(2)}
                        </p>
                      </div>

                      {verificandoPagamento && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Aguardando confirmação do pagamento...
                        </div>
                      )}

                      <button
                        onClick={simularPagamentoConfirmado}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                      >
                        Simular Pagamento Confirmado
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Botão Pagar */}
              <div className="mt-6">
                <Button
                  onClick={() => handlePagar(false)}
                  size="lg"
                  disabled={loading || (metodoPagamento === "pix" && !!pagamentoInfo)}
                  className="w-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:from-[#4f46e5] hover:to-[#4338ca] text-white font-bold text-lg py-6 rounded-xl shadow-lg font-[family-name:var(--font-montserrat)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processando...
                    </span>
                  ) : metodoPagamento === "cartao" ? (
                    "Pagar com Cartão"
                  ) : pagamentoInfo ? (
                    "Aguardando Pagamento"
                  ) : (
                    "Pagar com PIX"
                  )}
                </Button>
              </div>

              {/* Pagamento Seguro */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Pagamento Seguro</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Seus dados estão protegidos com criptografia SSL de 256 bits.
                    </p>
                    <p className="text-xs text-gray-600">
                      Processamento via Mercado Pago.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Carregando...</div>}>
      <PagamentoContent />
    </Suspense>
  );
}
