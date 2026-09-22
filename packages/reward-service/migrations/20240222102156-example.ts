/* eslint-disable unicorn/expiring-todo-comments */
import { Db, MigrationBase, MongoClient } from '@neofinancial/neo-migration';

class Migration implements MigrationBase {
  async up(db: Db, client: MongoClient): Promise<void> {
    //TODO: implement migration
  }

  async down(db: Db, client: MongoClient): Promise<void> {
    //TODO: implement rollback
  }
}

export default Migration;
