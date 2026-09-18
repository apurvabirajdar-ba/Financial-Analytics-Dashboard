import { Transaction } from '../models/Transaction';
import transactions from '../../transactions.json';

export const seedDatabase = async () => {
  const count = await Transaction.countDocuments();
  if (count === 0) {
    await Transaction.insertMany(transactions);
    console.log('Database seeded with transactions');
  }
};