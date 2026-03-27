"use client";

import { Check, Star, Anchor, Ship, Crown, Waves, BarChart3, Calendar, Users, Clock, Shield, Headphones, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const plans = [
  {
    name: 'Inicial',
    price: 'R$ 149',
    period: 'por mês',
    description: 'Para pequenas empresas começando',
    icon: Anchor,
    embarcacoes: '1 embarcação',
    features: [
      '1 Embarcação cadastrada',
      'Sistema de Gerenciamento Básico',
      'Venda de passagens online',
      'Relatórios mensais',
      'Suporte via e-mail'
    ],
    buttonText: 'Começar Agora',
    isPopular: false,
    highlight: false
  },
  {
    name: 'Profissional',
    price: 'R$ 349',
    period: 'por mês',
    description: 'Ideal para frotas em crescimento',
    icon: Ship,
    embarcacoes: 'Até 5 embarcações',
    features: [
      'Até 5 Embarcações cadastradas',
      'Sistema de Gerenciamento Completo',
      'Previsão de Maré integrada',
      'Gestão de tripulação',
      'Relatórios semanais detalhados',
      'Dashboard de vendas em tempo real',
      'Suporte via telefone'
    ],
    buttonText: 'Escolher Plano',
    isPopular: true,
    highlight: true
  },
  {
    name: 'Empresarial',
    price: 'R$ 699',
    period: 'por mês',
    description: 'Solução completa para grandes frotas',
    icon: Crown,
    embarcacoes: 'Embarcações ilimitadas',
    features: [
      'Embarcações ilimitadas',
      'Sistema de Gerenciamento Avançado',
      'Previsão de Maré com alertas',
      'Gestão completa de tripulação',
      'Relatórios personalizados',
      'API de integração',
      'Múltiplos usuários admin',
      'Suporte prioritário 24/7'
    ],
    buttonText: 'Falar com Consultor',
    isPopular: false,
    highlight: false
  }
];

const features = [
  {
    icon: BarChart3,
    title: 'Sistema de Gerenciamento',
    description: 'Controle total da sua frota, vendas, rotas e tripulação em um único painel intuitivo.'
  },
  {
    icon: Waves,
    title: 'Previsão de Maré',
    description: 'Tecnologia exclusiva que prevê condições de maré para otimizar rotas e garantir segurança.'
  },
  {
    icon: Calendar,
    title: 'Agendamento Inteligente',
    description: 'Organize viagens, escalas e manutenções com nosso sistema de calendário integrado.'
  },
  {
    icon: TrendingUp,
    title: 'Análise de Desempenho',
    description: 'Métricas detalhadas de ocupação, receita e performance de cada embarcação.'
  }
];

export default function PlanosPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/20 text-[#0ea5e9] px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold font-[family-name:var(--font-nunito-sans)]">
              Planos para empresas de navegação
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-rajdhani)]">
            Gerencie sua frota com{" "}
            <span className="text-[#0ea5e9]">inteligência</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-[family-name:var(--font-nunito-sans)]">
            Soluções completas para donos de embarcações. Cadastre seus barcos, gerencie vendas de passagens, 
            acompanhe a previsão de maré e muito mais. Escolha o plano ideal para o tamanho da sua frota.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] text-white shadow-2xl shadow-[#0ea5e9]/30'
                    : 'bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-[#0ea5e9]'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    Mais Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    plan.highlight ? 'bg-white/20' : 'bg-[#0ea5e9]/20'
                  }`}>
                    <Icon className={`w-8 h-8 ${plan.highlight ? 'text-white' : 'text-[#0ea5e9]'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 font-[family-name:var(--font-montserrat)] ${
                    plan.highlight ? 'text-white' : 'text-white'
                  }`}>
                    {plan.name}
                  </h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    plan.highlight ? 'bg-white/20 text-white' : 'bg-[#0ea5e9]/20 text-[#0ea5e9]'
                  }`}>
                    {plan.embarcacoes}
                  </div>
                  <p className={`text-sm font-[family-name:var(--font-nunito-sans)] ${
                    plan.highlight ? 'text-white/80' : 'text-white/60'
                  }`}>
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-5xl font-bold font-[family-name:var(--font-rajdhani)] ${
                      plan.highlight ? 'text-white' : 'text-white'
                    }`}>
                      {plan.price}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 font-[family-name:var(--font-nunito-sans)] ${
                    plan.highlight ? 'text-white/80' : 'text-white/60'
                  }`}>
                    {plan.period}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlight ? 'bg-white/20' : 'bg-[#0ea5e9]/20'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? 'text-white' : 'text-[#0ea5e9]'}`} />
                      </div>
                      <span className={`text-sm font-[family-name:var(--font-nunito-sans)] ${
                        plan.highlight ? 'text-white' : 'text-white/80'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-6 rounded-xl font-bold text-base transition-all font-[family-name:var(--font-nunito-sans)] ${
                    plan.highlight
                      ? 'bg-white text-[#0ea5e9] hover:bg-gray-100 shadow-lg'
                      : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7]'
                  }`}
                  asChild
                >
                  <Link href="/contato">{plan.buttonText}</Link>
                </Button>
              </div>
            );
          })}
        </div>

        <div className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-rajdhani)]">
              Funcionalidades <span className="text-[#0ea5e9]">Exclusivas</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto font-[family-name:var(--font-nunito-sans)]">
              Tecnologia de ponta para otimizar suas operações e aumentar seus lucros
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-row items-center gap-4 md:flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#0ea5e9] transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#0ea5e9]/20 rounded-xl flex items-center justify-center group-hover:bg-[#0ea5e9]/30 transition-all">
                    <Icon className="w-6 h-6 text-[#0ea5e9]" />
                  </div>
                  <div className="md:text-center">
                    <h3 className="text-base font-bold text-white mb-1 font-[family-name:var(--font-montserrat)] whitespace-nowrap">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/60 font-[family-name:var(--font-nunito-sans)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-[#0ea5e9]/20 to-[#0284c7]/20 backdrop-blur-sm border border-[#0ea5e9]/30 rounded-3xl p-10 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-[family-name:var(--font-rajdhani)]">
              Pronto para expandir seu negócio?
            </h2>
            <p className="text-white/70 mb-8 font-[family-name:var(--font-nunito-sans)] max-w-xl mx-auto">
              Fale com nossa equipe comercial e descubra como a Navega Afuá pode ajudar 
              sua empresa a vender mais passagens e gerenciar sua frota com eficiência.
            </p>
            <Button 
              className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-8 py-6 rounded-xl font-bold"
              asChild
            >
              <Link href="/contato">Falar com Consultor</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
