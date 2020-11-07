import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Response {
  transactions: Array<Transaction>;
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

class ShowTransactionsService {
  public async execute(): Promise<Response> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();

    return { transactions, balance };
  }
}

export default ShowTransactionsService;
