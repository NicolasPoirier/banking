import { Loan } from '../loan.model';

export interface SendFundsGateway {
  findLoanById(loanId: string): Promise<Loan | void>;
  updateLoan(loan: Loan): Promise<void>;
  transfer(from: string, to: string, amount: number): Promise<void>;
}
