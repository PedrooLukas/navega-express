import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { criarClienteAsaas, criarCobrancaPix, buscarQrCodePix, consultarPagamento } from "../services/asaas";

const router = Router();

// ============ ROTAS PÚBLICAS ============

// Buscar viagens disponíveis
router.get("/viagens", async (req: Request, res: Response): Promise<void> => {
  try {
    const { origem, destino, data } = req.query;

    const where: Record<string, unknown> = {
      status: "AGENDADO",
      assentosDisp: { gt: 0 },
      dataHora: { gte: new Date() },
    };

    if (origem || destino) {
      where.rota = {};
      if (origem) (where.rota as Record<string, unknown>).origem = { contains: origem as string, mode: "insensitive" };
      if (destino) (where.rota as Record<string, unknown>).destino = { contains: destino as string, mode: "insensitive" };
    }

    if (data) {
      const dataInicio = new Date(data as string);
      dataInicio.setHours(0, 0, 0, 0);
      const dataFim = new Date(data as string);
      dataFim.setHours(23, 59, 59, 999);
      where.dataHora = { gte: dataInicio, lte: dataFim };
    }

    const viagens = await prisma.embarque.findMany({
      where,
      include: {
        embarcacao: { select: { id: true, nome: true, capacidade: true } },
        rota: { select: { id: true, origem: true, destino: true, duracao: true } },
      },
      orderBy: { dataHora: "asc" },
    });

    res.json(viagens);
  } catch (error) {
    console.error("Erro ao buscar viagens:", error);
    res.status(500).json({ error: "Erro ao buscar viagens" });
  }
});

// Detalhes de uma viagem
router.get("/viagens/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const viagem = await prisma.embarque.findUnique({
      where: { id: parseInt(id) },
      include: {
        embarcacao: true,
        rota: true,
      },
    });

    if (!viagem) {
      res.status(404).json({ error: "Viagem não encontrada" });
      return;
    }

    res.json(viagem);
  } catch (error) {
    console.error("Erro ao buscar viagem:", error);
    res.status(500).json({ error: "Erro ao buscar viagem" });
  }
});

// Listar rotas disponíveis
router.get("/rotas", async (req: Request, res: Response): Promise<void> => {
  try {
    const rotas = await prisma.rota.findMany({
      where: { isActive: true },
      orderBy: { origem: "asc" },
    });
    res.json(rotas);
  } catch (error) {
    console.error("Erro ao listar rotas:", error);
    res.status(500).json({ error: "Erro ao listar rotas" });
  }
});

// ============ ROTAS AUTENTICADAS (CLIENTE) ============

