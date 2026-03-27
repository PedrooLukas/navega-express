import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireMinRole } from "../middleware/rbac";

const router = Router();

router.use(authenticate);
router.use(requireMinRole("OPERADOR"));

// ============ DASHBOARD ============
router.get("/dashboard", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPassageiros,
      totalPassagens,
      totalEmbarques,
      embarquesHoje,
      passagensHoje,
      vendasHoje,
      embarquesProximos,
    ] = await Promise.all([
      prisma.passageiro.count(),
      prisma.passagem.count({ where: { status: "CONFIRMADA" } }),
      prisma.embarque.count(),
      prisma.embarque.count({
        where: { dataHora: { gte: today, lt: tomorrow } },
      }),
      prisma.passagem.count({
        where: { createdAt: { gte: today, lt: tomorrow }, status: "CONFIRMADA" },
      }),
      prisma.passagem.aggregate({
        where: { createdAt: { gte: today, lt: tomorrow }, status: "CONFIRMADA" },
        _sum: { valorPago: true },
      }),
      prisma.embarque.findMany({
        where: { dataHora: { gte: today }, status: "AGENDADO" },
        include: { embarcacao: true, rota: true, _count: { select: { passagens: true } } },
        orderBy: { dataHora: "asc" },
        take: 5,
      }),
    ]);

    res.json({
      totais: {
        passageiros: totalPassageiros,
        passagensConfirmadas: totalPassagens,
        embarques: totalEmbarques,
      },
      hoje: {
        embarques: embarquesHoje,
        passagensVendidas: passagensHoje,
        valorVendas: vendasHoje._sum.valorPago || 0,
      },
      embarquesProximos,
    });
  } catch (error) {
    console.error("Erro no dashboard:", error);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

// ============ EMBARQUES ============
router.get("/embarques", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, dataInicio, dataFim, page = "1", limit = "10" } = req.query;
    
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (dataInicio || dataFim) {
      where.dataHora = {};
      if (dataInicio) (where.dataHora as Record<string, Date>).gte = new Date(dataInicio as string);
      if (dataFim) (where.dataHora as Record<string, Date>).lte = new Date(dataFim as string);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [embarques, total] = await Promise.all([
      prisma.embarque.findMany({
        where,
        include: {
          embarcacao: true,
          rota: true,
          _count: { select: { passagens: true } },
        },
        orderBy: { dataHora: "desc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.embarque.count({ where }),
    ]);

    res.json({
      embarques,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Erro ao listar embarques:", error);
    res.status(500).json({ error: "Erro ao listar embarques" });
  }
});

router.post("/embarques", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { embarcacaoId, rotaId, dataHora, preco, assentosDisp } = req.body;

    const embarque = await prisma.embarque.create({
      data: {
        embarcacaoId,
        rotaId,
        dataHora: new Date(dataHora),
        preco,
        assentosDisp,
      },
      include: { embarcacao: true, rota: true },
    });

    res.status(201).json(embarque);
  } catch (error) {
    console.error("Erro ao criar embarque:", error);
    res.status(500).json({ error: "Erro ao criar embarque" });
  }
});

router.put("/embarques/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { dataHora, preco, assentosDisp, status } = req.body;

    const embarque = await prisma.embarque.update({
      where: { id: parseInt(id) },
      data: {
        ...(dataHora && { dataHora: new Date(dataHora) }),
        ...(preco !== undefined && { preco }),
        ...(assentosDisp !== undefined && { assentosDisp }),
        ...(status && { status }),
      },
      include: { embarcacao: true, rota: true },
    });

    res.json(embarque);
  } catch (error) {
    console.error("Erro ao atualizar embarque:", error);
    res.status(500).json({ error: "Erro ao atualizar embarque" });
  }
});

router.get("/embarques/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const embarque = await prisma.embarque.findUnique({
      where: { id: parseInt(id) },
      include: {
        embarcacao: true,
        rota: true,
        passagens: {
          include: { passageiro: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!embarque) {
      res.status(404).json({ error: "Embarque não encontrado" });
      return;
    }

    res.json(embarque);
  } catch (error) {
    console.error("Erro ao buscar embarque:", error);
    res.status(500).json({ error: "Erro ao buscar embarque" });
  }
});

// ============ PASSAGEIROS ============
router.get("/passageiros", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, page = "1", limit = "10" } = req.query;
    
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { nome: { contains: search as string, mode: "insensitive" } },
        { cpf: { contains: search as string } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [passageiros, total] = await Promise.all([
      prisma.passageiro.findMany({
        where,
        orderBy: { nome: "asc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.passageiro.count({ where }),
    ]);

    res.json({
      passageiros,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Erro ao listar passageiros:", error);
    res.status(500).json({ error: "Erro ao listar passageiros" });
  }
});

router.post("/passageiros", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nome, cpf, telefone, email } = req.body;

    if (!nome || !cpf) {
      res.status(400).json({ error: "Nome e CPF são obrigatórios" });
      return;
    }

    const existing = await prisma.passageiro.findUnique({ where: { cpf } });
    if (existing) {
      res.status(400).json({ error: "CPF já cadastrado" });
      return;
    }

    const passageiro = await prisma.passageiro.create({
      data: { nome, cpf, telefone, email },
    });

    res.status(201).json(passageiro);
  } catch (error) {
    console.error("Erro ao criar passageiro:", error);
    res.status(500).json({ error: "Erro ao criar passageiro" });
  }
});

