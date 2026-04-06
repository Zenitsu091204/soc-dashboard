/*
  Warnings:

  - You are about to drop the column `reputation` on the `Ioc` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "caseId" TEXT;

-- AlterTable
ALTER TABLE "Ioc" DROP COLUMN "reputation",
ADD COLUMN     "confidence" INTEGER,
ADD COLUMN     "lastEnriched" TIMESTAMP(3),
ADD COLUMN     "severity" TEXT;

-- CreateTable
CREATE TABLE "CaseIoc" (
    "caseId" TEXT NOT NULL,
    "iocId" TEXT NOT NULL,

    CONSTRAINT "CaseIoc_pkey" PRIMARY KEY ("caseId","iocId")
);

-- CreateTable
CREATE TABLE "CaseRule" (
    "caseId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,

    CONSTRAINT "CaseRule_pkey" PRIMARY KEY ("caseId","ruleId")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "indicatorId" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL,
    "lastVerified" TIMESTAMP(3),
    "verificationStatus" TEXT,
    "naxsiId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "details" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncStatus" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "iocCount" INTEGER NOT NULL DEFAULT 0,
    "freshness" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rule_naxsiId_key" ON "Rule"("naxsiId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncStatus_serviceName_key" ON "SyncStatus"("serviceName");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseIoc" ADD CONSTRAINT "CaseIoc_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseIoc" ADD CONSTRAINT "CaseIoc_iocId_fkey" FOREIGN KEY ("iocId") REFERENCES "Ioc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseRule" ADD CONSTRAINT "CaseRule_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseRule" ADD CONSTRAINT "CaseRule_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Ioc"("id") ON DELETE SET NULL ON UPDATE CASCADE;
