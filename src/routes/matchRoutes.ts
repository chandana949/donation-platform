import express from "express";
import prisma from "../lib/prisma";

const router = express.Router();

/*
====================================
BLOOD COMPATIBILITY RULES
====================================
*/

const compatibilityMap: Record<string, string[]> = {
  "O-": ["O-"],

  "O+": ["O+", "O-"],

  "A-": ["A-", "O-"],

  "A+": ["A+", "A-", "O+", "O-"],

  "B-": ["B-", "O-"],

  "B+": ["B+", "B-", "O+", "O-"],

  "AB-": ["AB-", "A-", "B-", "O-"],

  "AB+": [
    "AB+",
    "AB-",
    "A+",
    "A-",
    "B+",
    "B-",
    "O+",
    "O-",
  ],
};

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

    const compatibleGroups =
      compatibilityMap[request.bloodGroup] || [
        request.bloodGroup,
      ];

    const donors = await prisma.user.findMany({
      where: {
        bloodGroup: {
          in: compatibleGroups,
        },

        city: request.city,
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
      compatibleBloodGroups: compatibleGroups,
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