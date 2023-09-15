import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Get all categories"
	const search = req.query.search;
	try {
		const allCategory = await prisma.categories.findMany({
			where: {
				category_name: {
					contains: search, // ใช้ contains เพื่อให้คำค้นมีค่าเหมือน RegExp
				},
			},
		});

		res.json({
			data: allCategory,
		});
	} catch (error) {
		console.error(error);
	}
});

router.get("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Get categories by id"
	const categoryId = Number(req.params.id);
	try {
		const category = await prisma.categories.findUnique({
			where: {
				id: categoryId,
			},
		});

		res.json({
			data: category,
		});
	} catch (error) {
		console.error(error);
	}
});

router.post("/", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Create categories"
	const { category_name } = req.body; // Extract the category_name from the request body
	try {
		// Ensure category_name is a string before passing it to prisma.categories.create()
		if (typeof category_name === "string") {
			const result = await prisma.categories.findMany({
				where: {
					category_name: category_name,
				},
			});
			if (result.length > 0) {
				res.status(400).json({
					result: result,
					message: `${category_name} has been in database.`,
				});
			} else {
				await prisma.categories.create({
					data: {
						category_name: category_name,
						createAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
						updateAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
					},
				});
				res.json({
					category_name,
					message: "create category success",
				});
			}
		} else {
			// Handle the case where category_name is not a string (e.g., provide an error response)
			res.status(400).json({
				message: "category_name must be a string",
			});
		}
	} catch (error) {
		console.error(error);
	}
});

router.delete("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Delete categories by id"
	const categoryId = Number(req.params.id);
	try {
    console.log(categoryId)
		const existCategoryId = await prisma.categories.findUnique({
			where: {
				id: categoryId,
			},
		});
		if (!existCategoryId) {
			res.status(400).json({
				category_id: null,
				message: `Not found category_id: ${categoryId}`,
			});
		} else {
			await prisma.categories.delete({
				where: {
					id: categoryId,
				},
			});
      res.json({
        message: `Delete category id: ${categoryId} successfull`,
      });
		}
	} catch (error) {
		console.error(error);
	}
});

router.put("/:id", async (req, res) => {
	// #swagger.tags = ["Admin/Category"]
	// #swagger.summary = "Update categories by id"
	const categoryId = Number(req.params.id);
  try { 
    console.log("122 >>>", categoryId)
    const existCategoryId = await prisma.categories.findUnique({
      where: {
        id: categoryId,
			},
		});
    console.log("128 >>>", categoryId)
    if (!existCategoryId) {
      res.status(400).json({
        category_id: null,
				message: `Not found category_id: ${categoryId}`,
			});
		} else {
      console.log("135 >>>", categoryId)
      const currentTime = new Date(req.body.updateAt)
      await prisma.categories.update({
        where: {
          id: categoryId
        },
        data: {
          ...req.body,
          // แปลง Date กลับเป็น ISO-8601 DateTime โดยไม่เปลี่ยนเวลา
          updateAt: new Date(currentTime.getTime() - currentTime.getTimezoneOffset() * 60000).toISOString(),
        }
      })

      res.json({
        message: `Update category id: ${categoryId} successfull`,
      });
    }
  } catch (error) {
    console.error(error)
  }
});

export default router;
