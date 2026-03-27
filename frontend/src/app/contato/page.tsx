"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      info: "(96) 99999-9999",
      description: "Seg a Sex, 8h às 18h"
    },
    {
      icon: Mail,
      title: "E-mail",
      info: "contato@navegaafua.com.br",
      description: "Respondemos em até 24h"
    },
    {
      icon: MapPin,
      title: "Endereço",
      info: "Afuá, Pará - Brasil",
      description: "Terminal Fluvial"
    },
    {
      icon: Clock,
      title: "Horário",
      info: "Segunda a Sábado",
      description: "08:00 - 18:00"
    }
  ];

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/20 text-[#0ea5e9] px-4 py-2 rounded-full mb-6">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-semibold font-[family-name:var(--font-nunito-sans)]">
              Estamos aqui para ajudar
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-rajdhani)]">
            Entre em <span className="text-[#0ea5e9]">Contato</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-[family-name:var(--font-nunito-sans)]">
            Tem alguma dúvida ou precisa de ajuda? Nossa equipe está pronta para atendê-lo.
            Preencha o formulário ou utilize um dos nossos canais de atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-montserrat)] text-center">
                Envie sua mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 font-[family-name:var(--font-nunito-sans)]">
                      Nome completo
                    </label>
                    <Input
                      placeholder="Digite seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#0ea5e9] focus:ring-0 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 font-[family-name:var(--font-nunito-sans)]">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#0ea5e9] focus:ring-0 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 font-[family-name:var(--font-nunito-sans)]">
                      Telefone
                    </label>
                    <Input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#0ea5e9] focus:ring-0 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 font-[family-name:var(--font-nunito-sans)]">
                      Assunto
                    </label>
                    <select
                      value={formData.assunto}
                      onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:border-[#0ea5e9] focus:ring-0 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#001125]">Selecione um assunto</option>
                      <option value="duvidas" className="bg-[#001125]">Dúvidas sobre passagens</option>
                      <option value="reservas" className="bg-[#001125]">Reservas e cancelamentos</option>
                      <option value="reclamacao" className="bg-[#001125]">Reclamação</option>
                      <option value="sugestao" className="bg-[#001125]">Sugestão</option>
                      <option value="parceria" className="bg-[#001125]">Parceria comercial</option>
                      <option value="outro" className="bg-[#001125]">Outro assunto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 font-[family-name:var(--font-nunito-sans)]">
                    Mensagem
                  </label>
                  <textarea
                    placeholder="Digite sua mensagem..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#0ea5e9] focus:ring-0 transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 bg-white/10 border-2 border-white/20 text-white hover:bg-white/20"
                >
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#0ea5e9] transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#0ea5e9]/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#0ea5e9]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-[family-name:var(--font-montserrat)]">
                        {item.title}
                      </h3>
                      <p className="text-white font-[family-name:var(--font-nunito-sans)]">
                        {item.info}
                      </p>
                      <p className="text-sm text-white/60 font-[family-name:var(--font-nunito-sans)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2 font-[family-name:var(--font-montserrat)]">
                Atendimento Rápido
              </h3>
              <p className="text-white/90 text-sm mb-4 font-[family-name:var(--font-nunito-sans)]">
                Precisa de ajuda imediata? Fale conosco pelo WhatsApp!
              </p>
              <Button
                className="w-full font-bold py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 transition-all"
              >
                Chamar no WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
