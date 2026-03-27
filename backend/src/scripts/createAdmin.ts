import { prisma } from "../lib/prisma";
import { hashPassword } from "../utils/password";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrador";

  if (!email || !password) {
    console.error("Erro: Defina as variáveis de ambiente ADMIN_EMAIL e ADMIN_PASSWORD");
    console.log("Exemplo: ADMIN_EMAIL=admin@email.com ADMIN_PASSWORD=senha123 npx tsx src/scripts/createAdmin.ts");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    console.log("Usuário admin já existe!");
    console.log("Email:", email);
    process.exit(0);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin criado com sucesso!");
  console.log("Email:", email);
  console.log("Role:", user.role);
  
  process.exit(0);
}

createAdmin().catch(console.error);
