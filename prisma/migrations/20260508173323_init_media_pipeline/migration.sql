-- CreateTable
CREATE TABLE "ImageAsset" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "originalUrl" TEXT,
    "cachedUrl" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "author" TEXT,
    "attribution" TEXT,
    "license" TEXT,
    "sourcePage" TEXT,
    "destination" TEXT,
    "tags" TEXT[],
    "qualityScore" DOUBLE PRECISION,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DestinationImageMapping" (
    "id" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "heroImageId" TEXT,
    "imageIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DestinationImageMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCredit" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "attributionText" TEXT NOT NULL,

    CONSTRAINT "ImageCredit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageAsset_hash_key" ON "ImageAsset"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "DestinationImageMapping_destination_key" ON "DestinationImageMapping"("destination");

-- CreateIndex
CREATE INDEX "ImageCredit_tripId_idx" ON "ImageCredit"("tripId");

-- AddForeignKey
ALTER TABLE "DestinationImageMapping" ADD CONSTRAINT "DestinationImageMapping_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "ImageAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCredit" ADD CONSTRAINT "ImageCredit_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "ImageAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageCredit" ADD CONSTRAINT "ImageCredit_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
