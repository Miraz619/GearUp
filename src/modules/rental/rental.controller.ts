import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RentalService } from "./rental.service";

const createRental = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user!.id;

    const result = await RentalService.createRental(
      customerId,
      req.body,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Rental order created successfully",
      data: result,
    });
  },
);

export const RentalController = {
  createRental,
};