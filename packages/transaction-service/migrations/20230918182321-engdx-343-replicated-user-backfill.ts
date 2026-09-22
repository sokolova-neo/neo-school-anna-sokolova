import config from 'config-dug';

import {
  BulkWriteOperationError,
  Collection,
  Db,
  FilterOperations,
  FindCursor,
  MigrationBase,
  MongoClient,
  ObjectId,
  sleep,
  takeCursor,
} from '@neofinancial/neo-migration';

interface SourceUserDocument {
  _id: ObjectId;
  _replicationVersion?: number;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  FROZEN = 'FROZEN',
}

interface BulkUpdateUp {
  updateOne: {
    filter: { _id: ObjectId };
    update: {
      $set: {
        _id: ObjectId;
        status: UserStatus;
        _replicationVersion: number;
        _replicationCreatedAt: Date;
        _replicationUpdatedAt: Date;
      };
    };
    upsert: true;
  };
}

interface LogProcessInput {
  batchNumber: number;
  id: string;
  processedCount: number;
  totalCount: number;
}

class Migration implements MigrationBase {
  //In the neo codebase this BATCH_SIZE should be MUCH larger(1000~2000) but as the source DB only has 100 documents, this batch size is smaller to test batching
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_DELAY_MS = 500;
  private readonly SOURCE_DATABASE_NAME = 'userService';
  private readonly SOURCE_COLLECTION_NAME = 'users';
  private readonly DESTINATION_COLLECTION_NAME = 'replicated_users';

  private logProgress({ batchNumber, id, processedCount, totalCount }: LogProcessInput): void {
    const progressPercent = ((processedCount / totalCount) * 100).toFixed(2);

    console.log(
      `Batch: ${batchNumber}. First document ID: ${id}. Processed ${processedCount}/${totalCount} documents. ${progressPercent}% complete.`,
    );
  }

  private async getFilter(collection: Collection): Promise<FilterOperations<SourceUserDocument>> {
    if (!config.START_DOCUMENT_ID) {
      return {};
    }

    const startDocumentId = new ObjectId(config.START_DOCUMENT_ID as string);
    const startDocument = await collection.findOne({ _id: startDocumentId });

    if (!startDocument) {
      throw new Error(
        `Document with ID ${startDocumentId} does not exist in ${this.SOURCE_DATABASE_NAME}.${this.SOURCE_COLLECTION_NAME}. Please ensure that the correct document ID was provided.`,
      );
    }

    return {
      _id: {
        $gte: startDocumentId,
      },
    };
  }

  async up(db: Db, client: MongoClient): Promise<void> {
    console.log('\n\n🚀🚀🚀 Initiating replicated users backfill! 🚀🚀🚀');
    console.time('Replicated users backfill time');
    console.group('Initiating connection to user-service database...');

    const userServiceUserCollection: Collection = client
      .db(this.SOURCE_DATABASE_NAME)
      .collection(this.SOURCE_COLLECTION_NAME);

    console.log('Connection to user-service database established!');
    console.groupEnd();

    const filter = await this.getFilter(userServiceUserCollection);

    const cursor = userServiceUserCollection
      .find({ ...filter })
      .sort({
        _id: 1,
      })
      .project<SourceUserDocument>({
        _id: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        _replicationVersion: 1,
      });

    const totalCount = await userServiceUserCollection.countDocuments(filter);
    const failedWrites: BulkWriteOperationError[] = [];
    let batchNumber = 0;
    let processedCount = 0;
    let currentBatchFirstDocumentId: string | undefined;

    try {
      console.group(`Starting batch writes. Estimated time to completion:`);

      for await (const batch of takeCursor<FindCursor<SourceUserDocument>, SourceUserDocument>(
        cursor,
        this.BATCH_SIZE,
      )) {
        batchNumber++;
        currentBatchFirstDocumentId = batch[0]._id.toHexString();

        const updates: BulkUpdateUp[] = batch.map((document) => ({
          updateOne: {
            filter: { _id: document._id },
            update: {
              $set: {
                _id: document._id,
                status: document.status,
                _replicationVersion: document._replicationVersion ?? 0,
                _replicationCreatedAt: document.createdAt,
                _replicationUpdatedAt: document.updatedAt,
              },
            },
            upsert: true,
          },
        }));

        const result = await db.collection(this.DESTINATION_COLLECTION_NAME).bulkWrite(updates, { ordered: false });

        processedCount += result.upsertedCount;
        failedWrites.push(...result.getWriteErrors().map(({ err }) => err));

        this.logProgress({ batchNumber, id: currentBatchFirstDocumentId, processedCount, totalCount });

        await sleep(this.BATCH_DELAY_MS);
      }

      console.groupEnd();

      console.log('\n\nSuccessfully completed migration! 🥳 · 🎉 · 🤩 · 🤗 · ٩(ˊᗜˋ*)و ♡ · ヾ( ˃ᴗ˂ )◞ • *✰ · ✨');
    } catch (error) {
      console.log(error);
      console.log(
        `Script failed at batch ${batchNumber}${
          currentBatchFirstDocumentId ? `, restart script at document ID: ${currentBatchFirstDocumentId}` : '.'
        }`,
      );
    }

    if (failedWrites.length > 0) {
      console.table(failedWrites);
    }

    console.timeEnd('Replicated users backfill time');
  }

  async down(db: Db, _client: MongoClient): Promise<void> {
    console.log('\nInitiating replicated users backfill DOWN.');
    console.log(`Deleting all documents in "${db.databaseName}.${this.DESTINATION_COLLECTION_NAME}".`);

    const cursor = db.collection(this.DESTINATION_COLLECTION_NAME).find({}).project({
      _id: 1,
    });
    const totalCount = await db.collection(this.DESTINATION_COLLECTION_NAME).countDocuments();
    let batchNumber = 0;
    let processedCount = 0;

    for await (const users of takeCursor(cursor, this.BATCH_SIZE)) {
      batchNumber++;

      const userIds = users.map((user) => user._id);

      const result = await db.collection(this.DESTINATION_COLLECTION_NAME).deleteMany({ _id: { $in: userIds } });

      processedCount += result.deletedCount;
      this.logProgress({ batchNumber, id: userIds[0].toHexString(), processedCount, totalCount });

      await sleep(this.BATCH_DELAY_MS);
    }

    console.log('\n\nFinished replicated users backfill DOWN.');
  }
}

export default Migration;
