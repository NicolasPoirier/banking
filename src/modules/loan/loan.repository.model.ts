import { Loan, LoanStatus } from './loan.model';

export type LoanInDb = {
  _id: string;
  from: string;
  to: string;
  amount: number;
  status: LoanStatus;
};

export function loanInDbToModel(loanInDb: LoanInDb | null): Loan | void {
  if (!loanInDb) {
    return;
  }

  return {
    id: loanInDb._id,
    from: loanInDb.from,
    to: loanInDb.to,
    amount: loanInDb.amount,
    status: loanInDb.status,
  };
}

export function loanModelToInDb(loan: Loan): LoanInDb {
  return {
    _id: loan.id, from: loan.from, to: loan.to, amount: loan.amount, status: loan.status,
  };
}