// Simular compra de passagem (sem Asaas - para testes)
router.post("/comprar-simulado", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { embarqueId, passageiro } = req.body;
    const userId = req.user!.id;

    if (!embarqueId || !passageiro) {
      res.status(400).json({ error: "Embarque e dados do passageiro são obrigatórios" });
      return;
    }

    const { nome, cpf, telefone, email } = passageiro;

    if (!nome || !cpf) {
      res.status(400).json({ error: "Nome e CPF do passageiro são obrigatórios" });
      return;
    }

    // Verificar embarque
    const embarque = await prisma.embarque.findUnique({
      where: { id: embarqueId },
      include: { rota: true, embarcacao: true },
    });

    if (!embarque) {
      res.status(404).json({ error: `Viagem com ID ${embarqueId} não encontrada` });
      return;
    }

    if (embarque.status !== "AGENDADO") {
      res.status(400).json({ error: "Esta viagem não está disponível" });
      return;
    }

    if (embarque.assentosDisp <= 0) {
      res.status(400).json({ error: "Não há assentos disponíveis" });
      return;
    }

    // Criar ou buscar passageiro no banco local
    const cpfLimpo = cpf.replace(/\D/g, "");
    let passageiroDb = await prisma.passageiro.findUnique({ where: { cpf: cpfLimpo } });
    
    if (!passageiroDb) {
      passageiroDb = await prisma.passageiro.create({
        data: { nome, cpf: cpfLimpo, telefone, email },
      });
    }

    // Criar passagem com status CONFIRMADA (simulado)
    const pagamentoId = `SIM-${Date.now()}`;
    const passagem = await prisma.$transaction(async (tx) => {
      const novaPassagem = await tx.passagem.create({
        data: {
          embarqueId,
          passageiroId: passageiroDb!.id,
          userId,
          valorPago: embarque.preco,
          formaPagamento: "PIX",
          status: "CONFIRMADA",
          assento: pagamentoId,
        },
        include: {
          passageiro: true,
          embarque: { include: { rota: true, embarcacao: true } },
        },
      });

      await tx.embarque.update({
        where: { id: embarqueId },
        data: { assentosDisp: { decrement: 1 } },
      });

      return novaPassagem;
    });

    res.status(201).json({
      message: "Compra simulada com sucesso!",
      passagem,
      pagamento: {
        id: pagamentoId,
        valor: embarque.preco,
        status: "CONFIRMED",
        pixQrCode: null,
        pixCopiaECola: "00020126580014br.gov.bcb.pix0136simulado-pix-test@email.com5204000053039865802BR5925SIMULACAO TESTE6009SAO PAULO62070503***6304ABCD",
        vencimento: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao simular compra:", error);
    res.status(500).json({ error: "Erro ao processar compra simulada" });
  }
});

// Comprar passagem com pagamento Asaas
router.post("/comprar", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { embarqueId, passageiro, formaPagamento = "PIX" } = req.body;
    const userId = req.user!.id;

    if (!embarqueId || !passageiro) {
      res.status(400).json({ error: "Embarque e dados do passageiro são obrigatórios" });
      return;
    }

    const { nome, cpf, telefone, email } = passageiro;

    if (!nome || !cpf) {
      res.status(400).json({ error: "Nome e CPF do passageiro são obrigatórios" });
      return;
    }

    // Verificar embarque
    const embarque = await prisma.embarque.findUnique({
      where: { id: embarqueId },
      include: { rota: true, embarcacao: true },
    });

    if (!embarque) {
      res.status(404).json({ error: "Viagem não encontrada" });
      return;
    }

    if (embarque.status !== "AGENDADO") {
      res.status(400).json({ error: "Esta viagem não está disponível" });
      return;
    }

    if (embarque.assentosDisp <= 0) {
      res.status(400).json({ error: "Não há assentos disponíveis" });
      return;
    }

    // Criar ou buscar passageiro no banco local
    let passageiroDb = await prisma.passageiro.findUnique({ where: { cpf } });
    
    if (!passageiroDb) {
      passageiroDb = await prisma.passageiro.create({
        data: { nome, cpf, telefone, email },
      });
    }

    // Criar cliente no Asaas
    const clienteAsaas = await criarClienteAsaas({
      name: nome,
      cpfCnpj: cpf.replace(/\D/g, ""),
      email,
      phone: telefone,
    });

    // Criar cobrança PIX no Asaas
    const descricao = `Passagem: ${embarque.rota.origem} → ${embarque.rota.destino} - ${embarque.embarcacao.nome}`;
    const cobranca = await criarCobrancaPix(clienteAsaas.id, embarque.preco, descricao);

    // Buscar QR Code PIX
    const qrCode = await buscarQrCodePix(cobranca.id);

    // Criar passagem com status PENDENTE
    const passagem = await prisma.$transaction(async (tx) => {
      const novaPassagem = await tx.passagem.create({
        data: {
          embarqueId,
          passageiroId: passageiroDb!.id,
          userId,
          valorPago: embarque.preco,
          formaPagamento: "PIX",
          status: "PENDENTE",
          assento: cobranca.id, // Guardando o ID do pagamento Asaas temporariamente
        },
        include: {
          passageiro: true,
          embarque: { include: { rota: true, embarcacao: true } },
        },
      });

      await tx.embarque.update({
        where: { id: embarqueId },
        data: { assentosDisp: { decrement: 1 } },
      });

      return novaPassagem;
    });

    res.status(201).json({
      message: "Cobrança criada! Escaneie o QR Code para pagar.",
      passagem,
      pagamento: {
        id: cobranca.id,
        valor: cobranca.value,
        status: cobranca.status,
        pixQrCode: qrCode.encodedImage,
        pixCopiaECola: qrCode.payload,
        vencimento: cobranca.dueDate,
      },
    });
  } catch (error) {
    console.error("Erro ao comprar passagem:", error);
    res.status(500).json({ error: "Erro ao processar compra" });
  }
});

// Verificar status do pagamento
router.get("/pagamento/:paymentId/status", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;

    const pagamento = await consultarPagamento(paymentId);

    // Se pagamento confirmado, atualizar passagem
    if (pagamento.status === "RECEIVED" || pagamento.status === "CONFIRMED") {
      await prisma.passagem.updateMany({
        where: { assento: paymentId },
        data: { status: "CONFIRMADA" },
      });
    }

    res.json({
      id: pagamento.id,
      status: pagamento.status,
      valor: pagamento.value,
      dataPagamento: pagamento.paymentDate,
    });
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error);
    res.status(500).json({ error: "Erro ao consultar pagamento" });
  }
});

// Minhas passagens
router.get("/minhas-passagens", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const passagens = await prisma.passagem.findMany({
      where: { userId },
      include: {
        passageiro: true,
        embarque: {
          include: { rota: true, embarcacao: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(passagens);
  } catch (error) {
    console.error("Erro ao buscar passagens:", error);
    res.status(500).json({ error: "Erro ao buscar passagens" });
  }
});

// Cancelar passagem
router.put("/passagens/:id/cancelar", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const passagem = await prisma.passagem.findFirst({
      where: { id: parseInt(id), userId },
      include: { embarque: true },
    });

    if (!passagem) {
      res.status(404).json({ error: "Passagem não encontrada" });
      return;
    }

    if (passagem.status === "CANCELADA") {
      res.status(400).json({ error: "Passagem já está cancelada" });
      return;
    }

    // Verificar se a viagem já ocorreu
    if (new Date(passagem.embarque.dataHora) < new Date()) {
      res.status(400).json({ error: "Não é possível cancelar uma viagem que já ocorreu" });
      return;
    }

    await prisma.$transaction([
      prisma.passagem.update({
        where: { id: parseInt(id) },
        data: { status: "CANCELADA" },
      }),
      prisma.embarque.update({
        where: { id: passagem.embarqueId },
        data: { assentosDisp: { increment: 1 } },
      }),
    ]);

    res.json({ message: "Passagem cancelada com sucesso" });
  } catch (error) {
    console.error("Erro ao cancelar passagem:", error);
    res.status(500).json({ error: "Erro ao cancelar passagem" });
  }
});

export default router;
