/**
 * Subscription Component
 * 
 * Componente de planos de passagens com diferentes níveis de conforto.
 * Exibe cards de planos (Básico, Conforto, Premium) com preços e features.
 * 
 * Usado em: Home (acima do Footer)
 */

import React from 'react';

export default function Subscription() {
  const plans = [
    {
      name: 'Básico',
      price: 'R$ 85',
      period: 'por viagem',
      description: 'Ideal para viajantes individuais',
      features: [
        'Assento Padrão',
        '1 Bagagem de Mão',
        'Embarque Prioritário',
        'Seguro Viagem Básico',
        'Suporte via Chat'
      ],
      buttonText: 'Comprar Passagem',
      isPopular: false,
      highlight: false
    },
    {
      name: 'Conforto',
      price: 'R$ 145',
      period: 'por viagem',
      description: 'Para quem busca mais comodidade',
      features: [
        'Cabine Compartilhada',
        '2 Bagagens (Mão + Despachada)',
        'Refeições Incluídas',
        'Wi-Fi a Bordo',
        'Suporte via Telefone'
      ],
      buttonText: 'Comprar Passagem',
      isPopular: false,
      highlight: false
    },
    {
      name: 'Premium',
      price: 'R$ 220',
      period: 'por viagem',
      description: 'Experiência completa de viagem',
      features: [
        'Cabine Privativa',
        'Bagagem Ilimitada',
        'Todas as Refeições + Bar',
        'Acesso Lounge VIP',
        'Suporte via WhatsApp 24/7'
      ],
      buttonText: 'Comprar Passagem',
      isPopular: true,
      highlight: true
    }
  ];

  return (
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-[family-name:var(--font-rajdhani)]">
            Escolha o plano ideal para <span className="text-[#0ea5e9]">sua viagem</span>
          </h1>
          <p className="text-white/70 text-lg font-[family-name:var(--font-nunito-sans)]">
            Opções que se adequam ao seu conforto e necessidades de viagem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 shadow-lg transition-transform hover:scale-105 ${
                plan.highlight
                  ? 'bg-[#0ea5e9] text-white'
                  : 'bg-white/5 backdrop-blur-sm border-2 border-white/10 hover:border-[#0ea5e9]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 right-4 bg-[#0284c7] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-semibold mb-2 font-[family-name:var(--font-montserrat)] ${plan.highlight ? 'text-white' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className={`text-5xl font-bold font-[family-name:var(--font-rajdhani)] ${plan.highlight ? 'text-white' : 'text-white'}`}>
                    {plan.price}
                  </span>
                </div>
                <p className={`text-sm font-[family-name:var(--font-nunito-sans)] ${plan.highlight ? 'text-white/90' : 'text-white/70'}`}>
                  {plan.period}
                </p>
                <p className={`text-sm mt-2 font-[family-name:var(--font-nunito-sans)] ${plan.highlight ? 'text-white/90' : 'text-white/70'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? 'text-white/80' : 'text-[#0ea5e9]'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`text-sm font-[family-name:var(--font-nunito-sans)] ${plan.highlight ? 'text-white' : 'text-white/80'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 px-6 rounded-lg font-semibold transition-colors font-[family-name:var(--font-nunito-sans)] bg-white/10 border-2 border-white/20 text-white hover:bg-white/20"
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
