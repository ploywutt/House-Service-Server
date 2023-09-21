import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
  try {
    const currentLoginEmail = req.query.email;
    console.log(currentLoginEmail);
    const response = await prisma.customer_profile.findMany({
      where: {
        email: currentLoginEmail,
      },
      select: {
        name: true,
        phone: true,
        email: true,
      },
    });

    res.json({
      message: "Data fetched successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error fetching order details:",
      error,
    });
  }
});

export default router;
