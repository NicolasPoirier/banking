import { TransactionManager } from '../../../transactionManagement/TransactionManager';
import { TransferGateway } from './Transfer.gateway';
import { transfer } from './transfer.model';

export type TransfertRequest = {
  from: string;
  to: string;
  amount: number;
};

export class TransferUsecase {
  constructor(private readonly gateway: TransferGateway, private readonly transactionManager: TransactionManager) {}

  async execute(transfertRequest: TransfertRequest): Promise<void> {
    await this.transactionManager.withTransaction(async () => {
      const fromAccount = await this.gateway.findOneAccountById(transfertRequest.from);
      const toAccount = await this.gateway.findOneAccountById(transfertRequest.to);

      if (!fromAccount || !toAccount) {
        throw Error('Accounts not found');
      }

      const transferResult = transfer({ from: fromAccount, to: toAccount, amount: transfertRequest.amount });

      await this.gateway.updateAccount(transferResult.from);
      await this.gateway.updateAccount(transferResult.to);
    });
  }
}
