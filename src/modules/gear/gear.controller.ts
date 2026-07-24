import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GearService } from "./gear.service";

const createGear = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;

  const result = await GearService.createGear(providerId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Gear created successfully",
    data: result,
  });
});
const getAllGear = catchAsync(async (req: Request, res: Response) => {
  const result = await GearService.getAllGear(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gear retrieved successfully",
    metaData: {
      page: result.meta.page,
      limit: result.meta.limit,
      total: result.meta.total,
      totalPage: result.meta.totalPages,
    },
    data: result.data,
  });
});

const getSingleGear = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await GearService.getSingleGear(id as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Gear details retrieved successfully",
      data: result,
    });
  },
);
export const GearController = {
  createGear,
  getAllGear,
  getSingleGear
};
