import express from 'express';
import { authenticate } from '../middleware/auth';
import { Transaction } from '../models/Transaction';
import { generateCSV } from '../utils/csv';

const router = express.Router();

router.post('/csv', authenticate, async (req, res) => {
  try {
    const { columns, filters } = req.body;
    const allowedColumns = ['id', 'date', 'amount', 'category', 'status', 'user_id'];
    const selectedColumns = Array.isArray(columns) ? columns.filter((column) => allowedColumns.includes(column)) : [];
    if (!selectedColumns.length) return res.status(400).json({ error: 'Choose at least one export column.' });

    // Fetch transactions with filters
    const query: any = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.status) query.status = filters.status;
    if (filters?.search) query.$or = [{ category: { $regex: filters.search, $options: 'i' } }, { status: { $regex: filters.search, $options: 'i' } }];

    const transactions = await Transaction.find(query);

    // Generate CSV
    const csv = generateCSV(transactions, selectedColumns);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
