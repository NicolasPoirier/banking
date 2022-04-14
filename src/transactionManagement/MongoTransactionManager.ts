import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession, MongoClient } from 'mongodb';
import { TransactionManager } from './TransactionManager';

export class MongoTransactionManager implements TransactionManager {
  constructor(
    private readonly client: MongoClient,
    private readonly asyncLocalStorage: AsyncLocalStorage<ClientSession>,
  ) {}

  async withTransaction<T>(runnable: () => Promise<T>): Promise<T> {
    const session = this.asyncLocalStorage.getStore() ?? this.client.startSession();

    if (session.inTransaction()) {
      return runnable();
    }

    try {
      return await this.asyncLocalStorage.run(session, async () => {
        try {
          return await session.withTransaction(async () => runnable());
        } finally {
          this.asyncLocalStorage.disable();
        }
      });
    } finally {
      session.endSession();
    }
  }
}
