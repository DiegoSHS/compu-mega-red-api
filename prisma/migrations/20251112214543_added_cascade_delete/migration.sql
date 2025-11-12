-- DropForeignKey
ALTER TABLE "Declarations" DROP CONSTRAINT "Declarations_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Declarations" ADD CONSTRAINT "Declarations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
