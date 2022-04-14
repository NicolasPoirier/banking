import { TransferUsecase } from '../../account/transfer/Transfer.usecase';
import { Loan } from '../loan.model';
import { LoanRepository } from '../Loan.repository';
import { SendFundsGateway } from './SendFunds.gateway';

export class SendFundsGatewayImpl implements SendFundsGateway {
  constructor(private readonly loanRepository: LoanRepository, private readonly transferUsecase: TransferUsecase) {}

  async findLoanById(loanId: string): Promise<Loan | void> {
    return await this.loanRepository.findOneById(loanId);
  }

  async updateLoan(loan: Loan): Promise<void> {
    return await this.loanRepository.update(loan);
  }

  async transfer(from: string, to: string, amount: number): Promise<void> {
    await this.transferUsecase.execute({ from, to, amount });
  }
}