router.put("/passageiros/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, telefone, email } = req.body;

    const passageiro = await prisma.passageiro.update({
      where: { id: parseInt(id) },
      data: { nome, telefone, email },
    });

    res.json(passageiro);
  } catch (error) {
    console.error("Erro ao atualizar passageiro:", error);
    res.status(500).json({ error: "Erro ao atualizar passageiro" });
  }
});

// ============ PASSAGENS ============
router.get("/passagens", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { embarqueId, status, page = "1", limit = "10" } = req.query;
    
    const where: Record<string, unknown> = {};
    if (embarqueId) where.embarqueId = parseInt(embarqueId as string);
    if (status) where.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [passagens, total] = await Promise.all([
      prisma.passagem.findMany({
        where,
        include: {
          passageiro: true,
          embarque: {
            include: { rota: true, embarcacao: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.passagem.count({ where }),
    ]);

    res.json({
      passagens,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error("Erro ao listar passagens:", error);
    res.status(500).json({ error: "Erro ao listar passagens" });
  }
});

router.post("/passagens", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { embarqueId, passageiroId, assento, valorPago, formaPagamento } = req.body;

    const embarque = await prisma.embarque.findUnique({
      where: { id: embarqueId },
    });

    if (!embarque) {
      res.status(404).json({ error: "Embarque não encontrado" });
      return;
    }

    if (embarque.assentosDisp <= 0) {
      res.status(400).json({ error: "Não há assentos disponíveis" });
      return;
    }

    const passagem = await prisma.$transaction(async (tx) => {
      const novaPassagem = await tx.passagem.create({
        data: {
          embarqueId,
          passageiroId,
          assento,
          valorPago: valorPago || embarque.preco,
          formaPagamento: formaPagamento || "PIX",
        },
        include: { passageiro: true, embarque: true },
      });

      await tx.embarque.update({
        where: { id: embarqueId },
        data: { assentosDisp: { decrement: 1 } },
      });

      return novaPassagem;
    });

    res.status(201).json(passagem);
  } catch (error) {
    console.error("Erro ao criar passagem:", error);
    res.status(500).json({ error: "Erro ao criar passagem" });
  }
});

router.put("/passagens/:id/status", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["CONFIRMADA", "CANCELADA", "UTILIZADA"].includes(status)) {
      res.status(400).json({ error: "Status inválido" });
      return;
    }

    const passagem = await prisma.passagem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!passagem) {
      res.status(404).json({ error: "Passagem não encontrada" });
      return;
    }

    if (status === "CANCELADA" && passagem.status !== "CANCELADA") {
      await prisma.$transaction([
        prisma.passagem.update({
          where: { id: parseInt(id) },
          data: { status },
        }),
        prisma.embarque.update({
          where: { id: passagem.embarqueId },
          data: { assentosDisp: { increment: 1 } },
        }),
      ]);
    } else {
      await prisma.passagem.update({
        where: { id: parseInt(id) },
        data: { status },
      });
    }

    res.json({ message: "Status atualizado" });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// ============ EMBARCAÇÕES ============
router.get("/embarcacoes", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const embarcacoes = await prisma.embarcacao.findMany({
      where: { isActive: true },
      orderBy: { nome: "asc" },
    });
    res.json(embarcacoes);
  } catch (error) {
    console.error("Erro ao listar embarcações:", error);
    res.status(500).json({ error: "Erro ao listar embarcações" });
  }
});

router.post("/embarcacoes", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nome, capacidade, descricao } = req.body;

    const embarcacao = await prisma.embarcacao.create({
      data: { nome, capacidade, descricao },
    });

    res.status(201).json(embarcacao);
  } catch (error) {
    console.error("Erro ao criar embarcação:", error);
    res.status(500).json({ error: "Erro ao criar embarcação" });
  }
});

// ============ ROTAS ============
router.get("/rotas", async (req: AuthRequest, res: Response): Promise<void> => {
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

router.post("/rotas", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { origem, destino, duracao, distancia } = req.body;

    const rota = await prisma.rota.create({
      data: { origem, destino, duracao, distancia },
    });

    res.status(201).json(rota);
  } catch (error) {
    console.error("Erro ao criar rota:", error);
    res.status(500).json({ error: "Erro ao criar rota" });
  }
});

// ============ RELATÓRIOS ============
router.get("/relatorios/vendas", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { dataInicio, dataFim } = req.query;

    const where: Record<string, unknown> = { status: "CONFIRMADA" };
    if (dataInicio || dataFim) {
      where.createdAt = {};
      if (dataInicio) (where.createdAt as Record<string, Date>).gte = new Date(dataInicio as string);
      if (dataFim) (where.createdAt as Record<string, Date>).lte = new Date(dataFim as string);
    }

    const [vendas, totalVendas, vendasPorFormaPagamento] = await Promise.all([
      prisma.passagem.findMany({
        where,
        include: {
          passageiro: true,
          embarque: { include: { rota: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.passagem.aggregate({
        where,
        _sum: { valorPago: true },
        _count: true,
      }),
      prisma.passagem.groupBy({
        by: ["formaPagamento"],
        where,
        _sum: { valorPago: true },
        _count: true,
      }),
    ]);

    res.json({
      vendas,
      resumo: {
        totalVendas: totalVendas._count,
        valorTotal: totalVendas._sum.valorPago || 0,
        porFormaPagamento: vendasPorFormaPagamento,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
});

export default router;
