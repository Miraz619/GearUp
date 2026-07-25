import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.user!.id;
    const { rentalOrderId } = req.body;

    const result = await PaymentService.createCheckoutSession(
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

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  await PaymentService.handleWebhook(req.body, signature);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Webhook received successfully",
    data: null,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const customerId = req.user!.id;

  const result = await PaymentService.getMyPayments(customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const customerId = req.user!.id;

  const result = await PaymentService.getSinglePayment(id as string, customerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});
export const PaymentController = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getSinglePayment,
};
