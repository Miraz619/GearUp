import Stripe from "stripe";
import {
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalOrderId =
    session.metadata?.rentalOrderId;

  const stripeSessionId = session.id;

  const transactionId =
    session.payment_intent as string;

  const amount =
    Number(session.amount_total) / 100;

  if (
    !rentalOrderId ||
    !stripeSessionId ||
    !transactionId
  ) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: {
        rentalOrderId,
      },

      create: {
        rentalOrderId,
        stripeSessionId,
        transactionId,
        amount,
        method: "STRIPE",
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },

      update: {
        stripeSessionId,
        transactionId,
        amount,
        method: "STRIPE",
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: {
        id: rentalOrderId,
      },

      data: {
        status: RentalStatus.PAID,
      },
    });
  });
};