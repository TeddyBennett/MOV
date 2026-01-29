-- DropForeignKey
ALTER TABLE "ListMovie" DROP CONSTRAINT "ListMovie_listId_fkey";

-- AddForeignKey
ALTER TABLE "ListMovie" ADD CONSTRAINT "ListMovie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
