-- CreateTable
CREATE TABLE "DonationRequest" (
    "id" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "unitsNeeded" INTEGER NOT NULL,
    "hospital" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DonationRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DonationRequest" ADD CONSTRAINT "DonationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
