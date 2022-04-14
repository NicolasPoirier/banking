import { expect } from 'chai';
import { accountInDbToModel, accountModelToInDb } from './account.repository.model';

describe('account.repository.model', () => {
  describe('accountInDbToModel', () => {
    it('transforms an account entity to model', () => {
      const accountInDb = { _id: 'account1', balance: 1000 };
      expect(accountInDbToModel(accountInDb)).to.be.eql({ id: 'account1', balance: 1000 });
    });

    it('transforms a null to undefined', () => {
      expect(accountInDbToModel(null)).to.be.eql(undefined);
    });
  });

  describe('accountModelToInDb', () => {
    it('transforms an account model to entity', () => {
      const account = { id: 'account1', balance: 1000 };
      expect(accountModelToInDb(account)).to.be.eql({ _id: 'account1', balance: 1000 });
    });
  });
});
