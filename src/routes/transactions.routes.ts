import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import ShowTransactionsService from '../services/ShowTransactionsService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const showTransactions = new ShowTransactionsService();

  const { transactions, balance } = await showTransactions.execute();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute({
      fileName: request.file.filename,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;
