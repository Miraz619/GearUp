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

const getAllGear = async (query: IGearFilter) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;

  const skip = (page - 1) * limit;

  const sortBy = query.sortBy ? query.sortBy : "createdAt";

  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: Prisma.GearItemWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.category) {
    andConditions.push({
      categoryId: query.category,
    });
  }

  if (query.brand) {
    andConditions.push({
      brand: {
        contains: query.brand,
        mode: "insensitive",
      },
    });
  }

 if (query.minPrice && query.maxPrice) {
  andConditions.push({
    pricePerDay: {
      gte: Number(query.minPrice),
      lte: Number(query.maxPrice),
    },
  });
} else if (query.minPrice) {
  andConditions.push({
    pricePerDay: {
      gte: Number(query.minPrice),
    },
  });
} else if (query.maxPrice) {
  andConditions.push({
    pricePerDay: {
      lte: Number(query.maxPrice),
    },
  });
}

  andConditions.push({
    isAvailable: true,
  });

  const gear = await prisma.gearItem.findMany({
    where: {
      AND: andConditions,
    },

    take: limit,
    skip,

    orderBy: {
      [sortBy]: sortOrder,
    },

    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const totalGearCount = await prisma.gearItem.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: gear,
    meta: {
      page,
      limit,
      total: totalGearCount,
      totalPages: Math.ceil(totalGearCount / limit),
    },
  };
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
          email: true,
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
