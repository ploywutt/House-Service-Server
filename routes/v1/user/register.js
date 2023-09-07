import { Router } from "express";
import { prisma } from "../../../lib/db.js";
import { hash } from "bcrypt";

const router = new Router();

router.post("/", async (req, res) => {
	try {
		const { name, phone, email, password } = req.body;

		// check if email already exists
		const existingUserByEmailOrPhone = await prisma.customer_profile.findUnique({
			where: {
				OR: [{ email: email }, { phone:phone }]
			},
		});
		if (existingUserByEmailOrPhone) {
			return res.status(409).json(
				{
					user: null,
					message: "User with this email or phone number already",
				}
			);
		}

		const hashedPassword = await hash(password, 10);
		const newUser = await prisma.customer_profile.create({
			data: {
				name,
				phone,
				email,
				password: hashedPassword,
			},
		});

		return res.status(201).json({
				user: newUser,
				message: "User created successully"
			}
		);
	} catch (error) {
		res.status(400).send(error)
	}
});

export default router;
