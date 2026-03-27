import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";
import asaasService from "../services/asaasService";

// ===========================================
// INTERFACES
// ===========================================

interface TicketPurchaseBody {
  embarqueId: number;
  passageiro: {
    nome: string;
    cpf: string;
    email?: string;
    telefone?: string;
  };
  billingType?: "PIX" | "BOLETO";
}

// ===========================================
// CONTROLLER DE PAGAMENTO
// ===========================================

/**
 * Processa a compra de uma passagem
 * 
 * Fluxo:
 * 1. Busca o usuário logado no banco
 * 2. Verifica se já tem asaasId (cliente no Asaas)
 * 3. Se não tiver, cria cliente no Asaas e salva o ID
 * 4. Cria a cobrança no Asaas (PIX ou Boleto)
 * 5. Cria a passagem no banco com status PENDENTE
 * 6. Retorna os dados de pagamento para o frontend
 */
export async function processTicketPurchase(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { embarqueId, passageiro, billingType = "PIX" } = req.body as TicketPurchaseBody;

    // Validação dos dados de entrada
    if (!embarqueId || !passageiro) {
      res.status(400).json({ 
        error: "Dados obrigatórios: embarqueId e passageiro" 
      });
      return;
    }

    const { nome, cpf, email, telefone } = passageiro;

    if (!nome || !cpf) {
      res.status(400).json({ 
        error: "Nome e CPF do passageiro são obrigatórios" 
      });
      return;
    }

    console.log(`[PaymentController] Processando compra - User: ${userId}, Embarque: ${embarqueId}`);

    // =========================================
    // PASSO 1: Buscar usuário no banco
    // =========================================
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    console.log(`[PaymentController] Usuário encontrado: ${user.name}`);

    // =========================================
    // PASSO 2: Verificar embarque disponível
    // =========================================
    const embarque = await prisma.embarque.findUnique({
      where: { id: embarqueId },
      include: { 
        rota: true, 
        embarcacao: true 
      },
    });

    if (!embarque) {
      res.status(404).json({ error: `Viagem com ID ${embarqueId} não encontrada` });
      return;
    }

    if (embarque.status !== "AGENDADO") {
      res.status(400).json({ error: "Esta viagem não está disponível para compra" });
      return;
    }

    if (embarque.assentosDisp <= 0) {
      res.status(400).json({ error: "Não há assentos disponíveis nesta viagem" });
      return;
    }

    console.log(`[PaymentController] Embarque válido: ${embarque.rota.origem} -> ${embarque.rota.destino}`);

    // =========================================
    // PASSO 3: Verificar/Criar cliente no Asaas
    // =========================================
    let asaasCustomerId = user.asaasId;

    if (!asaasCustomerId) {
      console.log("[PaymentController] Usuário não tem asaasId, criando cliente no Asaas...");

      try {
        // Criar cliente no Asaas
        asaasCustomerId = await asaasService.createCustomer({
          name: nome,
          cpfCnpj: cpf,
          email: email || user.email,
          phone: telefone || user.phone || undefined,
        });

        // Salvar o asaasId no banco de dados
        await prisma.user.update({
          where: { id: userId },
          data: { asaasId: asaasCustomerId },
        });

        console.log(`[PaymentController] asaasId salvo no usuário: ${asaasCustomerId}`);

      } catch (asaasError) {
        console.error("[PaymentController] Erro ao criar cliente no Asaas:", asaasError);
        res.status(500).json({ 
          error: "Erro ao registrar cliente no sistema de pagamento",
          details: asaasError instanceof Error ? asaasError.message : "Erro desconhecido"
        });
        return;
      }
    } else {
      console.log(`[PaymentController] Usuário já possui asaasId: ${asaasCustomerId}`);
    }

    // =========================================
    // PASSO 4: Criar cobrança no Asaas
    // =========================================
    const hoje = new Date();
    const vencimento = new Date(hoje);
    vencimento.setDate(vencimento.getDate() + 1); // Vence em 1 dia

    const descricao = `Passagem: ${embarque.rota.origem} → ${embarque.rota.destino} | ${embarque.embarcacao.nome}`;

    let payment;
    try {
      payment = await asaasService.createPayment(asaasCustomerId, {
        value: embarque.preco,
        dueDate: vencimento.toISOString().split("T")[0],
        description: descricao,
        billingType: billingType,
        externalReference: `embarque_${embarqueId}_user_${userId}`,
      });

      console.log(`[PaymentController] Cobrança criada: ${payment.id}`);

    } catch (paymentError) {
      console.error("[PaymentController] Erro ao criar cobrança:", paymentError);
      res.status(500).json({ 
        error: "Erro ao gerar cobrança",
        details: paymentError instanceof Error ? paymentError.message : "Erro desconhecido"
      });
      return;
    }

    // =========================================
    // PASSO 5: Buscar QR Code PIX (se for PIX)
    // =========================================
    let pixData = null;
    if (billingType === "PIX") {
      try {
        pixData = await asaasService.getPixQrCode(payment.id);
        console.log("[PaymentController] QR Code PIX obtido com sucesso");
      } catch (pixError) {
        console.error("[PaymentController] Erro ao buscar QR Code:", pixError);
      }
    }

    // =========================================
    // PASSO 6: Criar passageiro e passagem no banco
    // =========================================
    const cpfLimpo = cpf.replace(/\D/g, "");
    
    // Criar ou buscar passageiro
    let passageiroDb = await prisma.passageiro.findUnique({ 
      where: { cpf: cpfLimpo } 
    });

    if (!passageiroDb) {
      passageiroDb = await prisma.passageiro.create({
        data: { 
          nome, 
          cpf: cpfLimpo, 
          telefone, 
          email 
        },
      });
      console.log(`[PaymentController] Passageiro criado: ${passageiroDb.id}`);
    }

    // Criar passagem com status PENDENTE
    const passagem = await prisma.$transaction(async (tx) => {
      const novaPassagem = await tx.passagem.create({
        data: {
          embarqueId,
          passageiroId: passageiroDb!.id,
          userId,
          valorPago: embarque.preco,
          formaPagamento: billingType,
          status: "PENDENTE",
          assento: payment.id, // Guarda o ID do pagamento para verificação posterior
        },
        include: {
          passageiro: true,
          embarque: { 
            include: { 
              rota: true, 
              embarcacao: true 
            } 
          },
        },
      });

      // Decrementar assentos disponíveis
      await tx.embarque.update({
        where: { id: embarqueId },
        data: { assentosDisp: { decrement: 1 } },
      });

      return novaPassagem;
    });

    console.log(`[PaymentController] Passagem criada: ${passagem.id}`);

    // =========================================
    // PASSO 7: Retornar dados para o frontend
    // =========================================
    res.status(201).json({
      success: true,
      message: "Cobrança criada com sucesso!",
      passagem: {
        id: passagem.id,
        status: passagem.status,
        valorPago: passagem.valorPago,
        passageiro: passagem.passageiro,
        embarque: passagem.embarque,
      },
      pagamento: {
        id: payment.id,
        valor: payment.value,
        status: payment.status,
        billingType: payment.billingType,
        dueDate: payment.dueDate,
        invoiceUrl: payment.invoiceUrl,
        bankSlipUrl: payment.bankSlipUrl,
        // Dados específicos do PIX
        pixQrCode: pixData?.encodedImage || null,
        pixCopiaECola: pixData?.payload || null,
        pixExpiration: pixData?.expirationDate || null,
      },
    });

  } catch (error) {
    console.error("[PaymentController] Erro inesperado:", error);
    res.status(500).json({ 
      error: "Erro interno ao processar compra",
      details: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}

/**
 * Verifica o status de um pagamento
 */
export async function checkPaymentStatus(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      res.status(400).json({ error: "ID do pagamento é obrigatório" });
      return;
    }

    // Consultar status no Asaas
    const payment = await asaasService.getPaymentStatus(paymentId);

    // Se pagamento confirmado, atualizar passagem no banco
    if (payment.status === "RECEIVED" || payment.status === "CONFIRMED") {
      await prisma.passagem.updateMany({
        where: { assento: paymentId },
        data: { status: "CONFIRMADA" },
      });
      console.log(`[PaymentController] Passagem confirmada para pagamento: ${paymentId}`);
    }

    res.json({
      id: payment.id,
      status: payment.status,
      value: payment.value,
      billingType: payment.billingType,
      invoiceUrl: payment.invoiceUrl,
    });

  } catch (error) {
    console.error("[PaymentController] Erro ao verificar status:", error);
    res.status(500).json({ 
      error: "Erro ao verificar status do pagamento" 
    });
  }
}

export default {
  processTicketPurchase,
  checkPaymentStatus,
};
