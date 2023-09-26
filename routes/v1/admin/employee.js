import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ["Admin/Category"]
  // #swagger.summary = "Get all categories"

  const oders = req.query.orders;

  try {
    const allOrders = await prisma.orders.findMany({
      // where: {
      //   order_id: "ORD8892",
      // },
      select: {
        order_id: true,
        service_order: {
          select: {
            amount: true,
            sub_service: {
              select: {
                sub_service_name: true,
                unit: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        status: {
          select: {
            status: true,
          },
        },
        order_detail: {
          select: {
            working_time: true,
            address: true,
            subdistrict: true,
            district: true,
            province: true,
            details: true,
          },
        },
      },
    });

    res.json({
      data: allOrders,
    });
  } catch (error) {
    console.error(error);
  }
});

export default router;
