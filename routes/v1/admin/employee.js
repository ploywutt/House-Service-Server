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
      orderBy: {
        created_at: "asc",
      },
    });

    res.json({
      data: allOrders,
    });
  } catch (error) {
    console.error(error);
  }
});

router.put("/status/towork", async (req, res) => {
  const orderId = req.query.orderId;
  try {
    await prisma.orders.update({
      where: {
        order_id: orderId,
      },
      data: {
        status_id: 2,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.put("/status/tofinish", async (req, res) => {
  const orderId = req.query.orderId;
  console.log("Update status orderID:", orderId);
  try {
    await prisma.orders.update({
      where: {
        order_id: orderId,
      },
      data: {
        status_id: 3,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.get("/comingwork", async (req, res) => {
  try {
    const comingwork = await prisma.orders.findMany({
      where: {
        status_id: 1,
      },
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
      orderBy: {
        created_at: "asc",
      },
    });
    res.json({
      data: comingwork,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.get("/working", async (req, res) => {
  try {
    const working = await prisma.orders.findMany({
      where: {
        status_id: 2,
      },
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
      orderBy: {
        created_at: "asc",
      },
    });
    res.json({
      data: working,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

router.get("/success", async (req, res) => {
  try {
    const success = await prisma.orders.findMany({
      where: {
        status_id: 3,
      },
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
      orderBy: {
        created_at: "asc",
      },
    });
    res.json({
      data: success,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Status update error",
      error,
    });
  }
});

export default router;
