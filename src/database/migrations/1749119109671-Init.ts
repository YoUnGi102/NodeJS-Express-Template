import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1749119109671 implements MigrationInterface {
    name = 'Init1749119109671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_session" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "refreshToken" character varying NOT NULL, "userAgent" character varying, "ipAddress" character varying, "createdById" integer, "updatedById" integer, "deletedById" integer, "userId" integer, CONSTRAINT "UQ_3c95f5a4cbd3bc44736fa8e6a0d" UNIQUE ("refreshToken"), CONSTRAINT "PK_adf3b49590842ac3cf54cac451a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL DEFAULT '1', "uuid" uuid NOT NULL, "username" character varying NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "timezone" character varying(50) NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdById" integer, "updatedById" integer, "deletedById" integer, CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "FK_ac1fd0a456bc3a867aa3b469b5b" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "FK_229b263934222f802af79c6663a" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "FK_e1d103cab937be665f3a268f211" FOREIGN KEY ("deletedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_session" ADD CONSTRAINT "FK_b5eb7aa08382591e7c2d1244fe5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c3062c4102a912dfe7195a72bfb" FOREIGN KEY ("deletedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c3062c4102a912dfe7195a72bfb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "FK_b5eb7aa08382591e7c2d1244fe5"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "FK_e1d103cab937be665f3a268f211"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "FK_229b263934222f802af79c6663a"`);
        await queryRunner.query(`ALTER TABLE "user_session" DROP CONSTRAINT "FK_ac1fd0a456bc3a867aa3b469b5b"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_session"`);
    }

}
