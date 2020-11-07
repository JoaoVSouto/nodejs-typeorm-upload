import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';
import { Promise as PromiseBB } from 'bluebird';

import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  fileName: string;
}

class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const csvPath = path.join(uploadConfig.directory, fileName);

    const transactions = await csv().fromFile(csvPath);

    const createTransaction = new CreateTransactionService();

    const createdTransactions = await PromiseBB.mapSeries(
      transactions,
      ({ title, type, value, category }) =>
        createTransaction.execute({
          title,
          type,
          value,
          category,
          validateOutcome: false,
        }),
    );

    await fs.promises.unlink(csvPath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
