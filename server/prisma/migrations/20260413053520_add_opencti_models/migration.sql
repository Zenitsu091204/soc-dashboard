-- CreateTable
CREATE TABLE "OpenCtiReport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "published" TIMESTAMP(3),
    "author" TEXT,
    "labels" TEXT,
    "marking" TEXT,
    "status" TEXT,
    "important" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenCtiReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiExternalReference" (
    "id" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "externalId" TEXT,
    "url" TEXT,
    "description" TEXT,
    "creationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenCtiExternalReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiSighting" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "firstSeen" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3),
    "count" INTEGER NOT NULL DEFAULT 0,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT,
    "target" TEXT,
    "negative" BOOLEAN NOT NULL DEFAULT false,
    "important" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenCtiSighting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiIncident" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "severity" TEXT,
    "source" TEXT,
    "firstSeen" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3),
    "marking" TEXT,
    "status" TEXT,
    "important" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenCtiIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiObservable" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT,
    "labels" TEXT,
    "marking" TEXT,
    "platformCreationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenCtiObservable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiMalware" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "firstSeen" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3),
    "targetedCountries" TEXT,
    "targetedSectors" TEXT,
    "labels" TEXT,
    "important" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenCtiMalware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiIntrusionSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "firstSeen" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3),
    "targetedCountries" TEXT,
    "targetedSectors" TEXT,
    "labels" TEXT,
    "important" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenCtiIntrusionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiNote" (
    "id" TEXT NOT NULL,
    "attribute_abstract" TEXT,
    "content" TEXT,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenCtiNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiOrganization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "labels" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenCtiOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiRelationship" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "description" TEXT,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OpenCtiRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenCtiConnector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenCtiConnector_pkey" PRIMARY KEY ("id")
);
