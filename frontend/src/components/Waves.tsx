/**
 * Waves Component
 * 
 * Componente de ondas animadas decorativas para seção hero.
 * Cria efeito visual de ondas do mar em movimento.
 * 
 * Usado em: Home (seção hero)
 */

export const Waves = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg
        className="relative block w-[200%] h-40 sm:h-56 md:h-72"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z"
          className="fill-[#0a2463]/30 animate-[wave-slow_15s_linear_infinite]"
        />
        
        <path
          d="M0,70 C240,30 480,110 720,70 C960,30 1200,110 1440,70 L1440,120 L0,120 Z"
          className="fill-[#001845]/50 animate-[wave-medium_10s_linear_infinite_reverse]"
        />
        
        <path
          d="M0,80 C240,40 480,120 720,80 C960,40 1200,120 1440,80 L1440,120 L0,120 Z"
          className="fill-[#000d29] animate-[wave-fast_7s_linear_infinite]"
        />
      </svg>
    </div>
  );
};
