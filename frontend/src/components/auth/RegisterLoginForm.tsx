"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ship } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterLoginForm() {
  const pathname = usePathname();
  const router = useRouter();
  const { login, register, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: ""
  });

  useEffect(() => {
    const isLoginRoute = pathname?.includes('/login');
    if (isLoginRoute) {
      setIsLogin(true);
      const container = document.querySelector('.form-container');
      if (container) {
        container.classList.add('is-login', 'no-transition');
      }
    }
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.senha);
        if (!result.success) {
          setError(result.error || "Erro ao fazer login");
        }
      } else {
        if (formData.senha !== formData.confirmarSenha) {
          setError("As senhas não coincidem!");
          setLoading(false);
          return;
        }
        const result = await register(formData.nome, formData.email, formData.senha, formData.telefone);
        if (!result.success) {
          setError(result.error || "Erro ao registrar");
        }
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const container = document.querySelector('.form-container');
    const wrappers = document.querySelectorAll('.content-wrapper');
    
    if (container) {
      container.classList.remove('no-transition');
      container.classList.add('active');
      
      wrappers.forEach(wrapper => {
        wrapper.classList.remove('fade-in-animation');
      });
      
      setTimeout(() => {
        const newIsLogin = !isLogin;
        setIsLogin(newIsLogin);
        setFormData({ nome: "", email: "", telefone: "", senha: "", confirmarSenha: "" });
        
        if (newIsLogin) {
          container.classList.add('is-login');
        } else {
          container.classList.remove('is-login');
        }
        
        setTimeout(() => {
          wrappers.forEach(wrapper => {
            wrapper.classList.add('fade-in-animation');
          });
          
          setTimeout(() => {
            container.classList.remove('active');
          }, 100);
        }, 50);
      }, 400);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 pt-24">
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25%) translateY(-10px); }
        }

        .form-container {
          position: relative;
          width: 100%;
          max-width: 1200px;
          height: 700px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .blue-side,
        .white-side {
          position: absolute;
          width: 50%;
          height: 100%;
          transition: all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .form-container.no-transition .blue-side,
        .form-container.no-transition .white-side {
          transition: none;
        }

        .blue-side {
          left: 0;
          top: 0;
          background: linear-gradient(to bottom right, #0a5fa5, #0ea5e9);
          z-index: 2;
        }

        .white-side {
          left: 50%;
          top: 0;
          background: white;
          z-index: 1;
        }

        .form-container.is-login .blue-side {
          left: 50%;
        }

        .form-container.is-login .white-side {
          left: 0;
        }

        .content-wrapper {
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .form-container.active .content-wrapper {
          animation: fadeOutContent 0.3s ease forwards;
        }

        @keyframes fadeOutContent {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        @keyframes fadeInContent {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-in-animation {
          animation: fadeInContent 0.5s ease forwards;
        }

        .blue-content,
        .white-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .animate-wave-1 { animation: wave 15s ease-in-out infinite; }
        .animate-wave-2 { animation: wave 10s ease-in-out infinite reverse; animation-delay: -2s; }
        .animate-wave-3 { animation: wave 7s ease-in-out infinite; animation-delay: -4s; }

        @media (max-width: 1023px) {
          .form-container {
            height: auto;
            max-width: 100%;
            background: transparent;
            box-shadow: none;
            padding: 1rem;
            padding-top: 6rem;
          }

          .blue-side {
            display: none;
          }

          .white-side {
            position: relative;
            width: 100%;
            max-width: 450px;
            margin: 0 auto;
            left: auto !important;
            top: auto !important;
            transition: none !important;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .white-content {
            padding: 2.5rem 2rem;
          }
        }
      `}</style>

      <div className="form-container">
        <div className="blue-side">
          <div className="blue-content">
            <div className="content-wrapper relative z-10 text-center space-y-6 text-white">
              <Ship className="h-20 w-20 mx-auto mb-6 drop-shadow-lg transition-transform duration-700 ease-out hover:scale-110" />
              <h1 className="text-5xl font-bold font-[family-name:var(--font-rajdhani)] drop-shadow-md">
                {isLogin ? "Bem-vindo de volta!" : "Navega Afuá"}
              </h1>
              <p className="text-lg font-[family-name:var(--font-nunito-sans)] text-white/90 max-w-sm mx-auto leading-relaxed">
                {isLogin 
                  ? "Acesse sua conta e continue sua jornada com a gente. Viajar nunca foi tão fácil!"
                  : "Sua jornada começa aqui. Cadastre-se e explore novos horizontes com segurança e conforto."}
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none" style={{ lineHeight: 0 }}>
            <svg
              className="relative block w-[200%] h-32 animate-wave-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              style={{ display: 'block', marginBottom: '-1px' }}
            >
              <path
                d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z"
                fill="rgba(10, 95, 165, 0.3)"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none" style={{ lineHeight: 0 }}>
            <svg
              className="relative block w-[200%] h-28 animate-wave-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              style={{ display: 'block', marginBottom: '-1px' }}
            >
              <path
                d="M0,70 C240,30 480,110 720,70 C960,30 1200,110 1440,70 L1440,120 L0,120 Z"
                fill="rgba(8, 80, 140, 0.5)"
              />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none" style={{ lineHeight: 0 }}>
            <svg
              className="relative block w-[200%] h-24 animate-wave-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              style={{ display: 'block', marginBottom: '-1px' }}
            >
              <path
                d="M0,80 C240,40 480,120 720,80 C960,40 1200,120 1440,80 L1440,120 L0,120 Z"
                fill="rgba(6, 65, 115, 0.8)"
              />
            </svg>
          </div>
        </div>

        <div className="white-side">
          <div className="white-content">
            <div className="content-wrapper w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-1 font-[family-name:var(--font-montserrat)]">
                {isLogin ? "Login" : "Criar conta"}
              </h2>
              <p className="text-gray-600 mb-5 text-sm font-[family-name:var(--font-nunito-sans)]">
                {isLogin ? "Entre com suas credenciais" : "Preencha os dados para começar"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="nome" className="block text-xs font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-nunito-sans)]">
                      Nome
                    </label>
                    <Input
                      id="nome"
                      placeholder="Digite seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-0 transition-all duration-300"
                    />
                  </div>
                )}

                <div className="transition-all duration-300">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-nunito-sans)]">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-0 transition-all duration-300"
                  />
                </div>

                <div className="transition-all duration-300">
                  <label htmlFor="senha" className="block text-xs font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-nunito-sans)]">
                    Senha
                  </label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    required
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-0 transition-all duration-300"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmarSenha" className="block text-xs font-medium text-gray-700 mb-1.5 font-[family-name:var(--font-nunito-sans)]">
                      Confirmar Senha
                    </label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      placeholder="Confirme sua senha"
                      value={formData.confirmarSenha}
                      onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
                      required
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#0ea5e9] focus:ring-0 transition-all duration-300"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-start gap-2 pt-1">
                    <input type="checkbox" required className="mt-0.5 rounded accent-[#0ea5e9]" />
                    <label className="text-[10px] text-gray-600 font-[family-name:var(--font-nunito-sans)] leading-tight">
                      Concordo com os{" "}
                      <span className="text-[#0ea5e9] cursor-pointer hover:underline">
                        Termos & Condições
                      </span>
                    </label>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white py-5 text-sm font-semibold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Aguarde...
                    </span>
                  ) : (
                    isLogin ? "Entrar" : "Cadastrar"
                  )}
                </Button>
              </form>

              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white px-2 text-gray-500 font-[family-name:var(--font-nunito-sans)]">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:bg-gray-50 py-4 text-sm font-semibold transition-all duration-300"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continuar com Google
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => router.push(isLogin ? "/register" : "/login")}
                  type="button"
                  className="text-sm text-gray-600 font-[family-name:var(--font-nunito-sans)] hover:text-[#0ea5e9] transition-all duration-300"
                >
                  {isLogin ? (
                    <>Ainda não tem conta? <span className="font-semibold text-[#0ea5e9]">Registre-se</span></>
                  ) : (
                    <>Já tem conta? <span className="font-semibold text-[#0ea5e9]">Faça login</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
