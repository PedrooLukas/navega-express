/**
 * Toast Component
 * 
 * Notificações temporárias que aparecem no canto superior direito da tela.
 * Tipos: success (verde), error (vermelho), warning (laranja), info (azul).
 * 
 * Usado em: Páginas de passagens (busca, reserva, pagamento, checkout)
 */

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export function showToast({ message, type = "info", duration = 3000 }: ToastProps) {
  const existingToast = document.getElementById("custom-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.id = "custom-toast";
  toast.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-300 max-w-md ${
    type === "success" ? "bg-green-500 text-white" :
    type === "error" ? "bg-red-500 text-white" :
    type === "warning" ? "bg-orange-500 text-white" :
    "bg-blue-500 text-white"
  }`;
  
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-lg">${
        type === "success" ? "✓" :
        type === "error" ? "✕" :
        type === "warning" ? "⚠" :
        "ℹ"
      }</span>
      <p class="font-semibold">${message}</p>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 10);

  setTimeout(() => {
    toast.style.transform = "translateX(400px)";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
