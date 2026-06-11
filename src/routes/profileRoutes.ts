import express from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/*
====================================
GET PROFILE
====================================
*/
router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        age: true,
        gender: true,
        bloodGroup: true,
        city: true,
        state: true,
        role: true,
        isVerified: true,
        verificationStatus: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

/*
====================================
UPDATE PROFILE
====================================
*/
router.put("/", authMiddleware, async (req: any, res) => {
  try {
    const {
      phone,
      age,
      gender,
      bloodGroup,
      city,
      state,
      role,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.userId,
      },
      data: {
        phone,
        age,
        gender,
        bloodGroup,
        city,
        state,
        role,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;