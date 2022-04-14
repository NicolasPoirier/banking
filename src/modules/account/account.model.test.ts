import { expect } from 'chai';
import { credit, debit } from './account.model';

describe('account.model', () => {
  describe('debit', () => {
    it('debits amount from the account', () => {
      const account = { id: 'account1', balance: 1000 };
      expect(debit(account, 200)).to.be.eql({ id: 'account1', balance: 800 });
    });

    it('fails as amount to debit is negative', () => {
      const account = { id: 'account1', balance: 1000 };
      expect(() => debit(account, -200)).to.throw('Illegal argument: amount < 0');
    });

    it('fails as balance is smaller than amount to debit', () => {
      const account = { id: 'account1', balance: 1000 };
      expect(() => debit(account, 1001)).to.throw('Illegal state: balance < amount');
    });
  });

  describe('credit', () => {
    it('credits amount to the account', () => {
      const account = { id: 'account1', balance: 1000 };
      expect(credit(account, 200)).to.be.eql({ id: 'account1', balance: 1200 });
    });

    it('fails as amount to credit is negative', () => {
      const account = { id: 'account1', balance: 1000 };
      expect(() => credit(account, -200)).to.throw('Illegal argument: amount < 0');
    });
  });
});
