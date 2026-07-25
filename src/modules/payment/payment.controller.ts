import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const { rentalOrderId } = req.body;

    const result =
      await PaymentService.createCheckoutSession(
        customerId,
        rentalOrderId,
      );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

export const PaymentController = {
  createCheckoutSession,
};