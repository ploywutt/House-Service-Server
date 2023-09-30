import { Router } from "express";
import { prisma } from "../../../lib/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const email = req.query.email;
  try {
    const result = await prisma.customer_profile.findUnique({
      where: {
        email: email,
      },
    });
    if (!result) {
      return res.status(409).json({
        data: {
          message: `Cannot find this email`,
        },
      });
    }
    return res.json({
      data: {
        message: `User has this email: ${email} in database.`,
        email: email,
      },
    });
  } catch (error) {
    return console.error(error);
  }
});

export default router;
