import express from "express";
import multer from "multer";
import prisma from "../lib/prisma";
import cloudinary from "../config/cloudinary";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "donation-platform",
        }
      );

      await prisma.user.update({
        where: {
          id: req.user.userId,
        },
        data: {
          documentUrl: result.secure_url,
          verificationStatus: "PENDING",
        },
      });

      res.status(200).json({
        message: "Document uploaded successfully",
        documentUrl: result.secure_url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

export default router;