
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

    await prisma.rentalOrder.findFirstOrThrow({
    where: {
      customerId,
      status: "RETURNED",
      items: {
        some: {
          gearItemId,
        },
      },
    },
  });

  const existingReview = await prisma.review.findFirst({
  where: {
    customerId,
    gearItemId,
  },
});

if (existingReview) {
  const error = new Error(
    "You have already reviewed this gear",
  ) as Error & {
    statusCode: number;
  };

  error.statusCode = httpStatus.CONFLICT;
  throw error;
}

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

const getMyReviews = async (customerId: string) => {
  const result = await prisma.review.findMany({
    where: {
      customerId,
    },
    include: {
      gearItem: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
  getMyReviews
};