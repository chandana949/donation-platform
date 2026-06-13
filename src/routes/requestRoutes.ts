import express from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/*
====================================
CREATE BLOOD REQUEST
====================================
*/
router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const {
      bloodGroup,
      city,
      urgency,
      unitsNeeded,
      hospital,
      message,
    } = req.body;

    const request = await prisma.donationRequest.create({
      data: {
        bloodGroup,
        city,
        urgency,
        unitsNeeded,
        hospital,
        message,
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/*
====================================
GET ALL OPEN REQUESTS
====================================
*/
router.get("/", async (req, res) => {
  try {
   const requests = await prisma.donationRequest.findMany({
  include: {
    user: {
      select: {
        id: true,
        name: true,
        bloodGroup: true,
        city: true,
        role: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

    res.json(requests);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/*
====================================
ACCEPT REQUEST
====================================
*/
router.post("/:id/accept", authMiddleware, async (req: any, res) => {
  try {
    const requestId = req.params.id;

    const existingRequest =
      await prisma.donationRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!existingRequest) {
      return res.status(404).json({
        message: "Request not found",
      });
    }
    if (existingRequest.userId === req.user.userId) {
  return res.status(400).json({
    message: "You cannot accept your own request",
  });
}

    if (existingRequest.status === "ACCEPTED") {
      return res.status(400).json({
        message: "Request already accepted",
      });
    }

    const updatedRequest =
      await prisma.donationRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status: "ACCEPTED",
          acceptedById: req.user.userId,
        },
      });

    res.json({
      message: "Request accepted successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;