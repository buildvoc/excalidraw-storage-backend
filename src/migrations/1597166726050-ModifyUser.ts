import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUser1597166726050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" ADD "emailVerifiedAt" TIMESTAMP NULL DEFAULT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerifiedAt"`);
  }
}