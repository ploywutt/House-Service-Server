import { Router } from "express";
import { prisma } from "../../../lib/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  try {
    const data = await prisma.sub_services.findMany({
      where: {
        services: {
          service_name: "ซ่อมเครื่องซักผ้า",
        },
      },
      select: {
        sub_service_name: true,
        price_per_unit: true,
        unit: true,
      },
    });
    res.json({
      data: data,
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
