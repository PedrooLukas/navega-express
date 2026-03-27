import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowRight, Anchor, Waves as WavesIcon, Shield } from "lucide-react";
import { Waves } from "@/components/Waves";
import { PartnersSlider } from "@/components/PartnersSlider";
import { CounterAnimation } from "@/components/CounterAnimation";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 pt-32 pb-24 overflow-hidden">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 lg:mt-32">
              <h1 className="font-[family-name:var(--font-rajdhani)] text-[82px] font-semibold leading-[82px] tracking-normal">
                Navega Express –{" "}
                <br />
                O jeito inteligente de viajar{" "}
                <span className="text-[#0ea5e9]"></span>
              </h1>
              
              <p className="font-[family-name:var(--font-nunito-sans)] text-[18px] font-normal leading-auto tracking-normal text-[#FFFFFF] opacity-60">
                Navega Afuá é especializada na venda de passagens com praticidade, segurança e confiança. Nosso objetivo é facilitar o seu trajeto, oferecendo opções acessíveis e um atendimento que realmente entende suas necessidades.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold px-8" asChild>
                  <Link href="/passagens">
                    Ver Passagens <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:text-white hover:bg-white/10 bg-transparent font-semibold px-8 rounded-xl transition-colors" asChild>
                  <Link href="/sobre">Saiba Mais</Link>
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px] flex items-center justify-center">
                <div className="animate-gentle-rock">
                  <div className="animate-float-boat">
                    <Image 
                      src="/barco-frente.png" 
                      alt="Barco" 
                      width={650} 
                      height={500}
                      className="w-full h-full object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Waves />
      </section>

      <PartnersSlider />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl mb-20">
          <h2 className="text-3xl font-bold text-center mb-4 text-white font-[family-name:var(--font-rajdhani)]">Por que escolher Navega Afuá?</h2>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto font-[family-name:var(--font-nunito-sans)]">
            Oferecemos a melhor experiência em viagens marítimas com conforto, segurança e preços acessíveis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-all border-2 border-white/10 hover:border-[#0ea5e9] bg-white/5 backdrop-blur-sm">
              <CardHeader className="flex items-start gap-4">
                <Anchor className="h-8 w-8 flex-shrink-0 text-[#0ea5e9]" />
                <div>
                  <CardTitle className="text-white font-[family-name:var(--font-montserrat)]">Rotas Seguras</CardTitle>
                  <CardDescription className="text-white/70 font-[family-name:var(--font-nunito-sans)] mt-1">
                    Navegação com capitães experientes e rotas certificadas para sua segurança
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all border-2 border-white/10 hover:border-[#0ea5e9] bg-white/5 backdrop-blur-sm">
              <CardHeader className="flex items-start gap-4">
                <WavesIcon className="h-8 w-8 flex-shrink-0 text-[#0ea5e9]" />
                <div>
                  <CardTitle className="text-white font-[family-name:var(--font-montserrat)]">Conforto a Bordo</CardTitle>
                  <CardDescription className="text-white/70 font-[family-name:var(--font-nunito-sans)] mt-1">
                    Cabines confortáveis, restaurantes e entretenimento durante toda a viagem
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-xl transition-all border-2 border-white/10 hover:border-[#0ea5e9] bg-white/5 backdrop-blur-sm">
              <CardHeader className="flex items-start gap-4">
                <Shield className="h-8 w-8 flex-shrink-0 text-[#0ea5e9]" />
                <div>
                  <CardTitle className="text-white font-[family-name:var(--font-montserrat)]">Garantia Total</CardTitle>
                  <CardDescription className="text-white/70 font-[family-name:var(--font-nunito-sans)] mt-1">
                    Cancelamento gratuito até 24h antes e seguro viagem incluso
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <CounterAnimation 
                end={50} 
                suffix="+" 
                duration={2500}
                className="text-5xl font-bold mb-2 text-white font-[family-name:var(--font-rajdhani)]"
              />
              <p className="text-white/70 font-[family-name:var(--font-nunito-sans)]">Rotas Disponíveis</p>
            </div>
            <div>
              <CounterAnimation 
                end={10} 
                suffix="k+" 
                duration={2500}
                decimals={1}
                className="text-5xl font-bold mb-2 text-white font-[family-name:var(--font-rajdhani)]"
              />
              <p className="text-white/70 font-[family-name:var(--font-nunito-sans)]">Passageiros Felizes</p>
            </div>
            <div>
              <CounterAnimation 
                end={15} 
                duration={2500}
                className="text-5xl font-bold mb-2 text-white font-[family-name:var(--font-rajdhani)]"
              />
              <p className="text-white/70 font-[family-name:var(--font-nunito-sans)]">Anos de Experiência</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-white font-[family-name:var(--font-rajdhani)]">24/7</div>
              <p className="text-white/70 font-[family-name:var(--font-nunito-sans)]">Suporte Online</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
