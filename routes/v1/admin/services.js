import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get('/', async (req, res) => {
	// #swagger.tags = ["Admin/Service"]
  // #swagger.summary = "Get all services"
	const search = req.query.search || ''
	const category = req.query.category || ''
	const sort = req.query.sort || ''

	try {
		// const allServices = await prisma.services.findMany({
		// 	include: {
		// 		category: {
		// 			select: {
		// 				category_name: true
		// 			}
		// 		}
		// 	},
		// 	where: {
		// 		OR: [
		// 			{category_name: search},
		// 			{category_name: category}
		// 		]
		// 	},
		// 	orderBy: {
		// 		category_name: { sort: sort, null: 'asc' }
		// 	}
		// })

		// res.json({
		// 	data: allServices
		// })
		const allServices = await prisma.services.findMany({
			include: {
				category: {
					select: {
						category_name: true
					}
				}
			}
		})
		res.json({
			data: allServices
		})
	} catch (error) {
		res.status(400).send(error)
	}
})

router.post('/create', async (req, res) => {
	
})

export default router;