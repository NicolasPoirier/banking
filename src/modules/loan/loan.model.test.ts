import { expect } from 'chai';
import { LoanStatus, sendFunds } from './loan.model';

describe('loan.model', () => {
  describe('sendFunds', () => {
    it('transfers amount from an account to another', () => {
      const loan = {
        id: 'loan1', from: 'account1', to: 'account2', amount: 1000, status: LoanStatus.ACCEPTED,
      };
      const loanAfterFundsSent = {
        id: 'loan1',
        from: 'account1',
        to: 'account2',
        amount: 1000,
        status: LoanStatus.IN_PROGRESS,
      };

      expect(sendFunds(loan)).to.be.eql(loanAfterFundsSent);
    });

    it('fails as loan status is different from ACCEPTED', () => {
      const closedLoan = {
        id: 'loan1', from: 'account1', to: 'account2', amount: 1000, status: LoanStatus.CLOSED,
      };
      expect(() => sendFunds(closedLoan)).to.throw('Illegal state: loan status different from ACCEPTED');

      const inProgressLoan = {
        id: 'loan1',
        from: 'account1',
        to: 'account2',
        amount: 1000,
        status: LoanStatus.IN_PROGRESS,
      };
      expect(() => sendFunds(inProgressLoan)).to.throw('Illegal state: loan status different from ACCEPTED');
    });
  });
});
