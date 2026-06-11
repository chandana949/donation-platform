import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

/*
====================================
SMART DONOR MATCHING
====================================
*/

router.get("/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await prisma.donationRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const donors = await prisma.user.findMany({
      where: {
        bloodGroup: request.bloodGroup,
        city: request.city,
        availableToDonate: true,
      },
      select: {
        id: true,
        name: true,
        bloodGroup: true,
        city: true,
        isVerified: true,
      },
    });

    const rankedDonors = donors.sort((a, b) => {
      return Number(b.isVerified) - Number(a.isVerified);
    });

    res.json({
      request,
      totalMatches: rankedDonors.length,
      donors: rankedDonors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;