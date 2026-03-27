"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Ship, LucideIcon, CreditCard, MessageCircle, User, LogOut, ChevronDown, Mail, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Passagens", href: "/passagens", icon: Ship },
  { name: "Contato", href: "/contato", icon: MessageCircle },
  { name: "Nossos Planos", href: "/planos", icon: CreditCard },
];

const BrazilFlag = () => (
  <svg viewBox="0 0 30 20" className="w-full h-full">
    <rect width="30" height="20" fill="#009c3b"/>
    <path d="M0 10 L15 2 L30 10 L15 18 Z" fill="#ffdf00"/>
    <circle cx="15" cy="10" r="3.5" fill="#002776"/>
  </svg>
);

const USAFlag = () => (
  <svg viewBox="0 0 30 20" className="w-full h-full">
    <rect width="30" height="20" fill="#B22234"/>
    <rect y="2" width="30" height="2" fill="#FFFFFF"/>
    <rect y="6" width="30" height="2" fill="#FFFFFF"/>
    <rect y="10" width="30" height="2" fill="#FFFFFF"/>
    <rect y="14" width="30" height="2" fill="#FFFFFF"/>
    <rect y="18" width="30" height="2" fill="#FFFFFF"/>
    <rect width="12" height="10" fill="#3C3B6E"/>
  </svg>
);

const SpainFlag = () => (
  <svg viewBox="0 0 30 20" className="w-full h-full">
    <rect width="30" height="20" fill="#AA151B"/>
    <rect y="5" width="30" height="10" fill="#F1BF00"/>
  </svg>
);

interface LanguageSelectorProps {
  isScrolled?: boolean;
}

const LanguageSelector = ({ isScrolled = false }: LanguageSelectorProps) => {
  const [selectedLang, setSelectedLang] = useState("pt");
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "pt", name: "Português", flag: <BrazilFlag /> },
    { code: "en", name: "English", flag: <USAFlag /> },
    { code: "es", name: "Español", flag: <SpainFlag /> },
  ];

  const currentLanguage = languages.find(lang => lang.code === selectedLang);

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-6 rounded overflow-hidden border border-white/20 hover:border-white/40 transition-all cursor-pointer"
      >
        {currentLanguage?.flag}
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[140px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors ${
                selectedLang === lang.code ? "bg-gray-50" : ""
              }`}
            >
              <div className="w-6 h-4 rounded overflow-hidden border border-gray-200">
                {lang.flag}
              </div>
              <span className="text-sm font-medium text-gray-700">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface NavLinkProps {
  item: NavItem;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ item, onClick, className }: NavLinkProps) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={className}
    >
      <Icon className="h-5 w-5" />
      <span>{item.name}</span>
    </Link>
  );
};

const Logo = () => (
  <Link href="/" className="flex items-center hover:opacity-90 transition-opacity pt-2">
    <Image 
      src="/LOGO-NAVEGA.svg" 
      alt="Navega Afuá Logo" 
      width={160} 
      height={106}
      className="h-20 w-auto"
      priority
    />
  </Link>
);

interface AuthButtonsProps {
  isMobile?: boolean;
  onClose?: () => void;
  isScrolled?: boolean;
}

const AuthButtons = ({ isMobile = false, onClose }: AuthButtonsProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      ADMIN: "Administrador",
      OPERADOR: "Operador",
      CLIENTE: "Cliente",
    };
    return roles[role] || role;
  };

  if (isAuthenticated && user) {
    if (isMobile) {
      return (
        <div className="space-y-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-white/70 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="text-white/60 text-xs">
              Conta: {getRoleName(user.role)}
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-red-500/80 text-white hover:bg-red-600 font-[family-name:var(--font-montserrat)] font-bold"
            onClick={() => {
              logout();
              onClose?.();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded-full transition-colors"
        >
          <div className="w-8 h-8 bg-[#0ea5e9] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-[family-name:var(--font-montserrat)] font-medium text-sm hidden sm:block">
            {user.name.split(" ")[0]}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-4 bg-gradient-to-r from-[#0284c7] to-[#0ea5e9]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className="text-white/80 text-sm">{getRoleName(user.role)}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3">
                <div className="flex items-center gap-3 px-3 py-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-600">
                  <UserCircle className="h-4 w-4" />
                  <span className="text-sm">Tipo: {getRoleName(user.role)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Sair da conta</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className={isMobile
          ? "w-full border-2 border-white/50 text-white hover:bg-white/10 bg-transparent rounded-xl font-[family-name:var(--font-montserrat)] font-bold"
          : "bg-gradient-to-b from-[#0ea5e9] to-[#0284c7] text-white hover:from-[#0284c7] hover:to-[#0369a1] font-[family-name:var(--font-montserrat)] font-bold rounded-2xl px-8 shadow-lg transition-all"}
        onClick={onClose}
        asChild
      >
        <Link href="/login">Login</Link>
      </Button>
      <Button
        size="lg"
        className={isMobile
          ? "w-full bg-[#0ea5e9] text-white hover:bg-[#0284c7] font-[family-name:var(--font-montserrat)] font-bold"
          : "bg-white text-[#0284c7] hover:bg-[#0284c7] hover:text-white font-[family-name:var(--font-montserrat)] font-bold rounded-full px-6 shadow-lg transition-colors"}
        onClick={onClose}
        asChild
      >
        <Link href="/register">Registre-se</Link>
      </Button>
    </>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isOperadorOrAdmin } = useAuth();
  const closeSheet = () => setIsOpen(false);

  const isOperadorPage = pathname?.startsWith("/operador");
  const shouldRedirect = isAuthenticated && isOperadorOrAdmin() && !isOperadorPage && typeof window !== "undefined";

  useEffect(() => {
    const checkInitialScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    checkInitialScroll();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = "/operador";
    }
  }, [shouldRedirect]);

  // Não renderiza a Navbar no painel do operador
  if (isOperadorPage) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
      isScrolled 
        ? "bg-[#001125] shadow-lg backdrop-blur-md" 
        : "bg-transparent backdrop-blur-sm"
    }`}>
      <div className="container px-6 mx-auto max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex lg:items-center lg:gap-8 flex-1 justify-center">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                className={`flex items-center gap-2 font-[family-name:var(--font-montserrat)] font-bold text-base transition-colors ${
                  isScrolled 
                    ? "text-white hover:text-white/80" 
                    : "text-white hover:text-[#0ea5e9]"
                }`}
              />
            ))}
          </nav>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <LanguageSelector isScrolled={isScrolled} />
            <AuthButtons isScrolled={isScrolled} />
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden ml-auto">
              <Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/10">
                <Menu className="size-7" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#001125] text-white border-none p-6">
              <SheetHeader>
                <SheetTitle className="text-white text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    onClick={closeSheet}
                    className="flex items-center gap-3 text-white text-lg font-medium hover:text-white/80 transition-colors"
                  />
                ))}
                <div className="border-t border-white/20 pt-6 mt-4 space-y-3">
                  <AuthButtons isMobile onClose={closeSheet} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
