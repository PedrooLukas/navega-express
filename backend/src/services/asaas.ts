const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "";

interface ClienteAsaas {
  name: string;
  cpfCnpj: string;
  email?: string;
  phone?: string;
}

interface CobrancaAsaas {
  customer: string;
  billingType: "PIX" | "BOLETO" | "CREDIT_CARD";
  value: number;
  dueDate: string;
  description?: string;
}

async function asaasRequest(endpoint: string, method: string, body?: unknown) {
  const response = await fetch(`${ASAAS_API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "access_token": ASAAS_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Erro Asaas:", data);
    throw new Error(data.errors?.[0]?.description || "Erro na API do Asaas");
  }

  return data;
}

// Criar ou buscar cliente no Asaas
export async function criarClienteAsaas(cliente: ClienteAsaas) {
  // Buscar cliente existente pelo CPF
  const busca = await asaasRequest(`/customers?cpfCnpj=${cliente.cpfCnpj}`, "GET");
  
  if (busca.data && busca.data.length > 0) {
    return busca.data[0];
  }

  // Criar novo cliente
  return await asaasRequest("/customers", "POST", cliente);
}

// Criar cobrança PIX
export async function criarCobrancaPix(customerId: string, valor: number, descricao: string) {
  const hoje = new Date();
  const vencimento = new Date(hoje);
  vencimento.setDate(vencimento.getDate() + 1); // Vence em 1 dia

  const cobranca: CobrancaAsaas = {
    customer: customerId,
    billingType: "PIX",
    value: valor,
    dueDate: vencimento.toISOString().split("T")[0],
    description: descricao,
  };

  return await asaasRequest("/payments", "POST", cobranca);
}

// Buscar QR Code PIX
export async function buscarQrCodePix(paymentId: string) {
  return await asaasRequest(`/payments/${paymentId}/pixQrCode`, "GET");
}

// Consultar status do pagamento
export async function consultarPagamento(paymentId: string) {
  return await asaasRequest(`/payments/${paymentId}`, "GET");
}

// Criar cobrança Boleto
export async function criarCobrancaBoleto(customerId: string, valor: number, descricao: string) {
  const hoje = new Date();
  const vencimento = new Date(hoje);
  vencimento.setDate(vencimento.getDate() + 3); // Vence em 3 dias

  const cobranca: CobrancaAsaas = {
    customer: customerId,
    billingType: "BOLETO",
    value: valor,
    dueDate: vencimento.toISOString().split("T")[0],
    description: descricao,
  };

  return await asaasRequest("/payments", "POST", cobranca);
}

// Buscar linha digitável do boleto
export async function buscarIdentificadorBoleto(paymentId: string) {
  return await asaasRequest(`/payments/${paymentId}/identificationField`, "GET");
}

export default {
  criarClienteAsaas,
  criarCobrancaPix,
  buscarQrCodePix,
  consultarPagamento,
  criarCobrancaBoleto,
  buscarIdentificadorBoleto,
};
