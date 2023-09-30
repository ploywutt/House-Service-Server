import { Router } from "express";
import stripe from "stripe";
import dotenv from "dotenv";

const stripeSecretKey = process.env.SECRET_KEY;
const stripeClient = stripe(stripeSecretKey);

const router = Router();

router.post("/", async (req, res) => {

  const {price} = req.body
 
  try {
    
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: 100000,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    // console.log("hello")
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

export default router;
