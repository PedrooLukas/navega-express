"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/operador")) {
    return null;
  }

  return (
    <footer className="text-white py-16">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] rounded-3xl p-8 md:p-12">
          {/* --- Simplified Newsletter Section --- */}
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 font-[family-name:var(--font-rajdhani)] text-white">
              Join Our Newsletter
            </h3>
            <p className="text-white/80 text-sm mb-6 font-[family-name:var(--font-nunito-sans)]">
              Eget nulla phasellus odio sit porttitor enatibus aliquam
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="E-mail address"
                className="bg-white/90 text-gray-900 border-0 placeholder:text-gray-500 flex-grow"
              />
              <Button className="px-6 bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 transition-all">
                Subscribe →
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm font-[family-name:var(--font-nunito-sans)]">
            Copyright © Navega Afuá | All rights reserved
          </p>
          <div className="flex gap-6 text-sm font-[family-name:var(--font-nunito-sans)]">
            <Link href="#" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/60 hover:text-white transition-colors">
              Cookies
            </Link>
            <Link href="#" className="text-white/60 hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}