import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (
  customerId: string,
  rentalOrderId: string,
) => {
  const transactionResult = await prisma.$transaction(
    async (tx) => {
      const rentalOrder =
        await tx.rentalOrder.findFirstOrThrow({
          where: {
            id: rentalOrderId,
            customerId,
          },
          include: {
            customer: true,
          },
        });

      const session =
        await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency: "bdt",

                product: config.stripe_product_id,

                unit_amount:
                  Number(rentalOrder.totalAmount) * 100,
              },

              quantity: 1,
            },
          ],

          mode: "payment",

          payment_method_types: ["card"],

          customer_email: rentalOrder.customer.email,

          success_url:
            `${config.app_url}/payment?success=true`,

          cancel_url:
            `${config.app_url}/payment?success=false`,

          metadata: {
            customerId,
            rentalOrderId: rentalOrder.id,
          },
        });

      return session.url;
    },
  );

  return {
    paymentUrl: transactionResult,
  };
};

export const PaymentService = {
  createCheckoutSession,
};