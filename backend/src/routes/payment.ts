import { Router } from "express";
import { authenticate } from "../middleware/auth";
import paymentController from "../controllers/paymentController";

const router = Router();

// Todas as rotas de pagamento requerem autenticação
router.use(authenticate);

/**
 * POST /api/payment/purchase
 * Processa a compra de uma passagem
 * 
 * Body:
 * {
 *   embarqueId: number,
 *   passageiro: {
 *     nome: string,
 *     cpf: string,
 *     email?: string,
 *     telefone?: string
 *   },
 *   billingType?: "PIX" | "BOLETO"
 * }
 */
router.post("/purchase", paymentController.processTicketPurchase);

/**
 * GET /api/payment/status/:paymentId
 * Verifica o status de um pagamento no Asaas
 */
router.get("/status/:paymentId", paymentController.checkPaymentStatus);

export default router;
