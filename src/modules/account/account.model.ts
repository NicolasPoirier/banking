export type Account = {
  id: string;
  balance: number;
};

export function debit(account: Account, amount: number): Account {
  if (amount < 0) {
    throw Error('Illegal argument: amount < 0');
  }

  const balanceAfterDebit = account.balance - amount;

  if (balanceAfterDebit < 0) {
    throw Error('Illegal state: balance < amount');
  }

  const accountAfterDebit = { ...account, balance: balanceAfterDebit };

  return accountAfterDebit;
}

export function credit(account: Account, amount: number): Account {
  if (amount < 0) {
    throw Error('Illegal argument: amount < 0');
  }

  const balanceAfterCredit = account.balance + amount;
  const accountAfterCredit = { ...account, balance: balanceAfterCredit };

  return accountAfterCredit;
}
