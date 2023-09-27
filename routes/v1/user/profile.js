import { Router } from "express";
import { prisma } from "../../../lib/db.js";
const router = new Router();

router.get("/", async (req, res) => {
  try {
    const currentLoginEmail = req.query.email;
    console.log(currentLoginEmail);
    const response = await prisma.customer_profile.findMany({
      where: {
        email: currentLoginEmail,
      },
      select: {
        name: true,
        phone: true,
        email: true,
        avatar_url: true,
      },
    });

    res.json({
      message: "Data fetched successfully!",
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: "Error fetching profile details:",
      error,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const currentLoginEmail = req.query.email;
    const {
      name,
      phone,
      email,
      password,
      newPassword,
      reNewPassword,
      avatar_url,
    } = req.body;
    console.log(`edit put ${currentLoginEmail}`);

    const user = await prisma.customer_profile.findUnique({
      where: {
        email: currentLoginEmail,
      },
    });

    // Check if the user wants to change the password and if the provided current password matches
    if (
      !newPassword ||
      (newPassword !== "" && user && user.password === password)
    ) {
      const response = await prisma.customer_profile.update({
        where: {
          email: currentLoginEmail,
        },
        data: {
          name: name !== "" ? name : undefined,
          phone: phone !== "" ? phone : undefined,
          email: email !== "" ? email : undefined,
          password: newPassword || undefined, // Update newPassword when provided, or set to undefined if not provided
          avatar_url: avatar_url !== "" ? avatar_url : undefined,
        },
      });

      res.json({
        message: "Update successful!",
        response,
      });
    } else {
      res.status(400).json({
        message: "Current password is incorrect. Cannot update the password.",
      });
    }
    //   const response = await prisma.customer_profile.update(
    //     {
    //       where: {
    //         email: currentLoginEmail,
    //       },
    //       data: {
    //         name: name !== "" ? name : undefined,
    //         phone: phone !== "" ? phone : undefined,
    //         email: email !== "" ? email : undefined,
    //         password: password !== "" ? password : undefined,
    //         avatar_url: avatar_url !== "" ? avatar_url : undefined,
    //       },
    //     },
    //     res.json({
    //       message: "update successfully!",
    //     })
    //   );
  } catch (error) {
    console.log(`edit put ${error}`);

    res.status(400).json({
      message: "Error updating profile details:",
      error,
    });
  }
});

export default router;
