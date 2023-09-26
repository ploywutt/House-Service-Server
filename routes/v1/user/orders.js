import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
  try {
    const currentLoginEmail = req.query.email;
    console.log(currentLoginEmail);
    const response = await prisma.orders.findMany({
      where: {
        user: {
          email: currentLoginEmail,
        },
        status_id: {
          in: [1, 2, 4],
        },
      },
      select: {
        order_id: true,
        order_detail: {
          select: {
            working_time: true,
            order_employee: {
              select: {
                employee: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        service_order: {
          select: {
            amount: true,
            sub_service: {
              select: {
                sub_service_name: true,
                price_per_unit: true,
                unit: true,
              },
            },
          },
        },
        status: {
          select: {
            status: true,
          },
        },
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
