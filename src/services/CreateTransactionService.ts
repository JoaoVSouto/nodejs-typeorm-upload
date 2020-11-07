import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
  validateOutcome?: boolean;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryTitle,
    validateOutcome = true,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (validateOutcome && type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (total < value) {
        throw new AppError(
          "You don't have enough balance to buy this product.",
        );
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
    });

    const categoriesRepository = getRepository(Category);

    const category = await categoriesRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      const newCategory = categoriesRepository.create({ title: categoryTitle });
      await categoriesRepository.save(newCategory);

      transaction.category = newCategory;
    } else {
      transaction.category = category;
    }

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
