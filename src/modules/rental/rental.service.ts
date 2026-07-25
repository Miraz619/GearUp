import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { ICreateRental } from "./rental.interface";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRental = async (customerId: string, payload: ICreateRental) => {
  const { startDate, endDate, items } = payload;

  if (!startDate || !endDate || !items || items.length === 0) {
    const error = new Error(
      "Start date, end date and rental items are required",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  const now = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(now.getTime()) || isNaN(end.getTime())) {
    const error = new Error(
      "Please provide valid start and end dates",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  if (end <= now) {
    const error = new Error("End date must be after start date") as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  const oneDay = 1000 * 60 * 60 * 24;

  const rentalDays = Math.ceil((end.getTime() - now.getTime()) / oneDay);

  const result = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;

    const rentalItems = [];

    for (const item of items) {
      if (!item.gearItemId || !item.quantity) {
        const error = new Error(
          "Gear item ID and quantity are required",
        ) as Error & {
          statusCode: number;
        };

        error.statusCode = httpStatus.BAD_REQUEST;

        throw error;
      }

      if (item.quantity <= 0) {
        const error = new Error(
          "Rental quantity must be greater than zero",
        ) as Error & {
          statusCode: number;
        };

        error.statusCode = httpStatus.BAD_REQUEST;

        throw error;
      }

      const gear = await tx.gearItem.findUniqueOrThrow({
        where: {
          id: item.gearItemId,
        },
      });

      if (!gear.isAvailable) {
        const error = new Error(
          `${gear.name} is currently unavailable`,
        ) as Error & {
          statusCode: number;
        };

        error.statusCode = httpStatus.BAD_REQUEST;

        throw error;
      }

      if (gear.stock < item.quantity) {
        const error = new Error(
          `Only ${gear.stock} units of ${gear.name} are available`,
        ) as Error & {
          statusCode: number;
        };

        error.statusCode = httpStatus.BAD_REQUEST;

        throw error;
      }

      const pricePerDay = Number(gear.pricePerDay);

      const subtotal = pricePerDay * item.quantity * rentalDays;

      totalAmount = totalAmount + subtotal;

      rentalItems.push({
        gearItemId: gear.id,
        quantity: item.quantity,
        pricePerDay,
        subtotal,
      });

      const remainingStock = gear.stock - item.quantity;

      await tx.gearItem.update({
        where: {
          id: gear.id,
        },
        data: {
          stock: remainingStock,
          isAvailable: remainingStock > 0,
        },
      });
    }

    const rentalOrder = await tx.rentalOrder.create({
      data: {
        customerId,
        startDate: now,
        endDate: end,
        totalAmount,
        items: {
          create: rentalItems,
        },
      },
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
      },
    });

    return rentalOrder;
  });

  return result;
};

const getSingleRental = async (rentalId: string, customerId: string) => {
  const result = await prisma.rentalOrder.findFirstOrThrow({
    where: {
      id: rentalId,
      customerId,
    },
    include: {
      items: true,
    },
  });

  return result;
};
const getProviderOrders = async (providerId: string) => {
  const result = await prisma.rentalOrder.findMany({
    where: {
      items: {
        some: {
          gearItem: {
            providerId,
          },
        },
      },
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      items: {
        where: {
          gearItem: {
            providerId,
          },
        },
        include: {
          gearItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const updateStatus = async (
  rentalId: string,
  providerId: string,
  status: RentalStatus,
) => {
  const result = await prisma.rentalOrder.update({
    where: {
      id: rentalId,
      items: {
        some: {
          gearItem: {
            providerId,
          },
        },
      },
    },
    data: {
      status,
    },
    include: {
      items: true,
    },
  });

  return result;
};
export const RentalService = {
  createRental,
  getSingleRental,
  getProviderOrders,
  updateStatus,
};
