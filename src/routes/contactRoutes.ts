import express from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/*
====================================
REVEAL DONOR CONTACT
====================================
*/

router.get("/:requestId", authMiddleware, async (req: any, res) => {
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

    if (request.status !== "ACCEPTED") {
      return res.status(400).json({
        message: "Request not accepted yet",
      });
    }

    if (!request.acceptedById) {
      return res.status(400).json({
        message: "No donor assigned",
      });
    }

    const donor = await prisma.user.findUnique({
      where: {
        id: request.acceptedById,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        bloodGroup: true,
        city: true,
      },
    });

    res.json({
      message: "Donor contact revealed",
      donor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;