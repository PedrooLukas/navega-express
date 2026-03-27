/**
 * PartnersSlider Component
 * 
 * Carrossel infinito de parceiros/empresas com animação automática.
 * Exibe logos de empresas parceiras em loop contínuo.
 * 
 * Usado em: Home (abaixo da seção hero)
 */

"use client";

export const PartnersSlider = () => {
  const partners = [
    { name: "Empresa 1", logo: "🚢" },
    { name: "Empresa 2", logo: "⚓" },
    { name: "Empresa 3", logo: "🛳️" },
    { name: "Empresa 4", logo: "⛴️" },
    { name: "Empresa 5", logo: "🚤" },
    { name: "Empresa 6", logo: "⛵" },
  ];

  return (
    <div className="w-full bg-white border-y border-gray-200 py-6 overflow-hidden">
      <div className="relative flex">
        <div className="flex animate-[scroll_30s_linear_infinite] gap-16 px-8">
          {partners.map((partner, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center justify-center min-w-[150px] grayscale hover:grayscale-0 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl">{partner.logo}</span>
                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex animate-[scroll_30s_linear_infinite] gap-16 px-8">
          {partners.map((partner, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center justify-center min-w-[150px] grayscale hover:grayscale-0 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-5xl">{partner.logo}</span>
                <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
