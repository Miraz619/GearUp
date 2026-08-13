import { prisma } from "../../lib/prisma";

import type {
  CreateContactMessageInput,
} from "./contact.validation";

const createContactMessage = async (
  payload: CreateContactMessageInput,
) => {
  const result =
    await prisma.contactMessage.create({
      data: {
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
      },
    });

  return result;
};

export const ContactService = {
  createContactMessage,
};