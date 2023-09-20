import { Router } from "express";
import { prisma } from "../../../lib/db.js";

const router = new Router();

router.get("/:id", async (req, res) => {
	const reqId = Number(req.params.id);
	try {
		const data = await prisma.sub_services.findMany({
			where: {
				services: {
					id: reqId,
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
