-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verifiedBloodGroup" TEXT;
