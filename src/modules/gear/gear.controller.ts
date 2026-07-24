import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { GearService } from "./gear.service";

const createGear = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user!.id;

    const result = await GearService.createGear(
      providerId,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Gear created successfully",
      data: result,
    });
  },
);

export const GearController = {
  createGear,
};