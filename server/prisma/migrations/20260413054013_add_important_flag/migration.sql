-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "important" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Ioc" ADD COLUMN     "important" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ThreatActor" ADD COLUMN     "important" BOOLEAN NOT NULL DEFAULT false;
