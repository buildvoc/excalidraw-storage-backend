import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDraw1728548094000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "draw" (
          "id" SERIAL NOT NULL,
          "userId" integer NOT NULL,
          "projectId" integer NOT NULL,
          "title" character varying NOT NULL,
          "private" integer NOT NULL DEFAULT 1,
          "value" text NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_d429b7114371f6a35c5cb4776a9" PRIMARY KEY ("id"),
          CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb9" FOREIGN KEY ("userId") 
          REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
          CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cc9" FOREIGN KEY ("projectId")
          REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        )`,
      );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "draw" DROP CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "draw" DROP CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cc9"`,
    );
    await queryRunner.query(`DROP TABLE "draw"`);
  }
}