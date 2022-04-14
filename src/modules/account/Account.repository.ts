import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession, Db } from 'mongodb';
import { Account } from './account.model';
import { AccountInDb, accountInDbToModel, accountModelToInDb } from './account.repository.model';

export const ACCOUNTS_COLLECTION = 'accounts';

export class AccountRepository {
  private readonly accountsCollection;

  constructor(database: Db, private readonly asyncLocalStorage: AsyncLocalStorage<ClientSession>) {
    this.accountsCollection = database.collection<AccountInDb>(ACCOUNTS_COLLECTION);
  }

  async findOneById(id: string): Promise<Account | void> {
    const session = this.asyncLocalStorage.getStore();
    const accountInDb = await this.accountsCollection.findOne({ _id: id }, { session });
    return accountInDbToModel(accountInDb);
  }

  async update(account: Account): Promise<void> {
    const session = this.asyncLocalStorage.getStore();
    const accountInDb = accountModelToInDb(account);
    await this.accountsCollection.replaceOne({ _id: account.id }, accountInDb, { session });
  }
}
