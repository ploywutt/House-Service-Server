import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Get all services"
	const search = req.query.search;
	const category = req.query.category;
	const sort = req.query.sort;
	const price = +req.query.price;
	const page = +req.query.page || 1;

	const PAGE_SIZE = 5;
	const skip = PAGE_SIZE * (page - 1);

	try {
		const serviceCount = await prisma.services.count();
		const allServices = await prisma.services.findMany({
			// take: PAGE_SIZE,
			// skip: skip,
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
			},
			orderBy: {
				service_name: sort,
			},
		});
		const listServices = allServices.map((service) => ({
			...service,
			category: service.category.category_name,
		}));
		res.json({
			data: listServices,
			totalServices: serviceCount,
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

router.delete("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Delete service by id"
	const serviceId = Number(req.params.id);
	try {
		const existServiceId = await prisma.services.findUnique({
			where: {
				id: serviceId,
			},
		});
		if (!existServiceId) {
			res.status(400).json({
				serviceId: null,
				message: `Not found serviceId: ${serviceId}`,
			});
		} else {
			await prisma.services.delete({
				where: {
					id: serviceId,
				},
			});
			res.json({
				message: `Delete category id:${serviceId} "${existServiceId}" successfull`,
			});
		}
	} catch (error) {
		console.error(error);
	}
});

router.post("/", async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
	// #swagger.summary = "Create services"
	const { service_name, category_name, pic_service } = req.body;
	try {
		// 1. ค้นหาหมวดหมู่ด้วยชื่อ
    const category = await prisma.categories.findFirst({
      where: {
        category_name: category_name
      }
    });

		// 2. ตรวจสอบว่าหมวดหมู่มีอยู่หรือไม่
    if (!category) {
      res.status(400).json({
        message: `Category '${category_name}' not found.`
      });
      return;
    }

		const result = await prisma.services.findMany({
			where: {
				service_name: service_name
			}
		});
		if (result.length > 0) {
			res.status(400).json({
				result: result,
				message: `${service_name} has been in database.`,
			});
		} else {
			await prisma.services.create({
				data: {
					service_name: service_name,
					category_id: category.id,
					pic_service: pic_service,
					createAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
					updateAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),

				}
			});
			res.json({
				service_name,
				message: "create services success",
			});
		}
	} catch (error) {
		console.error(error);
	}
});

export default router;
