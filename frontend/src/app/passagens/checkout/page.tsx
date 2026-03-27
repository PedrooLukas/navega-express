"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, User, CreditCard, Calendar, Mail, Phone, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { showToast } from "@/components/ui/Toast";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viagemId = searchParams.get("viagemId") || "";
  const origem = searchParams.get("origem") || "";
  const destino = searchParams.get("destino") || "";
  const numPassageiros = Number(searchParams.get("numPassageiros")) || 1;
  const seats = searchParams.get("seats") || "";

  const [passageiros, setPassageiros] = useState(
    Array(numPassageiros).fill(null).map(() => ({
      nomeCompleto: "",
      tipoDocumento: "CPF",
      cpf: "",
      dataNascimento: "",
      isPcd: false,
      email: "",
      telefone: ""
    }))
  );

  const getCityName = (code: string) => {
    if (code === "afua") return "Afuá - PA";
    if (code === "macapa") return "Macapá - AP";
    return code;
  };

  // Dados mockados da viagem
  const viagem = {
    origem: getCityName(origem),
    destino: getCityName(destino),
    data: "31 de outubro de 2025",
    navio: viagemId === "2" ? "EXPRESSO MARAJÓ" : "F/B LEÃO DO MARAJÓ",
    precoPorPessoa: viagemId === "2" ? 50.00 : 50.00
  };

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const calcularValorPassageiro = (index: number) => {
    const passageiro = passageiros[index];
    const idade = calcularIdade(passageiro.dataNascimento);
    
    // Crianças 0-5 anos: Gratuito
    if (idade >= 0 && idade <= 5) return 0;
    
    // Crianças 6-10 anos: 50% desconto
    if (idade >= 6 && idade <= 10) return viagem.precoPorPessoa * 0.5;
    
    // Idosos 60+: 50% desconto
    if (idade >= 60) return viagem.precoPorPessoa * 0.3;
    
    // Adultos: Valor integral
    return viagem.precoPorPessoa;
  };

  const calcularTotal = () => {
    return passageiros.reduce((total, _, index) => {
      return total + calcularValorPassageiro(index);
    }, 0);
  };

  const handlePassageiroChange = (index: number, field: string, value: string | boolean) => {
    const novosPassageiros = [...passageiros];
    novosPassageiros[index] = {
      ...novosPassageiros[index],
      [field]: value
    };
    setPassageiros(novosPassageiros);
  };

  const validarIdadeMinima = (dataNascimento: string) => {
    const idade = calcularIdade(dataNascimento);
    return idade >= 18;
  };

  const formatarCPF = (cpf: string) => {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatarTelefone = (telefone: string) => {
    return telefone
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleFinalizar = () => {
    // Validar todos os campos
    for (let i = 0; i < passageiros.length; i++) {
      const p = passageiros[i];
      
      if (!p.nomeCompleto || !p.cpf || !p.dataNascimento || !p.email || !p.telefone) {
        showToast({
          message: `Por favor, preencha todos os campos do passageiro ${i + 1}!`,
          type: "warning",
          duration: 3000
        });
        return;
      }

      if (i === 0 && !validarIdadeMinima(p.dataNascimento)) {
        showToast({
          message: "O primeiro passageiro deve ter 18 anos ou mais!",
          type: "error",
          duration: 3000
        });
        return;
      }
    }

    // Ir para página de pagamento com dados do passageiro
    const valorTotal = calcularTotal();
    const primeiroPassageiro = passageiros[0];
    const params = new URLSearchParams({
      viagemId,
      embarqueId: viagemId,
      origem,
      destino,
      numPassageiros: numPassageiros.toString(),
      valorTotal: valorTotal.toString(),
      nome: primeiroPassageiro.nomeCompleto,
      cpf: primeiroPassageiro.cpf,
      email: primeiroPassageiro.email,
      telefone: primeiroPassageiro.telefone,
      seats,
    });
    router.push(`/passagens/payment?${params.toString()}`);
  };

  return (
    <main className="flex flex-col min-h-screen pt-32 pb-20 px-4 bg-gradient-to-br from-[#001845] via-[#0a2463] to-[#3a0ca3]">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/passagens/booking?viagemId=${viagemId}&origem=${origem}&destino=${destino}`}>
            <Button variant="ghost" className="text-white hover:text-white/80 mb-4">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Anterior
            </Button>
          </Link>
          <h1 className="font-[family-name:var(--font-rajdhani)] text-4xl font-bold text-white mb-2">
            Informações dos Passageiros
          </h1>
          <p className="text-white/80 font-[family-name:var(--font-nunito-sans)]">
            Por favor, preencha os dados de todos os passageiros
          </p>
          <p className="text-sm text-white/60 mt-2">
            {viagem.origem} → {viagem.destino} • {viagem.data}
            <Link href="#" className="text-[#0ea5e9] ml-2 font-semibold hover:underline">
              PADRÃO
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulários dos passageiros */}
          <div className="lg:col-span-2 space-y-6">
            {passageiros.map((passageiro, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                {/* Alerta de restrição de idade */}
                {index === 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800 text-sm">
                          Restrição de Idade - Primeiro Passageiro
                        </p>
                        <p className="text-yellow-700 text-sm mt-1">
                          O primeiro passageiro deve ter <strong>18 anos ou mais</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="font-bold text-gray-800 mb-4 font-[family-name:var(--font-montserrat)]">
                  Passageiro {index + 1}
                </h3>

                {/* Nome Completo */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={passageiro.nomeCompleto}
                      onChange={(e) => handlePassageiroChange(index, "nomeCompleto", e.target.value)}
                      placeholder="Nome completo conforme documento"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9] font-[family-name:var(--font-nunito-sans)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Tipo de Documento */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Tipo de Documento <span className="text-xs text-gray-500">*(CPF obrigatório)</span>
                    </label>
                    <select
                      value={passageiro.tipoDocumento}
                      onChange={(e) => handlePassageiroChange(index, "tipoDocumento", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9] font-semibold"
                    >
                      <option value="CPF">CPF</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      CPF é obrigatório para todos os passageiros conforme regulamentação
                    </p>
                  </div>

                  {/* CPF */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      CPF <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={passageiro.cpf}
                        onChange={(e) => handlePassageiroChange(index, "cpf", formatarCPF(e.target.value))}
                        placeholder="XXX.XXX.XXX-XX"
                        maxLength={14}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>
                  </div>
                </div>

                {/* Data de Nascimento */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={passageiro.dataNascimento}
                      onChange={(e) => handlePassageiroChange(index, "dataNascimento", e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                    />
                  </div>
                  {passageiro.dataNascimento && (
                    <p className="text-xs text-gray-500 mt-1">
                      Idade: {calcularIdade(passageiro.dataNascimento)} anos
                    </p>
                  )}
                </div>

                {/* Pessoa com Deficiência */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={passageiro.isPcd}
                      onChange={(e) => handlePassageiroChange(index, "isPcd", e.target.checked)}
                      className="w-4 h-4 text-[#0ea5e9] rounded"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-red-400">♥</span>
                      Pessoa com Deficiência (PcD)
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Marque esta opção se o passageiro possui alguma deficiência para aplicação de desconto conforme lei
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={passageiro.email}
                        onChange={(e) => handlePassageiroChange(index, "email", e.target.value)}
                        placeholder="email@exemplo.com"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Telefone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={passageiro.telefone}
                        onChange={(e) => handlePassageiroChange(index, "telefone", formatarTelefone(e.target.value))}
                        placeholder="(XX) XXXXX-XXXX"
                        maxLength={15}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botões de ação */}
            <div className="flex gap-3">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1 py-6 text-lg border-2"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Anterior
              </Button>
              <Button
                onClick={() => {
                  // Limpar todos os campos
                  setPassageiros(passageiros.map(() => ({
                    nomeCompleto: "",
                    tipoDocumento: "CPF",
                    cpf: "",
                    dataNascimento: "",
                    isPcd: false,
                    email: "",
                    telefone: ""
                  })));
                }}
                variant="outline"
                className="px-6 py-6 text-lg border-2"
              >
                Limpar Campos
              </Button>
            </div>
          </div>

          {/* Resumo da Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-[#0ea5e9]" />
                <h3 className="font-bold text-gray-800 font-[family-name:var(--font-montserrat)]">
                  Resumo da Reserva
                </h3>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-700 text-sm">Passagens</h4>
                {passageiros.map((passageiro, index) => {
                  const valor = calcularValorPassageiro(index);
                  const idade = calcularIdade(passageiro.dataNascimento);
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {index + 1} passageiro × R$ {viagem.precoPorPessoa.toFixed(2)}
                        {passageiro.dataNascimento && idade >= 0 && idade <= 5 && (
                          <span className="text-green-600 ml-1">(Grátis)</span>
                        )}
                        {passageiro.dataNascimento && ((idade >= 6 && idade <= 10) || idade >= 60) && (
                          <span className="text-green-600 ml-1">(50% OFF)</span>
                        )}
                      </span>
                      <span className="font-semibold">R$ {valor.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-700 font-semibold">Valor Total</span>
                <span className="font-[family-name:var(--font-rajdhani)] text-3xl font-bold text-[#0ea5e9]">
                  R$ {calcularTotal().toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handleFinalizar}
                size="lg"
                className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white font-bold py-6 rounded-xl shadow-lg font-[family-name:var(--font-montserrat)]"
              >
                Finalizar
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Carregando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
