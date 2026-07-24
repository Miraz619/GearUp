import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateGear, IGearFilter, IUpdateGear } from "./gear.interface";

const createGear = async (providerId: string, payload: ICreateGear) => {
  const { name, description, brand, pricePerDay, stock, categoryId } = payload;

  if (pricePerDay <= 0) {
    const error = new Error(
      "Price per day must be greater than zero",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  if (stock < 0) {
    const error = new Error("Stock cannot be negative") as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  const result = await prisma.gearItem.create({
    data: {
      name,
      description,
      brand,
      pricePerDay,
      stock,
      isAvailable: stock > 0,
      categoryId,
      providerId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const getAllGear = async (filters: IGearFilter) => {
  const { category, brand, minPrice, maxPrice } = filters;

  const whereConditions: Prisma.GearItemWhereInput = {
    isAvailable: true,
  };

  if (category) {
    whereConditions.categoryId = category;
  }

  if (brand) {
    whereConditions.brand = {
      contains: brand,
      mode: "insensitive",
    };
  }

  if (minPrice || maxPrice) {
    whereConditions.pricePerDay = {};

    if (minPrice) {
      whereConditions.pricePerDay.gte = Number(minPrice);
    }

    if (maxPrice) {
      whereConditions.pricePerDay.lte = Number(maxPrice);
    }
  }

  const result = await prisma.gearItem.findMany({
    where: whereConditions,
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleGear = async (gearId: string) => {
  const result = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearId,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: true,
    },
  });

  return result;
};

const updateGear = async (
  gearId: string,
  providerId: string,
  payload: IUpdateGear,
) => {
  const gear = await prisma.gearItem.findFirstOrThrow({
    where: {
      id: gearId,
      providerId,
    },
  });

  if (Object.keys(payload).length === 0) {
    const error = new Error("Provide at least one field to update") as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  if (payload.pricePerDay !== undefined && payload.pricePerDay <= 0) {
    const error = new Error(
      "Price per day must be greater than zero",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  if (payload.stock !== undefined && payload.stock < 0) {
    const error = new Error("Stock cannot be negative") as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: payload.categoryId,
      },
    });
  }

  let isAvailable = payload.isAvailable;

  if (payload.stock !== undefined) {
    isAvailable = payload.stock > 0;
  }

  const result = await prisma.gearItem.update({
    where: {
      id: gear.id,
    },
    data: {
      ...payload,
      isAvailable,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

const deleteGear = async (gearId: string, providerId: string) => {
  const gear = await prisma.gearItem.findFirstOrThrow({
    where: {
      id: gearId,
      providerId,
    },
    include: {
      _count: {
        select: {
          rentalOrderItems: true,
        },
      },
    },
  });

  if (gear._count.rentalOrderItems > 0) {
    const error = new Error(
      "This gear cannot be deleted because it has rental records",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.CONFLICT;

    throw error;
  }

  const result = await prisma.gearItem.delete({
    where: {
      id: gear.id,
    },
  });

  return result;
};

export const GearService = {
  createGear,
  getAllGear,
  getSingleGear,
  updateGear,
  deleteGear,
};
