import { Account } from '../account.model';

export interface TransferGateway {
  findOneAccountById(id: string): Promise<Account | void>;
  updateAccount(account: Account): Promise<void>;
}
