import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();

    const totalRequests =
      await prisma.donationRequest.count();

    const openRequests =
      await prisma.donationRequest.count({
        where: {
          status: "OPEN",
        },
      });

    const acceptedRequests =
      await prisma.donationRequest.count({
        where: {
          status: "ACCEPTED",
        },
      });

    const verifiedUsers =
      await prisma.user.count({
        where: {
          isVerified: true,
        },
      });

    res.json({
      totalUsers,
      totalRequests,
      openRequests,
      acceptedRequests,
      verifiedUsers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;