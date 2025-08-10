import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { credits, email } = await req.json();

  // Simple package validation
  const packageList = [
    { credits: 100, price: 1000 },   // $10
    { credits: 1000, price: 8000 },  // $80
  ];
  const pkg = packageList.find(p => p.credits === credits);
  if (!pkg || !email) {
    return NextResponse.json({ error: "Invalid package or email" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${credits} AI Interview Credits` },
          unit_amount: pkg.price,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing?canceled=1`,
    metadata: { credits: String(pkg.credits), email }
  });

  return NextResponse.json({ url: session.url });
}
