import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

router.post("/", async (req, res) => {
  const {
    address,
    details,
    province,
    district,
    subdistrict,
    working_time,
    user_email,
    status_id,
    promotion_code,
    sub_service_orders,
  } = req.body;

  //สร้าง order_id
  function generateOrderId() {
    const newOrderId = "ORD" + Math.floor(Math.random() * 10000);
    return newOrderId;
  }
  const newOrderId = generateOrderId();

  try {
    const workingTimeTimestamp = new Date(working_time);

    const getUserId = await prisma.Customer_profile.findMany({
      where: {
        email: user_email,
      },
      select: {
        id: true,
      },
    });

    console.log(getUserId);
    // if (getUserId.length > 0) {
    //   console.log(getUserId[0].id);
    // }
    const userId = getUserId[0].id;

    const orderDetail = await prisma.Order_details.create({
      data: {
        address,
        details,
        province,
        district,
        subdistrict,
        working_time: workingTimeTimestamp,
        order: {
          create: {
            order_id: newOrderId,
            user_id: userId,
            status_id,
            promotion_code,
          },
        },
      },
    });

    const serviceOrders = await Promise.all(
      sub_service_orders.map(async (subServiceOrder, index) => {
        const { sub_service_name, count } = subServiceOrder;

        //สร้าง service_order_id
        if (count > 0) {
          const latestServiceOrder = await prisma.Service_Order.findFirst({
            orderBy: { service_order_id: "desc" },
          });
          const newServiceOrderId = latestServiceOrder.service_order_id + 1;

          //หา id ของ subservice
          const getSubServiceId = await prisma.Sub_services.findMany({
            where: {
              sub_service_name,
            },
            select: {
              id: true,
            },
          });
          const subServiceId = getSubServiceId[index].id;

          return prisma.Service_Order.create({
            data: {
              order_id: newOrderId,
              sub_service_id: subServiceId,
              service_order_id: newServiceOrderId,
              amount: count,
            },
          });
        }
      })
    );

    res.json({
      orderDetail,
      serviceOrders,
      message: "Order Created :)",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error creating order", message: error.message });
  }
});

export default router;
