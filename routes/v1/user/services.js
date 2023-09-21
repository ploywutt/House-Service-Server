import { Router } from "express";
import { prisma } from "../../../lib/db.js";

const router = new Router();

router.get("/autocomplete", async (req, res) => {
  try {
    const search = req.query.search || "";
    const result = await prisma.services.findMany({
      where: {
        service_name: {
          contains: search,
        },
      },
      take: 10,
      orderBy: {
        service_name: "asc",
      },
    });
    res.send({
      data: result,
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/", async (req, res) => {
  // #swagger.tags = ["User/Service"]
  // #swagger.summary = "Get all services"
  const search = req.query.search;
  const category = req.query.category;
  const sort = req.query.sort;
  const price = +req.query.price;
  const page = +req.query.page || 1;
  const minprice = +req.query.minprice || 0;
  const maxprice = +req.query.maxprice || 1000000;
  let orderBy = {
    service_name: "asc",
  };
  if (sort == "desc") orderBy = { service_name: "desc" };
  // if (sort == "recommended")
  if (sort == "new") orderBy = { createAt: "desc" };
  if (sort == "old") orderBy = { createAt: "asc" };

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
        sub_services: {
          some: {
            price_per_unit: {
              gte: minprice,
              lte: maxprice,
            },
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
      orderBy,
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
