import {
  Request,
  Response,
} from "express";

import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { ContactService } from "./contact.service";
import { ContactValidation } from "./contact.validation";

const createContactMessage =
  catchAsync(
    async (
      req: Request,
      res: Response,
    ) => {
      const validationResult =
        ContactValidation.createContactMessage.safeParse(
          req.body,
        );

      if (!validationResult.success) {
        const error = new Error(
          validationResult.error
            .issues[0]?.message ||
            "Invalid contact information",
        ) as Error & {
          statusCode: number;
        };

        error.statusCode =
          httpStatus.BAD_REQUEST;

        throw error;
      }

      const result =
        await ContactService.createContactMessage(
          validationResult.data,
        );

      sendResponse(res, {
        statusCode:
          httpStatus.CREATED,
        success: true,
        message:
          "Message sent successfully",
        data: result,
      });
    },
  );

export const ContactController = {
  createContactMessage,
};