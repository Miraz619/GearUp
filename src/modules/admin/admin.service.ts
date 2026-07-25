

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

const getAllGear = async () => {
  const result = await prisma.gearItem.findMany({
    include: {
      provider: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getAllRentals = async () => {
  const result = await prisma.rentalOrder.findMany({
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      items: {
        include: {
          gearItem: true,
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const AdminService = {
  getAllUsers,
  updateUser,
  getAllGear,
  getAllRentals
};