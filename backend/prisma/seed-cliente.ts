import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("cliente123", 10);

  const cliente = await prisma.user.upsert({
    where: { email: "cliente@navega.com" },
    update: {},
    create: {
      name: "Cliente Teste",
      email: "cliente@navega.com",
      password: hashedPassword,
      role: "CLIENTE",
      isActive: true,
    },
  });

  console.log("Cliente criado:", cliente);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
