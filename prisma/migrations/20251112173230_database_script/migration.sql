-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('sale', 'purchase');

-- CreateEnum
CREATE TYPE "DeclarationStatus" AS ENUM ('pending', 'submitted', 'accepted');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "Operations" (
    "id" UUID NOT NULL,
    "type" "OperationType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "declaration_id" UUID,

    CONSTRAINT "Operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Declarations" (
    "id" UUID NOT NULL,
    "month" VARCHAR(7) NOT NULL,
    "sales_vat" DECIMAL(12,2) NOT NULL,
    "purchases_vat" DECIMAL(12,2) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "status" "DeclarationStatus" NOT NULL DEFAULT 'pending',
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Declarations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Declarations_user_id_month_key" ON "Declarations"("user_id", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "Users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Operations" ADD CONSTRAINT "Operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operations" ADD CONSTRAINT "Operations_declaration_id_fkey" FOREIGN KEY ("declaration_id") REFERENCES "Declarations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Declarations" ADD CONSTRAINT "Declarations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
