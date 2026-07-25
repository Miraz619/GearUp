

import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const updateUser = async (
  userId: string,
  isActive: boolean,
) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive,
    },
    omit: {
      password: true,
    },
  });

  return result;
};

export const AdminService = {
  getAllUsers,
  updateUser,
};