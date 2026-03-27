import axios, { AxiosInstance, AxiosError } from "axios";

// ===========================================
// CONFIGURAÇÃO DO AXIOS PARA ASAAS
// ===========================================

const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://api-sandbox.asaas.com/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY || "$aact_hmlg_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjM2MDg5MTdhLTAwODEtNGRkZS05ZGI4LWVkOWYyN2JhNTJkMzo6JGFhY2hfZTMyZjg1OTQtODNjMy00Zjk0LTg5MDctMTVhMDgzNjlkMmFh";

// Instância do Axios configurada com URL base e headers

const asaasApi: AxiosInstance = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    "Content-Type": "application/json",
    "access_token": ASAAS_API_KEY,
  },
});

// ===========================================
// INTERFACES (TIPAGEM)
// ===========================================

export interface CustomerData {
  name: string;
  cpfCnpj: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
}

export interface PaymentData {
  value: number;
  dueDate: string;
  description?: string;
  billingType: "PIX" | "BOLETO" | "CREDIT_CARD";
  externalReference?: string;
}

export interface AsaasCustomerResponse {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
}

export interface AsaasPaymentResponse {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  status: string;
  billingType: string;
  dueDate: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  description?: string;
}

export interface AsaasPixQrCodeResponse {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface AsaasError {
  errors: Array<{
    code: string;
    description: string;
  }>;
}

// ===========================================
// FUNÇÕES DO SERVICE
// ===========================================

/**
 * Cria um novo cliente no Asaas
 * @param userData - Dados do usuário para criar o cliente
 * @returns ID do cliente criado (ex: cus_00001)
 */
export async function createCustomer(userData: CustomerData): Promise<string> {
  try {
    console.log("[AsaasService] Criando cliente no Asaas:", userData.name);

    const response = await asaasApi.post<AsaasCustomerResponse>("/customers", {
      name: userData.name,
      cpfCnpj: userData.cpfCnpj.replace(/\D/g, ""), // Remove formatação do CPF
      email: userData.email,
      phone: userData.phone,
      mobilePhone: userData.mobilePhone || userData.phone,
    });

    console.log("[AsaasService] Cliente criado com sucesso:", response.data.id);
    return response.data.id;

  } catch (error) {
    const axiosError = error as AxiosError<AsaasError>;
    
    if (axiosError.response?.data?.errors) {
      const errorMessage = axiosError.response.data.errors
        .map((e) => e.description)
        .join(", ");
      console.error("[AsaasService] Erro ao criar cliente:", errorMessage);
      throw new Error(`Erro ao criar cliente no Asaas: ${errorMessage}`);
    }

    console.error("[AsaasService] Erro desconhecido ao criar cliente:", error);
    throw new Error("Erro ao criar cliente no Asaas");
  }
}

/**
 * Busca um cliente existente no Asaas pelo CPF/CNPJ
 * @param cpfCnpj - CPF ou CNPJ do cliente
 * @returns ID do cliente ou null se não encontrado
 */
export async function findCustomerByCpf(cpfCnpj: string): Promise<string | null> {
  try {
    const cpfLimpo = cpfCnpj.replace(/\D/g, "");
    console.log("[AsaasService] Buscando cliente por CPF:", cpfLimpo);

    const response = await asaasApi.get<{ data: AsaasCustomerResponse[] }>(
      `/customers?cpfCnpj=${cpfLimpo}`
    );

    if (response.data.data && response.data.data.length > 0) {
      console.log("[AsaasService] Cliente encontrado:", response.data.data[0].id);
      return response.data.data[0].id;
    }

    console.log("[AsaasService] Cliente não encontrado");
    return null;

  } catch (error) {
    console.error("[AsaasService] Erro ao buscar cliente:", error);
    return null;
  }
}

/**
 * Cria uma cobrança no Asaas
 * @param customerId - ID do cliente no Asaas (ex: cus_00001)
 * @param paymentData - Dados da cobrança
 * @returns Dados completos da cobrança criada
 */
export async function createPayment(
  customerId: string,
  paymentData: PaymentData
): Promise<AsaasPaymentResponse> {
  try {
    console.log("[AsaasService] Criando cobrança para cliente:", customerId);

    const response = await asaasApi.post<AsaasPaymentResponse>("/payments", {
      customer: customerId,
      billingType: paymentData.billingType,
      value: paymentData.value,
      dueDate: paymentData.dueDate,
      description: paymentData.description,
      externalReference: paymentData.externalReference,
    });

    console.log("[AsaasService] Cobrança criada com sucesso:", response.data.id);
    return response.data;

  } catch (error) {
    const axiosError = error as AxiosError<AsaasError>;
    
    if (axiosError.response?.data?.errors) {
      const errorMessage = axiosError.response.data.errors
        .map((e) => e.description)
        .join(", ");
      console.error("[AsaasService] Erro ao criar cobrança:", errorMessage);
      throw new Error(`Erro ao criar cobrança no Asaas: ${errorMessage}`);
    }

    console.error("[AsaasService] Erro desconhecido ao criar cobrança:", error);
    throw new Error("Erro ao criar cobrança no Asaas");
  }
}

/**
 * Busca o QR Code PIX de uma cobrança
 * @param paymentId - ID da cobrança no Asaas
 * @returns Dados do QR Code PIX (imagem em base64 e código copia-e-cola)
 */
export async function getPixQrCode(paymentId: string): Promise<AsaasPixQrCodeResponse> {
  try {
    console.log("[AsaasService] Buscando QR Code PIX para cobrança:", paymentId);

    const response = await asaasApi.get<AsaasPixQrCodeResponse>(
      `/payments/${paymentId}/pixQrCode`
    );

    console.log("[AsaasService] QR Code obtido com sucesso");
    return response.data;

  } catch (error) {
    const axiosError = error as AxiosError<AsaasError>;
    
    if (axiosError.response?.data?.errors) {
      const errorMessage = axiosError.response.data.errors
        .map((e) => e.description)
        .join(", ");
      console.error("[AsaasService] Erro ao buscar QR Code:", errorMessage);
      throw new Error(`Erro ao buscar QR Code: ${errorMessage}`);
    }

    console.error("[AsaasService] Erro desconhecido ao buscar QR Code:", error);
    throw new Error("Erro ao buscar QR Code PIX");
  }
}

/**
 * Consulta o status de uma cobrança
 * @param paymentId - ID da cobrança no Asaas
 * @returns Dados atualizados da cobrança
 */
export async function getPaymentStatus(paymentId: string): Promise<AsaasPaymentResponse> {
  try {
    console.log("[AsaasService] Consultando status da cobrança:", paymentId);

    const response = await asaasApi.get<AsaasPaymentResponse>(`/payments/${paymentId}`);

    console.log("[AsaasService] Status:", response.data.status);
    return response.data;

  } catch (error) {
    const axiosError = error as AxiosError<AsaasError>;
    
    if (axiosError.response?.data?.errors) {
      const errorMessage = axiosError.response.data.errors
        .map((e) => e.description)
        .join(", ");
      throw new Error(`Erro ao consultar cobrança: ${errorMessage}`);
    }

    throw new Error("Erro ao consultar cobrança no Asaas");
  }
}

/**
 * Busca a linha digitável do boleto
 * @param paymentId - ID da cobrança no Asaas
 * @returns Linha digitável do boleto
 */
export async function getBoletoIdentificationField(paymentId: string): Promise<string> {
  try {
    const response = await asaasApi.get<{ identificationField: string }>(
      `/payments/${paymentId}/identificationField`
    );
    return response.data.identificationField;
  } catch (error) {
    throw new Error("Erro ao buscar linha digitável do boleto");
  }
}

// Export default com todas as funções
export default {
  createCustomer,
  findCustomerByCpf,
  createPayment,
  getPixQrCode,
  getPaymentStatus,
  getBoletoIdentificationField,
};
