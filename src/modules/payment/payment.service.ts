import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createCheckoutSession = async (
  customerId: string,
  rentalOrderId: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const rentalOrder = await tx.rentalOrder.findFirstOrThrow({
      where: {
        id: rentalOrderId,
        customerId,
      },
      include: {
        customer: true,
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "bdt",

            product: config.stripe_product_id,

            unit_amount: Number(rentalOrder.totalAmount) * 100,
          },

          quantity: 1,
        },
      ],

      mode: "payment",

      payment_method_types: ["card"],

      customer_email: rentalOrder.customer.email,

      success_url: `${config.app_url}/payment?success=true`,

      cancel_url: `${config.app_url}/payment?success=false`,

      metadata: {
        customerId,
        rentalOrderId: rentalOrder.id,
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  console.log(event.type);

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

const getMyPayments = async (customerId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId,
      },
    },
    include: {
      rentalOrder: {
        include: {
          items: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSinglePayment = async (
  paymentId: string,
  customerId: string,
) => {
  const result =
    await prisma.payment.findFirstOrThrow({
      where: {
        id: paymentId,
        rentalOrder: {
          customerId,
        },
      },
      include: {
        rentalOrder: {
          include: {
            items: true,
          },
        },
      },
    });

  return result;
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getSinglePayment,
};
