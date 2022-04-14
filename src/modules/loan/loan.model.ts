export type LoanStatus = 'ACCEPTED' | 'IN PROGRESS' | 'CLOSED';

export const LoanStatus: Record<string, LoanStatus> = {
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN PROGRESS',
  CLOSED: 'CLOSED',
};

export type Loan = {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: LoanStatus;
};

export function sendFunds(loan: Loan): Loan {
  if (loan.status != LoanStatus.ACCEPTED) {
    throw Error('Illegal state: loan status different from ACCEPTED');
  }

  return { ...loan, status: LoanStatus.IN_PROGRESS };
}
