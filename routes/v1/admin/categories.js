import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
  // #swagger.tags = ["Admin/Products"]
  // #swagger.summary = "Get all products"
  
  try {
    const allCategory = await prisma.categories.findMany()
    res.json({
      data : allCategory
    });
  } catch (error) { 
    console.error(error)
  }

});

router.get("/:id", async (req, res) => {
  // #swagger.tags = ["Admin/Products"]
  // #swagger.summary = "Get products by id"
  const categoryId = Number(req.params.id)
  try {
    const category = await prisma.categories.findUnique({
      where: {
        id: categoryId
      }
    })

    res.json({
      data: category
    })
  } catch (error) {
    console.error(error)
  }
});

router.post("/", async (req, res) => {
  // #swagger.tags = ["Admin/Products"]
  // #swagger.summary = "Create products"
  const { category_name } = req.body; // Extract the category_name from the request body
  try {
    // Ensure category_name is a string before passing it to prisma.categories.create()
    if (typeof category_name === 'string') {
      await prisma.categories.create({
        data: {
          category_name: category_name,
        }
      })

      res.json({
        message: "create category success"
      })
    } else {
      // Handle the case where category_name is not a string (e.g., provide an error response)
      res.status(400).json({
        error: "category_name must be a string"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

router.delete('/:id', async (req, res) => {
  const categoryId = Number(req.params.id)
  try {
    const existCategoryId = await prisma.categories.findUnique({
      where: {
        id: categoryId
      }
    })
    if (!existCategoryId) {
      res.json({
        category_id: null,
        message: `Not found category_id: ${categoryId}`
      })
    } else {
      await prisma.categories.delete({
        where: {
          id: categoryId
        }
      })
    }

    res.json({
      message: `Delete category id: ${categoryId} successfull`
    })
  } catch (error) {
    console.error(error)
  }
})

export default router;
