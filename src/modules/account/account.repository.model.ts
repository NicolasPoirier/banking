import { Account } from './account.model';

export type AccountInDb = {
  _id: string;
  balance: number;
};

export function accountInDbToModel(accountInDb: AccountInDb | null): Account | void {
  if (!accountInDb) {
    return;
  }

  return { id: accountInDb._id, balance: accountInDb.balance };
}

export function accountModelToInDb(account: Account): AccountInDb {
  return { _id: account.id, balance: account.balance };
}
