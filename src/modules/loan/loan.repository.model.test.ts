import { expect } from 'chai';
import { LoanStatus } from './loan.model';
import { loanInDbToModel, loanModelToInDb } from './loan.repository.model';

describe('loan.repository.model', () => {
  describe('loanInDbToModel', () => {
    it('transforms a loan in db to model', () => {
      const loanInDb = {
        _id: 'loan1', from: 'account1', to: 'account2', amount: 1000, status: LoanStatus.ACCEPTED,
      };
      expect(loanInDbToModel(loanInDb)).to.be.eql({
        id: 'loan1',
        from: 'account1',
        to: 'account2',
        amount: 1000,
        status: LoanStatus.ACCEPTED,
      });
    });

    it('transforms a null to undefined', () => {
      expect(loanInDbToModel(null)).to.be.eql(undefined);
    });
  });

  describe('loanModelToInDb', () => {
    it('transforms a loan model to in db', () => {
      const loan = {
        id: 'loan1', from: 'account1', to: 'account2', amount: 1000, status: LoanStatus.ACCEPTED,
      };
      expect(loanModelToInDb(loan)).to.be.eql({
        _id: 'loan1',
        from: 'account1',
        to: 'account2',
        amount: 1000,
        status: LoanStatus.ACCEPTED,
      });
    });
  });
});
