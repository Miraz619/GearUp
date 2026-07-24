import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import {
  ICreateCategory,
  IUpdateCategory,
} from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
  const { name, description } = payload;

  if (!name) {
    const error = new Error("Category name is required") as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.BAD_REQUEST;

    throw error;
  }

  const isCategoryExist = await prisma.category.findUnique({
    where: {
      name,
    },
  });

  if (isCategoryExist) {
    const error = new Error("Category already exists") as Error & {
      statusCode: number;
    };

    error.statusCode = httpStatus.CONFLICT;

    throw error;
  }

  const result = await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};



export const CategoryService = {
  createCategory,
  getAllCategories,
 
};