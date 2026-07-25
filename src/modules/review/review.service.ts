
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

const createReview = async (
  customerId: string,
  payload: {
    gearItemId: string;
    rating: number;
    comment?: string;
  },
) => {
  const { gearItemId, rating, comment } = payload;

  if (!gearItemId || !rating) {
    const error = new Error(
      "Gear item ID and rating are required",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    const error = new Error(
      "Rating must be an integer between 1 and 5",
    ) as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;
    throw error;
  }

  await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearItemId,
    },
  });

  const result = await prisma.review.create({
    data: {
      customerId,
      gearItemId,
      rating,
      comment,
    },
    include: {
      gearItem: true,
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
};