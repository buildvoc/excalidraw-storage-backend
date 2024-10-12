import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProject1728548094000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "project" (
          "id" SERIAL NOT NULL,
          "userId" integer NOT NULL,
          "projectName" character varying NOT NULL,
          "projectDescription" character varying NULL,
          "private" integer NOT NULL DEFAULT 1,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"),
          CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8" FOREIGN KEY ("userId")
          REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        )`,
      );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8"`,
    );
    await queryRunner.query(`DROP TABLE "project"`);
  }
}