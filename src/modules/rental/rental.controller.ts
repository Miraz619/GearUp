import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RentalService } from "./rental.service";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRental = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;

  const result = await RentalService.createRental(customerId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Rental order created successfully",
    data: result,
  });
});

const getSingleRental = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customerId = req.user!.id;

  const result = await RentalService.getSingleRental(id as string, customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order retrieved successfully",
    data: result,
  });
});

const getProviderOrders = catchAsync(async (req: Request, res: Response) => {
  const providerId = req.user!.id;

  const result = await RentalService.getProviderOrders(providerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Provider orders retrieved successfully",
    data: result,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const providerId = req.user!.id;

  const { status } = req.body as {
    status: RentalStatus;
  };

  const result = await RentalService.updateStatus(id as string, providerId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order status updated successfully",
    data: result,
  });
});
export const RentalController = {
  createRental,
  getSingleRental,
  getProviderOrders,
  updateStatus
};
