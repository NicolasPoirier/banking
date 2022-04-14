import { expect } from 'chai';
import { transfer } from './transfer.model';

describe('transfer.model', () => {
  describe('transfer', () => {
    const account1 = { id: 'account1', balance: 1000 };
    const account2 = { id: 'account2', balance: 2000 };

    it('transfers amount from an account to another', () => {
      const transferResult = transfer({ from: account1, to: account2, amount: 200 });

      expect(transferResult.from).to.be.eql({ id: 'account1', balance: 800 });
      expect(transferResult.to).to.be.eql({ id: 'account2', balance: 2200 });
    });

    it('fails as amount to debit is negative', () => {
      expect(() => transfer({ from: account1, to: account2, amount: -200 })).to.throw('Illegal argument: amount < 0');
    });

    it('fails as balance is smaller than amount to debit', () => {
      expect(() => transfer({ from: account1, to: account2, amount: 1001 })).to.throw(
        'Illegal state: balance < amount',
      );
    });
  });
});
