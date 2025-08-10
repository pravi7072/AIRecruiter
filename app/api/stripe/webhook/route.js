import Stripe from "stripe";
import { prisma } from "@/lib/prisma"; // Adapt this import to your app setup

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const config = { api: { bodyParser: false } }; // for Next.js Pages router; omit for App router

export async function POST(req) {
  const buf = await req.arrayBuffer(); // Use arrayBuffer for App Router
  const sig = req.headers.get && req.headers.get("stripe-signature");
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(buf).toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[Webhook error]", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const creditsToAdd = Number(session.metadata.credits);
    const email = session.metadata.email || session.customer_email;

    if (creditsToAdd && email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.user.update({
          where: { email },
          data: { credits: { increment: creditsToAdd } }
        });
      }
    }
  }

  return new Response("ok", { status: 200 });
}
