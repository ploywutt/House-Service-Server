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

	const PAGE_SIZE = 3;
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
						contains: category
					}
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
				service_name: sort
			}
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

router.post("/create", async (req, res) => {});

export default router;
