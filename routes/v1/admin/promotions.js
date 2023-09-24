import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Get all Promotion Code"
	const search = req.query.search;
	try {
		const promotions = await prisma.promotions.findMany({
			where: {
				promotion_code: {
					contains: search
				}
			}
		})
		console.log(promotions)
		res.json({
			data: promotions
		})
	} catch (error) {
		res.json({
			message: error
		})
	}
})

router.get("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Get Promotion code by id"
	const promotionId = Number(req.params.id)
	try {
		const promotion = await prisma.promotions.findUnique({
			where: {
				promotion_id: promotionId
			}
		})

		res.json({
			data: promotion
		})
	} catch (error) {
		res.json({
			message: error
		})
	}
})

router.delete("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Promotions"]
	// #swagger.summary = "Delete Promotion Code by id"
	const promotionId = +(req.params.id)
	try {
		await prisma.promotions.delete({
			where: {
				promotion_id: promotionId
			}
		})

		res.json({
			message: `Delete promotion code: ${promotionId} success`
		})
	} catch (error) {
		res.json({
			message: error
		})
	}
})

export default router;