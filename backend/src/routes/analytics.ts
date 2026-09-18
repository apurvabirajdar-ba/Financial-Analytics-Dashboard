import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { Transaction } from '../models/Transaction';

const router = Router();
router.use(authenticate);

router.get('/trends', async (_req: Request, res: Response): Promise<void> => {
  try {
    const monthly = await Transaction.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$date' } }, revenue: { $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] } }, expenses: { $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] } } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', revenue: 1, expenses: 1 } },
    ]);
    res.json({ monthly });
  } catch { res.status(500).json({ error: 'Unable to retrieve trends.' }); }
});

router.get('/summary', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [summary] = await Transaction.aggregate([{ $group: { _id: null, totalRevenue: { $sum: { $cond: [{ $eq: ['$category', 'Revenue'] }, '$amount', 0] } }, totalExpenses: { $sum: { $cond: [{ $eq: ['$category', 'Expense'] }, '$amount', 0] } }, totalTransactions: { $sum: 1 } } }]);
    const totals = summary || { totalRevenue: 0, totalExpenses: 0, totalTransactions: 0 };
    res.json({ totalTransactions: totals.totalTransactions, totalRevenue: totals.totalRevenue, totalExpenses: totals.totalExpenses, netIncome: totals.totalRevenue - totals.totalExpenses });
  } catch { res.status(500).json({ error: 'Unable to retrieve summary.' }); }
});

export default router;
