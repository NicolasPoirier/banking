import { TransactionManager } from '../../../transactionManagement/TransactionManager';
import { sendFunds } from '../loan.model';
import { SendFundsGateway } from './SendFunds.gateway';

export class SendFundsUsecase {
  constructor(private readonly gateway: SendFundsGateway, private readonly transactionManager: TransactionManager) {}

  async execute(loanId: string) {
    await this.transactionManager.withTransaction(async () => {
      const loan = await this.gateway.findLoanById(loanId);

      if (!loan) {
        throw Error('Loan not found');
      }

      const loanAfterFundsSent = sendFunds(loan);

      await this.gateway.transfer(loan.from, loan.to, loan.amount);

      await this.gateway.updateLoan(loanAfterFundsSent);
    });
  }
}
