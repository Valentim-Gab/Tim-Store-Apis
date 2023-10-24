-- CreateTable
CREATE TABLE "sex" (
    "id_sex" SERIAL NOT NULL,
    "descr_sex" VARCHAR(20) NOT NULL,
    "abbr_sex" CHAR(1) NOT NULL,

    CONSTRAINT "sex_pkey" PRIMARY KEY ("id_sex")
);

-- CreateTable
CREATE TABLE "user_address" (
    "id_user_address" UUID NOT NULL,
    "cep" VARCHAR(9) NOT NULL,
    "number" INTEGER NOT NULL,
    "street" VARCHAR(50) NOT NULL,
    "neighborhood" VARCHAR(50) NOT NULL,
    "complement" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "selected_address" BOOLEAN NOT NULL DEFAULT false,
    "home_address" BOOLEAN NOT NULL DEFAULT false,
    "work_address" BOOLEAN NOT NULL DEFAULT false,
    "id_user" UUID NOT NULL,

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id_user_address")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "cpf" VARCHAR(14),
    "cnpj" VARCHAR(18),
    "date_birth" DATE,
    "phone_number" VARCHAR(25),
    "role" VARCHAR(10)[],
    "id_sex" INTEGER NOT NULL,
    "profile_image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_cnpj_key" ON "users"("cnpj");

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_sex_fkey" FOREIGN KEY ("id_sex") REFERENCES "sex"("id_sex") ON DELETE NO ACTION ON UPDATE NO ACTION;
