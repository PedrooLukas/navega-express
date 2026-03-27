import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Criar Embarcações
  const embarcacao1 = await prisma.embarcacao.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "Lancha Navegante I",
      capacidade: 30,
      descricao: "Lancha rápida com ar condicionado",
      isActive: true,
    },
  });

  const embarcacao2 = await prisma.embarcacao.upsert({
    where: { id: 2 },
    update: {},
    create: {
      nome: "Barco Regional II",
      capacidade: 50,
      descricao: "Barco regional confortável",
      isActive: true,
    },
  });

  console.log("Embarcações criadas:", embarcacao1.nome, embarcacao2.nome);

  // Criar Rotas
  const rota1 = await prisma.rota.upsert({
    where: { id: 1 },
    update: {},
    create: {
      origem: "Afuá",
      destino: "Macapá",
      duracao: 180, // 3 horas em minutos
      distancia: 120.5,
      isActive: true,
    },
  });

  const rota2 = await prisma.rota.upsert({
    where: { id: 2 },
    update: {},
    create: {
      origem: "Afuá",
      destino: "Belém",
      duracao: 300, // 5 horas
      distancia: 200.0,
      isActive: true,
    },
  });

  const rota3 = await prisma.rota.upsert({
    where: { id: 3 },
    update: {},
    create: {
      origem: "Macapá",
      destino: "Afuá",
      duracao: 180,
      distancia: 120.5,
      isActive: true,
    },
  });

  console.log("Rotas criadas:", rota1.origem, "->", rota1.destino);

  // Criar Embarques (viagens disponíveis)
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const depoisDeAmanha = new Date(hoje);
  depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2);

  const embarque1 = await prisma.embarque.create({
    data: {
      embarcacaoId: embarcacao1.id,
      rotaId: rota1.id,
      dataHora: new Date(amanha.setHours(8, 0, 0, 0)),
      preco: 150.0,
      assentosDisp: 25,
      status: "AGENDADO",
    },
  });

  const embarque2 = await prisma.embarque.create({
    data: {
      embarcacaoId: embarcacao1.id,
      rotaId: rota1.id,
      dataHora: new Date(amanha.setHours(14, 0, 0, 0)),
      preco: 150.0,
      assentosDisp: 30,
      status: "AGENDADO",
    },
  });

  const embarque3 = await prisma.embarque.create({
    data: {
      embarcacaoId: embarcacao2.id,
      rotaId: rota2.id,
      dataHora: new Date(depoisDeAmanha.setHours(6, 0, 0, 0)),
      preco: 250.0,
      assentosDisp: 45,
      status: "AGENDADO",
    },
  });

  const embarque4 = await prisma.embarque.create({
    data: {
      embarcacaoId: embarcacao2.id,
      rotaId: rota3.id,
      dataHora: new Date(depoisDeAmanha.setHours(16, 0, 0, 0)),
      preco: 150.0,
      assentosDisp: 50,
      status: "AGENDADO",
    },
  });

  console.log("Embarques criados:", embarque1.id, embarque2.id, embarque3.id, embarque4.id);

  // Criar um passageiro de exemplo
  const passageiro = await prisma.passageiro.upsert({
    where: { cpf: "12345678901" },
    update: {},
    create: {
      nome: "João Silva",
      cpf: "12345678901",
      telefone: "96999999999",
      email: "joao@email.com",
    },
  });

  console.log("Passageiro criado:", passageiro.nome);

  console.log("\n=== DADOS CRIADOS COM SUCESSO ===");
  console.log("Embarcações: 2");
  console.log("Rotas: 3");
  console.log("Embarques disponíveis: 4");
  console.log("Passageiro de exemplo: 1");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
