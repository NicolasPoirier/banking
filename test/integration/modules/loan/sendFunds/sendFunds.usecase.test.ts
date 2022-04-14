import { expect } from 'chai';
import { after, afterEach, before, beforeEach } from 'mocha';
import { ClientSession, Collection, Db, MongoClient } from 'mongodb';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AccountInDb } from '../../../../../src/modules/account/account.repository.model';
import { AccountRepository, ACCOUNTS_COLLECTION } from '../../../../../src/modules/account/Account.repository';
import { LoanInDb } from '../../../../../src/modules/loan/loan.repository.model';
import { LoanRepository, LOANS_COLLECTION } from '../../../../../src/modules/loan/Loan.repository';
import { TransferGateway } from '../../../../../src/modules/account/transfer/Transfer.gateway';
import { TransferGatewayImpl } from '../../../../../src/modules/account/transfer/Transfer.gateway.impl';
import { TransferUsecase } from '../../../../../src/modules/account/transfer/Transfer.usecase';
import { SendFundsGateway } from '../../../../../src/modules/loan/sendFunds/SendFunds.gateway';
import { SendFundsGatewayImpl } from '../../../../../src/modules/loan/sendFunds/SendFunds.gateway.impl';
import { SendFundsUsecase } from '../../../../../src/modules/loan/sendFunds/SendFunds.usecase';
import { TransactionManager } from '../../../../../src/transactionManagement/TransactionManager';
import { MongoTransactionManager } from '../../../../../src/transactionManagement/MongoTransactionManager';
import { LoanStatus } from '../../../../../src/modules/loan/loan.model';
import { AsyncLocalStorage } from 'async_hooks';

describe('SendFunds.usecase', function () {
  this.timeout(10000);

  let mongoClient: MongoClient;
  let replSet: MongoMemoryReplSet;
  let db: Db;

  let transactionManager: TransactionManager;

  let accountsCollection: Collection<AccountInDb>;
  let accountRepository: AccountRepository;
  let transferGateway: TransferGateway;
  let transferUsecase: TransferUsecase;

  let loansCollection: Collection<LoanInDb>;
  let loanRepository: LoanRepository;
  let sendFundsGateway: SendFundsGateway;
  let sendFundsUsecase: SendFundsUsecase;

  before(async () => {
    replSet = await MongoMemoryReplSet.create({ replSet: { count: 3, dbName: 'bank' } });

    mongoClient = await MongoClient.connect(replSet.getUri(), {});

    db = mongoClient.db('bank');
    accountsCollection = db.collection<AccountInDb>(ACCOUNTS_COLLECTION);
    loansCollection = db.collection<LoanInDb>(LOANS_COLLECTION);
  });

  after(async () => {
    if (mongoClient) {
      await mongoClient.close();
    }
    if (replSet) {
      await replSet.stop();
    }
  });

  beforeEach(async () => {
    await accountsCollection.insertMany([
      { _id: 'clientAccount', balance: 1000 },
      { _id: 'bankAccount', balance: 2000 },
    ]);
    await loansCollection.insertMany([
      { _id: 'loan1', from: 'bankAccount', to: 'clientAccount', amount: 200, status: LoanStatus.ACCEPTED },
    ]);

    const asyncLocalStorage = new AsyncLocalStorage<ClientSession>();

    transactionManager = new MongoTransactionManager(mongoClient, asyncLocalStorage);

    accountRepository = new AccountRepository(db, asyncLocalStorage);
    transferGateway = new TransferGatewayImpl(accountRepository);
    transferUsecase = new TransferUsecase(transferGateway, transactionManager);

    loanRepository = new LoanRepository(db, asyncLocalStorage);
    sendFundsGateway = new SendFundsGatewayImpl(loanRepository, transferUsecase);
    sendFundsUsecase = new SendFundsUsecase(sendFundsGateway, transactionManager);
  });

  afterEach(async () => {
    await accountsCollection.deleteMany({});
    await loansCollection.deleteMany({});
  });

  it('successfully sends funds: transfer amount and loan status IN PROGRESS', async () => {
    await sendFundsUsecase.execute('loan1');

    const clientAccount = await accountsCollection.findOne({ _id: 'clientAccount' });
    const bankAccount = await accountsCollection.findOne({ _id: 'bankAccount' });

    expect(clientAccount?.balance).to.be.eql(1200);
    expect(bankAccount?.balance).to.be.eql(1800);

    const loan = await loansCollection.findOne({ _id: 'loan1' });

    expect(loan?.status).to.be.eql(LoanStatus.IN_PROGRESS);
  });

  it('fails when an error occurres during update of the loan status', async () => {
    loanRepository.update = async () => {
      throw Error('Fake error');
    };

    try {
      await sendFundsUsecase.execute('loan1');
    } catch (error) {
      let message: string;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      expect(message).to.be.eql('Fake error');
    }

    const clientAccount = await accountsCollection.findOne({ _id: 'clientAccount' });
    const bankAccount = await accountsCollection.findOne({ _id: 'bankAccount' });

    expect(clientAccount?.balance).to.be.eql(1000);
    expect(bankAccount?.balance).to.be.eql(2000);

    const loan = await loansCollection.findOne({ _id: 'loan1' });

    expect(loan?.status).to.be.eql(LoanStatus.ACCEPTED);
  });

  it('fails when an error occurres during transfer', async () => {
    accountRepository.update = async () => {
      throw Error('Fake error');
    };

    try {
      await sendFundsUsecase.execute('loan1');
    } catch (error) {
      let message: string;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      expect(message).to.be.eql('Fake error');
    }

    const clientAccount = await accountsCollection.findOne({ _id: 'clientAccount' });
    const bankAccount = await accountsCollection.findOne({ _id: 'bankAccount' });

    expect(clientAccount?.balance).to.be.eql(1000);
    expect(bankAccount?.balance).to.be.eql(2000);

    const loan = await loansCollection.findOne({ _id: 'loan1' });

    expect(loan?.status).to.be.eql(LoanStatus.ACCEPTED);
  });

  it('transfers money only once. The second funds sending fails', async () => {
    try {
      await Promise.all([sendFundsUsecase.execute('loan1'), sendFundsUsecase.execute('loan1')]);
    } catch (error) {
      let message: string;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      expect(message).to.be.eql('Illegal state: loan status different from ACCEPTED');
    }

    const clientAccount = await accountsCollection.findOne({ _id: 'clientAccount' });
    const bankAccount = await accountsCollection.findOne({ _id: 'bankAccount' });

    expect(clientAccount?.balance).to.be.eql(1200);
    expect(bankAccount?.balance).to.be.eql(1800);

    const loan = await loansCollection.findOne({ _id: 'loan1' });

    expect(loan?.status).to.be.eql(LoanStatus.IN_PROGRESS);
  });
});
