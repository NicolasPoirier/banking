import { Account, credit, debit } from '../account.model';

export type Transfer = {
  from: Account;
  to: Account;
  amount: number;
};

export type TransferResult = {
  from: Account;
  to: Account;
};

export function transfer(transfer: Transfer): TransferResult {
  if (transfer.amount < 0) {
    throw Error('Illegal argument: amount < 0');
  }

  const fromAccountAfterDebit = debit(transfer.from, transfer.amount);
  const toAccountAfterCredit = credit(transfer.to, transfer.amount);

  return { from: fromAccountAfterDebit, to: toAccountAfterCredit };
}
