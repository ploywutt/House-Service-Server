import { Router } from "express";
import { prisma } from "../../../lib/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ["User/Service"]
  // #swagger.summary = "Get all services"
  const search = req.query.search;
  const category = req.query.category;
  const sort = req.query.sort;
  const price = +req.query.price;
  const page = +req.query.page || 1;

  const PAGE_SIZE = +req.query.pageSize || 24;
  const skip = PAGE_SIZE * (page - 1);

  try {
    const serviceCount = await prisma.services.count();
    const allServices = await prisma.services.findMany({
      take: PAGE_SIZE,
      skip: skip,
      where: {
        service_name: {
          contains: search, // ใช้ contains เพื่อให้คำค้นมีค่าเหมือน RegExp
        },
        category: {
          category_name: {
            contains: category,
          },
        },
      },
      include: {
        category: {
          select: {
            category_name: true,
          },
        },
        sub_services: {
          select: { price_per_unit: true },
        },
      },
      orderBy: {
        service_name: sort,
      },
    });

    const listServices = allServices.map((service) => {
      const priceData = service.sub_services.map((sub) => sub.price_per_unit);
      let max_price = null;
      let min_price = null;
      if (priceData.length > 0) {
        min_price = Math.min.apply(null, priceData);
        max_price = Math.max.apply(null, priceData);
      }
      return {
        ...service,
        min_price,
        max_price,
        category: service.category.category_name,
      };
    });

    res.json({
      data: listServices,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        totalRecord: serviceCount,
        totalPage: Math.ceil(serviceCount / PAGE_SIZE),
      },
      // totalServices: serviceCount,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
