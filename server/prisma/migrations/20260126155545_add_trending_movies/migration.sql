-- CreateTable
CREATE TABLE "TrendingMovie" (
    "movieId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "poster_path" TEXT,
    "vote_average" DOUBLE PRECISION NOT NULL,
    "release_date" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendingMovie_pkey" PRIMARY KEY ("movieId")
);
