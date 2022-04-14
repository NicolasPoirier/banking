import { Account } from '../account.model';
import { AccountRepository } from '../Account.repository';
import { TransferGateway } from './Transfer.gateway';

export class TransferGatewayImpl implements TransferGateway {
  constructor(private readonly accountRepository: AccountRepository) {}

  async findOneAccountById(id: string): Promise<void | Account> {
    return await this.accountRepository.findOneById(id);
  }

  async updateAccount(account: Account): Promise<void> {
    await this.accountRepository.update(account);
  }
}
