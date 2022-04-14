import { AsyncLocalStorage } from 'async_hooks';
import { ClientSession, Db } from 'mongodb';
import { Loan } from './loan.model';
import { LoanInDb, loanInDbToModel, loanModelToInDb } from './loan.repository.model';

export const LOANS_COLLECTION = 'loans';

export class LoanRepository {
  private readonly loansCollection;

  constructor(database: Db, private readonly asyncLocalStorage: AsyncLocalStorage<ClientSession>) {
    this.loansCollection = database.collection<LoanInDb>(LOANS_COLLECTION);
  }

  async findOneById(id: string): Promise<Loan | void> {
    const session = this.asyncLocalStorage.getStore();
    const loanInDb = await this.loansCollection.findOne({ _id: id }, { session });
    return loanInDbToModel(loanInDb);
  }

  async update(loan: Loan): Promise<void> {
    const session = this.asyncLocalStorage.getStore();
    const loanInDb = loanModelToInDb(loan);
    await this.loansCollection.replaceOne({ _id: loan.id }, loanInDb, { session });
  }
}
