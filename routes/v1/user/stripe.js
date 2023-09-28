import { Router } from "express";
import stripe from "stripe";

const router = Router();

const stripeClient = stripe(
  "sk_test_51NoyonCDxlniS9dC0pfFFKWXlWzYGlhdhWd232VlZOI9hWJxfiz8qntF1gHUFRqBBHYBwNkyGD8jO2MPRR0kwmZj00Z45tqz9C"
);

router.post("/", async (req, res) => {
  try {
    const totalprice = price * 100;
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: totalprice,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({
      message: "Stripe Error",
      error,
    });
  }
});
