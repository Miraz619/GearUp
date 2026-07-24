import bcrypt from "bcrypt";
import { Role } from "../generated/prisma/enums";
import config from "../src/config";
import { prisma } from "../src/lib/prisma";

const seedAdmin = async () => {
  const adminEmail = "miraz765@gmail.com";
  const adminPassword = "gearup431@#";

  const isAdminExist = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (isAdminExist) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    adminPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const admin = await prisma.user.create({
    data: {
      name: "GearUp Admin",
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    omit: {
      password: true,
    },
  });

  console.log("Admin created successfully");
  console.log(admin);
};

seedAdmin()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });